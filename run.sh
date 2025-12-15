#!/bin/bash

# Instagram Mirror - Development Runner
# Starts both backend and frontend servers
# Run ./install.sh first if this is your first time

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
    echo ""
    echo "Please run: ./install.sh"
    echo ""
    exit 1
fi

# Check if .env files exist
if [ ! -f "backend/.env" ] || [ ! -f "frontend/.env" ]; then
    echo "⚠️  Environment files missing!"
    echo ""
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

# Run both servers
npm run dev
