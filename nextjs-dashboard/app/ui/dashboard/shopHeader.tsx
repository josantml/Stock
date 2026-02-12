'use client'

import Link from "next/link";
import { useSession } from 'next-auth/react';
import { usePathname } from "next/navigation";

export default function ShopHeader() {
    const {data: session, status} = useSession();
    const isLoading = status === 'loading';
    const pathname = usePathname();

    const isShopPage = pathname === '/shop';

    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-blue-600">
                        ROMA Multirubros
                    </Link>

                    <div className="flex gap-4 items-center">

                        {isShopPage ? (
                            // Si estamos en shop mostrar el enlace al carrito
                            <Link href='/cart' className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                                🛒 Mi Carrito
                            </Link>
                        ) : ( 
                            // Si no estamos en el shop se muestra el enlace Ver Productos
                            <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
                                Ver Productos
                            </Link>
                        )}
                       

                        {/* Logica condicional para el boton de usuario */}
                        {isLoading ? (
                            <span className="text-sm text-gray-500">Cargando...</span>
                        ) : !session ? (
                            // Si no hay sesion mostrar ingresar
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Ingresar
                            </Link>
                        ) : (
                            // Si hay sesion -> Mostrar nombre o enlace a su panel
                            <Link  href={session.user?.role === 'admin' ? '/dashboard' : '/dashboard/orders'} 
                                className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {session.user?.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}