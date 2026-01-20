"use client";

import { useState } from 'react';
import CartToggle from './CartToggle';
import CartSidebar from './CartSidebar';

export default function CartUI(){
    const [open, setOpen] = useState(false);

    return (
        <>
            <CartToggle onClick={() => setOpen(true)} />
            {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)}></div>}
            {open && <CartSidebar onClose={() => setOpen(false)} />}
        </>
    )
}
