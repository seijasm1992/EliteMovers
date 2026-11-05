# Contract: Eventos de contacto

Eventos que el sitio envía a Cloudflare Zaraz con `zaraz.track(name, properties)`. Zaraz los reenvía a Google Analytics 4 según los disparadores configurados en el panel.

## Eventos

| Evento | Cuándo se envía | Origen en el código |
|--------|-----------------|---------------------|
| `contact_call` | Clic (o Enter) en cualquier `a[href^="tel:"]` | Listener delegado en `BaseLayout.astro` |
| `contact_text` | Clic (o Enter) en cualquier `a[href^="sms:"]` | Listener delegado en `BaseLayout.astro` |
| `contact_form` | `/api/quote` respondió `2xx` con `{ ok: true }` | `QuoteForm.tsx`, justo antes de mostrar el mensaje de éxito |

## Propiedades

| Propiedad | Tipo | Valor | Notas |
|-----------|------|-------|-------|
| `page_path` | string | `location.pathname`, por ejemplo `/get-a-quote/` | Sin query string ni hash |

Prohibido en cualquier evento: nombre, teléfono, correo, ciudades, fecha de mudanza, tamaño de la vivienda o cualquier otro valor escrito en el formulario (FR-013).

## Reglas

- `trackContact()` MUST NOT lanzar excepciones ni bloquear la navegación. Si `window.zaraz` no existe (desarrollo, bloqueadores), no hace nada.
- Cada clic cuenta una vez; no hay deduplicación.
- `contact_form` se envía como mucho una vez por envío aceptado. Nunca se envía ante 4xx, 5xx o un error de red.

## Configuración en el panel (no en el repo)

- Zaraz → herramienta Google Analytics 4 con el ID de medición del dueño.
  - Disparador Pageview (para visitas y atribución de origen).
  - Un disparador por evento: regla "Event Name" igual a `contact_call`, `contact_text` y `contact_form`, con acción "Event" del mismo nombre que reenvía `page_path`.
- GA4 → marcar los tres eventos como *key events*.
