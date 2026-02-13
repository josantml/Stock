# Script para ejecutar la migración SQL en Windows
# Uso: .\run-migration.ps1

param(
    [string]$DatabaseName = "stock_pablo",
    [string]$User = "postgres",
    [string]$HostName = "localhost",
    [System.Security.SecureString]$Password = $null,
    [switch]$CheckOnly
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

# Verificar que psql esté disponible
if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 'psql' no se encuentra en PATH. Instala psql o añade al PATH." -ForegroundColor Red
    exit 1
}

try {
    # Pre-check: columna 'notes' existente
    $checkSql = "SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='notes';"

    $plainPwd = $null
    if ($Password) {
        $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
        try { $plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr) } finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }
        $env:PGPASSWORD = $plainPwd
    }

    $exists = & psql -h $HostName -U $User -d $DatabaseName -tAc $checkSql 2>$null
    if ($exists -and $exists.Trim() -eq '1') {
        Write-Host "⚠️  La columna 'notes' ya existe. Se omitirá la migración." -ForegroundColor Yellow
        exit 0
    }

    if ($CheckOnly) {
        Write-Host "--check-only especificado: la migración no se ejecutará, sólo verificación." -ForegroundColor Cyan
        exit 0
    }

    # Ejecutar la migración
    & psql -h $HostName -U $User -d $DatabaseName -f $migrationFile

    if ($LASTEXITCODE -eq 0) {
        Write-Host "" 
        Write-Host "✅ Migración completada exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "Verificando que la columna 'notes' fue creada..." -ForegroundColor Yellow

        $verifySql = "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'notes';"
        & psql -h $HostName -U $User -d $DatabaseName -c $verifySql
    } else {
        Write-Host "❌ Error al ejecutar la migración" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    if ($env:PGPASSWORD) { Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue }
    $plainPwd = $null
}
