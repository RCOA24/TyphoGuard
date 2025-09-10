# Stage 1: Build Frontend (Vite + Tailwind)
FROM node:18 AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Laravel + PHP Backend
FROM php:8.2

# Install PHP extensions needed for Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev unzip git \
    && docker-php-ext-install pdo pdo_mysql zip

WORKDIR /var/www/html

# Copy Laravel app and frontend build
COPY --from=frontend /app /var/www/html

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Ensure writable dirs
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port (Render will assign one, but we default to 8080 locally)
EXPOSE 8080

# Start Laravel's built-in server, binding to Render's $PORT or fallback 8080
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
