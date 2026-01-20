"use client";

import { useCart } from "./CartProvider";

export default function CartSidebar({onClose}:{onClose:()=>void}){
    const {items, removeItem, total, clear} = useCart();

    return (
        <aside className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l z-50 flex flex-col">
            <div className="px-4 py-3 border-b flex items-center justify-between">
                <h3 className="font-semibold">Tu carrito</h3>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-900">Cerrar</button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-sm text-gray-600">El carrito está vacío</p>
                ) : (
                    items.map(i => (
                        <div key={i.productId} className="flex items-center gap-3 py-2 border-b">
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                                {i.image ? <img src={i.image} alt={i.name} className="object-cover w-full h-full"/> : null}
                            </div>
                            <div className="flex-1 text-sm">
                                <div className="font-medium truncate">{i.name}</div>
                                <div className="text-gray-500 text-xs">{i.quantity} x ${(i.price/100).toFixed(2)}</div>
                            </div>
                            <div>
                                <button onClick={() => removeItem(i.productId)} className="text-sm text-red-600">Quitar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">${(total/100).toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                    <a href="/cart" className="block text-center w-full px-3 py-2 bg-blue-600 text-white rounded">Ir al carrito</a>
                    <button onClick={() => { clear(); onClose(); }} className="w-full px-3 py-2 border rounded">Vaciar carrito</button>
                </div>
            </div>
        </aside>
    )
}
