$p1=Get-Content "C:\Users\User\Downloads\p1.txt" -Raw
$p2=Get-Content "C:\Users\User\Downloads\p2.txt" -Raw
$p3=Get-Content "C:\Users\User\Downloads\p3.txt" -Raw
$p4=Get-Content "C:\Users\User\Downloads\p4.txt" -Raw
$b=$p1.Trim()+$p2.Trim()+$p3.Trim()+$p4.Trim()
$bytes=[Convert]::FromBase64String($b)
$dir="C:\Users\User\bolao-brasileirao-2026\public"
if(-not(Test-Path $dir)){New-Item -ItemType Directory -Path $dir -Force}
[System.IO.File]::WriteAllBytes("$dir\logo_brasileirao.png",$bytes)
Write-Host "OK: $($bytes.Length) bytes salvos!"
