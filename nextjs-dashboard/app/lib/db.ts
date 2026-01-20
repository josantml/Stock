import postgres from 'postgres';

// Crear una única instancia global de conexión
let sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!sql) {
    sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { 
      ssl: 'require',
      max: 10, // Limitar el máximo de conexiones por instancia
    });
  }
  return sql;
}

export default getDb();
