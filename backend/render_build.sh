#!/usr/bin/env bash
# Render build script for XFoli AI Backend

set -o errexit  # Exit on error

echo "🔧 Starting build process..."
echo "📍 Working directory: $(pwd)"
echo "🐍 Python version: $(python --version)"

echo "🔄 Upgrading pip..."
pip install --upgrade pip

echo "📦 Installing dependencies..."
pip install -e .

echo "✅ Build complete! Backend ready for deployment." 