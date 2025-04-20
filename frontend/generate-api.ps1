$gitBashPath = "C:\Program Files\Git\bin\bash.exe"
$scriptPath = "generate-api.sh"

if (-Not (Test-Path $gitBashPath)) {
    Write-Host "Git Bash not found: $gitBashPath"
    exit 1
}

& "$gitBashPath" "$scriptPath"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success"
} else {
    Write-Host "Error ($LASTEXITCODE)"
}
