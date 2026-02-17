import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [react(), tailwind(), clerk()],
  output: 'hybrid',
  adapter: vercel(),
  vite: {
    define: {
      'import.meta.env.PUBLIC_CONVEX_URL': JSON.stringify(process.env.PUBLIC_CONVEX_URL || ''),
    }
  }
});