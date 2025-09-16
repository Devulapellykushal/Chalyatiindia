#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo "🚀 Deploying to Vercel..."
        vercel --prod
    else
        echo "❌ Vercel CLI not found. Please install it first:"
        echo "npm install -g vercel"
        echo ""
        echo "Or deploy manually by:"
        echo "1. Go to https://vercel.com"
        echo "2. Import your project"
        echo "3. Deploy the build folder"
    fi
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi
