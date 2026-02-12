import Link from 'next/link';
import { fetchCategories } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { auth } from '@/auth';
import { CreateCategory } from '@/app/ui/invoices/buttons';
import { DeleteCategory } from '@/app/ui/invoices/buttons';


export default async function PageCategory() {
    const session = await auth();

    if(!session || session?.user.role !== 'admin'){
        return <p className='text-2xl p-6 text-red-500'>Acceso Denegado!</p>
    }

    const categories = await fetchCategories();

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <Breadcrumbs breadcrumbs={[{label: 'Dashboard', href: '/dashboard'}, {label: 'Categorias', href:'/dashboard/categories', active: true}]}/>
                <CreateCategory />
            </div>

            <div className='mt-6'>
                <h1 className='text-2xl font-bold mb-4'> Categorias Listadas </h1>

                {categories.length === 0 ? (<p className='text-gray-500'>Aun no existen categorias listadas</p>) : (
                    <div className='border rounded-md bg-white shadow-sm overflow-hidden'>
                        <table className='w-full text-left'>
                            <thead className='bg-gray-50 border-b'>
                                <tr>
                                    <th className='p-3 text-sm font-medium text-gray-600'>Nombre</th>
                                    <th className='p-3 text-sm font-medium text-gray-600'>Slug (URL)</th>
                                    <th className='p-3 text-sm font-medium text-gray-600'>Descripcion</th>
                                    <th className='p-3 text-sm font-medium text-gray-600 text-right'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {categories.map((category) => (
                                    <tr key={category.id} className='hover:bg-gray-50'>
                                        <td className='p-3 font-medium'>{category.name}</td>
                                        <td className='p-3 text-sm text-gray-500'>{category.slug}</td>
                                        <td className='p-3 text-sm text-gray-500 truncate max-w-xs'>{category.description || '-'}</td>
                                        <td className='p-3 text-right space-x-2'><DeleteCategory id={category.id}/></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}