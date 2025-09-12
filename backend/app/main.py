from fastapi import FastAPI,status,Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.database.session import create_db_tables
from app.api import portfolios, search, agent, account # Import the routers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    """
    print("Starting up...")
    create_db_tables() # Create database tables on startup
    yield
    print("Shutting down...")

# Create the main FastAPI app instance
app = FastAPI(
    title="Portfolio AI Analyst API",
    description="API for managing stock portfolios and getting AI-driven insights.",
    lifespan=lifespan
)

# Configure CORS origins for development and production
cors_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Local development
]

# Add production origins from environment variable
if production_origins := os.getenv("CORS_ORIGINS"):
    cors_origins.extend(production_origins.split(","))

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router from the portfolios api module
# All routes in the router will now be prefixed with /api/portfolios
app.include_router(portfolios.router, prefix="/api/portfolios", tags=["Portfolios"])
app.include_router(search.router, prefix="/api/search/stocks", tags=["Search"])
app.include_router(agent.router, prefix="/api/agent", tags=["Agent"])
app.include_router(account.router, prefix="/api/account", tags=["Account"])
@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.head("/")
def head_root():
    return Response(status_code=status.HTTP_200_OK)

@app.get("/health")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "message": "XFoli AI Backend is running",
        "version": "1.0.0"
    }
