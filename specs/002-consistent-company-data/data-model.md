# Data Model: Datos de la empresa

## SiteConfig (`src/types/content.ts`, valor en `src/data/site.ts`)

| Campo | Tipo | Valor | Cambio |
|---|---|---|---|
| `name` | `string` | `ProElite Movers` | Sin cambio |
| `legalName` | `string` | `PROELITE MOVING LLC` | Nuevo |
| `wordmark` | `{ primary: string; secondary: string }` | `ProElite` / `Movers` | Sin cambio |
| `phone` | `string` | `+1 (786) 281-7825` | Corregido |
| `phoneHref` | `string` | `tel:+17862817825`, derivado de `phone` | Ahora derivado |
| `email` | `string` | `info@proelitemovers.com` | Sin cambio |
| `location` | `string` | `Miami, FL` | Nuevo |
| `description` | `string` | Texto actual | Sin cambio |
| `address` | | | Eliminado |
| `addressHref` | | | Eliminado |

### Reglas

- `phoneHref` = `tel:+` seguido de todos los dígitos de `phone`. Nunca se escribe a mano.
- `location` no lleva calle, número ni código postal.
- `legalName` solo se usa en `Footer.astro`.
- Ningún otro archivo de `src/` contiene el teléfono, `tel:+1…`, `info@proelitemovers.com` ni "Miami, FL" como dato de la empresa; los leen de `site`.

## Zona de servicio (`src/data/aboutUs.ts`, `cities`)

Lista de lugares donde se trabaja. Miami Lakes sigue en ella. No es la sede y no se relaciona con `location`.
