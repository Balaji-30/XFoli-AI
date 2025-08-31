from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import UniqueConstraint


class SupportedTicker(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticker: str = Field(index=True, unique=True)
    name: str
    index_name: str = Field(index=True)

class Portfolio(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    user_id: str = Field(index=True)
    holdings: List["Holding"] = Relationship(
        back_populates="portfolio", 
        cascade_delete=True  # Enable cascade delete
    )

class Holding(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticker: str = Field(index=True)
    quantity: float
    # Foreign Key to link this holding to a portfolio
    portfolio_id: int = Field(foreign_key="portfolio.id")
    
    # Add unique constraint
    __table_args__ = (UniqueConstraint("portfolio_id", "ticker"),)
    # The relationship back to the Portfolio model
    portfolio: "Portfolio" = Relationship(back_populates="holdings")