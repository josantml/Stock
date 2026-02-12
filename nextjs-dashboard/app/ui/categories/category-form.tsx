'use client';

import { useActionState} from "react";
import { createCategories, type CategoryState } from "@/app/lib/actions";



export default function CategoryForm() {
    const initialState : CategoryState = { message: null, errors:{} };
    const [state, formAction] = useActionState(createCategories, initialState);

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
                        className="px-3 py-3 border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                
                    {state.errors?.description?.map((err) => (
                        <p key={err} className="text-sm text-red-500">
                            {err}
                        </p>
                    ))}
                </div>

                {state.message && (
                    <p className="text-sm text-red-700">{state.message}</p>
                )}

                <div className="mx-auto">
                    <button type="submit" className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-800 transition">
                        Crear Categoria
                    </button>
                </div>
                
            </form>
        </div>
    )
}