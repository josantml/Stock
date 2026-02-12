'use client';

import { useCart } from "../cart/CartProvider";
import { createOrder } from "@/app/lib/actions";
import { useState, useTransition } from "react";
import Link from "next/link";
import { z } from "zod";

interface CheckoutFormProps {
    userId?: string | null;
    isAuthenticated?: boolean;
    defaultName?: string;
    defaultEmail?: string;
}

// Validación de checkout
const CheckoutSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
});

export default function CheckoutForm({ userId, isAuthenticated, defaultName = '', defaultEmail = '' }: CheckoutFormProps) {
    const {items, total, clear} = useCart();
    
    // Dividir el nombre completo en nombre y apellido
    const nameParts = defaultName.trim().split(' ');
    const defaultFirstName = nameParts[0] || '';
    const defaultLastName = nameParts.slice(1).join(' ') || '';
    
    const [firstName, setFirstName] = useState(defaultFirstName);
    const [lastName, setLastName] = useState(defaultLastName);
    const [email, setEmail] = useState(defaultEmail);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


    if(!items.length){
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-lg mb-4">Tu carrito está vacío</p>
                <a href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
                    Volver a productos
                </a>
            </div>
        );
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        // Validar datos con Zod
        const validation = CheckoutSchema.safeParse({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
        });

        if (!validation.success) {
            const errors: { [key: string]: string } = {};
            validation.error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            setFieldErrors(errors);
            return;
        }


    startTransition(() => {
        (async () => {
            try {
                // Crear orden con datos del cliente
                const formData = new FormData();
                formData.append('customerName', `${firstName} ${lastName}`);
                formData.append('customerEmail', email);
                if (userId) {
                    formData.append('customerId', userId);
                }
                formData.append('email', email);
 
                formData.append('items', JSON.stringify(
                    items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        notes: item.notes || undefined,
                    }))
                ));

                const orderResult = await createOrder({}, formData);

                if(orderResult?.message?.includes('Error')){
                    setError(orderResult.message);
                    return;
                }

                if(!orderResult?.orderId){
                    setError('No se pudo obtener el ID de la orden');
                    return;
                }

                // Limpiar carrito y redirigir
                clear();
                window.location.href = `/orders/${orderResult.orderId}`;

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al procesar la orden');
            }
        })();
    });
    };


    return(
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info de sesión */}
            {isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        ✓ Estás comprando con tu cuenta. Tu ID de cliente será asociado a esta orden.
                    </p>
                </div>
            )}

            {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                        Si prefieres, puedes <Link href="/login" className="font-semibold text-amber-900 hover:underline">iniciar sesión</Link> para completar la compra con tu cuenta.
                    </p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Información del Cliente</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre *
                        </label>
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Ej: Juan"
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {fieldErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido *
                        </label>
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Ej: Pérez"
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                            required
                        />
                        {fieldErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (opcional)
                    </label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                    )}
                </div>
            </div>

            {/* Resumen de compra */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen de Compra</h2>
                
                <div className="space-y-3 mb-4 pb-4 border-b">
                    {items.map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {item.name} x {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                                ${((item.price * item.quantity) / 100).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-blue-600">
                        ${(total / 100).toFixed(2)}
                    </span>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isPending || !firstName || !lastName}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                    {isPending ? 'Procesando compra...' : 'Finalizar Compra'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Al finalizar tu compra, recibirás la confirmación de tu orden.
                </p>
            </div>
        </form>
    );
}