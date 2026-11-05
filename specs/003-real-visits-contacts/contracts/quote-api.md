# Contract: `POST /api/quote` (cambios)

Solo se describen los cambios respecto al comportamiento actual de `src/pages/api/quote.ts`.

## Request

JSON con los campos actuales de `quoteSchema` y `turnstileToken`, más:

| Campo | Tipo | Regla |
|-------|------|-------|
| `website` | string, opcional | Máx. 200 caracteres. Las personas lo envían vacío o no lo envían. |

## Orden de comprobaciones

1. Cuerpo JSON inválido → `400 { ok: false, message: "Invalid request body." }` (sin cambio).
2. Validación del esquema → `422 { ok: false, errors }` (sin cambio).
3. **Nuevo:** `website` con contenido tras `trim()` → `400 { ok: false }`, sin `message`. No se llama a Turnstile ni a Resend.
4. Turnstile → `403` / `503` (sin cambio).
5. Envío del correo → `200 { ok: true }` solo si Resend no devolvió error (sin cambio); `502` / `500` en otro caso.

## Cliente (`QuoteForm.tsx`)

| Respuesta | Mensaje mostrado | `contact_form` |
|-----------|------------------|----------------|
| `200 { ok: true }` | Mensaje de éxito | Sí |
| `403` con `message` | `message` del servidor | No |
| `422` | Errores por campo + mensaje genérico | No |
| Cualquier otro fallo (incluido el campo trampa) o error de red | "We couldn't send your request. Please call or text us." | No |

## Campo trampa en el formulario

- `<input name="website">` dentro de un contenedor fuera de pantalla (no `display:none`), con `aria-hidden="true"`.
- `tabIndex={-1}` y `autoComplete="off"`. Etiqueta "Leave this field empty", para el caso raro de que alguien llegue a él.
- No aparece en la barra de progreso ni en el recuento de campos completados.
