# Contract: Dónde y cómo se muestran los datos de la empresa

Contrato de interfaz para el cliente del sitio. Todo valor sale de `site` ([data-model.md](../data-model.md)). El texto visible está en inglés.

## Pie de página (todas las páginas) — `Footer.astro`

| Elemento | Contenido | Enlace |
|---|---|---|
| Teléfono | `site.phone` | `site.phoneHref` |
| Correo | `site.email` | `mailto:` + `site.email` |
| Ubicación | `site.location` con el icono de ubicación | Ninguno (texto) |
| Copyright | `© {año} {site.name}. All rights reserved.` | Ninguno |
| Nombre legal | `{site.name} is operated by {site.legalName}.` | Ninguno |

- El enlace al mapa de la dirección desaparece.
- "Licensed and insured in Florida." queda igual (fuera de alcance).

## Bloque de contacto de la página de presupuesto — `get-a-quote.astro`

| Elemento | Etiqueta | Contenido | Enlace |
|---|---|---|---|
| Correo | `Email` | `site.email` | `mailto:` (ya existe) |
| Teléfono | `Phone number` | `site.phone` | `site.phoneHref` |
| Ubicación | `Location` (antes `Address`) | `site.location` | Ninguno (texto) |

## Llamadas a la acción de llamada

Cabecera, menú móvil (`NavMenu.tsx`), botón "Call Now" del hero (`hero.ts`) y botón de mensaje (`Contacto.tsx`) usan `site.phoneHref`. Ninguno escribe el número a mano.

## Textos que dicen dónde está la empresa

| Lugar | Texto |
|---|---|
| Descripción de la página "About" (`aboutUs.ts`) | La empresa se presenta en `site.location`, sin Miami Lakes como sede |
| Insignia de "About" (`aboutUs.ts`) | `Locally Owned & Operated · {site.location}` |
| Pregunta frecuente de zona (`faqContent.ts`) | `We're based in {site.location} and regularly serve Miami Lakes, Hialeah, …` |

## Correo de las solicitudes de presupuesto — `resend.ts`

| Campo | Valor |
|---|---|
| Destino | `QUOTE_TO_EMAIL` si existe; si no, `site.email` |
| Remitente | `QUOTE_FROM_EMAIL` si existe; si no, `{site.name} <quotes@proelitemovers.com>` |
