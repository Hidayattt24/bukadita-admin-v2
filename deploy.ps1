# ================================
# Bukadita Admin v2 - Deploy Script
# ================================
# Script untuk mempermudah deployment ke Vercel

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Bukadita Admin v2 - Deploy Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please install manually." -ForegroundColor Red
        exit 1
    }
    Write-Host "Vercel CLI installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""

# Check if .env.local exists
Write-Host "Checking environment variables..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host ".env.local not found!" -ForegroundColor Red
    Write-Host "Creating .env.local from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host ".env.local created! Please edit it with your actual values." -ForegroundColor Yellow
        Write-Host "Opening .env.local in notepad..." -ForegroundColor Yellow
        Start-Process notepad ".env.local"
        
        $continue = Read-Host "Have you updated .env.local with actual values? (y/n)"
        if ($continue -ne "y") {
            Write-Host "Please update .env.local first, then run this script again." -ForegroundColor Yellow
            exit 0
        }
    } else {
        Write-Host ".env.example not found! Please create .env.local manually." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host ".env.local found!" -ForegroundColor Green
}

Write-Host ""

# Run build test
Write-Host "Testing build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Ask deployment type
Write-Host "Choose deployment type:" -ForegroundColor Cyan
Write-Host "1. Preview deployment (for testing)" -ForegroundColor White
Write-Host "2. Production deployment" -ForegroundColor White
Write-Host "3. Cancel" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying to preview..." -ForegroundColor Yellow
        vercel
    }
    "2" {
        Write-Host ""
        Write-Host "Deploying to production..." -ForegroundColor Yellow
        vercel --prod
    }
    "3" {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "Invalid choice. Deployment cancelled." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your deployment URL" -ForegroundColor White
Write-Host "2. Set environment variables in Vercel Dashboard if not set yet" -ForegroundColor White
Write-Host "3. Setup custom domain (optional)" -ForegroundColor White
Write-Host ""
Write-Host "For more info, check VERCEL_DEPLOYMENT_CHECKLIST.md" -ForegroundColor Cyan
