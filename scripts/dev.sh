#!/usr/bin/env bash
# FraudGraph AI — Local Concurrent Development Launcher
set -e

# Export standard system paths
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

echo "=========================================================="
echo "🚀 Starting FraudGraph AI Unified Development Environment"
echo "=========================================================="

# Cleanup handler on exit (Ctrl+C)
cleanup() {
  echo ""
  echo "🛑 Shutting down FraudGraph AI services..."
  kill $(jobs -p) 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 1. Start Python FastAPI intelligence service
echo "🐍 Starting FastAPI Intelligence Service on http://localhost:8000 ..."
PYTHONPATH=apps/api apps/api/.venv/bin/uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload &
API_PID=$!

# Wait briefly for FastAPI to bind
sleep 1.5

# 2. Start Vite Workbench Frontend
echo "⚛️ Starting Vite Frontend Workbench on http://localhost:3000 ..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✨ All services running concurrently:"
echo "   - Frontend UI:  http://localhost:3000"
echo "   - Backend API:  http://localhost:8000"
echo "   - API Docs:     http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to terminate all services."

# Wait for background jobs
wait $API_PID $FRONTEND_PID
