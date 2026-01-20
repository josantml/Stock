'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { CustomerOrderDetail } from '@/app/lib/customerOrders';

interface OrderDetailProps {
  order: CustomerOrderDetail;
}

export default function OrderDetail({ order }: OrderDetailProps) {
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

  const subtotal = order.items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orden {order.id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-600 mt-1">
            Realizada el {formatDateToLocal(order.created_at)}
          </p>
        </div>
        <span
          className={`w-fit px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status)}
        </span>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4">
              <div className="flex gap-4 items-start">
                {item.product_image && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Cantidad: <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Precio: <span className="font-medium">${(item.price / 100).toFixed(2)}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.subtotal / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900 font-medium">
                ${(subtotal / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Impuestos:</span>
              <span className="text-gray-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>${(order.total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Factura */}
      {order.invoice && order.invoice.id && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Factura</h2>
              <p className="text-sm text-gray-600 mt-1">
                Factura No. {order.invoice.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
            {order.invoice.pdf_url && (
              <a
                href={order.invoice.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
                  />
                </svg>
                Descargar PDF
              </a>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de pago pendiente (sin Stripe) */}
      {order.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800">Pago pendiente</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Tu orden ha sido creada pero aún no ha sido pagada. 
                Por favor contacta al administrador para completar el pago.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver a mis órdenes
        </Link>
      </div>
    </div>
  );
}
