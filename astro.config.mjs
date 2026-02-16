import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  adapter: vercel(),
  vite: {
    define: {
      'import.meta.env.PUBLIC_CONVEX_URL': JSON.stringify('https://efficient-antelope-653.convex.cloud'),
    }
  }
});