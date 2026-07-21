$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot ".env.local"

Write-Host ""
Write-Host "MarketCap + Stripe local setup" -ForegroundColor Cyan
Write-Host "Project: $projectRoot"
Write-Host ""

if (-not (Test-Path -LiteralPath $envPath)) {
  throw ".env.local was not found in $projectRoot"
}

$stripeCommand = Get-Command stripe.exe -ErrorAction SilentlyContinue
if (-not $stripeCommand) {
  $candidatePaths = @(
    (Join-Path $env:LOCALAPPDATA "Microsoft\WinGet\Links\stripe.exe"),
    "C:\Program Files\Stripe\stripe.exe"
  )
  $stripePath = $candidatePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
  if ($stripePath) {
    $stripeCommand = Get-Item -LiteralPath $stripePath
  }
}

if (-not $stripeCommand) {
  throw "Stripe CLI was not found. Run 'winget install Stripe.StripeCLI', close Command Prompt, reopen it, and run this script again."
}

$envLines = Get-Content -LiteralPath $envPath
if (-not ($envLines | Where-Object { $_ -match '^STRIPE_SECRET_KEY=sk_test_.+' })) {
  throw "STRIPE_SECRET_KEY with an sk_test_ value is missing from .env.local."
}
if (-not ($envLines | Where-Object { $_ -match '^STRIPE_PRO_PRICE_ID=price_.+' })) {
  throw "STRIPE_PRO_PRICE_ID with a price_ value is missing from .env.local."
}

Write-Host "1/4 Signing in to Stripe..." -ForegroundColor Yellow
& $stripeCommand.Source login
if ($LASTEXITCODE -ne 0) { throw "Stripe login did not complete." }

Write-Host "2/4 Creating local webhook signing secret..." -ForegroundColor Yellow
$webhookSecret = (& $stripeCommand.Source listen --print-secret 2>$null | Select-Object -Last 1).Trim()
if ($webhookSecret -notmatch '^whsec_.+') {
  throw "Stripe CLI did not return a valid whsec_ signing secret. Run 'stripe listen --help' and confirm your Stripe CLI is current."
}

$existing = Get-Content -LiteralPath $envPath
$updated = New-Object System.Collections.Generic.List[string]
$replaced = $false
foreach ($line in $existing) {
  if ($line -match '^STRIPE_WEBHOOK_SECRET=') {
    $updated.Add("STRIPE_WEBHOOK_SECRET=$webhookSecret")
    $replaced = $true
  } else {
    $updated.Add($line)
  }
}
if (-not $replaced) {
  $updated.Add("")
  $updated.Add("STRIPE_WEBHOOK_SECRET=$webhookSecret")
}
[System.IO.File]::WriteAllLines($envPath, $updated)
Write-Host "    Saved STRIPE_WEBHOOK_SECRET to .env.local (value hidden)." -ForegroundColor Green

Write-Host "3/4 Checking MarketCap server..." -ForegroundColor Yellow
$portListener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $portListener) {
  Start-Process -FilePath "cmd.exe" -WorkingDirectory $projectRoot -ArgumentList "/k", "title MarketCap Dev && npm.cmd run dev"
  Start-Sleep -Seconds 5
  Write-Host "    Started MarketCap at http://localhost:3000" -ForegroundColor Green
} else {
  Write-Host "    Port 3000 is already running; reusing it." -ForegroundColor Green
}

Write-Host "4/4 Starting Stripe webhook forwarding..." -ForegroundColor Yellow
$listenerCommand = "title Stripe Webhook && stripe listen --events checkout.session.completed,customer.subscription.updated,customer.subscription.deleted --forward-to http://localhost:3000/api/stripe/webhook"
Start-Process -FilePath "cmd.exe" -WorkingDirectory $projectRoot -ArgumentList "/k", $listenerCommand

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Keep the MarketCap Dev and Stripe Webhook windows open while testing."
Write-Host "Open: http://localhost:3000/pricing"
Write-Host "Test card: 4242 4242 4242 4242"
Write-Host ""
