'use client';

import Link from "next/link";
import { Categories } from "@/app/lib/definitions";
import { useUser } from "@/app/lib/hooks/useUser";

export default function CategoriesFilter({categories,} : {categories: Categories[]}) {
    const { user, loading } = useUser();
    const isAdmin = user?.role === 'admin';

    return(
        <aside className="">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Categorias</h3>
                {isAdmin && (
                    <Link href="/dashboard/categories/create" className="text-sm text-blue-600 hover:text-blue-800">
                        + Crear
                    </Link>
                )}
            </div>

            <ul className="">
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <Link href={`/dashboard/products?categories=${cat.slug}`} className="">
                            {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}