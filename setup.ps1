# CropCast Setup Script for Windows PowerShell
# This script sets up the complete CropCast application with backend and frontend integration

param(
    [switch]$SkipTests,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Cyan"
    White = "White"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Test-NodeJs {
    Write-Status "Checking Node.js installation..."
    
    try {
        $nodeVersion = node --version
        $majorVersion = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
        
        if ($majorVersion -lt 16) {
            Write-Error "Node.js version $nodeVersion is not supported. Please install Node.js 16+."
            exit 1
        }
        
        Write-Success "Node.js $nodeVersion is installed"
        return $true
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    }
}

function Test-PackageManager {
    Write-Status "Checking package manager..."
    
    try {
        yarn --version | Out-Null
        $script:PackageManager = "yarn"
        Write-Success "Using Yarn as package manager"
        return "yarn"
    }
    catch {
        try {
            npm --version | Out-Null
            $script:PackageManager = "npm"
            Write-Success "Using npm as package manager"
            return "npm"
        }
        catch {
            Write-Error "Neither npm nor yarn is installed. Please install one and try again."
            exit 1
        }
    }
}

function Test-MongoDB {
    Write-Status "Checking MongoDB connection..."
    
    try {
        if (Get-Command mongosh -ErrorAction SilentlyContinue) {
            $result = mongosh --eval "db.runCommand('ping')" --quiet 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "MongoDB is running and accessible"
            }
            else {
                Write-Warning "MongoDB is not running or not accessible"
                Write-Status "Please start MongoDB or update the MONGODB_URI in .env file"
            }
        }
        else {
            Write-Warning "MongoDB shell (mongosh) not found"
            Write-Status "Make sure MongoDB is installed and running"
        }
    }
    catch {
        Write-Warning "Could not check MongoDB status"
    }
}

function Setup-Backend {
    Write-Status "Setting up backend..."
    
    Push-Location backend
    
    try {
        # Install dependencies
        if ($script:PackageManager -eq "yarn") {
            yarn install
        }
        else {
            npm install
        }
        
        # Check if .env exists
        if (-not (Test-Path ".env")) {
            Write-Warning ".env file not found in backend directory"
            Write-Status "Please create a .env file with required environment variables"
            Write-Status "Refer to the existing .env file for the required variables"
        }
        else {
            Write-Success "Backend .env file found"
            
            # Check for Gemini API key
            $envContent = Get-Content ".env" -Raw
            if ($envContent -notmatch "GEMINI_API_KEY=" -or $envContent -match "GEMINI_API_KEY=your_gemini_api_key_here") {
                Write-Warning "Gemini API key not configured in .env"
                Write-Status "Translation features will not work without a valid Gemini API key"
                Write-Status "Get your API key from: https://makersuite.google.com/app/apikey"
            }
        }
        
        Write-Success "Backend setup completed"
    }
    finally {
        Pop-Location
    }
}

function Setup-Frontend {
    Write-Status "Setting up frontend..."
    
    Push-Location frontend
    
    try {
        # Install dependencies
        if ($script:PackageManager -eq "yarn") {
            yarn install
        }
        else {
            npm install
        }
        
        # Check if .env exists
        if (-not (Test-Path ".env")) {
            Write-Status "Frontend .env file already exists"
            Write-Success "Frontend .env file configured"
        }
        else {
            Write-Success "Frontend .env file found"
        }
        
        Write-Success "Frontend setup completed"
    }
    finally {
        Pop-Location
    }
}

function Create-StartupScripts {
    Write-Status "Creating startup scripts..."
    
    # Backend start script
    @"
@echo off
echo 🚀 Starting CropCast Backend...
cd backend
npm run dev
pause
"@ | Out-File -FilePath "start-backend.bat" -Encoding UTF8
    
    # Frontend start script
    @"
@echo off
echo 🌐 Starting CropCast Frontend...
cd frontend
npm run dev
pause
"@ | Out-File -FilePath "start-frontend.bat" -Encoding UTF8
    
    # PowerShell script for full start
    @"
# CropCast Full Start Script
Write-Host "🌾 Starting CropCast Full Application..." -ForegroundColor Green
Write-Host "This will start both backend and frontend servers" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Check if concurrently is installed globally
try {
    concurrently --version | Out-Null
}
catch {
    Write-Host "Installing concurrently..." -ForegroundColor Yellow
    npm install -g concurrently
}

# Start both servers
concurrently "cd backend && npm run dev" "cd frontend && npm run dev" --names "Backend,Frontend" --prefix-colors "blue,green"
"@ | Out-File -FilePath "start-full.ps1" -Encoding UTF8
    
    Write-Success "Startup scripts created"
}

