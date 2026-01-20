import CategoryForm from "@/app/ui/categories/category-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function CreateCategoryPage() {
    const session = await auth();
    
    // Proteger: solo admins pueden crear categorías
    if (!session || session.user?.role !== 'admin') {
        redirect('/dashboard');
    }
    return(
        <div className="p-6">
            <Breadcrumbs  breadcrumbs={[{label: 'Categories', href: '/dashboard/categories'}, {label: 'Create Category', href: '/dashboard/categories/create', active: true}]}/>
            <h2 className="text-xl font-semibold mb-4">Nueva Categoria</h2>
            <CategoryForm/>
        </div>
    )
}