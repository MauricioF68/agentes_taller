import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                notion: {
                    bg: '#191919',         // Fondo principal oscuro
                    sidebar: '#202020',    // Fondo del menú lateral y tarjetas
                    text: '#ebebeb',       // Texto claro principal
                    textMuted: '#9ca3af',  // Texto secundario
                    blue: '#2563eb',       // Acento azul vibrante
                    border: '#2f2f2f',     // Bordes sutiles oscuros
                    hover: '#2c2c2c'       // Hover de botones y enlaces
                }
            }
        },
    },

    plugins: [forms],
};