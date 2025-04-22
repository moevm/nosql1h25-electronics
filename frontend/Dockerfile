FROM node:22.14.0-alpine3.21 AS frontend

WORKDIR /app
ENV VITE_BASE_URL=""

COPY package.json .
RUN npm i

COPY index.html tsconfig.* vite.config.ts ./
COPY src src
RUN npm run build

FROM nginx:1.27.5-alpine-slim

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend /app/dist /usr/share/nginx/html
