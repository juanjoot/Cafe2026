'use client';

import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  // Función para manejar el clic y redirigir al formulario correspondiente
  const handleRedirect = (formId: string) => {
    document.getElementById(formId)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sección: Nuestros Productos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">NUESTROS PRODUCTOS</h3>
            <ul className="space-y-1">
              {[
                { id: 'cafesForm', label: 'Cafés' },
                { id: 'suscripcionesForm', label: 'Suscripciones' },
                { id: 'metodosForm', label: 'Métodos' },
                { id: 'kitsForm', label: 'Kits & Regalos' },
                { id: 'dulcesForm', label: 'Dulces' },
                { id: 'otrosForm', label: 'Otros' },
                { id: 'puntosForm', label: 'Puntos' },
              ].map(({ id, label }) => (
                <li
                  key={id}
                  className="hover:bg-black/5 cursor-pointer p-1 rounded-md transition text-sm"
                  onClick={() => handleRedirect(id)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Sección: Aprende Más */}
          <div>
            <h3 className="font-semibold text-lg mb-4">APRENDE MÁS</h3>
            <ul className="space-y-1">
              {[
                { id: 'comoHacemosForm', label: '¿Cómo lo hacemos?' },
                { id: 'hechoColombiaForm', label: 'Hecho en Colombia' },
                { id: 'cuppingScoreForm', label: 'Cupping Score' },
                { id: 'preguntasForm', label: 'Preguntas Frecuentes' },
                { id: 'prepararCafeForm', label: '¿Cómo preparar café?' },
                { id: 'blogEspanolForm', label: 'Blog en Español' },
                { id: 'blogInglesForm', label: 'English Blog' },
                { id: 'terminosForm', label: 'Términos y condiciones' },
              ].map(({ id, label }) => (
                <li
                  key={id}
                  className="hover:bg-black/5 cursor-pointer p-1 rounded-md transition text-sm"
                  onClick={() => handleRedirect(id)}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Sección: Síguenos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">SÍGUENOS</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="text-white hover:text-gray-400"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="text-white hover:text-gray-400"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="YouTube"
                className="text-white hover:text-gray-400"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Sección: Novedades */}
          <div>
            <h3 className="font-semibold text-lg mb-4">NOVEDADES</h3>
            
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>© 2025 Café De Especialidad - Colombia | Juanjo Digital</p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
