Set-Location "C:\Users\User\bolao-brasileirao-2026"

# Login no Vercel via GitHub token do gh CLI
$env:VERCEL_TOKEN = ""

Write-Host "=== Deploy no Vercel ===" -ForegroundColor Green
Write-Host "Fazendo login e deploy..." -ForegroundColor Yellow

# Deploy com --yes para aceitar defaults
vercel --yes --prod 2>&1

Write-Host "VERCEL_DONE"
