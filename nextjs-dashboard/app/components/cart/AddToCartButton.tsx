'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "./CartProvider";
import { Toast } from '../ui/Toast';

type Props = {
    product: any;
    quantity?: number;
    selectedOptions?: Record<string, string>;
};

export default function AddToCartButton({ product, quantity = 1, selectedOptions }: Props) {
    const { addItem } = useCart();
    const router = useRouter();
    const [showToast, setShowToast] = useState(false);

    const handleClick = () => {
        addItem({
            productId: product.id,
            name: product.nombre,
            price: product.precio,
            quantity,
            stock: product.stock,
            image: product.imagen,
            selectedOptions,
        });
        setShowToast(true);

        setTimeout(() => {
            router.push('/cart');
        }, 1000);
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
            >
                Agregar al carrito
            </button>
            {showToast && (
                <Toast
                    message="✓ Producto añadido al carrito"
                    type="success"
                    duration={1500}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
}
