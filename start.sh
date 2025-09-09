#!/bin/bash

# Clear and cache configs
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM to serve Laravel properly
php-fpm
