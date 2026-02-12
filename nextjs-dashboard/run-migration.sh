#!/bin/bash
# Script para ejecutar la migración SQL
# Uso: bash run-migration.sh

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
