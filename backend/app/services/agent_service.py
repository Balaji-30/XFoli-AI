# FILE: backend/app/services/agent_service.py
# DESCRIPTION: LangChain-powered AI agent service using OpenRouter (Official Implementation)
import os
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import re

# LangChain imports - proper OpenRouter implementation
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

from app.database.models import Portfolio, SupportedTicker
from app.services import finnhub_service
from sqlmodel import select, Session

load_dotenv()

# Data models for portfolio analysis
class StockPerformance(BaseModel):
    """Data model for a single stock's performance."""
    ticker: str = Field(description="The stock ticker symbol.")
    company_name: str = Field(description="The company name.", default="")
    day_change_percent: float = Field(description="The percentage change for the day.")
    current_price: float = Field(description="Current stock price.")
    quantity: float = Field(description="Number of shares held.")
    current_value: float = Field(description="Current total value of holding.")

class PortfolioPerformance(BaseModel):
    """Data model for overall portfolio performance."""
    total_value: float = Field(description="Total portfolio value.")
    total_day_change_percent: float = Field(description="Overall day change percentage.")
    total_day_change_amount: float = Field(description="Total dollar change for the day.")
    biggest_mover: StockPerformance = Field(description="The stock with the biggest percentage move.")
    holdings: List[StockPerformance] = Field(description="All portfolio holdings with performance data.")

def get_portfolio_performance(portfolio: Portfolio, session: Session = None) -> PortfolioPerformance:
    """Calculates comprehensive portfolio performance metrics."""
    try:
        total_value = 0.0
        total_prev_value = 0.0
        biggest_change = 0.0
        biggest_mover = None
        holdings_performance = []
        
        # Fetch company names if session is available
        stock_names_map = {}
        if session:
            tickers = [holding.ticker for holding in portfolio.holdings]
            if tickers:
                supported_tickers = session.exec(
                    select(SupportedTicker).where(SupportedTicker.ticker.in_(tickers))
                ).all()
                stock_names_map = {ticker.ticker: ticker.name for ticker in supported_tickers}
        
        for holding in portfolio.holdings:
            # Get current market data
            quote = finnhub_service.get_stock_quote(holding.ticker)
            if quote and quote.get("current_price"):
                current_price = quote["current_price"]
                current_value = holding.quantity * current_price
                total_value += current_value
                
                day_change_pct = quote.get("day_change_percent", 0)
                
                # Create stock performance record
                stock_perf = StockPerformance(
                    ticker=holding.ticker,
                    company_name=stock_names_map.get(holding.ticker, ""),
                    day_change_percent=day_change_pct,
                    current_price=current_price,
                    quantity=holding.quantity,
                    current_value=current_value
                )
                holdings_performance.append(stock_perf)
                
                # Track biggest mover
                if abs(day_change_pct) > abs(biggest_change):
                    biggest_change = day_change_pct
                    biggest_mover = stock_perf
                
                # Calculate previous value
                if quote.get("previous_close"):
                    prev_value = holding.quantity * quote["previous_close"]
                    total_prev_value += prev_value
        
        # Calculate total day change
        total_day_change_pct = 0.0
        total_day_change_amount = total_value - total_prev_value
        if total_prev_value > 0:
            total_day_change_pct = (total_day_change_amount / total_prev_value) * 100
        
        # Default biggest mover if none found
        if not biggest_mover and holdings_performance:
            biggest_mover = holdings_performance[0]
        elif not biggest_mover:
            biggest_mover = StockPerformance(
                ticker="N/A", company_name="", day_change_percent=0.0, current_price=0.0, 
                quantity=0.0, current_value=0.0
            )
        
        return PortfolioPerformance(
            total_value=total_value,
            total_day_change_percent=total_day_change_pct,
            total_day_change_amount=total_day_change_amount,
            biggest_mover=biggest_mover,
            holdings=holdings_performance
        )
    except Exception as e:
        print(f"Error calculating portfolio performance: {e}")
        return PortfolioPerformance(
            total_value=0.0,
            total_day_change_percent=0.0,
            total_day_change_amount=0.0,
            biggest_mover=StockPerformance(
                ticker="N/A", company_name="", day_change_percent=0.0, current_price=0.0,
                quantity=0.0, current_value=0.0
            ),
            holdings=[]
        )

