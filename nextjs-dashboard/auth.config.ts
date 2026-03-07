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

        // Verificamos si está en la ruta de órdenes (permitida para clientes)
        const isOnOrders = nextUrl.pathname.startsWith('/dashboard/orders');

        // NUEVO: Permitir acceso público a la ruta de confirmación de orden
        const isPublicOrderView = nextUrl.pathname.startsWith('/orders');

        // Proteger rutas de admin - solo admins pueden acceder
        if(isOnDashboard){
            // 1. Si no está logueado, mandar a login
          if (!isLoggedIn) return false;

          // 2. Si es Admin, puede entrar a todo
          if (isAdmin) return true;

          // 3. Si es Cliente e intenta entrar a /dashboard/orders, PERMITIR
          if (isOnOrders) return true;

          // 4. Si es Cliente e intenta entrar a otra parte (ej: /dashboard raíz),
          // REDIRIGIRLO a sus órdenes.
          // Usamos NextResponse.redirect porque estamos en el Middleware
          return NextResponse.redirect(new URL('/dashboard/orders', nextUrl));
        }

        if (isPublicOrderView) {
          return true; // Cualquiera puede ver su confirmación si tiene el link
        }
        return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;

