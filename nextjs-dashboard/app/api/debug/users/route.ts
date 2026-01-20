import postgres from 'postgres';
import { NextResponse } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

export async function GET() {
  try {
    // Verificar si existe la tabla users
    const tables = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `;
    
    console.log('Tablas existentes:', tables);

    // Contar usuarios
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    console.log('Cantidad de usuarios:', users);

    // Listar usuarios (sin mostrar contraseñas)
    const userList = await sql`SELECT id, name, email, role FROM users`;
    console.log('Usuarios en BD:', userList);

    return NextResponse.json({
      tablesExist: tables.length > 0,
      userCount: users[0]?.count,
      users: userList,
      message: 'Debug info - check server logs'
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
