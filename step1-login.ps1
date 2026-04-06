$gh = "C:\Program Files\GitHub CLI\gh.exe"
$git = "C:\Program Files\Git\cmd\git.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"

# 1. Login no GitHub
Write-Host "=== Fazendo login no GitHub CLI ===" -ForegroundColor Green
& $gh auth login --web

Write-Host "DONE"
