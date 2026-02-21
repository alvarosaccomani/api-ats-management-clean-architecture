# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies) para compilar
RUN npm ci

# Copiar el código fuente
COPY . .

# Compilar TypeScript
RUN npx tsc

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Solo instalar dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar los archivos compilados desde la etapa builder
COPY --from=builder /app/dist ./dist

# Copiar cualquier otro archivo necesario (ej: .env, assets, etc.)
# COPY .env .  # si lo usas

EXPOSE 3003

# Comando para ejecutar la app
CMD ["node", "dist/app.js"]