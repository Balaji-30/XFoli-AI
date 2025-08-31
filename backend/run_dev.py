#!/usr/bin/env python3
"""
Development server for the Portfolio AI Analyst API
Run this script to start the backend server during development.
"""

import uvicorn
import os
from pathlib import Path

# Add the current directory to Python path
import sys
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    print("🚀 Starting Portfolio AI Analyst API...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("📊 API Documentation at: http://localhost:8000/docs")
    print("🔄 Auto-reload enabled for development")
    print("\n" + "="*50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    ) 