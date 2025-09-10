#!/bin/bash
set -e

# Clear and cache configs
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run Laravel's built-in server on Render's assigned $PORT
php artisan serve --host=0.0.0.0 --port=${PORT}
