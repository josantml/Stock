import Image from "next/image";
import { fetchProducts, fetchFilteredProducts, fetchCategories, fetchProductByCategorySlug } from "@/app/lib/data";
import Link from "next/link";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/products/Pagination";
import { CreateProduct } from "@/app/ui/invoices/buttons";
import DashboardCategoriesHeader from "@/app/ui/products/DashboardCategoriesHeader";
import { auth } from "@/auth";



  
export default async function Page({ searchParams }: {searchParams: Promise<{query?: string; page?: string; category?: string}>;}) {
  
  const { query = "", page = "1", category } = await searchParams;
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';

  const currentPage = Number(page);
  /*const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;*/

  const categories = await fetchCategories();

  let results;

  if (category){
    results = await fetchProductByCategorySlug(category, currentPage);
  }
  else if (query){
    // Si hay búsqueda ➜ usa el filtrado
    results = await fetchFilteredProducts(query, currentPage)
  } else {
    // Si NO hay búsqueda ➜ trae todos
    results = await fetchProducts(currentPage);
  }


  console.log("PRODUCTOS RECIBIDOS:", results);

  const {products= [], totalPages = 1} = results || {};

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Productos</h3>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar productos..." />
        {isAdmin && <CreateProduct />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
        {/* Sidebar Categorias */}
        <div className="md:col-span-1">
          <DashboardCategoriesHeader categories={categories} />
        </div>

        {/* Productos */}
        <div className="md:col-span-4 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product: any) => (
                <Link
                  href={`/dashboard/productDetail/${product.id}`}
                  key={product.id}
                  className="block"
                >
                  <div className="h-full border rounded-lg p-4 shadow-sm bg-white flex flex-col">
                    {/* Imagen */}
                    <div className="w-full h-48 flex items-center justify-center mb-3">
                      {product.imagen ? (
                        <Image
                          src={product.imagen}
                          alt={product.nombre}
                          width={160}
                          height={160}
                          className="object-contain max-h-full"
                        />
                      ) : (
                        <p className="text-gray-400">Sin imagen</p>
                      )}
                    </div>

                    {/* Contenido */}
                    <h4 className="text-lg font-semibold mb-1">
                      {product.nombre}
                    </h4>

                    <p className="text-sm text-gray-600 flex-grow line-clamp-2">
                      {product.descripcion}
                    </p>

                    <p className="font-bold mt-3 text-lg">
                      ${product.precio}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500 py-10">No se encontraron productos.</p>
            )}
          </div>

          {/* 5. Paginación */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            query={query} 
            category={category} 
          />
        </div>
      </div>
    </div>
  );
}


