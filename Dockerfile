# Use PHP 8.2 CLI with Composer
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    zip \
    nodejs \
    npm \
    bash \
    && apt-get clean

# Enable PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --optimize-autoloader

# Install Vite globally so "npm run build" works
RUN npm install -g vite

# Install Node dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Build Vite assets (Tailwind CSS + JS)
RUN npm run build

# Optionally remove dev dependencies to save space
RUN npm prune --production

# Set storage and public/build permissions
RUN chmod -R 775 storage bootstrap/cache public/build
RUN chown -R www-data:www-data storage bootstrap/cache public/build

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port
EXPOSE 8080

# Start Laravel
CMD ["/start.sh"]
