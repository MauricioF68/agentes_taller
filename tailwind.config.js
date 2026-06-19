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
                    bg: '#f8fafc',         // Fondo principal claro (slate-50)
                    sidebar: '#ffffff',    // Sidebar blanco
                    text: '#1e293b',       // Texto corporativo oscuro (slate-800)
                    textMuted: '#64748b',  // Texto secundario (slate-500)
                    blue: '#0f172a',       // Azul corporativo oscuro para acentos primarios (slate-900)
                    border: '#e2e8f0',     // Bordes claros (slate-200)
                    hover: '#f1f5f9'       // Hover sutil (slate-100)
                }
            }
        },
    },

    plugins: [forms],
};