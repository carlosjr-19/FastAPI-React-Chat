# Stage 1: Build React
FROM node:18-alpine as build

WORKDIR /app

# 1. Buscamos el package.json DENTRO de la carpeta frontend
COPY frontend/package*.json ./

RUN npm install

# 2. Copiamos todo el contenido de la carpeta frontend
COPY frontend/ .

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# 3. Buscamos el nginx.conf DENTRO de la carpeta frontend
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]