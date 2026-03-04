'use client';

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Pagination({
  currentPage,
  totalPages,
  query,
  category,
}:{
    currentPage: number;
    totalPages: number;
    query?: string;
    category?: string;
}) {

    const pathname = usePathname();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams();
        if (query) params.set('query', query);
        if (category) params.set('category', category);
        params.set('page', pageNumber.toString());

        //return `/shop?${params.toString()}`;
        // retornamos el pathname actual (puede ser /shop o /dashboard/products) con los nuevos params
        return `${pathname}?${params.toString()}`; 
    };

    if (totalPages <= 1) return null;

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <Link
                href={createPageURL(currentPage - 1)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                !hasPrevPage
                    ? 'pointer-events-none text-gray-300 bg-gray-100'
                    : 'text-gray-700 bg-white hover:bg-gray-100 border shadow-sm'
                }`}
                aria-disabled={!hasPrevPage}
            >
                <ArrowLeftIcon className="w-4 h-4" />
                Anterior
            </Link>

            <div className="text-sm text-gray-700">
                Página <span className="font-bold">{currentPage}</span> de{' '}
                <span className="font-bold">{totalPages}</span>
            </div>

            <Link
                href={createPageURL(currentPage + 1)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${
                !hasNextPage
                    ? 'pointer-events-none text-gray-300 bg-gray-100'
                    : 'text-gray-700 bg-white hover:bg-gray-100 border shadow-sm'
                }`}
                aria-disabled={!hasNextPage}
            >
                Siguiente
                <ArrowRightIcon className="w-4 h-4" />
            </Link>
        </div>
    )
}