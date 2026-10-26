import React from "react";
import Link from "next/link";

export type Product = {
  id: string;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagenUrl?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/home/product/${product.id}`} passHref>
      <div className="border rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer">
        {product.imagenUrl && (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="w-full h-48 object-cover rounded"
          />
        )}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-gray-800">{product.nombre}</h3>
          <p className="text-gray-600 mb-2">
            {product.descripcion ?? "Café de especialidad seleccionado"}
          </p>
          <p className="text-coffee font-semibold text-xl">
            ${Number(product.precio).toLocaleString("es-CO")}
          </p>
        </div>
      </div>
    </Link>
  );
}


