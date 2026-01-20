'use client';

import Link from 'next/link';
import { products } from '@/app/lib/placeholder-data';
import { useCart } from '@/app/components/cart/CartProvider';
import { Toast } from '@/app/components/ui/Toast';
import { useState, useMemo } from 'react';
import Image from 'next/image';

// Extraer categorías únicas
function getCategories() {
  const categoriesSet = new Set<string>();
  products.forEach(product => {
    product.caracteristicas.forEach(carac => {
      if (carac.label === 'Categoria') {
        categoriesSet.add(carac.value);
      }
    });
  });
  return Array.from(categoriesSet).sort();
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const categories = getCategories();

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    
    return products.filter(product =>
      product.caracteristicas.some(
        carac => carac.label === 'Categoria' && carac.value === selectedCategory
      )
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
          <p className="text-gray-600">
            Explora nuestro catálogo de productos. Agrega los que desees a tu carrito y procede al checkout.
          </p>
        </div>

        {/* Filtro de Categorías */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Filtrar por Categoría</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Todas las Categorías ({products.length})
            </button>
            {categories.map(category => {
              const count = products.filter(p =>
                p.caracteristicas.some(c => c.label === 'Categoria' && c.value === category)
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Productos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay productos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.nombre,
      price: product.precio * 100,
      quantity: quantity,
      stock: product.stock,
      image: product.imagen,
    });
    setShowToast(true);
    setQuantity(1);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
        {/* Imagen */}
        <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
          <Image
            src={product.imagen}
            alt={product.nombre}
            width={400}
            height={400}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/products/placeholder.png';
            }}
          />
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.nombre}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.descripcion}
          </p>

          {/* Precio y Stock */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
              ${product.precio}
            </span>
            <span className={`text-sm font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              Stock: {product.stock}
            </span>
          </div>

          {/* Selector de Cantidad */}
          {/*product.stock > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad:
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          )*/}

          {/* Botones */}
          <div className="flex gap-2">
            <Link
              href={`/shop/${product.id}`}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded font-medium text-center hover:bg-gray-300 transition"
            >
              Ver Detalle
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
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
