# Script para ejecutar la migración SQL en Windows
# Uso: .\run-migration.ps1

param(
    [string]$DatabaseName = "stock_pablo",
    [string]$User = "postgres",
    [string]$Host = "localhost"
)

Write-Host "🔧 Ejecutando migración SQL..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$migrationFile = "migrations/001_add_notes_to_order_items.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Archivo de migración no encontrado: $migrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Archivo de migración: $migrationFile" -ForegroundColor Yellow

try {
    # Ejecutar la migración
    psql -h $Host -U $User -d $DatabaseName -f $migrationFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migración completada exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "Verificando que la columna 'notes' fue creada..." -ForegroundColor Yellow
        
        # Verificar la columna
        psql -h $Host -U $User -d $DatabaseName -c `
            "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'notes';"
    } else {
        Write-Host "❌ Error al ejecutar la migración" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
}