def get_news_for_stock(ticker: str) -> List[Dict[str, Any]]:
    """Gets recent news for a specific stock ticker."""
    try:
        # Using existing finnhub service for company news
        return finnhub_service.get_company_news(ticker) if hasattr(finnhub_service, 'get_company_news') else []
    except Exception as e:
        print(f"Error fetching news for {ticker}: {e}")
        return []

def run_analysis(portfolio: Portfolio, session: Session = None) -> str:
    """
    Main function to run LangChain + OpenRouter AI portfolio analysis.
    Uses the official OpenRouter implementation pattern.
    """
    try:
        # Get portfolio performance data
        performance = get_portfolio_performance(portfolio, session)
        
        # Check for OpenRouter API key
        openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not openrouter_api_key:
            # Return basic analysis if no API key
            return generate_basic_analysis(performance)
        
        # Get news for biggest mover
        news_headlines = []
        if performance.biggest_mover.ticker != "N/A":
            news_data = get_news_for_stock(performance.biggest_mover.ticker)
            news_headlines = [item.get('headline', '') for item in news_data[:3]]  # Top 3 headlines
        
        # Prepare holdings breakdown
        holdings_breakdown = "\n".join([
            f"• {h.ticker} ({h.company_name}): {h.quantity} shares @ ${h.current_price:.2f} = ${h.current_value:,.2f} ({h.day_change_percent:+.2f}%)"
            if h.company_name else f"• {h.ticker}: {h.quantity} shares @ ${h.current_price:.2f} = ${h.current_value:,.2f} ({h.day_change_percent:+.2f}%)"
            for h in performance.holdings
        ])
        
        # Prepare news summary
        news_summary = "\n".join([f"- {headline}" for headline in news_headlines]) if news_headlines else "No recent news available"
        
        # Create the LangChain prompt template
        template = """You are a professional financial advisor and portfolio analyst. 
Provide insightful, actionable analysis of the user's portfolio performance in a clean, structured format.

CRITICAL FORMATTING REQUIREMENTS:
- Output PLAIN TEXT ONLY - no markdown, no bold, no asterisks
- Use EXACTLY this section header format: "Section Name:" followed by content
- Do NOT use numbers (1., 2., 3.) or bullet points
- Write in clear, professional paragraphs
- Keep each section concise but informative

Portfolio Data: {portfolio_data}

OUTPUT FORMAT - Follow this EXACT structure:

Daily Performance Analysis:

[Write a paragraph about today's overall portfolio performance, including the day change percentage and dollar amount, and what primarily drove these changes. Mention specific stocks by ticker that contributed most to the performance.]

Biggest Mover Spotlight:

[Write a paragraph focusing on the stock with the largest percentage move today. Include the ticker, percentage change, and impact on portfolio value. Explain potential reasons for the movement based on the provided news or market context.]

Overall Portfolio Assessment:

[Write a paragraph evaluating the portfolio's composition, diversification, and any notable concentrations or risks. Comment on the overall balance and strategic positioning.]

Recommendations and Outlook:

[Write a paragraph with specific, actionable recommendations for portfolio optimization. Include market outlook considerations and any suggested adjustments.]

EXAMPLE OUTPUT STYLE:
Daily Performance Analysis:

Today's portfolio showed a strong gain of +2.3% ($1,240), primarily driven by your NVDA position which surged 8.7% on strong earnings. The technology sector led performance while your defensive positions remained stable.

Biggest Mover Spotlight:

NVDA was your top performer, adding $980 to your portfolio value. The rally was fueled by better-than-expected Q4 results and strong guidance for the upcoming quarter.

Remember: Use simple, clean formatting with section headers followed by colons."""

        prompt = PromptTemplate(template=template, input_variables=["portfolio_data"])
        
        # Initialize OpenRouter LLM using official pattern
        llm = ChatOpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            model="deepseek/deepseek-chat",  # Free model
            default_headers={
                "HTTP-Referer": "https://xfoli.com",  # Replace with your app URL
                "X-Title": "XFoli Portfolio Agent",
            },
            temperature=0.1  # Lower temperature for more consistent formatting
        )
        
        # Create the LangChain chain
        llm_chain = LLMChain(prompt=prompt, llm=llm)
        
        # Prepare the portfolio data for analysis
        portfolio_data = f"""
Portfolio Overview:
• Total Value: ${performance.total_value:,.2f}
• Total Day Change: {performance.total_day_change_percent:+.2f}% (${performance.total_day_change_amount:+,.2f})
• Number of Holdings: {len(performance.holdings)}

Biggest Mover:
• {performance.biggest_mover.ticker} ({performance.biggest_mover.company_name}): {performance.biggest_mover.day_change_percent:+.2f}% (${performance.biggest_mover.current_price:.2f}/share, {performance.biggest_mover.quantity} shares)

All Holdings:
{holdings_breakdown}

Recent News for {performance.biggest_mover.ticker}:
{news_summary}
        """
        
        # Run the chain
        result = llm_chain.run(portfolio_data=portfolio_data)
        
        # Clean up any markdown formatting the AI might have added
        clean_result = clean_markdown_formatting(result)
        
        return f"🤖 AI Portfolio Analysis\n\n{clean_result}"
        
    except Exception as e:
        print(f"Error running LangChain analysis: {e}")
        # Fallback to basic analysis
        performance = get_portfolio_performance(portfolio, session)
        return generate_basic_analysis(performance)

