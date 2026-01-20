'use client';

import Link from 'next/link';
import { products } from '@/app/lib/placeholder-data';
import { useCart } from '@/app/components/cart/CartProvider';
import { Toast } from '@/app/components/ui/Toast';
import { useState } from 'react';
import { use } from 'react';

export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              StockPablo
            </Link>
            <div className="flex gap-4 items-center">
              <Link href="/cart" className="text-blue-600 hover:text-blue-800 font-medium">
                🛒 Ver Carrito
              </Link>
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Ingresar
              </Link>
            </div>
          </div>
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Volver a productos
          </Link>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagen */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg aspect-square">
              <img
                src={product.imagen}
                alt={product.nombre}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/products/placeholder.png';
                }}
              />
            </div>

            {/* Información */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.nombre}
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  {product.descripcion}
                </p>

                {/* Precio y Stock */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Precio</p>
                      <p className="text-3xl font-bold text-blue-600">
                        ${product.precio}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Stock disponible</p>
                      <p className={`text-3xl font-bold ${
                        product.stock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Características */}
                {product.caracteristicas && product.caracteristicas.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Características
                    </h2>
                    <div className="space-y-3">
                      {product.caracteristicas.map((carac, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b">
                          <span className="text-gray-600 font-medium">
                            {carac.label}
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {carac.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Agregar */}
              <div className="flex flex-col gap-4 pt-6">
                {/* Selector de Cantidad */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Selecciona la cantidad:
                  </label>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="w-20 h-10 text-center text-lg font-semibold border-2 border-blue-600 rounded-lg px-2 py-1"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-600 ml-auto">
                      (Máximo: {product.stock})
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    Subtotal: ${(product.precio * quantity).toFixed(2)}
                  </p>
                </div>

                {/* Input para notas */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Aclaraciones o notas (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Color especifico, urgente, etc."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Máximo 500 caracteres
                  </p>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        name: product.nombre,
                        price: product.precio * 100,
                        quantity: quantity,
                        stock: product.stock,
                        image: product.imagen,
                        notes: notes || undefined,
                      });
                      setShowToast(true);
                      setQuantity(1);
                      setNotes('');
                    }}
                    disabled={product.stock === 0}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    🛒 Agregar al Carrito
                  </button>
                  <Link
                    href="/cart"
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Ver Carrito
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={`✓ ${quantity} producto(s) agregado(s) al carrito`}
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
