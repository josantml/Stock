import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchCustomerOrders, fetchCustomerOrderStats } from '@/app/lib/customerOrders';
import OrdersList from '@/app/components/customer/OrdersList';
import postgres from 'postgres';

export const metadata: Metadata = {
  title: 'Mis Órdenes',
  description: 'Visualiza y gestiona tus órdenes de compra',
};

const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, { ssl: 'require' });

export default async function OrdersPage() {
  // Get authenticated user
  // TEMPORARILY DISABLED FOR TESTING
  const session = await auth();

  // TEMPORARILY COMMENTED - REMOVE LOGIN REQUIREMENT FOR TESTING
  // if (!session?.user?.email) {
  //   redirect('/login');
  // }

  // Use test customer for now
  const testCustomerEmail = 'evil@rabbit.com';

  try {
    // Get customer ID from email
    const customers = await sql`
      SELECT id FROM customers WHERE email = ${testCustomerEmail}
    `;

    if (!customers || customers.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil incompleto</h1>
            <p className="text-gray-600 mb-6">
              No encontramos un perfil de cliente asociado a tu cuenta.
            </p>
            <a
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
            >
              Volver a Login
            </a>
          </div>
        </div>
      );
    }

    const customerId = customers[0].id;

    // Fetch orders and stats in parallel
    const [orders, stats] = await Promise.all([
      fetchCustomerOrders(customerId),
      fetchCustomerOrderStats(customerId),
    ]);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Mis Órdenes</h1>
            <p className="text-gray-600 mt-2">
              Administra y da seguimiento a todas tus compras
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Total de Órdenes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Órdenes Pagadas</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid_orders}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Órdenes Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_orders}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Total Gastado</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(stats.total_spent / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Orders List */}
          <OrdersList customerId={customerId} orders={orders} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading orders:', error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">
            No pudimos cargar tus órdenes. Por favor intenta nuevamente más tarde.
          </p>
          <a
            href="/orders"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
          >
            Reintentar
          </a>
        </div>
      </div>
    );
  }
}
