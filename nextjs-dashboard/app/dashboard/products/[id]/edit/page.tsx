import { fetchProductById, fetchCategories } from "@/app/lib/data"
import EditProductForm from "@/app/ui/products/editProduct-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"

export default async function EditProduct({params}:{params: Promise<{id: string}>}) {
    const session = await auth();
    
    // Proteger: solo admins pueden editar productos
    if (!session || session.user?.role !== 'admin') {
        redirect('/dashboard');
    }
    const { id } = await params;
    const product = await fetchProductById(id);
    const categories = await fetchCategories();

    if(!product){
        return notFound();
    }

    return(
        <div className=""> 
            <Breadcrumbs 
                breadcrumbs={[{label: 'Products', href: '/dashboard/products'}, {label: 'Edit Product', href: `/dashboard/products/${id}/edit`, active: true}]}
            />
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <EditProductForm product={product} categories={categories}/>
        </div>
    )
}