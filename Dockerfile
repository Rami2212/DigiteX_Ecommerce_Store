# Multi-stage build
FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Final stage - serve both frontend and backend
FROM node:22-alpine

# Install nginx
RUN apk add --no-cache nginx

# Copy backend
WORKDIR /app
COPY --from=backend-build /app/backend ./backend

# Copy frontend build to nginx directory
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80

CMD ["/start.sh"]