#!/bin/bash

# Instagram Mirror - Development Runner
# Starts both backend and frontend servers

set -e

echo "🚀 Starting Instagram Mirror..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️  Creating backend .env from template..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚙️  Creating frontend .env from template..."
    cp frontend/.env.example frontend/.env
fi

echo ""
echo "✅ All dependencies installed"
echo "✅ Environment files ready"
echo ""
echo "🔥 Starting servers..."
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both servers
npm run dev
