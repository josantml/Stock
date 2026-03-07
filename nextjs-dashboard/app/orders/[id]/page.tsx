/*import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { fetchCustomerOrderDetail } from '@/app/lib/customerOrders';
import OrderDetail from '@/app/components/customer/OrderDetail';
import postgres from 'postgres';

export const metadata: Metadata = {
  title: 'Detalle de Orden',
};

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderPageProps) {
  // Get authenticated user
  // TEMPORARILY DISABLED FOR TESTING
  const session = await auth();

  // TEMPORARILY COMMENTED - REMOVE LOGIN REQUIREMENT FOR TESTING
  // if (!session?.user?.email) {
  //   redirect('/login');
  // }

  // Use test customer for now
  const testCustomerEmail = 'evil@rabbit.com';

  const { id } = await params;

  try {
    // Get customer ID from email
    const customers = await sql`
      SELECT id FROM customers WHERE email = ${testCustomerEmail}
    `;

    if (!customers || customers.length === 0) {
      redirect('/login');
    }

    const customerId = customers[0].id;

    // Fetch order detail (verifies ownership)
    const order = await fetchCustomerOrderDetail(id, customerId);

    if (!order) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex justify-end">
            <a
              href={`/api/orders/${id}/ticket`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              🖨️ Imprimir Ticket
            </a>
          </div>
          <OrderDetail order={order} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading order:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            No pudimos cargar el detalle de la orden. Por favor intenta nuevamente más tarde.
          </p>
          <a
            href="/orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Volver a mis órdenes
          </a>
        </div>
      </div>
    );
  }
}*/


// app/order/[id]/page.tsx
import { fetchOrderById, fetchOrderItem } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ShopHeader from '@/app/ui/dashboard/shopHeader'; // Reutilizamos el header

export default async function OrderConfirmationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;

  // Obtener datos de la orden
  const order = await fetchOrderById(orderId);
  
  if (!order) {
    notFound();
  }

  const items = await fetchOrderItem(orderId);

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader />
      
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Icono de éxito */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h1>
          <p className="text-gray-600 mb-2">
            Gracias por tu compra, <span className="font-semibold">{order.customer_name}</span>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tu número de orden es: <span className="font-mono font-bold text-blue-600">{order.id}</span>
          </p>

          <div className="border-t pt-6 mt-6 text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium text-gray-700">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">${item.subtotal.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t-2">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Seguir Comprando
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}