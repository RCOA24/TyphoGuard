# Stage 1: Build frontend assets
FROM node:18 AS frontend
WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy resources and build
COPY . .
RUN npm run build   # outputs to public/build

# Stage 2: Laravel backend
FROM php:8.2-fpm
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip bash \
    && apt-get clean

# Enable PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Copy Laravel files
COPY composer.json composer.lock ./
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

COPY . .

# Copy built frontend assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]
