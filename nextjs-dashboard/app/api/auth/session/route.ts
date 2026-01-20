import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Retorna los datos de sesión del usuario autenticado.
 * Incluye id, nombre, email y rol.
 */
export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({ user: session.user });
}
