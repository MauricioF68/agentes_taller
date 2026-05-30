import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
    // Si ejecutas 'npm run build', usará la ruta de Hostinger.
    // Si ejecutas 'npm run dev', usará la ruta local.
    base: command === 'build' ? '/agentes/public/build/' : '/',
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
}));