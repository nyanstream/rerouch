import { defineConfig } from 'vite';

import reactRefresh from '@vitejs/plugin-react-refresh';
import reactJsx from 'vite-react-jsx';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [reactRefresh(), reactJsx(), legacy({ targets: ['defaults', 'not IE 11'] })],

    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
});
