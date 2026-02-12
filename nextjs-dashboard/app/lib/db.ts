import postgres from 'postgres';

// Crear una única instancia global de conexión
/*let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!sql) {
    sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { 
      ssl: 'require',
      max: 10, // Limitar el máximo de conexiones por instancia
    });
  }
  return sql;
}

export default getDb();*/


/**
 * IMPORTANTE: Usamos POSTGRES_URL (Connection Pooler)
 * en lugar de NON_POOLING (Direct Mode).
 * 
 * POSTGRES_URL apunta al puerto 6543 y usa el pooler de Supabase,
 * lo que permite manejar muchas peticiones simultáneas sin bloquearse.
 */
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  max: 15, // Número máximo de conexiones permitidas en el pool
  idle_timeout: 20, // Cierra conexiones inactivas automáticamente
  connect_timeout: 10, // Tiempo de espera para conectar
});

export default sql;