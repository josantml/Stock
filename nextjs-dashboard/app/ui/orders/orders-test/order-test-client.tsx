'use client';
import { useState } from "react";
import { newUpdateOrderStatus } from "@/app/lib/actions";
import Link from "next/link";
import { OrderRow } from "@/app/lib/definitions";


export default function OrdersTestClient({orders,} : {orders: OrderRow[]}) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function handleAction(orderId: string, status: 'paid' | 'cancelled' | 'shipped'){
        try {
            setLoadingId(orderId);
            await newUpdateOrderStatus(orderId, status);
            alert(`Orden ${status}`);
            window.location.reload();
        } catch (error: any) {
            alert (error.message ?? 'Error');
        } finally {
            setLoadingId(null);
        }
    }

    return(
        <table className="min-w-full divide-y divide-gray-200 rounded-md mt-6 border">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium">ID</th>
                    <th className="px-3 py-2 text-sm">Cliente</th>
                    <th className="px-3 py-2 text-sm">Status</th>
                    <th className="px-3 py-2 text-sm">Total</th>
                    <th className="px-3 py-2 text-sm">Acciones</th>
                </tr>
            </thead>


            <tbody className="divide-y bg-white">
                {orders.map((order) => (
                    <tr key={order.id} className="hover: bg-gray-50">
                        <td className="px-3 py-2">{order.id}</td>
                        <td className="px-3 py-2">{order.customer_name}</td>
                        <td className="px-3 py-2">{order.status}</td>
                        <td className="px-3 py-2">{order.total / 100}</td>
                        <td className="px-3 py-2 flex gap-2">
                            <button 
                                className="rounded bg-green-600 px-2 py-1 text-white disabled:opacity-50"
                                disabled = {loadingId === order.id || order.status !== 'pending'}
                                onClick={() => handleAction(order.id, 'paid')}
                            >
                                Marcar Pagada
                            </button>

                            <button
                                className="rounded bg-red-600 px-2 py-1 text-white disabled:opacity-50"
                                disabled = {loadingId === order.id || order.status !== 'pending'}
                                onClick={() => handleAction(order.id, 'cancelled')}
                            >
                                Cancelar
                            </button>

                            {order.status === 'paid' && (
                                <button onClick={() => handleAction(order.id, 'shipped')} className="rounded bg-blue-600 px-2 py-1 text-white">
                                    Marcar Enviada
                                </button>
                            )}

                            {order.invoice_id && (
                                <Link href={`/dashboard/invoices/${order.invoice_id}`} className="text-blue-600 underline">
                                    Ver Factura
                                </Link>
                            )}

                        
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}