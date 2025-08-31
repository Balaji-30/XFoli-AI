from pydantic import BaseModel
from app.models.holding import HoldingRead,HoldingReadWithMarketData    
from typing import List,Optional

# Data Transfer Object for creating a new portfolio (from API request body)
class PortfolioCreate(BaseModel):
    name: str

# Data Transfer Object for reading a portfolio (for API response)
class PortfolioRead(BaseModel):
    id: int
    name: str
    user_id: str
    holdings: List[HoldingRead] = []

class PortfolioReadWithHoldings(BaseModel):
    id: int
    name: str
    holdings: List[HoldingRead] = []

class PortfolioReadWithDetails(BaseModel):
    id: int
    name: str
    holdings: List[HoldingReadWithMarketData] = []
    total_value: Optional[float] = None
    total_day_change_percent: Optional[float] = None
    total_day_change: Optional[float] = None