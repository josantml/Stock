import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import ProductForm from "@/app/ui/products/createProduct-form";
import { fetchCategories } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProductPage() {
    const session = await auth();
    
    // Proteger: solo admins pueden crear productos
    if (!session || session.user?.role !== 'admin') {
        redirect('/dashboard');
    }

    const categories = await fetchCategories();

    return (
        <div className="p-6">
            <Breadcrumbs 
                breadcrumbs={[{label: 'Products', href: '/dashboard/products'}, {label: 'Create Product', href: '/dashboard/products/create', active: true}]} 
            />
            <ProductForm  categories={categories}/>
        </div>
    );
}