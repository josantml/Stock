import Image from "next/image";
import { fetchProducts, fetchFilteredProducts, fetchCategories, fetchProductByCategorySlug } from "@/app/lib/data";
import Link from "next/link";
import Search from "@/app/ui/search";
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

  let products;

  if (category){
    products = await fetchProductByCategorySlug(category);
  }
  else if (query){
    // Si hay búsqueda ➜ usa el filtrado
    products = await fetchFilteredProducts(query, Number(page))
  } else {
    // Si NO hay búsqueda ➜ trae todos
    products = await fetchProducts();
  }


  console.log("PRODUCTOS RECIBIDOS:", products);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Productos</h3>

      <div className="mt-4 flex items-center justify-beetween gap-2 md:mt-8">
          <Search placeholder="Buscar productos..." />
          {isAdmin && <CreateProduct />}
      </div>
     
     <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">

        {/* Sidebar Categorias */}
        <div className="md:col-span-1">
            <DashboardCategoriesHeader categories={categories} />
        </div>


        {/* Productos */}
        {/*<div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border border-black">
          {products.map((product: any) => (
              <Link href={`/dashboard/productDetail/${product.id}`} key={product.id} className="block">
                  <div
                      key={product.id}
                      className="border rounded-lg p-3 shadow-sm bg-white"
                  >
                  

                      {product.imagen ? (
                          <div className="w-[150px] h-[200px] flex justify-center items-center mx-auto mt-3">
                              <Image
                                  src={product.imagen}
                                  alt={product.nombre}
                                  width={130}
                                  height={130}
                                  className="rounded-md object-contain"
                              />
                          </div>
                          
                      ) : (
                      <p className="text-gray-400 mt-2">Sin imagen</p>
                      )}
                      <h4 className="text-lg font-semibold">{product.nombre}</h4>
                      <p className="text-sm">{product.descripcion}</p>
                      <p className="font-bold mt-2">${product.precio}</p>
                  </div>
              </Link>
            
          ))}
        </div>*/}
        <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
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

                <p className="text-sm text-gray-600 flex-grow">
                  {product.descripcion}
                </p>

                <p className="font-bold mt-3 text-lg">
                  ${product.precio}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}


