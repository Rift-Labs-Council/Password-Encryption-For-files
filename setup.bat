@echo off
echo ================================
echo File Encryption App - Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo * Node.js version:
node --version
echo * npm version:
npm --version
echo.

REM Install root dependencies
echo Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install root dependencies
    exit /b 1
)
echo * Root dependencies installed successfully
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install backend dependencies
    cd ..
    exit /b 1
)
echo * Backend dependencies installed successfully
cd ..
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install frontend dependencies
    cd ..
    exit /b 1
)
echo * Frontend dependencies installed successfully
cd ..
echo.

REM Copy favicon files
echo Setting up favicon files...
call copy-favicons.bat >nul 2>&1
echo * Favicon files setup complete
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application, run from root folder:
echo.
echo   npm run dev
echo.
echo Both backend and frontend will start together!
echo.
echo Then open http://localhost:5173 in your browser
echo.
echo Your app now includes:
echo   * Lightning bolt favicon
echo   * Apple device icons
echo   * Android device icons
echo   * Web app manifest
echo.
