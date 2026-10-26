// ✅ ProductDetailPage final recomendado
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/slices/cartSlice';

type Product = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number | string;
  imagenUrl?: string;
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    api.get<{ data: Product }>(`/products/${id}`)
      .then((res) => {
        console.log('Respuesta del producto:', res.data);
        setProduct(res.data.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError('Producto no encontrado');
        } else {
          setError('No se pudo cargar el producto');
        }
      });
  }, [id]);

  if (error) return (
    <div className="p-6 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <Link href="/catalog" className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
        Volver al catálogo
      </Link>
    </div>
  );

  if (!product) return (
    <div className="p-6">
      <div className="animate-pulse bg-gray-200 h-64 w-full mb-4 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-8 w-1/2 mb-2 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-full mb-2 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-4 w-1/3 rounded"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {product.imagenUrl && (
        <img
          src={product.imagenUrl}
          alt={product.nombre}
          className="w-full max-h-[400px] object-cover rounded-lg"
        />
      )}
      <h1 className="text-2xl font-bold mt-6">{product.nombre}</h1>
      <p className="text-gray-600 mt-2">{product.descripcion}</p>
      <p className="text-xl text-coffee font-semibold mt-4">
        {product.precio
          ? `$${Number(product.precio).toLocaleString('es-CO')}`
          : 'Precio no disponible'}
      </p>

      <button
        onClick={() => dispatch(addItem({
          id: product.id,
          name: product.nombre,
          price: Number(product.precio),
          quantity: 1,
        }))}
        className="mt-6 px-6 py-2 bg-coffee text-white rounded hover:opacity-90"
      >
        Agregar al carrito
      </button>
    </div>
  );
}
