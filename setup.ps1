# Sauda Seven Summits - Setup Script
Write-Host "Sauda Seven Summits - Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "OK - Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR - Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Copy logo to public folder
Write-Host ""
Write-Host "Copying logo to public folder..." -ForegroundColor Yellow
if (Test-Path "S7S.png") {
    if (-not (Test-Path "public")) {
        New-Item -ItemType Directory -Path "public" | Out-Null
    }
    Copy-Item "S7S.png" "public\S7S.png" -Force
    Write-Host "OK - Logo copied successfully" -ForegroundColor Green
} else {
    Write-Host "WARNING - S7S.png not found in root directory" -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR - Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Generate Prisma Client
Write-Host ""
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Prisma Client generated successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR - Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Push database schema
Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Database created successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR - Failed to create database" -ForegroundColor Red
    exit 1
}

# Seed database
Write-Host ""
Write-Host "Seeding database with initial data..." -ForegroundColor Yellow
npx tsx prisma/seed.ts
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK - Database seeded successfully" -ForegroundColor Green
} else {
    Write-Host "ERROR - Failed to seed database" -ForegroundColor Red
    exit 1
}

# Success message
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your settings (especially SMTP for email)" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Admin login:" -ForegroundColor Yellow
Write-Host "  Email: admin@saudasevensummits.no" -ForegroundColor White
Write-Host "  Password: ChangeThisPassword123!" -ForegroundColor White
Write-Host "  URL: http://localhost:3000/admin/login" -ForegroundColor White
Write-Host ""
Write-Host "WARNING - Remember to change the admin password in .env!" -ForegroundColor Red
Write-Host ""
