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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita la navegación al hacer clic en el enlace
    e.stopPropagation(); 

    addItem({
      productId: product.id,
      name: product.nombre,
      price: product.precio,
      quantity,
      stock: product.stock,
      image: product.imagen,
    });
    setShowToast(true);
    setQuantity(1);  // Reinicia la cantidad después de agregar al carrito
  };

  const handleQuantityChange = (e: React.MouseEvent, action: 'inc' | 'dec') => {
    e.preventDefault();
    e.stopPropagation();

    if(action === 'inc' && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    } else if (action === 'dec' && quantity > 1) {
      setQuantity(prev => prev -1);
    }
  };

  return (
    <>
     
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 flex flex-col h-full">
          <Link href={`/shop/${product.id}`} className="flex flex-col flex-grow">
          
            <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-lg">
              <Image
                src={product.imagen}
                alt={product.nombre}
                width={350}
                height={350}
                loading="lazy"
                className="object-contain max-h-full"
                onError={(e) => {
                  e.currentTarget.src = '/products/placeholder.png';
                }}
              />
            </div>

            <div className="p-4 flex-grow">
              <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{product.descripcion}</p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-bold text-gray-900">${product.precio.toFixed(2)}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </Link>
          
              {/*<div className="flex gap-2 mt-4">
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
              </div>*/}
            

            {/* Botón Agregar al carrito con control de cantidad */}
            <div className="p-4 pt-0 border-t border-gray-100 mt-auto">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border mt-3 border-gray-300 rounded-lg overflow-hidden">
                      <button onClick={(e) => handleQuantityChange(e, 'dec')}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold text-lg"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 font-semibold text-gray-800 min-w-[40px] text-center text-lg">
                        {quantity}
                      </span>
                      <button onClick={(e) => handleQuantityChange(e, 'inc')}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg mt-3 font-medium hover:bg-blue-700 transition-colors text-sm"
                    >
                      Agregar
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed">
                    Sin stock
                  </div> 
                )}
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
