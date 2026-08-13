// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// Las variables `client` de astro:env se incrustan en el bundle en build time.
// Compilar sin site key deja el formulario sin captcha y, con
// ENABLE_TURNSTILE=true en producción, /api/quote rechaza todos los envíos.
// El guard vive en `astro:build:start` para correr únicamente durante el build.
const turnstileSiteKeyGuard = () => ({
  name: 'turnstile-site-key-guard',
  hooks: {
    'astro:build:start': () => {
      const fileEnv = loadEnv('production', process.cwd(), '');
      const siteKey = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? fileEnv.PUBLIC_TURNSTILE_SITE_KEY;
      const enabled = (process.env.ENABLE_TURNSTILE ?? fileEnv.ENABLE_TURNSTILE ?? 'true') !== 'false';
      if (enabled && !siteKey?.trim()) {
        throw new Error(
          'PUBLIC_TURNSTILE_SITE_KEY is required for production builds. ' +
          'Client env vars are inlined at build time, so the Turnstile widget ' +
          'cannot render without it. Add it to .env (or the build environment) ' +
          'before `astro build`, or set ENABLE_TURNSTILE=false to opt out.',
        );
      }
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: 'https://proelitemovers.com',
  integrations: [react(), turnstileSiteKeyGuard()],
  adapter: cloudflare(),
  devToolbar: {
    enabled: false,
  },
  env: {
    schema: {
      // ── Resend ──────────────────────────────────────────────────────────
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
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
