// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://proelitemovers.com',
  integrations: [react()],
  adapter: cloudflare(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      QUOTE_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'hello@proelitemovers.com',
      }),
      QUOTE_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'ProElite Movers <hello@proelitemovers.com>',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
