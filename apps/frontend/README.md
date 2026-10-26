This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 📖 Tinticos Frontend Boilerplate - README

## Estructura incluida

- `features/` → Lógica de dominio (carrito, sommelier, auth, productos, pedidos)
- `hooks/` → Hooks personalizados (useCart, useSommelier)
- `store/` → Configuración Redux Toolkit con slices
- `services/` → Llamadas API separadas por entidad (productos, sommelier AI)
- `tests/` → Carpeta lista para pruebas unitarias

## Cómo usar

1️⃣ Descomprime el ZIP en tu proyecto Next.js.

2️⃣ Instala dependencias recomendadas:
```bash
npm install @reduxjs/toolkit react-redux axios
```

3️⃣ Configura el `store` en `_app.tsx` o `layout.tsx`:
```tsx
import { Provider } from 'react-redux';
import { store } from '../store';

<Provider store={store}>
  {/* tu layout */}
</Provider>
```

4️⃣ Expande cada `feature` y `service` según tu backend.

5️⃣ Agrega lógica real en los hooks (`useCart`, `useSommelier`).

6️⃣ Organiza tus páginas en `app/` usando la estructura recomendada.

## Siguiente nivel

✅ Integra el sommelier virtual con IA.  
✅ Conecta los endpoints de productos y pedidos reales.  
✅ Agrega pruebas en `tests/` con Jest y Testing Library.  

🚀 ¡Tinticos va tomando forma! ☕✨