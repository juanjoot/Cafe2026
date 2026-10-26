'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import ProductCard, { Product } from '@/components/cards/ProductCard';

type Category = {
  id: string;
  nombre: string;
};

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [categoria, setCategoria] = useState('');

  const fetchProducts = () => {
    const params = new URLSearchParams({ page: page.toString() });
    if (q) params.append('q', q);
    if (precioMin) params.append('precioMin', precioMin);
    if (precioMax) params.append('precioMax', precioMax);
    if (categoria) params.append('categoria', categoria);

    api.get<{ data: Product[]; total: number; page: number; limit: number; pages: number }>(`/products?${params.toString()}`)
      .then((res) => {
        const lista = res.data.data;
        setProducts(Array.isArray(lista) ? lista : []);
        setPages(res.data.pages ?? 1);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudo obtener la lista de productos');
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    api.get<{ data: Category[] }>('/categories')
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('No se pudieron cargar las categorías'));
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, pages));

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Catálogo</h1>

      <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={precioMin}
          onChange={(e) => setPrecioMin(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Todas las categorías</option>
          {Array.isArray(categories) && categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-coffee text-white rounded">Filtrar</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(products) && products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">Página {page} de {pages}</span>
        <button
          onClick={handleNext}
          disabled={page === pages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
