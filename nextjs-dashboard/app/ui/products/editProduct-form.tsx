'use client';

import { useActionState, useState } from "react"
import { updateProduct, type ProductState } from "@/app/lib/actions";
import Image from "next/image";
import type { Categories } from "@/app/lib/definitions";


export default function EditProductForm({product, categories} : {product: any; categories: Categories[]}) {

    const initialState : ProductState = { message: null, errors: {} };
    const [state, formAction] = useActionState(updateProduct.bind(null, product.id), initialState);

    //const initialCaracteristicas = Object.entries(product.caracteristicas || {}).map(([key, value]) => ({key, value: String(value)}));

    // 1. INICIALIZACION DE CATEGORIAS (Solo para saber cuales estan marcadas)
    const selectCategoryIds = product.category_ids || [];

    // 2. INICIALIZACION DE CARACTERISTICAS
    /* Se mapea sobre 'product.caracteristicas', NO sobre category_ids.
     Convertimos el formato {label, value} de la BD al formato {key, value} del form.*/
    const [caracteristicas, setCaracteristicas] = useState<{ key: string; value: string }[]>(
        (product.caracteristicas ?? []).map((c: any) => ({
                key: c.label, // se mapea 'label' a 'key
                value: c.value,
            }))
        );


    const addCaracteristicas = () => {
        setCaracteristicas([...caracteristicas, { key: '', value: '' }]);
    };

    const updateCaracteristica = (index: number, field: 'key' | 'value', value: string) => {
        const updateCaracteristica = [...caracteristicas];
        updateCaracteristica[index][field] = value;
        setCaracteristicas(updateCaracteristica);
    };


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
                                /*placeholder="Ingrese el nombre del producto aqui..."*/
                                defaultValue={product.nombre}
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
                                //placeholder= "Ingrese la descripción del producto aquí..."
                                defaultValue={product.descripcion}
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
                                    //placeholder="Precio del producto..."
                                    defaultValue={product.precio}
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
                                    //placeholder="Ingrese la cantidad en stock..."
                                    defaultValue={product.stock}
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
                {/* Categorias Producto */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium">
                        Categorias (Seleccione las pertenecientes al producto)
                    </label>
                    <div className="grid grid-cols-2">
                        {categories.map((category) => (
                            <label key={category.id} className="">
                                <input
                                    type="checkbox"
                                    name="categoryIds"
                                    value={category.id}
                                    // Comprueba si el ID esta en la lista de Ids del producto
                                    defaultChecked={selectCategoryIds.includes(category.id)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                    {state.errors?.categoryIds?.map((error) => (
                        <p key={error} className="mt-1 text-sm text-red-500">
                            {error}
                        </p>
                    ))}
                </div>
                {/*Imagen del Producto*/}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium">
                        Imagen actual del producto
                    </label>
                    {product.imagen && (<Image src={product.imagen} alt={product.nombre} width={150} height={150}/>)}

                    <label htmlFor="imagen" className="text-sm font-medium">Nueva Imagen (Opcional)</label>
                    <input 
                        id="imagen"
                        type="file"
                        name="imagen" 
                        accept="image/*"
                        className="border p-3 w-full text-sm gap-2"
                    />
                    
                </div>
                {/* Caracteristicas Producto */}
                <div className="mb-4">
                    <div className="relative">
                        <label htmlFor="caracteristica" className="mb-2 block text-sm font-medium">
                            Detalle las Caracteristicas del producto (Ej: Color, Marca, Peso)
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
                Guardar Cambios
            </button>
        </form>
    )
}