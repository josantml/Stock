'use client';

import { useActionState} from "react";
import { createCategories, updateCategory, type CategoryState } from "@/app/lib/actions";


interface CategoryFormProps {
    category?: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
    };
}


export default function CategoryForm({category}: CategoryFormProps) {
    // Si existe una categoria, el form se usara para editar, sino para crear
    const initialState : CategoryState = { message: null, errors:{} };
    const bindAction = category ? updateCategory.bind(null, category.id) : createCategories;
    const [state, formAction] = useActionState(bindAction, initialState);


    return(
        <div className="max-w-2xl mx-auto">
            <form action={formAction} className="flex flex-col gap-4 p-6 border border-gray-300 rounded-lg bg-white shadow-md">

                {/* Nombre de la Categoria */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre</label>
                    <input 
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ingrese categoria. Ej.: Electronica, Bazar, Librería..."
                        // Se utiliza defaultValue si se esta editando
                        defaultValue={category?.name || ''}
                        className="px-3 py-2 border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                        {state.errors?.name?.map((err) => (
                            <p key={err} className="text-sm text-red-500">
                                {err}
                            </p>
                        ))}
                </div>

                 {/* Descripcion de la Categoria */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripcion</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Ingrese una breve descripcion de la categoria"
                        // Se utiliza defaultValue si se esta editando
                        defaultValue={category?.description ?? ''}
                        className="px-3 py-3 border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                
                    {state.errors?.description?.map((err) => (
                        <p key={err} className="text-sm text-red-500">
                            {err}
                        </p>
                    ))}
                </div>

                {state.message && (
                    <p className="text-sm text-green-600">{state.message}</p>
                )}

                <div className="mx-auto">
                    <button type="submit" className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-800 transition">
                        {category ? 'Guardar Cambios' : 'Crear Categoria'}
                    </button>
                </div>
                
            </form>
        </div>
    )
}