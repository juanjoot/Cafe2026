# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar el package.json del monorepo y la estructura del workspace
COPY package*.json ./
COPY apps/microservices/product-service/package*.json ./apps/microservices/product-service/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install
RUN mkdir -p /app/apps/microservices/product-service/node_modules

# Copiar el código fuente
COPY apps/microservices/product-service ./apps/microservices/product-service
COPY packages/shared ./packages/shared

# Construir el paquete compartido primero, luego el servicio
RUN npm run build --workspace=shared
RUN npm run build --workspace=product-service

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app/apps/microservices/product-service

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/microservices/product-service/node_modules /app/node_modules
COPY --from=builder /app/packages/shared /app/packages/shared
COPY --from=builder /app/apps/microservices/product-service/tsconfig.json ./tsconfig.json
COPY --from=builder /app/apps/microservices/product-service/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
