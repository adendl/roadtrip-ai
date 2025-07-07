# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
# Note: Environment variables will be injected at runtime, not build time
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional, if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy runtime config script
COPY public/runtime-config.js /usr/share/nginx/html/runtime-config.js

# Create a startup script to inject environment variables
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo 'echo "window.RUNTIME_CONFIG = {" > /usr/share/nginx/html/runtime-config.js' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_API_BASE_URL: \"$VITE_API_BASE_URL\", " >> /usr/share/nginx/html/runtime-config.js' >> /docker-entrypoint.sh && \
    echo 'echo "  VITE_APP_ENV: \"$VITE_APP_ENV\"" >> /usr/share/nginx/html/runtime-config.js' >> /docker-entrypoint.sh && \
    echo 'echo "};" >> /usr/share/nginx/html/runtime-config.js' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start nginx with environment variable injection
CMD ["/docker-entrypoint.sh"]