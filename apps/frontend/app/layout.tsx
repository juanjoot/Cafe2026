// ./app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import '../styles/globals.css';
import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer';
import { Providers } from './Providers';

export const metadata = {
  title: 'Tu App',
  description: 'Tu descripción',
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900">
        
        <Providers>
          <Header />        
          <main className="p-6">{children}</main>
          <Footer />
        </Providers>
        
      </body>
    </html>
  );
}
