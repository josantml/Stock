/*import { NextRequest, NextResponse } from 'next/server';
import { getToken} from 'next-auth/jwt'; 

// Activar mantenimiento: cambiar a true para activar
const MAINTENANCE_MODE = false;

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
};*/


import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const MAINTENANCE_MODE = true;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Log de todas las cookies
  console.log('Cookies en request:', request.cookies);

  // Permitir siempre acceder a la página de mantenimiento, login y auth
  if (pathname.startsWith('/maintenance') || pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Obtener token de sesión (NextAuth)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET, // ⚠ Usar NEXTAUTH_SECRET
  });

  console.log("TOKEN:", token);

  const isAdmin = token?.role === 'admin';

  // 🚧 Si está en mantenimiento:
  if (MAINTENANCE_MODE) {
    // Permitir acceso completo al admin
    if (isAdmin) {
      return NextResponse.next();
    }

    // Bloquear todo lo demás y redirigir a maintenance
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Si NO está en mantenimiento, comportamiento normal
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
