import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas PÚBLICAS (sin autenticación)
const PUBLIC_ROUTES = [
  '/shop',
  '/cart',
  '/login',
  '/checkout',
  '/api/debug/session',
];

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/dashboard',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Obtener la cookie de sesión de NextAuth
  const sessionCookie = request.cookies.get('authjs.session-token')?.value || 
                        request.cookies.get('next-auth.session-token')?.value;

  // Permitir rutas públicas sin restricción
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si no hay sesión y trata de acceder a rutas protegidas, redirigir a login
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