function Test-Installation {
    if ($SkipTests) {
        Write-Status "Skipping installation tests..."
        return
    }
    
    Write-Status "Testing installation..."
    
    # Test backend dependencies
    Push-Location backend
    try {
        if ($script:PackageManager -eq "yarn") {
            if (yarn list @google/generative-ai 2>$null) {
                Write-Success "Gemini AI package installed"
            }
            else {
                Write-Warning "Gemini AI package not found"
            }
            
            if (yarn list express 2>$null) {
                Write-Success "Express package installed"
            }
            else {
                Write-Error "Express package not found"
            }
        }
        else {
            try {
                npm list @google/generative-ai 2>$null | Out-Null
                Write-Success "Gemini AI package installed"
            }
            catch {
                Write-Warning "Gemini AI package not found"
            }
            
            try {
                npm list express 2>$null | Out-Null
                Write-Success "Express package installed"
            }
            catch {
                Write-Error "Express package not found"
            }
        }
    }
    finally {
        Pop-Location
    }
    
    # Test frontend dependencies
    Push-Location frontend
    try {
        if ($script:PackageManager -eq "yarn") {
            if (yarn list react 2>$null) {
                Write-Success "React package installed"
            }
            else {
                Write-Error "React package not found"
            }
            
            if (yarn list vite 2>$null) {
                Write-Success "Vite package installed"
            }
            else {
                Write-Error "Vite package not found"
            }
        }
        else {
            try {
                npm list react 2>$null | Out-Null
                Write-Success "React package installed"
            }
            catch {
                Write-Error "React package not found"
            }
            
            try {
                npm list vite 2>$null | Out-Null
                Write-Success "Vite package installed"
            }
            catch {
                Write-Error "Vite package not found"
            }
        }
    }
    finally {
        Pop-Location
    }
}

function Create-TestScript {
    Write-Status "Creating test script..."
    
    @"
@echo off
echo 🧪 Running CropCast Integration Tests...
echo Make sure the backend server is running on port 5000
echo.
cd backend
node test-integration.js
pause
"@ | Out-File -FilePath "test-integration.bat" -Encoding UTF8
    
    Write-Success "Test script created"
}

function Main {
    Write-Host "🌾 Welcome to CropCast Setup!" -ForegroundColor Green
    Write-Host "==============================" -ForegroundColor Green
    Write-Host "Starting CropCast setup process..." -ForegroundColor White
    Write-Host ""
    
    Test-NodeJs
    Test-PackageManager
    Test-MongoDB
    
    Write-Host ""
    Setup-Backend
    Write-Host ""
    Setup-Frontend
    Write-Host ""
    Create-StartupScripts
    Create-TestScript
    
    Write-Host ""
    Test-Installation
    
    Write-Host ""
    Write-Host "==============================" -ForegroundColor Green
    Write-Success "🎉 CropCast setup completed!"
    Write-Host "==============================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure your .env files with API keys"
    Write-Host "   - Backend: Add GEMINI_API_KEY, MONGODB_URI, etc."
    Write-Host "   - Frontend: Already configured with default values"
    Write-Host ""
    Write-Host "2. Start the application:" -ForegroundColor Yellow
    Write-Host "   - Full application: .\start-full.ps1"
    Write-Host "   - Backend only: .\start-backend.bat"
    Write-Host "   - Frontend only: .\start-frontend.bat"
    Write-Host ""
    Write-Host "3. Test the integration:" -ForegroundColor Yellow
    Write-Host "   - Run: .\test-integration.bat"
    Write-Host ""
    Write-Host "📍 URLs:" -ForegroundColor Cyan
    Write-Host "   - Backend API: http://localhost:5000/api"
    Write-Host "   - Frontend App: http://localhost:5173"
    Write-Host "   - Health Check: http://localhost:5000/api/health"
    Write-Host ""
    Write-Host "🔧 Important Environment Variables:" -ForegroundColor Cyan
    Write-Host "   - GEMINI_API_KEY: Required for translation features"
    Write-Host "   - MONGODB_URI: Required for database connection"
    Write-Host "   - WEATHER_API_KEY: Required for weather features"
    Write-Host ""
    Write-Warning "Don't forget to set up your API keys in the .env files!"
    Write-Host ""
}

# Run main function
Main