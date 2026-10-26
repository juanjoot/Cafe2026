'use client';

import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  const sections = [
    {
      href: '/cafes',
      title: 'CAFÉS ESPECIALES',
      description: 'Las mejores marcas de café colombiano están aquí.',
    },
    {
      href: '/suscripciones',
      title: 'SUSCRIPCIONES',
      description: 'Preocúpate por disfrutar, nosotros nos encargamos del resto.',
    },
    {
      href: '/preparacion',
      title: '¿CÓMO SE PREPARA?',
      description: 'Recetas con amor para que disfrutes del mejor café.',
    },
    {
      href: '/ayuda',
      title: 'CENTRO DE AYUDA',
      description: 'Estamos aquí para llevarte el mejor café del mundo.',
    },
  ];

  return (
    <div
      className="flex flex-col md:flex-row text-white h-96 relative"
      style={{
        backgroundImage: 'url(/images/cafes/coffeeshop1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {sections.map(({ href, title, description }, index) => (
        <Link
          key={href}
          href={href}
          className="flex-1 p-4 cursor-pointer transition-all relative group"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRight: index < sections.length - 1 ? '1px solid rgba(255, 255, 255, 0.5)' : 'none',
          }}
        >
          <div className="absolute inset-0 transition-all duration-500 group-hover:bg-black group-hover:bg-opacity-70" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 group-hover:bottom-4 transition-all">
            <h2 className="text-lg font-bold text-center text-white">{title}</h2>
            <p className="mt-1 text-sm text-center text-gray-300">{description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Header;
