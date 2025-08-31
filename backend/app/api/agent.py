from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel

from app.database.session import SessionDep
from app.database.models import Portfolio
from app.auth.security import get_current_user_id
from app.services import agent_service

router = APIRouter()

class AgentRequest(BaseModel):
    portfolio_id: int

@router.post("/explain-performance", response_model=dict)
def get_ai_analysis(
    request: AgentRequest,
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    portfolio = session.get(Portfolio, request.portfolio_id)
    if not portfolio or portfolio.user_id != user_id:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    if not portfolio.holdings:
        return {"analysis": "Your portfolio is empty. Add some stocks to get an analysis."}

    try:
        analysis_text = agent_service.run_analysis(portfolio, session)
        return {"analysis": analysis_text}
    except Exception as e:
        print(f"Error running agent service: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analysis from AI.")