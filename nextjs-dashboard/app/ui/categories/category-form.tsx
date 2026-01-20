'use client';

import { useActionState} from "react";
import { createCategories, type CategoryState } from "@/app/lib/actions";



export default function CategoryForm() {
    const initialState : CategoryState = { message: null, errors:{} };
    const [state, formAction] = useActionState(createCategories, initialState);

    return(
        <div>
            <form action={formAction} className="">
                {/* Nombre de la Categoria */}
                <label htmlFor="name">Nombre</label>
                <input 
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ingrese categoria. Ej.: Electronica, Bazar, Librería..."
                    className=""
                 />
                 <div>
                    {state.errors?.name?.map((err) => (
                        <p key={err} className="text-red-500">
                            {err}
                        </p>
                    ))}
                 </div>

                 {/*Descripcion de la Categoria */}
                 <label htmlFor="description">Descripcion</label>
                 <textarea
                    id="description"
                    name="description"
                    placeholder="Ingrese una breve descripcion de la categoria"
                    className=""
                />
                <div>
                    {state.errors?.description?.map((err) => (
                        <p key={err} className="text-red-500">
                            {err}
                        </p>
                    ))}
                </div>

                {state.message && (
                    <p className="">{state.message}</p>
                )}

                <button type="submit" className="">
                    Crear Categoria
                </button>
            </form>
        </div>
    )

}