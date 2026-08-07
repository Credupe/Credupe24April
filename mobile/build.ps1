$env:ANDROID_HOME="C:\Users\ASUS\AppData\Local\Android\Sdk"
$env:JAVA_HOME="C:\Users\ASUS\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
if ($env:Path -notlike "*C:\Users\ASUS\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin*") {
    $env:Path += ";C:\Users\ASUS\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin"
}

Clear-Host
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "          CreduPe Android Build & Run Tool                " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "1. Run Android App locally (npm run android)" -ForegroundColor White
Write-Host "2. Start Metro Bundler (npx expo start)" -ForegroundColor White
Write-Host "3. Build Local Debug APK (gradlew assembleDebug)" -ForegroundColor White
Write-Host "4. Build Local Release APK (gradlew assembleRelease)" -ForegroundColor White
Write-Host "5. Build via EAS Cloud (npx eas build -p android -profile previewbf)" -ForegroundColor White
Write-Host "6. Exit" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

$choice = Read-Host "Select an option (1-6)"

switch ($choice) {
    "1" {
        Write-Host "`nRunning Android app locally..." -ForegroundColor Green
        npm run android
    }
    "2" {
        Write-Host "`nStarting Metro Bundler..." -ForegroundColor Green
        npx expo start
    }
    "3" {
        Write-Host "`nBuilding Debug APK locally..." -ForegroundColor Green
        if (Test-Path .\android) {
            cd android
            .\gradlew.bat assembleDebug
            cd ..
            Write-Host "`nBuild complete! APK path: android/app/build/outputs/apk/debug/app-debug.apk" -ForegroundColor Green
        } else {
            Write-Host "Error: android folder not found." -ForegroundColor Red
        }
    }
    "4" {
        Write-Host "`nBuilding Release APK locally..." -ForegroundColor Green
        if (Test-Path .\android) {
            cd android
            .\gradlew.bat assembleRelease
            cd ..
            Write-Host "`nBuild complete! APK path: android/app/build/outputs/apk/release/app-release.apk" -ForegroundColor Green
        } else {
            Write-Host "Error: android folder not found." -ForegroundColor Red
        }
    }
    "5" {
        Write-Host "`nBuilding APK via EAS Cloud..." -ForegroundColor Green
        npx eas build --platform android --profile previewbf
    }
    "6" {
        Write-Host "`nExiting..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "`nInvalid selection." -ForegroundColor Red
    }
}
