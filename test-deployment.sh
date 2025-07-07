#!/bin/bash

# Test script to verify deployment configuration
# Usage: ./test-deployment.sh [backend-url] [frontend-url]

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get URLs from command line or prompt
BACKEND_URL=${1:-""}
FRONTEND_URL=${2:-""}

if [ -z "$BACKEND_URL" ]; then
    read -p "Enter backend URL: " BACKEND_URL
fi

if [ -z "$FRONTEND_URL" ]; then
    read -p "Enter frontend URL: " FRONTEND_URL
fi

print_status "Testing deployment configuration..."

# Test backend health
print_status "Testing backend health..."
if curl -f -s "$BACKEND_URL/actuator/health" > /dev/null; then
    print_status "✅ Backend health check passed"
else
    print_error "❌ Backend health check failed"
    exit 1
fi

# Test frontend loads
print_status "Testing frontend..."
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    print_status "✅ Frontend loads successfully"
else
    print_error "❌ Frontend failed to load"
    exit 1
fi

# Test runtime config
print_status "Testing runtime configuration..."
RUNTIME_CONFIG=$(curl -s "$FRONTEND_URL/runtime-config.js" 2>/dev/null || echo "")
if echo "$RUNTIME_CONFIG" | grep -q "VITE_API_BASE_URL"; then
    print_status "✅ Runtime config found"
    echo "$RUNTIME_CONFIG"
else
    print_warning "⚠️  Runtime config not found or empty"
fi

# Test API connectivity from frontend perspective
print_status "Testing API connectivity..."
API_RESPONSE=$(curl -s "$FRONTEND_URL" | grep -o "VITE_API_BASE_URL.*localhost" || echo "No localhost found")
if [ -z "$API_RESPONSE" ]; then
    print_status "✅ No localhost references found in frontend"
else
    print_warning "⚠️  Found localhost reference: $API_RESPONSE"
fi

print_status "Deployment test completed!"
print_status "Frontend URL: $FRONTEND_URL"
print_status "Backend URL: $BACKEND_URL"
print_status ""
print_status "To debug further, open the frontend URL in your browser and check the console for debug information." 