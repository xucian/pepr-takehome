#!/bin/bash

# Backend Installation Script

set -e

echo "📦 Installing Backend Dependencies..."
echo ""

# Load NVM if available
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Check for .nvmrc or use default
if [ -f .nvmrc ]; then
    NODE_VERSION=$(cat .nvmrc)
else
    NODE_VERSION="20.18.1"
fi

echo "🔍 Checking Node.js version..."
if command -v nvm &> /dev/null; then
    echo "   Using nvm to ensure Node $NODE_VERSION"
    nvm install "$NODE_VERSION" 2>/dev/null || true
    nvm use "$NODE_VERSION"
else
    echo "   ⚠️  NVM not found, using system Node: $(node -v)"
fi

echo ""
echo "📥 Installing npm packages..."
npm install

echo ""
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "   ✅ Created .env from template"
    else
        echo "   ⚠️  No .env.example found"
    fi
else
    echo "   ✅ .env already exists"
fi

echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Backend installation complete!"
echo ""
