# Data Model: Medición de visitas reales y contactos, filtrando bots

El sitio no guarda nada en una base de datos. Los datos viven en Cloudflare Web Analytics y en Google Analytics 4. En el repo solo hay tipos, contenido y la forma de los eventos.

## Visita

Registrada por Cloudflare Web Analytics (recuento de visitas) y por la vista de página de Zaraz hacia GA4 (atribución de origen).

| Campo | Fuente | Notas |
|-------|--------|-------|
| Página | URL de la petición | — |
| Fecha | Servicio | — |
| Origen | Referrer y UTM (GA4) | Búsqueda orgánica, Google Business Profile (`utm_campaign=gbp_listing`), directo, redes sociales, otros sitios |

## Contacto

Ver [contracts/analytics-events.md](contracts/analytics-events.md).

| Campo | Valores | Regla |
|-------|---------|-------|
| Tipo | `contact_call`, `contact_text`, `contact_form` | Uno por evento |
| `page_path` | Ruta sin query string | FR-005, FR-013 |
| Origen | El de la sesión en GA4 | FR-005a |
| Fecha | Servicio | — |

**Transiciones del formulario**: borrador → enviado → (aceptado → `contact_form` + correo) | (rechazado → sin evento ni correo).

## Envío rechazado

Envío con el campo trampa relleno, sin una verificación de Turnstile válida, con datos inválidos o con un fallo del envío del correo. No se guarda ni se registra.

## Contenido de la política de privacidad

Tipo nuevo `PrivacyPolicyContent` en `src/types/content.ts`, con datos en `src/data/privacyPolicy.ts`:

| Campo | Tipo | Notas |
|-------|------|-------|
| `meta.title` | string | Único (principio VI) |
| `meta.description` | string | Única |
| `title` | string | Único H1 |
| `updated` | string | Fecha de la última actualización |
| `sections` | `{ heading: string; paragraphs: string[] }[]` | Qué se mide, servicios, datos del formulario, contacto |

El correo y el nombre de la empresa se leen de `site` (`src/data/site.ts`), nunca escritos a mano.
