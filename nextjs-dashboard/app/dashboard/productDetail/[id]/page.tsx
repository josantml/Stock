import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchProductByCaT } from "@/app/lib/data";
import ProductDetail from "@/app/ui/products/productDetail";
import Link from "next/link";
import DeleteProductButton from "@/app/ui/products/deleteProduct";
import { auth } from "@/auth";




export default async function Page({params} : any) {
  const {id} = await params;
  const session = await auth();
  const isAdmin = session?.user?.role === 'admin';
  const product = await fetchProductByCaT(id);

  
  if(!product) {
    return <p>Producto no encontrado</p>
  }


  return(
    <main>
      <Breadcrumbs
            breadcrumbs={[{label: 'Products', href:'/dashboard/products'}, {label: 'Product Detail', href: `/dashboard/productDetail/${product.id}`, active: true}]}
       />
       <div className="mt-4">
          <ProductDetail product={product}/>
       </div>
       {isAdmin && (
       <div className="flex items-center justify-center gap-4 p-2 mt-4">
          <Link href={`/dashboard/products/${product.id}/edit`} className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover: bg-blue-500">
              Editar Producto
          </Link>
          <DeleteProductButton id={product.id} />
       </div>
       )}
       
    </main>
    
  )
}
