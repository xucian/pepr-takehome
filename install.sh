#!/bin/bash

# Instagram Mirror - Master Installation Script
# Installs all dependencies for both backend and frontend

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Instagram Mirror - Complete Installation           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Load NVM if available
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    echo "✅ NVM loaded"
else
    echo "⚠️  NVM not found - using system Node"
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo ""
    echo "Please install Node.js first:"
    echo "  Option 1: Install NVM - https://github.com/nvm-sh/nvm"
    echo "  Option 2: Install Node directly - https://nodejs.org/"
    exit 1
fi

# Determine Node version
NODE_VERSION="20.18.1"
if [ -f .nvmrc ]; then
    NODE_VERSION=$(cat .nvmrc)
fi

echo ""
echo "🔍 Node.js Setup"
echo "   Target version: $NODE_VERSION"

if command -v nvm &> /dev/null; then
    echo "   Installing Node $NODE_VERSION via NVM..."
    nvm install "$NODE_VERSION" 2>/dev/null || echo "   (already installed)"
    nvm use "$NODE_VERSION"
    echo "   ✅ Using Node $(node -v)"
else
    echo "   ⚠️  Using system Node: $(node -v)"
    CURRENT_VERSION=$(node -v | sed 's/v//')
    if [[ ! "$CURRENT_VERSION" =~ ^20\. ]]; then
        echo "   ⚠️  Warning: Node 20.x recommended, you have $CURRENT_VERSION"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 1/3: Installing Root Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$SCRIPT_DIR"
npm install
echo "   ✅ Root dependencies installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 2/3: Installing Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$SCRIPT_DIR/backend"
npm install
echo "   ✅ Backend dependencies installed"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Step 3/3: Installing Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd "$SCRIPT_DIR/frontend"
npm install
echo "   ✅ Frontend dependencies installed"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ Installation Complete!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Start the servers:"
echo "   $ ./run.sh"
echo ""
