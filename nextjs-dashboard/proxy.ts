/*import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


export default NextAuth(authConfig).auth;


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}*/


// proxy.ts (o middleware.ts)
/*export { auth as default } from "./auth";

export const config = {
  matcher: ["/dashboard/:path*"],
};*/


// proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/shop',
  '/cart',
  '/login',
  '/checkout',
  '/api/debug/session',
];

// Rutas protegidas que requieren sesión
const PROTECTED_ROUTES = [
  '/dashboard',
];

// Función proxy que Next.js ejecuta para cada request
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Revisar cookies de sesión de NextAuth
  const sessionCookie =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value;

  // Si es ruta pública, permitir
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es ruta protegida y no hay sesión, redirigir al login
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ruta permitida
  return NextResponse.next();
}

// Configuración de Next.js para qué rutas aplicar el proxy
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // aplica a todas las rutas excepto assets
};

