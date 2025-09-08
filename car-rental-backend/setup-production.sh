#!/bin/bash

echo "🚀 Setting up Chalyati Car Rental for Production"
echo "================================================"

# Check if .env file exists
if [ ! -f "car-rental-backend/.env" ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
cd car-rental-backend
npm install --production

echo "📦 Installing frontend dependencies..."
cd ../car-rental-frontend
npm install

# Build frontend
echo "🏗️  Building frontend for production..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update car-rental-backend/.env with your production values"
echo "2. Set up your production database"
echo "3. Configure your domain in CORS settings"
echo "4. Deploy using PM2: pm2 start car-rental-backend/index.js --name chalyati-api"
echo "5. Serve frontend build files with a web server (Nginx/Apache)"
echo ""
echo "📚 See SECURITY.md for detailed security configuration"
