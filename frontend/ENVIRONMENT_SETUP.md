# Environment Variables Setup

This document explains how to configure environment variables for different deployment environments.

## Environment Files (Development)

The application uses the following environment files for local development:

### `.env` (Default)
- Used when no specific environment is specified
- Contains production settings by default

### `.env.development`
- Used when running in development mode (`npm run dev`)
- Points to local backend for development

### `.env.production`
- Used when building for production (`npm run build`)
- Points to deployed backend

## Container Deployment (Google Cloud Run)

For containerized deployments, environment variables are passed as container environment variables rather than using `.env` files.

## Available Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `VITE_APP_ENV` | Application environment | `development` |

## Usage

### Development
```bash
npm run dev
```
This will use `.env.development` and proxy API calls to `http://localhost:8080`

### Production Build
```bash
npm run build
```
This will use `.env.production` and make direct API calls to the deployed backend.

### Custom Environment
You can create additional environment files like `.env.staging` and run:
```bash
npm run dev -- --mode staging
```

## Current Configuration

### Development Environment (`.env.development`)
```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_ENV=development
```

### Production Environment (`.env.production`)
```
VITE_API_BASE_URL=https://roadtrip-ai-backend-688052801817.australia-southeast1.run.app
VITE_APP_ENV=production
```

## API Configuration

The application uses a centralized API configuration in `src/utils/api.ts`:

- `API_CONFIG.BASE_URL`: Gets the base URL from environment variables
- `buildApiUrl()`: Helper function to build complete API URLs
- `getApiHeaders()`: Helper function to get common API headers
- `API_ENDPOINTS`: Centralized endpoint definitions

## Switching Environments

To switch between environments:

1. **Development**: Use `.env.development` (default for `npm run dev`)
2. **Production**: Use `.env.production` (default for `npm run build`)
3. **Custom**: Create a new `.env.{environment}` file and specify the mode

## Container Deployment Configuration

### Google Cloud Run Deployment

When deploying to Google Cloud Run, set the following environment variables:

```bash
VITE_API_BASE_URL=https://roadtrip-ai-backend-688052801817.australia-southeast1.run.app
VITE_APP_ENV=production
```

### Docker Build with Environment Variables

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://roadtrip-ai-backend-688052801817.australia-southeast1.run.app \
  --build-arg VITE_APP_ENV=production \
  -t your-app-name .
```

### Runtime Configuration

The application supports runtime configuration through the `runtime-config.js` file, which can be replaced at runtime to inject environment variables without rebuilding the container.

## Security Notes

- Environment files are not committed to version control (they're in `.gitignore`)
- Only variables prefixed with `VITE_` are exposed to the client-side code
- Sensitive information should not be stored in client-side environment variables
- For production deployments, use container environment variables instead of `.env` files

## Troubleshooting

### Environment Variables Not Loading
1. Ensure the variable name starts with `VITE_`
2. Restart the development server after changing environment files
3. Check that the environment file is in the correct location (project root)
4. For containers, verify environment variables are set in the deployment configuration

### API Calls Failing
1. Verify the `VITE_API_BASE_URL` is correct for your environment
2. Check that the backend is running and accessible
3. Ensure CORS is properly configured on the backend
4. For containers, check that environment variables are properly set in the deployment 