$ghPath = (Get-Command gh -ErrorAction SilentlyContinue).Source
if ($ghPath) { Write-Host "GH_FOUND: $ghPath" } else { Write-Host "GH_NOT_FOUND" }

# Tentar caminhos comuns
$possiblePaths = @(
    "C:\Program Files\GitHub CLI\gh.exe",
    "C:\Users\User\AppData\Local\GitHub CLI\gh.exe",
    "$env:LOCALAPPDATA\GitHub CLI\gh.exe",
    "$env:ProgramFiles\GitHub CLI\gh.exe"
)
foreach ($p in $possiblePaths) {
    if (Test-Path $p) { Write-Host "FOUND_AT: $p" }
}
Write-Host "SEARCH_DONE"
