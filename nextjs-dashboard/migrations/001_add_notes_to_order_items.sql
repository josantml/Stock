-- =====================================================
-- MIGRACIONES REQUERIDAS PARA NUEVAS FUNCIONALIDADES
-- =====================================================
-- Fecha: 18 de enero de 2026
-- Descripción: Agregar soporte para notas en items de orden

-- =====================================================
-- 1. Agregar columna 'notes' a tabla order_items
-- =====================================================
-- Esta columna almacena aclaraciones/notas del cliente para cada item

ALTER TABLE order_items
ADD COLUMN notes TEXT DEFAULT NULL;

-- Comentario para documentación
COMMENT ON COLUMN order_items.notes IS 'Notas o aclaraciones del cliente para este item (ej: color específico, urgente, etc.)';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ejecutar esta consulta para verificar la migración:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'order_items' 
-- ORDER BY ordinal_position;

-- Deberías ver una fila con:
-- column_name: notes
-- data_type: text
-- is_nullable: YES
