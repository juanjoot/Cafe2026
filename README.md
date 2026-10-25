# Cafe Ecommerce - Arquitectura

Este proyecto está diseñado como un monorepo de ecommerce con una arquitectura basada en frontend, API Gateway y microservicios.

## 1) Frontend

El frontend es la capa de presentación y la parte con la que interactúa el usuario.

Su responsabilidad es:
- mostrar el catálogo de productos
- autenticar usuarios
- gestionar carrito de compras
- procesar checkout
- consultar pedidos y pagos
- consumir la API del sistema

En términos simples, el frontend es la interfaz visual de la aplicación.

## 2) API Gateway

El API Gateway es la entrada central del sistema.

Su función principal es:
- recibir las peticiones del frontend
- enrutar cada solicitud al microservicio correcto
- centralizar seguridad y autenticación
- ocultar la estructura interna de los servicios
- reducir la complejidad del cliente

Flujo típico:

```text
Usuario
  ↓
Frontend
  ↓
API Gateway
  ├── /auth       → Auth Service
  ├── /products   → Product Service
  ├── /orders     → Order Service
  ├── /payments   → Payment Service
  ├── /notify     → Notification Service
  └── /recommend  → Recommendation Service
```

## 3) Microservicios

Cada microservicio está pensado para una responsabilidad específica.

### Auth Service
- registro de usuarios
- login
- JWT
- autenticación
- gestión de clientes

### Product Service
- catálogo de productos
- categorías
- inventario
- búsquedas y filtros

### Order Service
- creación de pedidos
- estado del pedido
- lógica de ordenes

### Payment Service
- integración con Stripe
- procesamiento de pagos
- confirmación de compra

### Notification Service
- envío de correos
- notificaciones por eventos
- alertas de pedidos y pagos

### Recommendation Service
- sugerencias de productos
- recomendaciones personalizadas

## 4) Librería compartida

La carpeta shared se usa para definir contratos comunes entre servicios.

Incluye:
- DTOs
- utilidades compartidas
- definiciones de eventos
- módulos reutilizables

Esto evita duplicación y mantiene consistencia entre servicios.

## 5) Infraestructura

El proyecto usa infraestructura externa para soportar la aplicación:

- PostgreSQL: almacenamiento estructurado para productos y pedidos
- MongoDB: almacenamiento para usuarios y autenticación
- Redis: caché y gestión de sesiones o datos rápidos
- RabbitMQ: mensajería entre servicios
- Docker Compose: orquestación del entorno local
- Kubernetes: preparación para despliegue a nivel producción

## 6) Comunicación entre servicios

Hay dos tipos de comunicación principales:

### a) Comunicación sincrónica
Se realiza mediante HTTP desde el API Gateway hacia los microservicios.

Ejemplo:
- frontend pide productos
- gateway llama a product-service
- product-service responde con datos

### b) Comunicación asincrónica
Se realiza con RabbitMQ.

Ejemplo:
- order-service publica un evento de pedido creado
- payment-service y notification-service reaccionan a ese evento
- cada servicio realiza su tarea sin bloquear la operación principal

## 7) Diagrama general

```text
Usuario
  │
  ▼
Frontend
  │
  │  HTTP
  ▼
API Gateway
  │
  ├── Auth Service ─────── MongoDB
  │
  ├── Product Service ───── PostgreSQL
  │
  ├── Order Service ─────── PostgreSQL
  │          │
  │          └── RabbitMQ ──────┐
  │                                │
  ├── Payment Service ───────────┼──► Notification Service
  │                                │
  │                                └── Recommendation Service
  │
  ├── Notification Service
  │
  └── Recommendation Service

Redis
```

## 8) Resumen

La arquitectura del proyecto está pensada para un ecommerce moderno con:
- frontend separado
- gateway centralizado
- microservicios con dominio claro
- comunicación síncrona y asincrónica
- infraestructura desacoplada con Docker y servicios externos

Esto permite:
- escalabilidad
- mantenimiento más simple por dominio
- aislamiento de responsabilidades
- mejor evolución del sistema a medida que crece

## 9) Cómo ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker compose build
docker compose up -d
docker compose logs -f
```

Para detener todo:

```bash
docker compose down -v
```

## 10) Verificación

Se validó la compilación del monorepo y la configuración de Docker con comandos reales:

```bash
npm run build --workspaces --if-present
docker compose config
```

Estos comandos se ejecutaron correctamente, validando que el proyecto quedó consistente para trabajar con Docker.

---

Este README resume la arquitectura del proyecto, la responsabilidad de frontend, API Gateway y microservicios, y la forma de manejarlo con Docker.

