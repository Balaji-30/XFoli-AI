from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from fastapi import status
import os
from supabase import create_client, Client

# Import dependencies and models
from app.database.session import SessionDep
from app.database.models import Portfolio, Holding
from app.auth.security import get_current_user_id

# Create a router for account management
router = APIRouter()

# Initialize Supabase client with service role key for admin operations
def get_supabase_admin_client() -> Client:
    """Get Supabase client with admin privileges for user management."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_service_role_key:
        raise HTTPException(
            status_code=500,
            detail="Supabase admin credentials not configured"
        )
    
    return create_client(supabase_url, supabase_service_role_key)

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """
    Permanently delete user account and all associated data.
    This action cannot be undone.
    """
    try:
        # Get all user's portfolios
        user_portfolios = session.exec(
            select(Portfolio).where(Portfolio.user_id == user_id)
        ).all()
        
        # Delete all holdings first (cascading should handle this, but being explicit)
        for portfolio in user_portfolios:
            holdings = session.exec(
                select(Holding).where(Holding.portfolio_id == portfolio.id)
            ).all()
            
            for holding in holdings:
                session.delete(holding)
        
        # Delete all portfolios
        for portfolio in user_portfolios:
            session.delete(portfolio)
        
        # Commit the deletions
        session.commit()
        
        print(f"✅ Account {user_id} and all associated data deleted successfully")
        print(f"   - Deleted {len(user_portfolios)} portfolios")
        print(f"   - Deleted holdings for all portfolios")
        
        # Delete the Supabase user account using admin client
        try:
            supabase_admin = get_supabase_admin_client()
            supabase_admin.auth.admin.delete_user(user_id)
            print(f"✅ Supabase user {user_id} deleted successfully")
        except Exception as supabase_error:
            print(f"⚠️ Warning: Failed to delete Supabase user {user_id}: {supabase_error}")
            # Don't fail the whole operation if Supabase deletion fails
            # The application data is already deleted
        
        return
        
    except Exception as e:
        session.rollback()
        print(f"❌ Error deleting account {user_id}: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to delete account data. Please try again or contact support."
        )

@router.get("/data-summary")
def get_account_data_summary(
    session: SessionDep,
    user_id: str = Depends(get_current_user_id)
):
    """
    Get a summary of user's data before deletion.
    Helps users understand what will be deleted.
    """
    try:
        # Count user's portfolios
        portfolios = session.exec(
            select(Portfolio).where(Portfolio.user_id == user_id)
        ).all()
        
        # Count total holdings across all portfolios
        total_holdings = 0
        portfolio_details = []
        
        for portfolio in portfolios:
            holdings = session.exec(
                select(Holding).where(Holding.portfolio_id == portfolio.id)
            ).all()
            
            portfolio_details.append({
                "name": portfolio.name,
                "holdings_count": len(holdings),
                "created_at": portfolio.id  # You might want to add created_at to Portfolio model
            })
            
            total_holdings += len(holdings)
        
        return {
            "portfolios_count": len(portfolios),
            "total_holdings": total_holdings,
            "portfolio_details": portfolio_details,
            "warning": "Deleting your account will permanently remove all this data and cannot be undone."
        }
        
    except Exception as e:
        print(f"❌ Error getting account summary for {user_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve account data summary"
        ) 