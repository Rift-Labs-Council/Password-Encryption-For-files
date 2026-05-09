#!/bin/bash

echo "================================"
echo "File Encryption App - Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✓ Root dependencies installed successfully"
else
    echo "❌ Failed to install root dependencies"
    exit 1
fi
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✓ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Copy favicon files
echo "Setting up favicon files..."
chmod +x copy-favicons.sh
./copy-favicons.sh > /dev/null 2>&1
echo "✓ Favicon files setup complete"
echo ""

echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the application, run from root folder:"
echo ""
echo "  npm run dev"
echo ""
echo "Both backend and frontend will start together!"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
echo "Your app now includes:"
echo "  ✓ Lightning bolt favicon"
echo "  ✓ Apple device icons"
echo "  ✓ Android device icons"
echo "  ✓ Web app manifest"
echo ""
