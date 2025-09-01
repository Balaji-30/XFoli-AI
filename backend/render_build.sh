#!/usr/bin/env bash
# Render build script for XFoli AI Backend (UV version)

set -o errexit  # Exit on error

echo "🔧 Starting build process..."
echo "📍 Working directory: $(pwd)"
echo "🐍 Python version: $(python --version)"

echo "⚡ Installing uv (fast Python package installer)..."
pip install uv

echo "📦 Installing dependencies with uv..."
uv pip install -e . --system

echo "✅ Build complete! Backend ready for deployment."
echo "🚀 uv is much faster than pip - great choice!" 