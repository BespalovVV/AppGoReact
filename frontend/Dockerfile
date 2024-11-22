# Первая стадия: билд React-приложения
FROM node:16 AS builder

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend ./
RUN npm run build

# Вторая стадия: сервер с Nginx
FROM nginx:alpine

# Копируем собранное приложение в директорию для Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Открываем порт 80 для доступа
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]