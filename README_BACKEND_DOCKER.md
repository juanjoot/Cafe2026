# Backend - Levantar servicios con Docker y MongoDB

Este documento explica cómo levantar el backend del proyecto paso a paso usando Docker Compose, incluyendo la creación de la base de datos de MongoDB.

## 1) Requisitos previos

Necesitas tener instalado:

- Docker
- Docker Compose
- Node.js 18 o 20
- npm

## 2) Entrar a la carpeta del proyecto

```bash
cd /workspaces/Cafe2026
```

## 3) Levantar la infraestructura base

Primero se levantan las bases de datos y servicios auxiliares:

```bash
docker compose up -d auth-db postgres redis rabbitmq
```

Esto inicia:
- MongoDB: puerto 27017
- PostgreSQL: puerto 5432
- Redis: puerto 6379
- RabbitMQ: puerto 5672
- RabbitMQ UI: puerto 15672

Para verificar:

```bash
docker compose ps
```

## 4) Levantar los servicios del backend

Ahora levantamos los microservicios:

```bash
docker compose up -d auth-service product-service order-service payment-service notification-service recommendation-service api-gateway
```

Si quieres ver los logs:

```bash
docker compose logs -f
```

O solo un servicio:

```bash
docker compose logs -f auth-service
```

## 5) Verificar estado

```bash
docker compose ps
```

Debe verse que los contenedores de backend están activos y en estado `Up`.

## 6) Puertos importantes

- API Gateway: http://localhost:3000
- RabbitMQ UI: http://localhost:15672
- MongoDB: localhost:27017
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 7) Crear la base de datos de MongoDB

La base de datos del servicio de autenticación se llama `auth`.

### Opción 1: entrar al contenedor de Mongo

```bash
docker exec -it cafe2026-auth-db-1 mongosh
```

> Si el nombre del contenedor es diferente, revisa con:
>
> ```bash
> docker ps
> ```

### Opción 2: crear la base de datos

Dentro del shell de Mongo:

```bash
use auth
```

Eso crea la base de datos `auth` si no existe.

### Opción 3: crear colección

```bash
db.createCollection("users")
```

### Opción 4: verificar

```bash
show dbs
show collections
```

## 8) Insertar un usuario de prueba

```bash
db.users.insertOne({
  email: "admin@test.com",
  password: "123456",
  role: "admin"
})
```

## 9) Conexión configurada por el proyecto

La conexión configurada para el servicio de auth es:

```env
DATABASE_URL=mongodb://auth-db:27017/auth
```

Esto se usa dentro de Docker Compose para que cada servicio se conecte por el nombre del contenedor.

Si quisieras conectarte desde tu máquina local, usarías:

```env
DATABASE_URL=mongodb://localhost:27017/auth
```

## 10) Reiniciar desde cero

Si quieres limpiar todo y volver a levantar:

```bash
docker compose down -v
```

Luego:

```bash
docker compose up -d
```

O reconstruir todo desde cero:

```bash
docker compose down -v
docker compose build --no-cache
docker compose up -d
```

## 11) Orden recomendado para levantar servicios

Para evitar errores de dependencia, el flujo recomendado es:

```bash
docker compose up -d auth-db postgres redis rabbitmq
docker compose up -d auth-service
docker compose up -d product-service
docker compose up -d order-service
docker compose up -d payment-service
docker compose up -d notification-service
docker compose up -d recommendation-service
docker compose up -d api-gateway
```

## 12) Validación del proyecto

Se validó la configuración con los siguientes comandos:

```bash
npm run build --workspaces --if-present
docker compose config
```

Ambos comandos ejecutaron correctamente, lo que confirma que la base del monorepo y la composición de Docker están consistentes.

## 13) Resumen

El backend se levanta con Docker Compose desde la raíz del proyecto y la base de datos de MongoDB se crea con `use auth` dentro del contenedor de Mongo. El servicio de autenticación usa esa base de datos para manejar usuarios y login.
