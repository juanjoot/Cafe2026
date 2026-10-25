# Ruta base del proyecto
$basePath = "apps\microservices"
# Lista de microservicios
$services = @(
    "auth-service",
    "product-service",
    "order-service",
    "payment-service",
    "notification-service",
    "recommendation-service"
)

foreach ($service in $services) {
    $path = Join-Path $basePath $service
    Write-Host "Instalando dependencias en $path ..."
    Push-Location $path
    npm install class-validator class-transformer
    Pop-Location
    Write-Host "Listo: $service`n"
}

Write-Host "Todas las dependencias han sido instaladas correctamente."

