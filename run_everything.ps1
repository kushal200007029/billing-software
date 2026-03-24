$baseDir = "C:\Users\KUSHAL\Desktop\gitclone\billing-software"

Write-Host "Starting Gateway..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\gateway; node index.js`""

Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\frontend; npm run dev`""

Write-Host "Starting Auth Service..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\auth-service; .\venv\Scripts\python.exe -m uvicorn main:app --port 8001`""

Write-Host "Starting Product Service..."
Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\product-service; npm install express cors; node index.js`""

Write-Host "Starting Billing Service..."
if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\billing-service; mvn spring-boot:run`""
} else {
    Write-Host "Maven not found, downloading portable Maven..."
    if (!(Test-Path "$baseDir\apache-maven-3.9.9")) {
        curl.exe -L -o "$baseDir\mvn.zip" "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
        Expand-Archive "$baseDir\mvn.zip" -DestinationPath $baseDir -Force
        Remove-Item "$baseDir\mvn.zip"
    }
    Start-Process powershell -ArgumentList "-NoExit -Command `"cd $baseDir\billing-service; & '$baseDir\apache-maven-3.9.9\bin\mvn.cmd' spring-boot:run`""
}

Write-Host "Done!"
