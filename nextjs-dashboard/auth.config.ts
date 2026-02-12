import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';


 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {   // auth: informacion de inicio de sesion, nextUrl: link donde se encuentra el recurso solicitado
        const isLoggedIn = !!auth?.user;
        const isAdmin = auth?.user?.role === 'admin';
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

        // Proteger rutas de admin - solo admins pueden acceder
        if(isOnDashboard){
            if(!isLoggedIn) {
              return false; // Redirige a los usuarios no autenticados a la página de inicio de sesión
            }
            if(!isAdmin) {
              return false; // Redirige a clientes que intenten acceder al dashboard
            }
            return true; // OK para admins en dashboard
        }
        return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;

