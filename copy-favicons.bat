@echo off
echo Copying favicon files to frontend/public...

REM Copy all favicon files
copy backend\assets\favicon_io\favicon.ico frontend\public\ >nul
copy backend\assets\favicon_io\favicon-16x16.png frontend\public\ >nul
copy backend\assets\favicon_io\favicon-32x32.png frontend\public\ >nul
copy backend\assets\favicon_io\apple-touch-icon.png frontend\public\ >nul
copy backend\assets\favicon_io\android-chrome-192x192.png frontend\public\ >nul
copy backend\assets\favicon_io\android-chrome-512x512.png frontend\public\ >nul

echo * Favicon files copied successfully!
echo.
echo Favicon setup complete. Your app now has:
echo   * Browser tab icon
echo   * Apple device icons
echo   * Android device icons
echo   * Web manifest
