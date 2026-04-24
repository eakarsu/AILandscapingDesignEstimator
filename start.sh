#!/bin/bash

# ===================================================
# AI Landscaping Design & Estimator - Startup Script
# ===================================================

set -e

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════╗"
echo "║   🌳 AI Landscaping Design & Estimator Pro 🌳   ║"
echo "║          Starting Application...                 ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
    echo -e "${RED}✗ .env file not found! Please create one.${NC}"
    exit 1
fi

BACKEND_PORT=${BACKEND_PORT:-3001}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Function to kill processes on specified ports
cleanup_ports() {
    echo -e "${YELLOW}→ Cleaning up ports...${NC}"

    for PORT in $BACKEND_PORT $FRONTEND_PORT; do
        PID=$(lsof -ti :$PORT 2>/dev/null || true)
        if [ ! -z "$PID" ]; then
            echo -e "${YELLOW}  Killing process on port $PORT (PID: $PID)${NC}"
            kill -9 $PID 2>/dev/null || true
            sleep 1
        fi
    done

    echo -e "${GREEN}✓ Ports cleaned${NC}"
}

# Function to check if PostgreSQL is running
check_postgres() {
    echo -e "${YELLOW}→ Checking PostgreSQL...${NC}"
    if command -v pg_isready &> /dev/null; then
        if pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PostgreSQL is running${NC}"
        else
            echo -e "${YELLOW}  Starting PostgreSQL...${NC}"
            if command -v brew &> /dev/null; then
                brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
            fi
            sleep 2
            if ! pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} > /dev/null 2>&1; then
                echo -e "${RED}✗ Could not start PostgreSQL. Please start it manually.${NC}"
                exit 1
            fi
            echo -e "${GREEN}✓ PostgreSQL started${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ pg_isready not found, assuming PostgreSQL is running${NC}"
    fi
}

# Function to create database if not exists
setup_database() {
    echo -e "${YELLOW}→ Setting up database...${NC}"
    DB_NAME=${DB_NAME:-landscaping_estimator}
    DB_USER=${DB_USER:-postgres}

    # Check if database exists, create if not
    if psql -U $DB_USER -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw $DB_NAME; then
        echo -e "${GREEN}✓ Database '$DB_NAME' exists${NC}"
    else
        echo -e "${YELLOW}  Creating database '$DB_NAME'...${NC}"
        createdb -U $DB_USER -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} $DB_NAME 2>/dev/null || true
        echo -e "${GREEN}✓ Database created${NC}"
    fi
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}→ Installing dependencies...${NC}"

    # Backend
    echo -e "${BLUE}  Installing backend dependencies...${NC}"
    (cd "$SCRIPT_DIR/backend" && npm install --silent 2>&1 | tail -1)
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"

    # Frontend
    echo -e "${BLUE}  Installing frontend dependencies...${NC}"
    (cd "$SCRIPT_DIR/frontend" && npm install --silent 2>&1 | tail -1)
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
}

# Function to seed database
seed_database() {
    echo -e "${YELLOW}→ Seeding database...${NC}"
    (cd "$SCRIPT_DIR/backend" && node src/seeds/seed.js)
    echo -e "${GREEN}✓ Database seeded with sample data${NC}"
}

# Function to start backend with hot reload
start_backend() {
    echo -e "${YELLOW}→ Starting backend (port $BACKEND_PORT) with hot reload...${NC}"
    (cd "$SCRIPT_DIR/backend" && npx nodemon src/server.js) &
    BACKEND_PID=$!
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
}

# Function to start frontend with hot reload
start_frontend() {
    echo -e "${YELLOW}→ Starting frontend (port $FRONTEND_PORT) with hot reload...${NC}"
    (cd "$SCRIPT_DIR/frontend" && PORT=$FRONTEND_PORT BROWSER=none npm start) &
    FRONTEND_PID=$!
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
}

# Cleanup function for graceful shutdown
cleanup() {
    echo -e "\n${YELLOW}→ Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    cleanup_ports
    echo -e "${GREEN}✓ Application stopped${NC}"
    exit 0
}

# Register cleanup handler
trap cleanup SIGINT SIGTERM

# ===== Main Execution =====
cleanup_ports
check_postgres
setup_database
install_deps
seed_database
start_backend

# Wait for backend to be ready
echo -e "${YELLOW}→ Waiting for backend to be ready...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend is ready${NC}"
        break
    fi
    sleep 1
done

start_frontend

echo -e ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🌳 Application is Running! 🌳           ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║  Frontend: ${BLUE}http://localhost:$FRONTEND_PORT${GREEN}              ║${NC}"
echo -e "${GREEN}║  Backend:  ${BLUE}http://localhost:$BACKEND_PORT${GREEN}              ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║  Login:    admin@landscaping.com / password123   ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}║  Hot reload is enabled for both services         ║${NC}"
echo -e "${GREEN}║  Press Ctrl+C to stop                            ║${NC}"
echo -e "${GREEN}║                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"

# Wait for both processes
wait
