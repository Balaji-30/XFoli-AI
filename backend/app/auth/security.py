# FILE: backend/app/auth/security.py
# DESCRIPTION: Handles JWT validation to secure API endpoints.

import os
from fastapi import Depends, HTTPException, status
# --- CHANGE HERE: Import HTTPBearer instead ---
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("DATABASE_JWT_SECRET")
ALGORITHM = "HS256"

if not SECRET_KEY:
    raise ValueError("DATABASE_JWT_SECRET is not set in the .env file")

# --- CHANGE HERE: Use HTTPBearer for simple token authentication ---
bearer_scheme = HTTPBearer()


# --- THE MAIN AUTHENTICATION DEPENDENCY ---
def get_current_user_id(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    """
    Decodes the JWT token from the request, validates it, and returns the user ID.
    This function will be used as a dependency in all protected API endpoints.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        print(f"--- Received Token: '{token.credentials}' ---")
        # The actual token string is in the 'credentials' attribute
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM], audience="authenticated")
        
        # The user ID is stored in the 'sub' (subject) claim of the token
        user_id: str | None = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
            
        return user_id
        
    except JWTError as e:
        # If the token is invalid for any reason, raise the exception
        print(f"--- JWT DECODING FAILED: {e} ---")
        raise credentials_exception

