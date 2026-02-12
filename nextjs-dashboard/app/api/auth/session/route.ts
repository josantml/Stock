import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * Retorna los datos de sesión del usuario autenticado.
 * Incluye id, nombre, email y rol.
 */
export async function GET() {
  const session = await auth();

  // Devolver la sesión completa (o null) con 200 para que `next-auth/react` la consuma correctamente
  return NextResponse.json(session ?? null);
}
