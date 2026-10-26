'use client';

import { useState } from 'react';
import { getRecommendations } from '@/services/sommelierService';

export default function AssistantForm() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!preferences.trim()) {
      alert('Por favor describe tus preferencias.');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const data = await getRecommendations({ query: preferences });
      setResult(data.recommendation || JSON.stringify(data));
    } catch (error) {
      console.error(error);
      setResult('Error al obtener recomendaciones.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-w-md">
      <label htmlFor="preferences" className="block mb-2 font-medium">
        Describe cómo te gusta el café:
      </label>
      <input
        id="preferences"
        type="text"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        placeholder="Ej: suave, afrutado, baja acidez..."
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Obtener recomendación'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Tu recomendación:</h3>
          <p>{result}</p>
        </div>
      )}
    </form>
  );
}
