$gh = "C:\Program Files\GitHub CLI\gh.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"

# Instalar Vercel CLI se necessário e fazer deploy
$vercel = (Get-Command vercel -ErrorAction SilentlyContinue).Source
if (-not $vercel) {
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host "=== Fazendo deploy no Vercel ===" -ForegroundColor Green
vercel --yes --prod

Write-Host "DEPLOY_DONE"
