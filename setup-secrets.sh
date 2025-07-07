#!/bin/bash

# Setup script for Google Secret Manager
# This script creates all required secrets for the roadtrip.ai Cloud Build pipeline

set -e

echo "Setting up Google Secret Manager secrets for roadtrip.ai..."

# Get the current project ID
PROJECT_ID=$(gcloud config get-value project)
echo "Using project: $PROJECT_ID"

# Function to create secret if it doesn't exist
create_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3
    
    echo "Creating secret: $secret_name"
    
    # Check if secret exists
    if gcloud secrets describe "$secret_name" >/dev/null 2>&1; then
        echo "Secret $secret_name already exists, updating..."
        echo -n "$secret_value" | gcloud secrets versions add "$secret_name" --data-file=-
    else
        echo "Creating new secret: $secret_name"
        echo -n "$secret_value" | gcloud secrets create "$secret_name" --data-file=- --replication-policy="automatic"
    fi
    
    # Add description if provided
    if [ -n "$description" ]; then
        # Convert description to valid label format (lowercase, hyphens instead of spaces)
        label_value=$(echo "$description" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
        gcloud secrets update "$secret_name" --update-labels="description=$label_value"
    fi
}

# Generate a secure JWT secret (256-bit)
JWT_SECRET=$(openssl rand -hex 32)
echo "Generated JWT secret: $JWT_SECRET"

# Create secrets
create_secret "jwt-secret" "$JWT_SECRET" "JWT signing secret for authentication"

# Database secrets (you'll need to update these with your actual values)
echo "Please provide your database configuration:"
read -p "Database URL (e.g., jdbc:postgresql://host:port/dbname): " DB_URL
read -p "Database username: " DB_USERNAME
read -p "Database password: " DB_PASSWORD

create_secret "db-url" "$DB_URL" "PostgreSQL database connection URL"
create_secret "db-username" "$DB_USERNAME" "PostgreSQL database username"
create_secret "db-password" "$DB_PASSWORD" "PostgreSQL database password"

# OpenAI API key
echo "Please provide your OpenAI API key:"
read -s -p "OpenAI API key: " OPENAI_API_KEY
echo

create_secret "openai-api-key" "$OPENAI_API_KEY" "OpenAI API key for GPT-4 integration"

# Grant Cloud Build service account access to secrets
echo "Granting Cloud Build service account access to secrets..."

# Get the Cloud Build service account
CLOUDBUILD_SA="$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com"

# Grant access to all secrets
SECRETS=("jwt-secret" "db-url" "db-username" "db-password" "openai-api-key")

for secret in "${SECRETS[@]}"; do
    echo "Granting access to secret: $secret"
    gcloud secrets add-iam-policy-binding "$secret" \
        --member="serviceAccount:$CLOUDBUILD_SA" \
        --role="roles/secretmanager.secretAccessor"
done

echo ""
echo "✅ All secrets have been created and configured!"
echo ""
echo "Summary of created secrets:"
echo "- jwt-secret: JWT signing secret"
echo "- db-url: PostgreSQL database URL"
echo "- db-username: Database username"
echo "- db-password: Database password"
echo "- openai-api-key: OpenAI API key"
echo ""
echo "Cloud Build service account has been granted access to all secrets."
echo ""
echo "Next steps:"
echo "1. Commit and push your code to trigger the Cloud Build pipeline"
echo "2. Monitor the build at: https://console.cloud.google.com/cloud-build/builds"
echo "3. Check your dev environment at: https://console.cloud.google.com/run" 