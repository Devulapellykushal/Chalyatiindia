#!/bin/bash

echo "🚀 Starting CHALYATI Backend Deployment..."

# Navigate to backend directory
cd car-rental-backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install --production

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Start the application
echo "🚀 Starting the application..."
npm start
