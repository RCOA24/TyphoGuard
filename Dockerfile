# Stage 1: Build Frontend (Vite + Tailwind)
FROM node:18 AS frontend
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . ./

# Build assets for production
RUN npm run build

# Stage 2: Laravel + PHP Backend
FROM php:8.2-fpm
WORKDIR /var/www/html

# Install PHP dependencies for Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

# Copy Laravel app and frontend build from previous stage
COPY --from=frontend /app /var/www/html

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Ensure storage & bootstrap/cache are writable
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
