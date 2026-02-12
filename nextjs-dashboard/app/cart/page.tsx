'use client';

import { useCart } from "../components/cart/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import ShopHeader from "../ui/dashboard/shopHeader";

export default function CartPage() {
    return <CartContent />;
}

function CartContent() {
    const { items, total, removeItem } = useCart();


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <ShopHeader />
            {/*<div className="bg-white shadow-sm border-b">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center mb-4">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            StockPablo
                        </Link>
                        <div className="flex gap-4 items-center">
                            <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
                                Ver Productos
                            </Link>
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Ingresar
                            </Link>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Mi Carrito</h1>
                </div>
            </div>*/}

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg mb-6">Tu carrito está vacío</p>
                        <Link
                            href="/shop"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LISTA DE PRODUCTOS */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map(item => (
                                <div
                                    key={item.productId}
                                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
                                >
                                    <div className="flex gap-4">
                                        {/* Imagen */}
                                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-gray-900">
                                                {item.name}
                                            </h3>
                                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                <div className="text-sm text-gray-600 mt-2">
                                                    {Object.entries(item.selectedOptions).map(([k,v]) => (
                                                        <div key={k}>{k}: {v}</div>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-600 mt-2">
                                                Cantidad: {item.quantity}
                                            </p>
                                            {item.notes && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                                    <p className="text-xs font-semibold text-blue-900 mb-1">Nota:</p>
                                                    <p className="text-sm text-blue-800">{item.notes}</p>
                                                </div>
                                            )}
                                            <p className="text-lg font-semibold text-blue-600 mt-2">
                                                ${((item.price * item.quantity) / 100).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Acciones */}
                                        <div>
                                            <button
                                                onClick={() => removeItem(item.productId, item.selectedOptions)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                            >
                                                ✕ Quitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RESUMEN */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Resumen del Pedido
                                </h3>

                                <div className="space-y-4 pb-6 border-b">
                                    {/*<div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${(total / 100).toFixed(2)}</span>
                                    </div>*/}
                                    <div className="text-gray-600">
                                        {items.map(item => (
                                            <div key={item.productId} className="mt-3">
                                                <h5>{item.name}</h5>
                                                <div className="flex justify-between">
                                                    <span>Subtotal</span>
                                                    <span>${((item.quantity * item.price)/ 100).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span>Gratis</span>
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 mb-6 font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span className="text-blue-600">${(total / 100).toFixed(2)}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full bg-blue-600 text-white text-center px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                                >
                                    Confirmar Pedido
                                </Link>

                                <Link
                                    href="/shop"
                                    className="block w-full bg-gray-200 text-gray-800 text-center px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Continuar Comprando
                                </Link>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Complete la compra llenando el formulario o iniciando sesión en su cuenta.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
