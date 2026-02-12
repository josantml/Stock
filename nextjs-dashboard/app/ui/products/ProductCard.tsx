'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/components/cart/CartProvider';
import { Toast } from '@/app/components/ui/Toast';
import { useState } from 'react';

export default function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.nombre,
      price: product.precio * 100,
      quantity,
      stock: product.stock,
      image: product.imagen,
    });
    setShowToast(true);
    setQuantity(1);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <Image
            src={product.imagen}
            alt={product.nombre}
            width={400}
            height={400}
            loading="lazy"
            className="object-contain"
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.png';
            }}
          />
        </div>

        <div className="p-4">
          <h3 className="font-semibold">{product.nombre}</h3>
          <p className="text-sm text-gray-600">{product.descripcion}</p>

          <div className="flex justify-between mt-3">
            <span className="font-bold">${product.precio}</span>
            <span className="text-sm">
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <Link
              href={`/shop/${product.id}`}
              className="flex-1 bg-gray-200 py-2 rounded text-center"
            >
              Ver Detalle
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
            >
              Agregar ({quantity})
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="✓ Producto agregado al carrito"
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
