# Research: Datos de la empresa coherentes en todo el sitio

No quedaban puntos "NEEDS CLARIFICATION" en el contexto técnico. Estas son las decisiones de diseño tomadas a partir del código actual.

## 1. Inventario de datos repetidos a mano

Búsqueda en `src/` (2026-11-05):

| Archivo | Problema | Acción |
|---|---|---|
| `src/data/site.ts` | Teléfono 407, dirección `1050 SW 70th Ave` y enlace a Google Maps | Corregir; quitar dirección y enlace |
| `src/data/hero.ts:10` | `tel:+14079849218` escrito a mano | Usar `site.phoneHref` |
| `src/data/aboutUs.ts:11` | "a Miami Lakes moving agency" (descripción de página) | Presentar la empresa en Miami, FL desde `site.location` |
| `src/data/aboutUs.ts:79` | Insignia "Locally Owned & Operated · Miami Lakes, FL" | Usar `site.location` |
| `src/data/aboutUs.ts:86` | Miami Lakes en la lista de ciudades | Se mantiene (zona de servicio) |
| `src/data/faqContent.ts:83` | "We're based in Miami Lakes" | "based in" con `site.location`; Miami Lakes pasa a la lista de zonas atendidas |
| `src/data/movingServices.ts:27` | Alt con "Pro Elite Movers" | Corregir a "ProElite Movers" |
| `src/data/guarantee.ts:5,29` | Forma corta "ProElite" | Corregir a "ProElite Movers" |
| `src/lib/resend.ts:4-5` | Destino `info@proelitemovers.com` y nombre del remitente escritos a mano | Por defecto desde `site.email` y `site.name` |
| `src/components/layout/Footer.astro` | Dirección con enlace al mapa; falta correo y nombre legal | Ver contrato |
| `src/pages/get-a-quote.astro` | Bloque "Address" con enlace al mapa | Ver contrato |

- **Decision**: corregir solo estos puntos.
- **Rationale**: son todos los lugares donde aparece un dato de identidad o de contacto escrito a mano o incorrecto.
- **Alternatives considered**: revisar también los textos de marketing; se descartó por la clarificación (opción A).

## 2. Qué cuenta como "nombre como identidad"

- **Decision**: el nombre sale de `site` cuando identifica a la empresa como dato: logo y sus etiquetas accesibles, sufijo del título de página, línea de copyright, línea del nombre legal, nombre del remitente del correo, insignia de ubicación y frases "based in". Las frases de marketing que nombran "ProElite Movers" (por ejemplo, "Luis and Juan started ProElite Movers") se quedan escritas, porque ya usan la marca correcta. La forma corta "ProElite" se elimina por decisión del dueño (2026-11-05): "Why ProElite" pasa a "Why ProElite Movers" y "They arrive in ProElite uniform." pasa a "They arrive in ProElite Movers uniforms." (`src/data/guarantee.ts`). El wordmark del logo (`ProElite` + `Movers`) no cuenta, porque muestra la marca completa.
- **Rationale**: cumple la clarificación A sin convertir todo el texto en plantillas, y la marca ya está escrita bien en esas frases.
- **Alternatives considered**: interpolar `site.name` en toda la prosa; se descartó por la clarificación A y por legibilidad (principio XII).

## 3. Teléfono y enlace de llamada

- **Decision**: guardar solo el teléfono para mostrar (`+1 (786) 281-7825`) y derivar `phoneHref` en `site.ts` (`tel:+` seguido de los dígitos: `tel:+17862817825`).
- **Rationale**: el enlace y el texto no pueden separarse (SC-006). `Contacto.tsx` ya deriva el número de SMS de `phoneHref`, así que sigue funcionando.
- **Alternatives considered**: dos cadenas escritas a mano; es lo que permitió el error actual.

## 4. Ubicación pública

- **Decision**: nuevo campo `location: "Miami, FL"`. Se eliminan `address` y `addressHref` del tipo `SiteConfig`, para que el compilador señale cualquier uso que quede.
- **Rationale**: quitar los campos del tipo convierte un uso olvidado en un error de `astro check`.
- **Alternatives considered**: dejar `address` vacío; ocultaría usos olvidados.

## 5. Mapa de la sección de presupuesto

- **Decision**: el mapa embebido de `QuoteSection.astro` (`q=Miami, FL`, a nivel de ciudad) se mantiene sin cambios.
- **Rationale**: no muestra ninguna dirección; la especificación solo retira el enlace al mapa de la dirección.

## 6. Correo de las solicitudes de presupuesto

- **Decision**: en `resend.ts`, el destino por defecto es `site.email` y el remitente por defecto es `` `${site.name} <quotes@proelitemovers.com>` ``. `QUOTE_TO_EMAIL` y `QUOTE_FROM_EMAIL` (en `wrangler.jsonc`, `.env.example` y `astro.config.mjs`) siguen teniendo prioridad y no se tocan.
- **Rationale**: clarificación B (FR-009a). `quotes@` es una dirección técnica de envío, no un dato de contacto público, así que se mantiene escrita.
- **Alternatives considered**: quitar las variables del despliegue (opción C); el dueño eligió B.

## 7. Verificación sin tests

- **Decision**: `npm run astro -- check`, `npm run build` y búsquedas con `grep` en `src/` y `dist/client/` con patrones que cubren las variantes del teléfono antiguo.
- **Rationale**: el proyecto no tiene scripts de test (CLAUDE.md) y no se deben añadir dependencias.
