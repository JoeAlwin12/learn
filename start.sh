#!/bin/bash

# Quantic CRM - One Command Starter
# Run: bash ~/learn/start.sh

echo "🚀 Starting Quantic CRM Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
echo "📦 Checking Docker..."
if ! docker ps > /dev/null 2>&1; then
    echo "${YELLOW}⚠️  Docker is not running. Attempting to start Docker Desktop...${NC}"
    open -a Docker
    echo "Waiting 10 seconds for Docker to start..."
    sleep 10
fi

# Start PostgreSQL with Docker
echo "${BLUE}📊 Starting PostgreSQL...${NC}"
cd ~/learn/backend
docker-compose up -d > /dev/null 2>&1
echo "${GREEN}✅ PostgreSQL started${NC}"
echo ""

# Create new terminal windows and start servers
echo "${BLUE}🎬 Starting servers...${NC}"
echo "${YELLOW}Note: Two new terminal windows will open${NC}"
echo ""

# Terminal 1: Backend
echo "Starting Backend Server..."
osascript <<EOF
tell application "Terminal"
    activate
    set newTab to (create tab (default window))
    tell newTab
        do script "cd ~/learn/backend && npm install > /dev/null 2>&1 && npm run dev"
    end tell
end tell
EOF

sleep 3

# Terminal 2: Frontend
echo "Starting Frontend Server..."
osascript <<EOF
tell application "Terminal"
    activate
    set newTab to (create tab (default window))
    tell newTab
        do script "cd ~/learn/frontend && npm install > /dev/null 2>&1 && npm run dev"
    end tell
end tell
EOF

echo ""
echo "${GREEN}════════════════════════════════════════════════════════${NC}"
echo "${GREEN}✅ Quantic CRM is Starting!${NC}"
echo "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo "📱 Open your browser:"
echo "${BLUE}   http://localhost:5173${NC}"
echo ""
echo "🔐 Login with:"
echo "   Email: ${BLUE}admin@crm.local${NC}"
echo "   Password: ${BLUE}admin123${NC}"
echo ""
echo "⏳ Waiting for servers to start (30-60 seconds)..."
echo ""
echo "📋 Servers running on:"
echo "   Backend:  ${BLUE}http://localhost:5000${NC}"
echo "   Frontend: ${BLUE}http://localhost:5173${NC}"
echo "   Database: PostgreSQL (port 5432)"
echo ""
echo "❌ To stop everything:"
echo "   1. Close the terminal windows, or"
echo "   2. Press Ctrl+C in each terminal"
echo ""
echo "For help, read: ~/learn/START_HERE.md"
echo ""
