# Stage 1: Build frontend assets with caching
FROM node:18 AS frontend
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the project
COPY . .

# Build Tailwind CSS + JS
RUN npm run build

# Stage 2: PHP backend with caching
FROM php:8.2-cli
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    zip \
    bash \
    && apt-get clean

# Enable PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Copy Laravel app and built assets from frontend stage
COPY --from=frontend /app /app

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Copy full app (overwrites any missing files)
COPY . .

# Set storage/build permissions
RUN chmod -R 775 storage bootstrap/cache public/build
RUN chown -R www-data:www-data storage bootstrap/cache public/build

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port Render will use
EXPOSE 8080

# Start Laravel
CMD ["/start.sh"]
