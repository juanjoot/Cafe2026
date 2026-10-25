# API Gateway - Coffee E-Commerce ☕

Este API Gateway actúa como punto de entrada único para los microservicios del ecosistema de venta de café de especialidad.

## 📌 Funcionalidades

- 🔐 Autenticación con JWT (verificación de token)
- 🛒 Proxy hacia el `product-service` para operaciones CRUD
- ✅ Validación de datos mediante DTOs
- ⚙️ Interceptor global para estandarizar respuestas
- 📦 Preparado para escalar con más rutas y servicios

---

## 📁 Estructura del Proyecto

```
api-gateway/
├── auth/
│   ├── auth.guard.ts
│   └── auth.module.ts
├── products/
│   ├── dto/
│   │   ├── create-product.dto.ts
│   │   ├── query-product.dto.ts
│   │   └── update-product.dto.ts
│   ├── products.controller.ts
│   └── products.module.ts
├── response.interceptor.ts
├── app.module.ts
├── main.ts
├── package.json
├── Dockerfile
└── .env (no incluido, ver ejemplo abajo)
```

---

## 🧪 Endpoints Disponibles

Todos los endpoints requieren token JWT válido (en `Authorization: Bearer <token>`)

### Productos
- `GET /products` - Listado con filtros
- `POST /products` - Crear nuevo producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` con al menos:

```
JWT_SECRET=miclaveultrasecreta
```

---

## ▶️ Ejecución

```bash
npm install
npm run start
```

---

## 🐳 Docker

```bash
docker build -t api-gateway .
docker run -p 3000:3000 --env-file .env api-gateway
```

---

## 📚 Requiere

- Node.js 18+
- NestJS
- @nestjs/jwt
- @nestjs/axios
