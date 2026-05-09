#!/bin/bash

echo "Copying favicon files to frontend/public..."

# Copy all favicon files
cp backend/assets/favicon_io/favicon.ico frontend/public/
cp backend/assets/favicon_io/favicon-16x16.png frontend/public/
cp backend/assets/favicon_io/favicon-32x32.png frontend/public/
cp backend/assets/favicon_io/apple-touch-icon.png frontend/public/
cp backend/assets/favicon_io/android-chrome-192x192.png frontend/public/
cp backend/assets/favicon_io/android-chrome-512x512.png frontend/public/

echo "✓ Favicon files copied successfully!"
echo ""
echo "Favicon setup complete. Your app now has:"
echo "  ✓ Browser tab icon"
echo "  ✓ Apple device icons"
echo "  ✓ Android device icons"
echo "  ✓ Web manifest"
