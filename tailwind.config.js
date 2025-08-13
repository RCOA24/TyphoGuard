/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto'],
      },
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
        },
        danger: '#ef4444',
        success: '#22c55e',
        warn: '#f59e0b',
      },
    },
  },
  plugins: [forms, typography],
}