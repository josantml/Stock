import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { NextResponse } from 'next/server';

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

async function resetUsers() {
  // Eliminar usuarios existentes
  await sql`DELETE FROM users`;

  // Crear contraseñas hasheadas
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  // Insertar usuarios correctos
  const users = [
    {
      id: '410544b2-4001-4271-9855-fec4b6a6442a',
      name: 'Admin User',
      email: 'admin@nextmail.com',
      password: adminPassword,
      role: 'admin',
    },
    {
      id: '25a60918-59ef-4dab-87bb-cb650b844126',
      name: 'Client User',
      email: 'client@nextmail.com',
      password: clientPassword,
      role: 'client',
    },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO users (id, name, email, password, role)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.role})
    `;
  }

  // Verificar que se crearon
  const createdUsers = await sql`SELECT id, name, email, role FROM users`;

  return {
    success: true,
    message: 'Usuarios creados correctamente',
    users: createdUsers,
    credentials: {
      admin: { email: 'admin@nextmail.com', password: 'admin123' },
      client: { email: 'client@nextmail.com', password: 'client123' },
    },
  };
}

export async function GET() {
  try {
    const result = await resetUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error resetting users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = await resetUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error resetting users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
