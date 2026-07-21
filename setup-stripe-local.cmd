@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup-stripe-local.ps1"
if errorlevel 1 (
  echo.
  echo Setup stopped because of the error shown above.
  pause
)
