# Stage 1: Build frontend assets (Tailwind + Vite)
FROM node:18 AS frontend
WORKDIR /app

# Install Node dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy resources and other files needed for build
COPY resources/ resources/
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.js .
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

# Copy full Laravel app first
COPY . /var/www/html

# Copy built frontend assets from previous stage
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]
