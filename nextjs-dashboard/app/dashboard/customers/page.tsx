// dashboard/customers/page.tsx
import { fetchAllCustomers } from '@/app/lib/data';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import CustomersTable from './customerModified/customerTable'; // Importamos el nuevo componente

export default async function Page() {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const customers = await fetchAllCustomers();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Clientes</h1>
      
      {/* Usamos el componente cliente aquí */}
      <CustomersTable customers={customers} />
      
    </div>
  );
}