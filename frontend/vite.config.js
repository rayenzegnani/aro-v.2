// filepath: f:\aro-1\frontend\vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        include: [], // Remove 'react-datepicker/dist/react-datepicker.css'
    },
});