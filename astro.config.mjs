import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [react(), tailwind(), clerk()],
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    define: {
      'import.meta.env.PUBLIC_CONVEX_URL': JSON.stringify(process.env.PUBLIC_CONVEX_URL || ''),
    }
  }
});