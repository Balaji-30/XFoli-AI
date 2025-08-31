from pydantic import BaseModel
from typing import Optional

class HoldingCreate(BaseModel):
    ticker: str
    quantity: float

# Data Transfer Object for reading a holding (API response)
class HoldingRead(BaseModel):
    id: int
    ticker: str
    quantity: float

class HoldingReadWithMarketData(BaseModel):
    id: int
    ticker: str
    quantity: float
    stock_name: Optional[str] = None
    current_price: Optional[float] = None
    current_value: Optional[float] = None
    day_change_percent: Optional[float] = None
    total_day_change: Optional[float] = None