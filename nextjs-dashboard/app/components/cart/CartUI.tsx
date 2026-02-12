"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import CartToggle from './CartToggle';
import CartSidebar from './CartSidebar';

export default function CartUI(){
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Solo mostrar el carrito en rutas de tienda/productos
    const shouldShowCart = pathname.startsWith('/shop') || pathname.startsWith('/cart');

    if (!shouldShowCart) {
        return null;
    }

    return (
        <>
            <CartToggle onClick={() => setOpen(true)} />
            {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)}></div>}
            {open && <CartSidebar onClose={() => setOpen(false)} />}
        </>
    )
}
