#!/bin/bash

# Clear and cache configs
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan serve --host 0.0.0.0 --port 8080

# Start PHP-FPM to serve Laravel properly
php-fpm
