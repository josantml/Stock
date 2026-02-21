import { NextRequest, NextResponse } from 'next/server';

// Activar mantenimiento: cambiar a true para activar
const MAINTENANCE_MODE = true;

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ['/shop', '/cart', '/login', '/register', '/api/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirigir a mantenimiento si está activado y no es la página de mantenimiento
  if (MAINTENANCE_MODE && !pathname.startsWith('/maintenance')) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Permitir todas las rutas públicas
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // No importar módulos nativos aquí; verificar cookie de sesión en su lugar
  const sessionCookie = request.cookies.get('authjs.session-token')?.value ||
                        request.cookies.get('next-auth.session-token')?.value;

  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
