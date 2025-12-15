#!/bin/bash

# Instagram Mirror - Development Runner
# Starts both backend and frontend servers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load NVM if available
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    if [ -f .nvmrc ]; then
        nvm use 2>/dev/null || true
    fi
fi

echo "🚀 Starting Instagram Mirror..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Dependencies not installed!"
    echo "Please run: ./install.sh"
    echo ""
    exit 1
fi

echo "🔥 Starting servers..."
echo "   Backend:  http://localhost:3002"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Set environment variables and run both servers
PORT=3002 NODE_ENV=development CORS_ORIGIN=http://localhost:5173 PUBLIC_API_URL=http://localhost:3002 npm run dev
