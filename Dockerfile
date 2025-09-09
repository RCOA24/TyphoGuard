# Stage 1: Build frontend
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY resources/ resources/
COPY vite.config.js .
COPY tailwind.config.js .
COPY postcss.config.cjs .

RUN npm run build

# Stage 2: Laravel backend
FROM php:8.2-fpm
WORKDIR /var/www/html
RUN apt-get update && apt-get install -y git unzip curl libzip-dev zip bash && apt-get clean
RUN docker-php-ext-install pdo pdo_mysql zip

# Copy Laravel app
COPY . /var/www/html

# Copy built assets
COPY --from=frontend /app/public/build /var/www/html/public/build

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080
CMD ["/start.sh"]
