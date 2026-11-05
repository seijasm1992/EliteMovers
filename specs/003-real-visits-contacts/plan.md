# Implementation Plan: Medición de visitas reales y contactos, filtrando bots

**Branch**: `003-real-visits-contacts` | **Date**: 2026-11-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-real-visits-contacts/spec.md`

## Summary

Las visitas se miden con Cloudflare Web Analytics, inyectado en el borde, sin código ni token en el repo. Los contactos se envían a Zaraz con `zaraz.track()` y Zaraz los reenvía a GA4:

- `contact_call` y `contact_text` salen de un listener de clic delegado en `BaseLayout.astro`, que cubre todos los enlaces `tel:` y `sms:`.
- `contact_form` sale de `QuoteForm.tsx`, solo cuando `/api/quote` responde `{ ok: true }`.

El formulario gana un campo trampa `website`. Si llega relleno, el servidor responde `400` sin enviar correo, y el cliente muestra el nuevo mensaje genérico "We couldn't send your request. Please call or text us." Se crea la página `/privacy-policy/`, enlazada desde el pie de página y añadida al sitemap. La configuración de los paneles queda en una guía en `docs/`: Web Analytics, Zaraz, GA4, key events, alertas, etiqueta UTM de Google Business Profile y Bot Fight Mode con su vuelta atrás. No hay dependencias nuevas.

## Technical Context

**Language/Version**: TypeScript (modo estricto de Astro), Node >= 22.12

**Primary Dependencies**: Astro 6, islas de React 19, Tailwind CSS 4, react-hook-form + Zod, Resend. Servicios externos configurados en paneles: Cloudflare Web Analytics, Cloudflare Zaraz, Google Analytics 4, Cloudflare Turnstile (ya existe) y Bot Fight Mode. Nada nuevo en `package.json`.

**Storage**: N/A. Los datos de medición viven en Cloudflare y GA4.

**Testing**: No hay scripts de test ni de lint. La validación es `npm run astro -- check`, `npm run build`, un `curl` al API y pruebas manuales en producción (ver [quickstart.md](quickstart.md)).

**Target Platform**: Cloudflare Workers mediante `@astrojs/cloudflare`, con custom domain y proxy de Cloudflare. Páginas estáticas y `/api/quote` en el servidor.

**Project Type**: Sitio web (Astro con islas React y rutas de API).

**Performance Goals**: Mantener LCP < 2.5 s, INP < 200 ms y CLS < 0.1 en móvil. Zaraz ejecuta GA4 en el borde, sin gtag.js en el navegador. El listener añade unas pocas líneas al script empaquetado que ya existe.

**Constraints**: Sin claves, tokens ni identificadores secretos en el repo, y ningún identificador de medición nuevo. Sin datos del formulario en los eventos. Texto visible en inglés. Plan gratuito de Cloudflare, donde Bot Fight Mode no admite excepciones.

**Scale/Scope**: 1 helper nuevo (`src/lib/analytics.ts`), 1 página nueva con su archivo de contenido y su tipo, y cambios en `BaseLayout.astro`, `QuoteForm.tsx`, `api/quote.ts` (esquema de envío y comprobación del campo trampa), `quoteForm.ts`, `Footer.astro` y `sitemap.xml.ts`. Además, 1 guía para el dueño.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Precios transparentes | No afecta | PASS |
| II. Honestidad | La política de privacidad solo describe lo que el sitio hace de verdad | PASS |
| III. Imágenes reales | No se añaden imágenes | PASS |
| IV. Cero rutas rotas | El enlace del pie lleva a `/privacy-policy/`, que existe y está en el sitemap | PASS |
| V. SEO 100 % orgánico | La medición no altera el contenido ni lo que ve Google. Los UTM de GBP no crean duplicados (canonical sin query). Bot Fight Mode deja pasar a Googlebot (bot verificado). | PASS |
| VI. SEO técnico por página | `/privacy-policy/` lleva título y meta descripción únicos, un solo H1, canonical (de `BaseLayout`) y entrada en el sitemap. MovingCompany: ninguna página lo tiene todavía; queda pendiente para todo el sitio, como ya registró la especificación 002. | PASS (con la deuda ya registrada) |
| VII. NAP coherente | La página nueva toma el nombre y el correo de `site` | PASS |
| VIII. Contenido local y útil | No afecta | PASS |
| IX. Rendimiento | GA4 corre en el borde, Web Analytics es un beacon ligero y el listener no añade islas | PASS (verificar con SC-008) |
| X. JavaScript mínimo | Sin islas nuevas; el listener va en el script estático existente | PASS |
| XI. Mobile first | Los botones de llamada y texto siguen igual | PASS |
| XII. Simplicidad | Solo lo pedido. La carga manual de Zaraz se añade solo si la automática falla. | PASS |
| Tecnología y código | Astro, React y Tailwind; sin `var` | PASS |
| Idioma y tono | Página nueva y mensaje de error en inglés natural | PASS |

**Post-design re-check**: sin cambios. Todos los principios pasan.

## Project Structure

### Documentation (this feature)

```text
specs/003-real-visits-contacts/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── analytics-events.md
│   └── quote-api.md
├── checklists/
│   └── requirements.md
└── tasks.md             # /speckit-tasks
```

### Source Code (repository root)

```text
docs/
└── analytics-and-bot-protection.md   # NUEVO: guía del dueño (Web Analytics, Zaraz, GA4, alertas, UTM de GBP, Bot Fight Mode)

src/
├── lib/
│   ├── analytics.ts                  # NUEVO: trackContact(), tipos de evento y declaración de window.zaraz
│   └── validations/quoteSchema.ts    # sin cambio (el campo trampa va solo en el esquema del API)
├── layouts/BaseLayout.astro          # listener delegado para tel:/sms:
├── components/
│   ├── layout/Footer.astro           # enlace a /privacy-policy/
│   └── react/QuoteForm.tsx           # campo trampa + contact_form tras { ok: true }
├── data/
│   ├── quoteForm.ts                  # nuevo errorMessage
│   └── privacyPolicy.ts              # NUEVO: contenido de la política
├── types/content.ts                  # PrivacyPolicyContent
└── pages/
    ├── privacy-policy.astro          # NUEVO
    ├── sitemap.xml.ts                # añade /privacy-policy/
    └── api/quote.ts                  # acepta website; lo rechaza si viene relleno
```

**Structure Decision**: Proyecto único de Astro. Se siguen los patrones existentes: contenido tipado en `src/data/` y `src/types/content.ts`, páginas en `src/pages/` con `BaseLayout`, `Navbar` y `Footer`, y helpers en `src/lib/`. La guía va en una carpeta nueva `docs/`, porque es documentación para el dueño y no código ni especificación.

## Complexity Tracking

No hay violaciones de la constitución.

La tensión entre FR-014/SC-006 y el ID público de Microsoft Clarity ya existente quedó resuelta. El dueño aprobó la nueva redacción: sin claves, tokens ni identificadores secretos, y ningún identificador de medición nuevo. El ID de Clarity se mantiene (ver [research.md](research.md) R8).
