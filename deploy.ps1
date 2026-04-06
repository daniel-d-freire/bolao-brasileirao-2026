$git = "C:\Program Files\Git\cmd\git.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"

# Criar repo no GitHub e fazer push
gh repo create daniel-d-freire/bolao-brasileirao-2026 --public --source=. --remote=origin --push

Write-Host ""
Write-Host "=========================================="
Write-Host "Repositorio criado e push feito!"
Write-Host "Agora acesse vercel.com para fazer o deploy"
Write-Host "=========================================="
