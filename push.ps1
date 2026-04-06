$git = "C:\Program Files\Git\cmd\git.exe"
Set-Location "C:\Users\User\bolao-brasileirao-2026"
& $git add .
& $git commit -m "fix: App.jsx completo e funcional"
& $git push
Write-Host "PUSH_DONE"
