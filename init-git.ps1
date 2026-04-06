$git = "C:\Program Files\Git\cmd\git.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"
& $git init
& $git add .
& $git commit -m "init: Bolao Brasileirao 2026"
Write-Host "GIT_DONE"
