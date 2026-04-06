$gh = "C:\Program Files\GitHub CLI\gh.exe"
$git = "C:\Program Files\Git\cmd\git.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"

# 2. Criar repo e fazer push
Write-Host "=== Criando repositorio no GitHub ===" -ForegroundColor Green
& $gh repo create bolao-brasileirao-2026 --public --source=. --remote=origin --push

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Repositorio criado e codigo enviado!" -ForegroundColor Green
Write-Host " Agora acesse vercel.com para o deploy" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
