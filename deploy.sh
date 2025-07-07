#!/bin/bash

# Deployment script for roadtrip.ai
# Usage: ./deploy.sh [backend|frontend|both]

set -e

# Configuration
PROJECT_ID="your-project-id"
REGION="australia-southeast1"
BACKEND_SERVICE="roadtrip-ai-backend"
FRONTEND_SERVICE="roadtrip-ai-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is configured
check_gcloud() {
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "gcloud is not authenticated. Please run 'gcloud auth login'"
        exit 1
    fi
    
    if [ "$PROJECT_ID" = "your-project-id" ]; then
        print_error "Please update PROJECT_ID in this script"
        exit 1
    fi
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    
    cd backend
    
    # Build Docker image
    print_status "Building Docker image..."
    docker build -t gcr.io/$PROJECT_ID/$BACKEND_SERVICE .
    
    # Push to Container Registry
    print_status "Pushing to Container Registry..."
    docker push gcr.io/$PROJECT_ID/$BACKEND_SERVICE
    
    # Deploy to Cloud Run
    print_status "Deploying to Cloud Run..."
    gcloud run deploy $BACKEND_SERVICE \
        --image gcr.io/$PROJECT_ID/$BACKEND_SERVICE \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 2Gi \
        --cpu 2 \
        --timeout 600 \
        --max-instances 10 \
        --set-env-vars="DATABASE_URL=$DATABASE_URL" \
        --set-env-vars="DATABASE_USERNAME=$DATABASE_USERNAME" \
        --set-env-vars="DATABASE_PASSWORD=$DATABASE_PASSWORD" \
        --set-env-vars="JWT_SECRET=$JWT_SECRET" \
        --set-env-vars="OPENAI_API_KEY=$OPENAI_API_KEY" \
        --set-env-vars="LOG_LEVEL=${LOG_LEVEL:-INFO}"
    
    cd ..
    
    # Get the backend URL
    BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
    print_status "Backend deployed at: $BACKEND_URL"
    
    # Export for frontend deployment
    export BACKEND_URL
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying frontend..."
    
    cd frontend
    
    # Check if backend URL is available
    if [ -z "$BACKEND_URL" ]; then
        print_warning "BACKEND_URL not set. Getting from Cloud Run..."
        BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
    fi
    
    print_status "Using backend URL: $BACKEND_URL"
    
    # Build Docker image
    print_status "Building Docker image..."
    docker build -t gcr.io/$PROJECT_ID/$FRONTEND_SERVICE .
    
    # Push to Container Registry
    print_status "Pushing to Container Registry..."
    docker push gcr.io/$PROJECT_ID/$FRONTEND_SERVICE
    
    # Deploy to Cloud Run
    print_status "Deploying to Cloud Run..."
    gcloud run deploy $FRONTEND_SERVICE \
        --image gcr.io/$PROJECT_ID/$FRONTEND_SERVICE \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 80 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 5 \
        --set-env-vars="VITE_API_BASE_URL=$BACKEND_URL" \
        --set-env-vars="VITE_APP_ENV=production"
    
    cd ..
    
    # Get the frontend URL
    FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")
    print_status "Frontend deployed at: $FRONTEND_URL"
}

# Main deployment logic
main() {
    check_gcloud
    
    case "${1:-both}" in
        "backend")
            deploy_backend
            ;;
        "frontend")
            deploy_frontend
            ;;
        "both")
            deploy_backend
            deploy_frontend
            ;;
        *)
            print_error "Usage: $0 [backend|frontend|both]"
            exit 1
            ;;
    esac
    
    print_status "Deployment completed successfully!"
}

# Check if environment variables are set
if [ -z "$DATABASE_URL" ] || [ -z "$DATABASE_USERNAME" ] || [ -z "$DATABASE_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$OPENAI_API_KEY" ]; then
    print_warning "Some environment variables are not set. Please set:"
    echo "  DATABASE_URL"
    echo "  DATABASE_USERNAME"
    echo "  DATABASE_PASSWORD"
    echo "  JWT_SECRET"
    echo "  OPENAI_API_KEY"
    echo ""
    print_warning "You can set them in your shell or create a .env file and source it."
    echo "Example:"
    echo "  export DATABASE_URL='jdbc:postgresql://your-db-host:5432/your-db'"
    echo "  export DATABASE_USERNAME='your-username'"
    echo "  export DATABASE_PASSWORD='your-password'"
    echo "  export JWT_SECRET='your-jwt-secret'"
    echo "  export OPENAI_API_KEY='your-openai-key'"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run main function
main "$@" 