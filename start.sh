#!/bin/sh

echo "Starting DigiteX Application..."

# Start backend server in background
echo "Starting backend server..."
cd /app/backend
npm start &

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

echo "Backend started successfully"

# Start nginx in foreground
echo "Starting nginx..."
nginx -g "daemon off;"