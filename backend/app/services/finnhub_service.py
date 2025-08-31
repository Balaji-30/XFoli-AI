import os
import time
import requests
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Optional
from datetime import datetime, timedelta


load_dotenv()
FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
FINNHUB_API_URL = "https://finnhub.io/api/v1"

def get_company_news(ticker: str) -> list:
    """Fetches recent news for a given stock ticker from the last 7 days."""
    if not FINNHUB_API_KEY:
        print("Finnhub API key not configured.")
        return []

    # Get dates for the last 7 days
    to_date = datetime.now().strftime('%Y-%m-%d')
    from_date = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')

    try:
        url = f"{FINNHUB_API_URL}/company-news?symbol={ticker}&from={from_date}&to={to_date}&token={FINNHUB_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news for {ticker}: {e}")
        return []
# --- A SIMPLE IN-MEMORY CACHE ---
# This dictionary will store our cached data and timestamps
quote_cache = {}
CACHE_DURATION_SECONDS = 60 # Cache data for 1 minute

def get_stock_quote(ticker: str) -> dict | None:
    """
    Fetches a real-time quote for a given stock ticker, using a cache
    to avoid redundant API calls.
    """
    current_time = time.time()

    # 1. Check if a valid cache entry exists
    if ticker in quote_cache:
        cached_data = quote_cache[ticker]
        if current_time - cached_data['timestamp'] < CACHE_DURATION_SECONDS:
            print(f"CACHE HIT for {ticker}")
            return cached_data['data']

    print(f"CACHE MISS for {ticker}. Fetching from API...")
    if not FINNHUB_API_KEY:
        print("Finnhub API key not configured.")
        return None
        
    try:
        url = f"{FINNHUB_API_URL}/quote?symbol={ticker}&token={FINNHUB_API_KEY}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if data.get('c') == 0 and data.get('d') is None:
            return None
            
        quote_data = {
            "current_price": data.get("c"),
            "day_change_percent": data.get("dp"),
            "day_change": data.get("d"),
            "previous_close": data.get("pc")
        }
        
        # 2. Store the new data and timestamp in the cache
        quote_cache[ticker] = {
            'data': quote_data,
            'timestamp': current_time
        }
        
        return quote_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching quote for {ticker}: {e}")
        return None

def get_multiple_stock_quotes(tickers: List[str], max_workers: int = 10) -> Dict[str, Optional[dict]]:
    """
    Fetches quotes for multiple tickers in parallel using ThreadPoolExecutor.
    Returns a dictionary mapping ticker -> quote_data (or None if failed).
    """
    print(f"📈 Fetching quotes for {len(tickers)} stocks in parallel...")
    start_time = time.time()
    
    results = {}
    
    # Use ThreadPoolExecutor to fetch quotes in parallel
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_ticker = {
            executor.submit(get_stock_quote, ticker): ticker 
            for ticker in tickers
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_ticker):
            ticker = future_to_ticker[future]
            try:
                quote_data = future.result()
                results[ticker] = quote_data
                status = "✅" if quote_data else "❌"
                print(f"{status} {ticker}: Quote fetched")
            except Exception as e:
                print(f"❌ {ticker}: Error - {e}")
                results[ticker] = None
    
    elapsed = time.time() - start_time
    print(f"🚀 Parallel fetch completed in {elapsed:.2f}s (vs ~{len(tickers) * 0.3:.1f}s sequential)")
    
    return results