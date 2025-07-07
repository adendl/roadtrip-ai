#!/bin/bash

# roadtrip.ai Setup Script
# This script helps you set up the application securely

echo "🚗 Setting up roadtrip.ai..."
echo ""

# Check if required tools are installed
command -v java >/dev/null 2>&1 || { echo "❌ Java is required but not installed. Please install Java 17 or higher."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 18 or higher."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"
echo ""

# Backend setup
echo "🔧 Setting up backend..."
if [ ! -f "backend/src/main/resources/application.properties" ]; then
    echo "📝 Creating application.properties from template..."
    cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
    echo "⚠️  Please edit backend/src/main/resources/application.properties with your actual credentials"
else
    echo "✅ application.properties already exists"
fi

# Frontend setup
echo ""
echo "🔧 Setting up frontend..."
if [ ! -f "frontend/.env.development" ]; then
    echo "📝 Creating .env.development from template..."
    cp frontend/env.template frontend/.env.development
    echo "✅ .env.development created"
else
    echo "✅ .env.development already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

echo "Installing backend dependencies..."
cd backend
./mvnw clean install -DskipTests
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/src/main/resources/application.properties with your database and OpenAI API credentials"
echo "2. Edit frontend/.env.development with your API URL"
echo "3. Start the backend: cd backend && ./mvnw spring-boot:run"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "For security guidelines, see SECURITY.md" 