def generate_basic_analysis(performance: PortfolioPerformance) -> str:
    """Generates a basic analysis when AI is not available."""
    basic_text = f"""
Daily Performance Analysis:

Your portfolio is currently valued at ${performance.total_value:,.2f} with today's change of {performance.total_day_change_percent:+.2f}% (${performance.total_day_change_amount:+,.2f}). The performance reflects movement across {len(performance.holdings)} active holdings in your portfolio.

Biggest Mover Spotlight:

{performance.biggest_mover.ticker} was your biggest mover today with a {performance.biggest_mover.day_change_percent:+.2f}% change. Your position of {performance.biggest_mover.quantity} shares at ${performance.biggest_mover.current_price:.2f} per share has a current value of ${performance.biggest_mover.current_value:,.2f}.

Overall Portfolio Assessment:

Your portfolio consists of the following positions: {', '.join([f"{h.ticker} ({h.day_change_percent:+.2f}%)" for h in performance.holdings[:5]])}{'...' if len(performance.holdings) > 5 else ''}. The portfolio shows a mix of positions with varying performance levels today.

Recommendations and Outlook:

Consider monitoring your biggest movers for potential rebalancing opportunities. Stay informed about market news affecting your holdings and review portfolio diversification across different sectors. For more detailed AI-powered insights, please configure the AI analysis feature.
    """.strip()
    
    return clean_markdown_formatting(basic_text)

def clean_markdown_formatting(text: str) -> str:
    """Remove markdown formatting from AI output to ensure clean plain text."""
    # Remove markdown headers with bold (### **text** -> text)
    text = re.sub(r'^#{1,6}\s*\*\*(.*?)\*\*\s*$', r'\1', text, flags=re.MULTILINE)
    
    # Remove markdown headers (### text -> text)
    text = re.sub(r'^#{1,6}\s*(.*?)$', r'\1', text, flags=re.MULTILINE)
    
    # Remove numbered headers with bold (#### **1. text** -> 1. text)
    text = re.sub(r'^#{1,6}\s*\*\*(\d+\..*?)\*\*', r'\1', text, flags=re.MULTILINE)
    
    # Remove bold formatting (**text** -> text)
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    
    # Remove italic formatting (*text* -> text)
    text = re.sub(r'\*([^*]+?)\*', r'\1', text)
    
    # Clean up bullet points with emoji patterns (🔹 **text:** -> 🔹 text:)
    text = re.sub(r'([🔹🔸•])\s*\*\*(.*?)\*\*', r'\1 \2', text)
    
    # Clean up markdown bullet points and convert to simple bullets
    text = re.sub(r'^[\s]*[-*+]\s*', '• ', text, flags=re.MULTILINE)
    
    # Clean up numbered lists that might have markdown
    text = re.sub(r'^(\d+\.)\s*\*\*(.*?)\*\*', r'\1 \2', text, flags=re.MULTILINE)
    
    # Remove check marks with bold (✅ **text** -> ✅ text)
    text = re.sub(r'([✅⚠️❌])\s*\*\*(.*?)\*\*', r'\1 \2', text)
    
    # Remove any remaining markdown-style formatting
    text = re.sub(r'[_~`]+', '', text)
    
    # Clean up multiple spaces and line breaks
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    
    return text.strip()
