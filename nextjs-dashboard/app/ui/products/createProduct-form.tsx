'use client';

import { useActionState, useState } from "react"
import { createProduct, type ProductState } from "@/app/lib/actions";
import type { Categories } from "@/app/lib/definitions";

type ProductFormProps = {
    categories: Categories[];
};


export default function ProductForm({categories}: ProductFormProps) {

    const initialState : ProductState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createProduct, initialState);

    const [caracteristicas, setCaracteristicas] = useState([{ key: '', value: ''}]);


    const addCaracteristicas = () => {
        setCaracteristicas([...caracteristicas, { key: '', value: ''}]);
    };


    const updateCaracteristica = (index: number, field: 'key' | 'value', value: string) => {
        const updateCaracteristica = [...caracteristicas];
        updateCaracteristica[index][field] = value;
        setCaracteristicas(updateCaracteristica);
    }


    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Nombre Producto*/}
                <div className="mb-4">
                    <label htmlFor="nombre" className="mb-2 block text-sm font-medium">
                        Nombre Producto
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input 
                                id="nombre"
                                name="nombre"
                                type="text" 
                                placeholder="Ingrese el nombre del producto aqui..."
                                className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm placeholder: text-gray-500"
                                aria-describedby="name-error"
                            />
                        </div>
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.nombre && state.errors.nombre.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                                ))}
                        </div>
                    </div>
                </div>
                {/* Descripcion Producto */}
                <div className="mb-4">
                    <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
                        Descripcion
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="">
                            <textarea 
                                name="descripcion" 
                                id="descripcion" 
                                rows={4} 
                                aria-describedby="description-error" 
                                placeholder= "Ingrese la descripción del producto aquí..."
                                className="border border-gray-200 p-2 w-full text-sm placeholder: text-gray-500"
                            />
                        </div>
                        <div id="description-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.descripcion && state.errors.descripcion.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="mb-4 grid grid-cols-1 md: grid-cols-2 gap-4">
                    {/* Precio Producto */}
                    <div>
                        <label htmlFor="precio" className="mb-2 block text-sm font-medium">
                            Precio
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input 
                                    id="precio"
                                    name="precio"
                                    type="number" 
                                    placeholder="Precio del producto..."
                                    className="w-full rounded-md border border-gray-200 text-sm placeholder: text-gray-500"
                                    aria-describedby="price-error"
                                />
                            </div>
                            <div id="price-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.precio && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {state.errors.precio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Stock Producto */}
                    <div>
                        <label htmlFor="stock" className="mb-2 block text-sm font-medium">
                            Stock
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <div className="relative">
                                <input 
                                    id="stock"
                                    name="stock"
                                    type="number" 
                                    placeholder= '45,...50,...10...'
                                    className="w-full rounded-md border border-gray-200 text-sm placeholder: text-gray-500"
                                    aria-describedby="stock-error"
                                />
                            </div>
                            <div id="stock-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.stock && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {state.errors.stock}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/*Imagen del Producto*/}
                <div className="mb-4">
                    <label htmlFor="image" className="mb-2 block text-sm font-medium">
                        Imagen del producto
                    </label>
                    <input 
                        id="image"
                        type="file"
                        name="imagen" 
                        accept="image/*"
                        className="border p-3 w-full text-sm gap-2"
                    />
                    <div className="image-error">
                        {state.errors?.imagen && (
                            <p className="text-red-500">
                                {state.errors.imagen}
                            </p>
                        )}
                    </div>
                </div>
                {/* Categoria */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                        Seleccione la/s categoria/s en las que se incluira el producto
                    </label>
                    <div className="">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer border p-2">
                                <input 
                                    type="checkbox" 
                                    name="categoryIds"
                                    value={category.id}
                                    className="rounded border-gray-300"
                                />
                                <span>{category.name}</span>
                            </label>
                        ))}
                    </div>
                    {state.errors?.categoryIds?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-500">
                            {error}
                        </p>
                    ))}
                </div>
                {/* Caracteristicas Producto */}
                <div className="mb-4">
                    <div className="relative">
                        <label htmlFor="caracteristica" className="mb-2 block text-sm font-medium">
                            Detalle las Caracteristicas del producto
                        </label>
                        {caracteristicas.map((caracter, idx) => (
                            <div key={idx}>
                                <div  className="flex gap-2 mb-2">
                                    <input
                                        id="caracteristica"
                                        placeholder="Nombre (Ej: Color)"
                                        value={caracter.key}
                                        onChange={(e) => updateCaracteristica(idx, "key", e.target.value)}
                                        className="border p-2 w-full text-sm border-gray-200 rounded-md placeholder: text-gray-500"
                                    />
                                    <input
                                        id="caracteristica"
                                        placeholder="Valor (Ej: Rojo)"
                                        value={caracter.value}
                                        onChange={(e) => updateCaracteristica(idx, "value", e.target.value)}
                                        className="border p-2 w-full text-sm border-gray-200 rounded-md placeholder: text-gray-500"
                                    />
                                </div>
                            </div>
                            
                        ))}

                        <button type="button" onClick={addCaracteristicas} className="bg-gray-200 px-2 py-1 rounded-md mt-2 text-sm hover:bg-gray-300">
                            Agregar Caracteristica
                        </button>

                        <input 
                            type="hidden"
                            name="caracteristicas"
                            value={JSON.stringify(caracteristicas.reduce((obj, item) => {
                                    if(item.key.trim()) obj[item.key] = item.value;
                                    return obj;
                                    }, {} as Record<string, string>))}
                        />
                    </div>
                    {/* Error del Server */}
                    <div className="mt-5 server-error">
                        {state.message && (
                            <p className="text-red-600">
                                {state.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button type="submit" className=" mt-2 bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-400">
                Crear Producto
            </button>
        </form>
    )
}