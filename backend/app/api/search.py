from typing import List
from fastapi import APIRouter, Query
from sqlmodel import  select

from app.database.session import SessionDep
from app.models.supported_ticker import SupportedTickerRead
from app.database.models import SupportedTicker

router = APIRouter()

@router.get("/", response_model=List[SupportedTickerRead])
def search_for_stocks(
    *,
    session: SessionDep,
    query: str = Query(..., min_length=1, max_length=50)
):
    """
    Searches for supported stocks by ticker or name.
    The search is case-insensitive and returns up to 10 results.
    """
    search_term = f"%{query}%" # Add wildcards for partial matching

    statement = (
        select(SupportedTicker)
        .where(
            # The | operator creates an "OR" condition
            (SupportedTicker.ticker.ilike(search_term)) |
            (SupportedTicker.name.ilike(search_term))
        )
        .limit(10) # Limit results for performance
    )
    
    results = session.exec(statement).all()
    return results