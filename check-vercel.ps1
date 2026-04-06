Set-Location "C:\Users\User\bolao-brasileirao-2026"

# Verificar se vercel esta instalado
$vercelPath = (Get-Command vercel -ErrorAction SilentlyContinue).Source
if ($vercelPath) {
    Write-Host "Vercel encontrado: $vercelPath"
} else {
    Write-Host "Instalando Vercel CLI globalmente..."
    npm install -g vercel
}

Write-Host "CHECK_DONE"
