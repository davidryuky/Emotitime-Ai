
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Isso substitui as chamadas de process.env.API_KEY pelo valor real da variável no build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
