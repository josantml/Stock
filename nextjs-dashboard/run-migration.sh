#!/bin/bash
# Script para ejecutar la migración SQL
#!/usr/bin/env bash
# Uso: bash run-migration.sh

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATION_FILE="$DIR/migrations/001_add_notes_to_order_items.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Archivo de migración no encontrado: $MIGRATION_FILE" >&2
    exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
    echo "❌ 'psql' no está en PATH. Instala psql o añádelo al PATH." >&2
    exit 1
fi

# Variables esperadas: DB_HOST, DB_USER, DB_NAME (opcional PGPASSWORD)
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-postgres}
DB_NAME=${DB_NAME:-stock_pablo}

# Pre-check: evitar re-ejecución si la columna ya existe
EXISTS=$(PGPASSWORD=${PGPASSWORD:-} psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -tAc "SELECT 1 FROM information_schema.columns WHERE table_name='order_items' AND column_name='notes';" 2>/dev/null || true)
if [ "${EXISTS//[[:space:]]/}" = "1" ]; then
    echo "⚠️  La columna 'notes' ya existe. Se omitirá la migración."
    exit 0
fi

echo "🔧 Ejecutando migración SQL: $MIGRATION_FILE"
PGPASSWORD=${PGPASSWORD:-} psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"
echo "✅ Migración finalizada (comprobar salida anterior para errores)."

DB_USER="postgres"
DB_NAME="stock_pablo"
DB_HOST="localhost"

echo "🔧 Ejecutando migración SQL..."
echo "========================="

psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f migrations/001_add_notes_to_order_items.sql

if [ $? -eq 0 ]; then
    echo "✅ Migración completada exitosamente"
    echo ""
    echo "Verificando que la columna 'notes' fue creada..."
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'order_items' AND column_name = 'notes'
        ORDER BY ordinal_position;
    "
else
    echo "❌ Error al ejecutar la migración"
    exit 1
fi
