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
      // ── Resend ──────────────────────────────────────────────────────────
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      QUOTE_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'info@proelitemovers.com',
      }),
      QUOTE_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'ProElite Movers <quotes@proelitemovers.com>',
      }),
      // ── Cloudflare Turnstile ─────────────────────────────────────────────
      // Site key: pública, inlined en el bundle del cliente
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      PUBLIC_GEOAPIFY_API_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      // Secret key: solo servidor, nunca inlined
      TURNSTILE_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // false = skip verificación (útil en dev local)
      // En producción omitir → defaults a true
      ENABLE_TURNSTILE: envField.boolean({
        context: 'server',
        access: 'public',
        default: true,
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
