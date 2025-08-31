from pydantic import BaseModel

class SupportedTickerRead(BaseModel):
    ticker: str
    name: str