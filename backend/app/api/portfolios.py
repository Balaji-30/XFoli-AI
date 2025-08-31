from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from fastapi import status


# Import dependencies and models from other files
from app.database.session import SessionDep
from app.database.models import Portfolio, Holding, SupportedTicker
from app.models.portfolio import PortfolioCreate, PortfolioRead, PortfolioReadWithHoldings, PortfolioReadWithDetails
from app.models.holding import HoldingRead, HoldingCreate, HoldingReadWithMarketData
from app.services import finnhub_service

from app.auth.security import get_current_user_id

# Create a router to group all portfolio-related endpoints.
# The prefix and tags help organize the auto-generated API docs.
router = APIRouter()

def validate_ticker(ticker: str, session: SessionDep) -> bool:
    """Validate if ticker exists in supported tickers."""
    supported_ticker = session.exec(
        select(SupportedTicker).where(SupportedTicker.ticker == ticker.upper())
    ).first()
    return supported_ticker is not None

@router.get("/", response_model=List[PortfolioRead])
def get_portfolios_for_user(
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """Fetches all portfolios owned by the current user."""
    portfolios = session.exec(
        select(Portfolio).where(Portfolio.user_id == user_id)
    ).all()
    return portfolios

@router.post("/", response_model=PortfolioRead, status_code=201)
def create_portfolio(
    portfolio_data: PortfolioCreate,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """Creates a new portfolio for the current user."""
    # `model_validate` creates a Portfolio instance from the PortfolioCreate object
    new_portfolio = Portfolio.model_validate(portfolio_data, update={"user_id": user_id})
    
    session.add(new_portfolio)
    session.commit()
    session.refresh(new_portfolio) # Refresh to get the new ID from the DB
    
    return new_portfolio

@router.post("/{portfolio_id}/holdings", response_model=HoldingRead, status_code=status.HTTP_201_CREATED)
def add_holding_to_portfolio(
    portfolio_id: int,
    holding_data: HoldingCreate,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    # Validate ticker first
    ticker_upper = holding_data.ticker.upper()
    if not validate_ticker(ticker_upper, session):
        raise HTTPException(status_code=400, detail=f"Ticker '{holding_data.ticker}' is not supported")
    
    # First, verify the portfolio belongs to the current user
    portfolio = session.get(Portfolio, portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    if portfolio.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this portfolio")

    # Check if holding already exists
    existing_holding = session.exec(
        select(Holding).where(
            Holding.portfolio_id == portfolio_id,
            Holding.ticker == ticker_upper
        )
    ).first()
    
    if existing_holding:
        # Update existing holding
        existing_holding.quantity += holding_data.quantity
        session.add(existing_holding)
        session.commit()
        session.refresh(existing_holding)
        return existing_holding
    else:
        # Create new holding
        new_holding = Holding.model_validate(
            holding_data, 
            update={"portfolio_id": portfolio_id, "ticker": ticker_upper}
        )
        session.add(new_holding)
        session.commit()
        session.refresh(new_holding)
        return new_holding

@router.delete("/holdings/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_holding_from_portfolio(
    holding_id: int,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """Removes a specific holding from a portfolio."""
    holding = session.get(Holding, holding_id)
    if not holding:
        # Return 204 even if not found to prevent leaking information
        return
        
    # Verify the holding belongs to a portfolio owned by the user
    if holding.portfolio.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this holding")

    session.delete(holding)
    session.commit()
    return

@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """Deletes a specific portfolio and all its holdings."""
    portfolio = session.get(Portfolio, portfolio_id)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Verify ownership
    if portfolio.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this portfolio")
    
    try:
        # Explicitly delete all holdings first (though cascade should handle this)
        holdings_to_delete = session.exec(
            select(Holding).where(Holding.portfolio_id == portfolio_id)
        ).all()
        
        for holding in holdings_to_delete:
            session.delete(holding)
        
        # Delete the portfolio
        session.delete(portfolio)
        session.commit()
        
        print(f"✅ Portfolio {portfolio_id} and {len(holdings_to_delete)} holdings deleted successfully")
        return
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error deleting portfolio {portfolio_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete portfolio")

@router.patch("/holdings/{holding_id}", response_model=HoldingRead)
def update_holding_quantity(
    holding_id: int,
    quantity: float,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """Partially update the quantity of an existing holding."""
    holding = session.get(Holding, holding_id)
    if not holding or holding.portfolio.user_id != user_id:
        raise HTTPException(status_code=404, detail="Holding not found")
    
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")
    
    holding.quantity = quantity
    session.add(holding)
    session.commit()
    session.refresh(holding)
    return holding

@router.get("/{portfolio_id}", response_model=PortfolioReadWithDetails)
def get_portfolio_details(
    portfolio_id: int,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """
    Fetches a specific portfolio and enriches its holdings with live market data.
    Uses parallel API calls for improved performance.
    """
    portfolio = session.get(Portfolio, portfolio_id)
    if not portfolio or portfolio.user_id != user_id:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    enriched_holdings = []
    total_portfolio_value = 0.0
    total_previous_day_value = 0.0
    total_day_change = 0.0
    
    # Extract all tickers for parallel fetching
    tickers = [holding.ticker for holding in portfolio.holdings]
    
    # Fetch all quotes in parallel
    quotes_map = finnhub_service.get_multiple_stock_quotes(tickers)
    
    # Fetch stock names for all tickers in a single query to avoid N+1 problem
    stock_names_map = {}
    if tickers:
        supported_tickers = session.exec(
            select(SupportedTicker).where(SupportedTicker.ticker.in_(tickers))
        ).all()
        stock_names_map = {ticker.ticker: ticker.name for ticker in supported_tickers}
    
    for holding in portfolio.holdings:
        try:
            quote = quotes_map.get(holding.ticker)
            
            current_value = None
            if quote and quote.get("current_price") is not None:
                current_price = quote["current_price"]
                current_value = holding.quantity * current_price
                total_portfolio_value += current_value
            
            if quote and quote.get("previous_close") is not None:
                previous_close = quote["previous_close"]
                total_previous_day_value += holding.quantity * previous_close
            
            if quote and quote.get("day_change") is not None:
                day_change = quote["day_change"]
                holding_day_change = holding.quantity * day_change
                total_day_change += holding_day_change
            else:
                holding_day_change = None
            
            enriched_holdings.append(
                HoldingReadWithMarketData(
                    id=holding.id,
                    ticker=holding.ticker,
                    quantity=holding.quantity,
                    stock_name=stock_names_map.get(holding.ticker),
                    current_price=quote.get("current_price") if quote else None,
                    current_value=current_value,
                    day_change_percent=quote.get("day_change_percent") if quote else None,
                    total_day_change=holding_day_change
                )
            )
        except Exception as e:
            # Log error but continue processing other holdings
            print(f"Error processing holding {holding.ticker}: {e}")
            # Add holding with null market data
            enriched_holdings.append(
                HoldingReadWithMarketData(
                    id=holding.id,
                    ticker=holding.ticker,
                    quantity=holding.quantity,
                    stock_name=stock_names_map.get(holding.ticker),
                    current_price=None,
                    current_value=None,
                    day_change_percent=None,
                    total_day_change=None
                )
            )
            continue
    
    # Note: Calculating total day change is complex and requires more data.
    total_day_change_percent = None
    if total_previous_day_value > 0:
        percent_change = ((total_portfolio_value - total_previous_day_value) / total_previous_day_value) * 100
        total_day_change_percent = round(percent_change, 2)
    # We will leave it as None for now.
    return PortfolioReadWithDetails(
        id=portfolio.id,
        name=portfolio.name,
        holdings=enriched_holdings,
        total_value=total_portfolio_value,
        total_day_change_percent=total_day_change_percent,
        total_day_change=total_day_change
    )