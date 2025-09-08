#!/bin/bash

# Clear and cache Laravel configs
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Serve Laravel
php artisan serve --host 0.0.0.0 --port 8080
