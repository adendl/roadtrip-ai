# Deployment Guide for Google Cloud Run

This guide explains how to deploy roadtrip.ai to Google Cloud Run with proper environment variable configuration.

## Prerequisites

- Google Cloud SDK installed and configured
- Docker installed
- Access to Google Cloud project with Cloud Run enabled

## Backend Deployment

### 1. Build and Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Build the Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/roadtrip-ai-backend .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/roadtrip-ai-backend

# Deploy to Cloud Run
gcloud run deploy roadtrip-ai-backend \
  --image gcr.io/YOUR_PROJECT_ID/roadtrip-ai-backend \
  --platform managed \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 600 \
  --max-instances 10 \
  --set-env-vars="DATABASE_URL=jdbc:postgresql://YOUR_DB_HOST:5432/YOUR_DB_NAME" \
  --set-env-vars="DATABASE_USERNAME=YOUR_DB_USER" \
  --set-env-vars="DATABASE_PASSWORD=YOUR_DB_PASSWORD" \
  --set-env-vars="JWT_SECRET=YOUR_JWT_SECRET" \
  --set-env-vars="OPENAI_API_KEY=YOUR_OPENAI_API_KEY" \
  --set-env-vars="LOG_LEVEL=INFO"
```

### 2. Environment Variables

Set these environment variables in Cloud Run:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `jdbc:postgresql://10.0.0.1:5432/roadtrip_ai` |
| `DATABASE_USERNAME` | Database username | `roadtrip_user` |
| `DATABASE_PASSWORD` | Database password | `secure_password_123` |
| `JWT_SECRET` | JWT signing secret | `your-256-bit-secret-key` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `SERVER_PORT` | Server port (optional) | `8080` |

### 3. Using Secret Manager (Recommended)

For better security, use Google Secret Manager:

```bash
# Create secrets
echo -n "your-database-password" | gcloud secrets create db-password --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-openai-api-key" | gcloud secrets create openai-api-key --data-file=-

# Deploy with secrets
gcloud run deploy roadtrip-ai-backend \
  --image gcr.io/YOUR_PROJECT_ID/roadtrip-ai-backend \
  --platform managed \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 600 \
  --max-instances 10 \
  --set-env-vars="DATABASE_URL=jdbc:postgresql://YOUR_DB_HOST:5432/YOUR_DB_NAME" \
  --set-env-vars="DATABASE_USERNAME=YOUR_DB_USER" \
  --set-env-vars="LOG_LEVEL=INFO" \
  --set-secrets="DATABASE_PASSWORD=db-password:latest" \
  --set-secrets="JWT_SECRET=jwt-secret:latest" \
  --set-secrets="OPENAI_API_KEY=openai-api-key:latest"
```

## Frontend Deployment

### 1. Build and Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Build the Docker image
docker build \
  --build-arg VITE_API_BASE_URL=https://roadtrip-ai-backend-XXXXX.australia-southeast1.run.app \
  --build-arg VITE_APP_ENV=production \
  -t gcr.io/YOUR_PROJECT_ID/roadtrip-ai-frontend .

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/roadtrip-ai-frontend

# Deploy to Cloud Run
gcloud run deploy roadtrip-ai-frontend \
  --image gcr.io/YOUR_PROJECT_ID/roadtrip-ai-frontend \
  --platform managed \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 5
```

### 2. Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://roadtrip-ai-backend-XXXXX.australia-southeast1.run.app` |
| `VITE_APP_ENV` | Environment name | `production` |
| `VITE_GRAPHHOPPER_API_KEY` | GraphHopper API key (optional) | `your-graphhopper-key` |

## Database Setup

### 1. Cloud SQL (Recommended)

```bash
# Create Cloud SQL instance
gcloud sql instances create roadtrip-ai-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=australia-southeast1 \
  --root-password=YOUR_ROOT_PASSWORD

# Create database
gcloud sql databases create roadtrip_ai --instance=roadtrip-ai-db

# Create user
gcloud sql users create roadtrip_user \
  --instance=roadtrip-ai-db \
  --password=YOUR_USER_PASSWORD
```

### 2. Connection String Format

For Cloud SQL, use this format:
```
jdbc:postgresql:///roadtrip_ai?cloudSqlInstance=YOUR_PROJECT_ID:australia-southeast1:roadtrip-ai-db&socketFactory=com.google.cloud.sql.postgres.SocketFactory
```

## Health Checks

The backend includes a health check endpoint at `/actuator/health`. Cloud Run will automatically use this for health monitoring.

## Monitoring and Logging

### 1. View Logs

```bash
# Backend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=roadtrip-ai-backend" --limit=50

# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=roadtrip-ai-frontend" --limit=50
```

### 2. Set up Monitoring

```bash
# Enable Cloud Monitoring
gcloud services enable monitoring.googleapis.com

# Create alerting policies for:
# - High error rates
# - High latency
# - High memory usage
# - High CPU usage
```

## Security Best Practices

1. **Use Secret Manager** for sensitive environment variables
2. **Enable VPC Connector** for database access
3. **Set up IAM** with least privilege access
4. **Enable Cloud Armor** for DDoS protection
5. **Use HTTPS** for all communications
6. **Regular security updates** for dependencies

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure Cloud SQL instance is in the same region
2. **Memory Issues**: Increase memory allocation if needed
3. **Timeout Issues**: Increase timeout for long-running operations
4. **CORS Issues**: Update CORS configuration in SecurityConfig.java

### Debug Commands

```bash
# Check service status
gcloud run services describe roadtrip-ai-backend --region=australia-southeast1

# View recent revisions
gcloud run revisions list --service=roadtrip-ai-backend --region=australia-southeast1

# Check logs for specific revision
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.revision_name=roadtrip-ai-backend-00001-abc" --limit=50
```

## Cost Optimization

1. **Set max instances** to control costs
2. **Use appropriate memory/CPU** allocation
3. **Enable autoscaling** to zero when not in use
4. **Monitor usage** with Cloud Monitoring 