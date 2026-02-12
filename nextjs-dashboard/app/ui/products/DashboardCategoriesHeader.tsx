'use client'

import Link from 'next/link';
import { Categories } from '@/app/lib/definitions';
import { useUser } from '@/app/lib/hooks/useUser';
import { PlusIcon } from '@heroicons/react/24/outline';


export default function DashboardCategoriesHeader({ categories }: { categories: Categories[] }) {
    const { user } = useUser(); 
    const isAdmin = user?.role === 'admin';

    return(
        <aside>
            <div className='flex items-center justify-between mb-4'>
                <h3 className='font-semibold'>Categorias</h3>

                {isAdmin && (
                    <Link href="/dashboard/categories/create" className='flex gap-1 items-center text-sm text-blue-600 hover:text-white hover:bg-blue-400 p-1 rounded-md'>
                        <span>Crear</span>
                        <PlusIcon className='w-4'/>
                    </Link>
                )}
            </div>

            <ul className='space-y-1'>
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <Link href={`/dashboard/products?category=${cat.slug}`} className='text-sm hover:underline'>
                            {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}