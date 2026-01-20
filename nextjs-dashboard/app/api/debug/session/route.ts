import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/**
 * DEBUG ENDPOINT: Muestra exactamente qué contiene la sesión
 * Accede a: http://localhost:3000/api/debug/session
 */
export async function GET() {
  try {
    const session = await auth();

    return NextResponse.json({
      status: 'OK',
      session: session,
      user: session?.user || null,
      role: session?.user?.role || null,
      isAdmin: session?.user?.role === 'admin',
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
