'use client';

import { deleteProduct } from "@/app/lib/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function DeleteProductButton({id}: {id: string}) {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleDelete = async () => {
        const confirmed = confirm('¿Seguro que desea eliminar este producto?');
        if(!confirmed) return;

        setIsLoading(true);

        try {
            await deleteProduct(id);
            alert('Producto borrado del stock');

            // Redireccionar a la pagina de productos despues de la eliminacion
            router.push('/dashboard/products');
            
        } catch (error) {
            alert('Error al eliminar el producto. Intente nuevamente mas tarde')
        }finally {
            setIsLoading(false);
        }
    };

  return(
    <button onClick={handleDelete} className="bg-red-600 px-4 py-2 text-sm rounded-md text-white hover:bg-red-500" disabled={isLoading}>
        {isLoading? 'Eliminando...' : 'Eliminar Producto'}
    </button>
  );
}