# Frontend de Cafe2026

Aplicacion web de comercio de cafe construida con Next.js App Router. El frontend presenta el catalogo y el detalle de productos, administra el carrito y el checkout en el estado del cliente y ofrece una pagina de asistente virtual.

## Requisitos y versiones

- Node.js 20 o superior y npm 9 o superior.
- La version de esta aplicacion es `0.1.0` (`apps/frontend/package.json`); es distinta de la version `1.0.0` del monorepo.
- Next.js `15.3.2`.
- React y React DOM `^19.0.0`.
- TypeScript `^5`.
- Tailwind CSS y `@tailwindcss/postcss` `^4`.
- Redux Toolkit `^2.8.2` y React Redux `^9.2.0`.
- Axios `^1.9.0`.

El archivo `package-lock.json` fija las versiones exactas instaladas. El frontend tiene su propio `package.json` y no forma parte de los workspaces declarados en el `package.json` de la raiz; por eso, ejecuta los comandos de npm desde `apps/frontend` o usa `npm --prefix apps/frontend`.

## Desarrollo local

1. Instala Node.js y npm con las versiones indicadas.
2. Desde la raiz del repositorio, entra al frontend e instala las dependencias fijadas por el lockfile:

   ```bash
   cd apps/frontend
   npm ci
   ```

3. Configura la URL publica del API Gateway. Crea `apps/frontend/.env.local` con la URL accesible desde el navegador:

   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   Cambia el puerto/host si tu API Gateway escucha en otra direccion. El `docker-compose.yml` de la raiz publica el gateway en `http://localhost:3000`; en ese caso, usa esa URL y arranca el frontend con `npm run dev -- --port 3002` para evitar el conflicto de puertos. La variable tiene prefijo `NEXT_PUBLIC_`, por lo que su valor se incorpora al bundle del navegador; define la URL correcta antes de iniciar el servidor o compilar.
4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000). Para usar otro puerto, ejecuta `npm run dev -- --port 3002`.

## Validacion y produccion local

Desde `apps/frontend`:

```bash
npm run lint
npm run build
npm run start
```

`npm run start` sirve la compilacion de produccion y requiere que `npm run build` haya terminado correctamente. De forma predeterminada, Next.js escucha en el puerto 3000; se puede cambiar con `npm run start -- --port 3002`.

## Rutas principales

| Ruta | Funcion |
| --- | --- |
| `/` | Pagina de inicio |
| `/cafes` | Cafes especiales |
| `/home/catalog` | Catalogo, filtros y categorias |
| `/home/product/[id]` | Detalle de producto |
| `/cart` | Carrito de compras |
| `/checkout` | Formulario de checkout |
| `/assistant` | Asistente de recomendaciones |

El estado del carrito se gestiona con Redux Toolkit y se provee a la aplicacion desde `app/Providers.tsx`. Las solicitudes del catalogo y del detalle usan Axios y `NEXT_PUBLIC_API_URL`. El asistente actualmente genera una recomendacion simulada; no llama a un servicio de IA real.

## Construir y ejecutar con Docker

Construye la imagen desde la raiz del repositorio. Proporciona el endpoint del API Gateway como argumento de build porque Next.js incorpora `NEXT_PUBLIC_API_URL` en el bundle:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.ejemplo.com \
  -t cafe-frontend:0.1.0 \
  -f apps/frontend/Dockerfile \
  apps/frontend
```

Inicia el contenedor:

```bash
docker run --rm -p 3000:3000 --name cafe-frontend cafe-frontend:0.1.0
```

La aplicacion queda disponible en [http://localhost:3000](http://localhost:3000). Para publicar, usa la URL real del API Gateway en el argumento de build, publica la imagen en el registro de contenedores elegido y despliega el contenedor exponiendo el puerto 3000. No pongas secretos en `NEXT_PUBLIC_*`: esos valores son visibles para los usuarios del navegador.

El `docker-compose.yml` de la raiz levanta servicios del backend, pero no incluye este frontend; estos pasos de `docker build` y `docker run` despliegan el cliente por separado.

## Scripts disponibles

| Comando | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automatica |
| `npm run lint` | Analisis estatico con las reglas de Next.js |
| `npm run build` | Compilacion optimizada para produccion |
| `npm run start` | Servidor de produccion para la compilacion |
