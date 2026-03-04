import Link from 'next/link';
import ProductCard from '../ui/products/ProductCard';
import Search from '@/app/ui/search';
import CategoriesFilter from '@/app/ui/products/categoriesFilter';
import ShopHeader from '../ui/dashboard/shopHeader';
import Pagination from '../ui/products/Pagination'; 
import {
  fetchProducts,
  fetchFilteredProducts,
  fetchCategories,
  fetchProductByCategorySlug,
} from '@/app/lib/data';
import { auth } from '@/auth';


export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    page?: string;
  }>;
}) {

  const params = await searchParams;
  const session = await auth();

  const query = params.query ?? '';
  const category = params.category;
  const currentPage = Number(params.page ?? '1');

  const categories = await fetchCategories();

  // Almacena los productos y también el total de páginas para la paginación
  let productsData: {products: any[]; totalPages: number};

  // se pasa currentPage a la funcion de categorias, busqueda y productos generales (obteniendo las paginas correspondientes)
  if (category) {
    productsData = await fetchProductByCategorySlug(category, currentPage);
  } else if (query) {
    productsData = await fetchFilteredProducts(query, currentPage);
  } else {
    productsData = await fetchProducts(currentPage);
  }

  const isAdmin = session?.user?.role === 'admin';

  const {products, totalPages} = productsData;  

  return (
    <>
      {/* Header */}
      <ShopHeader/>
    
    {/* Main Content */}
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
          <p className="text-gray-600">
            Explora nuestro catálogo de productos. Agrega los que desees a tu carrito.
          </p>
        </div>

      {/*Search y Nav*/}
      <div className="flex gap-4 mb-6">
        <Search placeholder="Buscar productos..." />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
        
          <aside className="md:col-span-1">
            <CategoriesFilter categories={categories} />
          </aside>
        

        {/* Productos Grid */}
        <section className='md:col-span-4'>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product}/>
            ))}
          </div>

          {/* Paginacion */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            query={query} 
            category={category} 
          />
        </section>
      </div>
      
    </div>
    </>
  );
}
