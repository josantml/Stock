import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { fetchOrderById, fetchOrderItem } from '@/app/lib/data';
import DeleteItemButton from './DeleteItemButton';
import UpdateOrderEmailForm from '@/app/ui/updateOrderEmailForm';
import { TicketSenderButton } from '@/app/components/ticket/ticketSender';

export const metadata = {
  title: 'Detalle de Orden',
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await auth();

  // Validar que sea admin
  if (!session || session.user?.role !== 'admin') {
    redirect('/dashboard');
  }

 

  try {
    const order = await fetchOrderById(id);
    const orderItems = await fetchOrderItem(id);

    if (!order) {
      redirect('/dashboard/admin/orders');
    }

    /*if(!order.customer_email){
      throw new Error('La orden no tiene un email asociado');
    }*/

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Detalle de Orden</h1>
            <p className="text-gray-600 mt-1">ID: {order.id}</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/api/orders/${id}/ticket`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              🖨️ Imprimir Ticket
            </a>
            <Link
              href="/dashboard/admin/orders"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Volver
            </Link>
          </div>
        </div>

        {/* Información de la orden */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de la Orden</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {order.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(order.total / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.customer_name || 'N/A'}
                  </p>
                </div>
                <div>
                  <h2 className="text-gray-600">Email</h2>
                  
                    {order.customer_email ? (<p>{order.customer_email}</p>) : (<p className='text-gray-400 italic'>El cliente no proporciono mail</p>)} 
                    <UpdateOrderEmailForm orderId={order.id} initialEmail={order.customer_email}/>
                </div>
                <div>
                  <TicketSenderButton orderId={order.id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Productos en la orden */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Productos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Notas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderItems && orderItems.length > 0 ? (
                  orderItems.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${(item.price / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                        ${(item.subtotal / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.notes ? (
                          <div className="bg-blue-50 rounded px-2 py-1 max-w-xs text-xs">
                            {item.notes}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DeleteItemButton orderId={id} itemId={item.id} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                      No hay productos en esta orden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading order:', error);
    redirect('/dashboard/admin/orders');
  }
}
