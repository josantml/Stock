'use client';

import { useSearchParams, usePathname, useRouter } from "next/navigation";

type Category = {
    id: string;
    name: string;
    slug: string;
};

export default function CategoriesFilter({ categories }: { categories: Category[] }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const activeCategory = searchParams.get('category');

    function selectCategory(slug?: string) {
        const params = new URLSearchParams(searchParams.toString());

        slug ? params.set('category', slug) : params.delete('category');
        params.delete('page'); // resetear paginacion al cambiar categoria

        replace(`${pathname}?${params.toString()}`);
    }


    return(
        <div className="">
            <button
                onClick={() => selectCategory()}
                className={`block w-full text-left px-3 py-2 rounded ${
                        !activeCategory ? 'bg-blue-600 text-white' : 'bg-gray-100'
                }`}
            >
                Todas
            </button>

            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => selectCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                        activeCategory === cat.slug
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                >
                    {cat.name}
                </button>
            ))}

        </div>
    )
}