# Stage 1: Build Frontend (Vite + Tailwind)
FROM node:18 AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Laravel + PHP
FROM php:8.2

# Install PHP extensions needed for Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

WORKDIR /var/www/html

# Copy Laravel app code
COPY . .

# Copy built assets from frontend
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Ensure writable dirs
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose Render’s port
EXPOSE 8080

# Start Laravel on Render’s injected $PORT
CMD php artisan key:generate --force && php artisan serve --host=0.0.0.0 --port=${PORT}
