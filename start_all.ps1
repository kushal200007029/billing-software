# start_all.ps1
$baseDir = $PSScriptRoot

Write-Host "Starting Auth Service (Python)..."
Start-Process -FilePath "python" -ArgumentList "-m uvicorn main:app --port 8001" -WorkingDirectory "$baseDir\auth-service"

Write-Host "Starting Product Service (Go)..."
Start-Process -FilePath "go" -ArgumentList "run main.go" -WorkingDirectory "$baseDir\product-service"

Write-Host "Starting Billing Service (Java/Maven)..."
Start-Process -FilePath "mvn" -ArgumentList "spring-boot:run" -WorkingDirectory "$baseDir\billing-service"

Write-Host "Starting API Gateway (Node.js)..."
Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory "$baseDir\gateway"

Write-Host "Starting Frontend (React/Vite)..."
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$baseDir\frontend"

Write-Host "All services have been launched!"
