# Etapa 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar el package.json del monorepo y la estructura del workspace
COPY package*.json ./
COPY apps/microservices/recommendation-service/package*.json ./apps/microservices/recommendation-service/
COPY packages/shared/package*.json ./packages/shared/

RUN npm install
RUN mkdir -p /app/apps/microservices/recommendation-service/node_modules

# Copiar el código fuente
COPY apps/microservices/recommendation-service ./apps/microservices/recommendation-service
COPY packages/shared ./packages/shared

# Construir el paquete compartido primero, luego el servicio
RUN npm run build --workspace=shared
RUN npm run build --workspace=recommendation-service

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app/apps/microservices/recommendation-service

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/microservices/recommendation-service/node_modules /app/node_modules
COPY --from=builder /app/packages/shared /app/packages/shared
COPY --from=builder /app/apps/microservices/recommendation-service/tsconfig.json ./tsconfig.json
COPY --from=builder /app/apps/microservices/recommendation-service/dist ./dist

ENV NODE_ENV=production

CMD ["node", "-r", "tsconfig-paths/register", "dist/apps/microservices/recommendation-service/src/main.js"]
