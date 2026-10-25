# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar el package.json del monorepo y la estructura del workspace
COPY package*.json ./
COPY apps/microservices/order-service/package*.json ./apps/microservices/order-service/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install

# Copiar el código fuente
COPY apps/microservices/order-service ./apps/microservices/order-service
COPY packages/shared ./packages/shared

# Construir el paquete compartido primero, luego el servicio
RUN npm run build --workspace=shared
RUN npm run build --workspace=order-service

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/microservices/order-service/package*.json ./
COPY --from=builder /app/apps/microservices/order-service/node_modules ./node_modules
COPY --from=builder /app/apps/microservices/order-service/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]

