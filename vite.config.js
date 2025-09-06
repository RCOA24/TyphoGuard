import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',   // main stylesheet
                'resources/js/app.js',
                'resources/js/ph-time.js',
                'resources/js/tide.js',
                'resources/js/weather.js',
                'resources/js/radar.js',
                'resources/js/about.js',
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
