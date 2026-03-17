import { fetchCategoryById } from "@/app/lib/data";
import CategoryForm from "@/app/ui/categories/category-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";


export default async function EditCategoryPage({params}: {params: Promise<{id: string}>}){
    const session = await auth();

    // Proteger: solo admins pueden editar categorias
    if (!session || session.user?.role !== 'admin') {
        redirect('/dashboard');
    }

    const { id } = await params;
    const category = await fetchCategoryById(id);

    if(!category){
        notFound();
    }


    return(
        <div className="">
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Categories', href: '/dashboard/categories'},
                    {label: 'Edit Category', href: `/dashboard/categories/${id}/edit`, active: true}
                ]}
            />

            <h2 className="">Editar Categoria</h2>
            {/* El form de categoria se puede reutilizar tanto para crear como para editar, dependiendo si se le pasa una categoria o no */}
            <CategoryForm category={category}/>
        </div>
    )
}