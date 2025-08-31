#!/usr/bin/env bash
# Render start script for XFoli AI Backend

echo "🚀 Starting XFoli AI Backend..."
echo "📍 Port: $PORT"
echo "🌐 Environment: ${ENV:-development}"

# Start the FastAPI server with uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port $PORT --log-level info 