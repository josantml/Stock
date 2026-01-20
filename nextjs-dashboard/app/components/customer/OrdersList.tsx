'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { CustomerOrder } from '@/app/lib/customerOrders';

interface OrdersListProps {
  customerId: string;
  orders: CustomerOrder[];
}

export default function OrdersList({ customerId, orders }: OrdersListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'pending':
        return 'Pendiente';
      case 'shipped':
        return 'Enviada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500 mb-4">No tienes órdenes aún.</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vista de escritorio */}
      <div className="hidden md:block rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                No. Orden
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-gray-900">
                    {order.id.substring(0, 8).toUpperCase()}
                  </code>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDateToLocal(order.created_at)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600">Orden</p>
                <code className="text-sm font-mono font-semibold text-gray-900">
                  {order.id.substring(0, 8).toUpperCase()}
                </code>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <p className="text-gray-600">Fecha</p>
                <p className="font-medium">{formatDateToLocal(order.created_at)}</p>
              </div>
              <div>
                <p className="text-gray-600">Total</p>
                <p className="font-medium">${(order.total / 100).toFixed(2)}</p>
              </div>
            </div>
            <Link
              href={`/orders/${order.id}`}
              className="w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-500 text-sm font-medium"
            >
              Ver detalles
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
