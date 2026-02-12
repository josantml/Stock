import Link from 'next/link';
import { fetchProductByCaT } from '@/app/lib/data';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ProductDetailClient from '@/app/ui/shop/productDetailClient';

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = await fetchProductByCaT(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/shop" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeftIcon className='w-5 h-5'/>
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
