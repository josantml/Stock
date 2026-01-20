import { Metadata } from 'next';
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
}
