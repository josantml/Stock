/*import { Product } from "@/app/lib/definitions";
import Image from "next/image";



export default function ProductDetail({product}:{product: Product}) {


  if (!product) {
    return <h1 className="p-6 text-red-500">Producto no encontrado</h1>;
  }


  return (
    <div className="flex p-6">
      
        <div className="mt-6">
            <Image
              src={product.imagen}
              width={200}
              height={200}
              alt={product.nombre}
              className="rounded-md object-contain"
            />
        </div>

        <div className="">
            <h1 className="text-3xl font-bold">{product.nombre}</h1>
            <p className="mt-4">{product.descripcion}</p>

            <p className="text-xl font-semibold mt-6">Precio: ${product.precio}</p>
            <p className="text-gray-500">Stock: {product.stock}</p>
        </div>
      
    </div>
  );
}*/




'use client';

import Image from "next/image";
import { useState } from "react";
import { ProductWithCategories } from "@/app/lib/definitions";
import AddToCartButton from "../../components/cart/AddToCartButton";
import QuantitySelector from "../../components/cart/QuantitySelector";
import ProductOptions from "../../components/cart/ProductOptions";

interface ProductDetailProps {
    product: ProductWithCategories;
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const [isZoomed, setIsZoomed] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    const handleMouseMove = (e: any) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();

        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;

        setPosition({ x, y });
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row gap-10">
                <div
                    className="relative w-[400px] h-[400px] border rounded-md overflow-hidden mx-auto"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                >
                    <Image
                        src={product.imagen}
                        alt={product.nombre}
                        fill
                        className={`object-contain transition-all duration-200 ${isZoomed ? "scale-150" : "scale-100"}`}
                        style={{ transformOrigin: `${position.x}% ${position.y}%` }}
                    />
                </div>

                <div className="flex flex-col justify-start">
                    <h1 className="text-3xl font-bold">{product.nombre}</h1>

                    {product.categories?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {product.categories.map((cat) => (
                                <span key={cat.id} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md">
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="mt-4 text-gray-700">{product.descripcion}</p>

                    <p className="text-2xl font-semibold mt-6">Precio: ${product.precio}</p>

                    <p className={`mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>Stock Disponible: {product.stock}</p>

                    <div className="mt-4 flex items-center gap-4">
                        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 999} />
                        <ProductOptions product={product} value={selectedOptions} onChange={setSelectedOptions} />
                    </div>

                    <div className="mt-4">
                        <AddToCartButton product={product} quantity={quantity} selectedOptions={selectedOptions} />
                    </div>
                </div>
            </div>

            {product.caracteristicas && product.caracteristicas.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Caracteristicas</h2>

                    <table className="w-full border border-gray-300 rounded-md">
                        <tbody>
                            {product.caracteristicas.map((c, index) => (
                                <tr key={index} className="border-t border-gray-300 bg-white even:bg-gray-100">
                                    <td className="p-3 font-medium">{c.label}</td>
                                    <td className="p-3 text-gray-700">{c.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
}