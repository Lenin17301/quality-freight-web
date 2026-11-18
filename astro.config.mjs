import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://qualityfreightservice.com',
  
  integrations: [
    react()
  ],
  
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/rastreo': '/infoquality',
    '/en/tracking': '/en/infoquality',
  },
});