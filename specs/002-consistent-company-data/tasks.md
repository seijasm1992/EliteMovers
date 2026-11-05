# Tasks: Datos de la empresa coherentes en todo el sitio

**Input**: Design documents from `specs/002-consistent-company-data/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/company-data.md](contracts/company-data.md), [quickstart.md](quickstart.md)

**Tests**: La especificación no pide tests y el proyecto no tiene scripts de test. La validación se hace con `astro check`, el build y las búsquedas de [quickstart.md](quickstart.md) (fase final).

**Organization**: Una sola historia de usuario (US1, P1). La fase fundacional cambia la fuente única; la fase de US1 hace que todo el sitio la use.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede hacerse en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1)

## Path Conventions

Proyecto Astro en la raíz del repositorio: código en `src/`, salida del build en `dist/client/`.

---

## Phase 1: Setup

**Purpose**: Punto de partida limpio.

- [X] T001 Crear y cambiar a la rama `002-consistent-company-data` desde `master` (`git switch -c 002-consistent-company-data`) y ejecutar `npm run build` en la raíz para confirmar que el build funciona antes de los cambios.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Corregir y completar la fuente única. Bloquea la fase de US1.

**⚠️ CRITICAL**: Después de T002 el compilador señala todos los usos de `site.address` y `site.addressHref`; eso es lo esperado y se resuelve en la fase 3.

- [X] T002 Actualizar la interfaz `SiteConfig` en `src/types/content.ts`: añadir `legalName: string` y `location: string`; eliminar `address` y `addressHref`. El resto de campos (`name`, `wordmark`, `phone`, `phoneHref`, `email`, `description`) no cambian.
- [X] T003 Actualizar `src/data/site.ts` (depende de T002): declarar `const phone = "+1 (786) 281-7825";` y en el objeto `site` poner `phone`, `phoneHref: \`tel:+${phone.replace(/\D/g, "")}\`` (resultado `tel:+17862817825`; regla: "`phoneHref` = `tel:+` seguido de todos los dígitos de `phone`. Nunca se escribe a mano."), `legalName: "PROELITE MOVING LLC"`, `location: "Miami, FL"` (regla: "`location` no lleva calle, número ni código postal."). Mantener `name: "ProElite Movers"`, `wordmark`, `email: "info@proelitemovers.com"` y `description`. Eliminar `address` y `addressHref`.

**Checkpoint**: La fuente única tiene los datos correctos. `npm run astro -- check` falla solo en `Footer.astro` y `get-a-quote.astro`.

---

## Phase 3: User Story 1 - Cliente que quiere confiar en la empresa y contactarla (Priority: P1) 🎯 MVP

**Goal**: Todas las páginas muestran la misma marca, teléfono, correo y ubicación, leídos de `site`; sin dirección física ni el número antiguo; Miami Lakes solo como zona de servicio.

**Independent Test**: Seguir las secciones 2 y 3 de [quickstart.md](quickstart.md): las búsquedas devuelven 0 resultados y cada botón de llamada marca +1 (786) 281-7825.

### Implementation for User Story 1

- [X] T004 [P] [US1] En `src/components/layout/Footer.astro`, en la columna de la marca: mantener el enlace del teléfono; sustituir el enlace `<a href={site.addressHref} …>` por un `<p>` con el mismo icono `mapPin` y `{site.location}`, sin enlace, sin `target` y sin estilos de hover; añadir debajo del teléfono un enlace `<a href={\`mailto:${site.email}\`}>` con `<Icon name="email" …>` y `{site.email}`, con las mismas clases que el enlace del teléfono. En la barra inferior: mantener `<p>&copy; {year} {site.name}. All rights reserved.</p>`, añadir `<p>{site.name} is operated by {site.legalName}.</p>` y mantener "Licensed and insured in Florida." sin cambios (ver [contracts/company-data.md](contracts/company-data.md), "Pie de página").
- [X] T005 [P] [US1] En `src/pages/get-a-quote.astro`, en el tercer elemento del bloque de contacto: cambiar la etiqueta `Address` por `Location` y sustituir el enlace `<a href={site.addressHref} …>{site.address}</a>` por un `<p>` con `{site.location}` y las mismas clases de texto (`font-accent text-sm font-bold text-text-strong`), sin enlace ni hover. Los bloques de correo y teléfono no cambian.
- [X] T006 [P] [US1] En `src/data/hero.ts`: importar `site` desde `./site` y cambiar `secondaryCta` a `{ label: "Call Now", href: site.phoneHref }` (quitar `tel:+14079849218`).
- [X] T007 [P] [US1] En `src/data/aboutUs.ts`: importar `site` desde `./site`; en la meta descripción (línea 11) cambiar "a Miami Lakes moving agency" por una frase que use `site.location`, por ejemplo `` `Meet the team behind ProElite Movers, a ${site.location} moving company built on honest hourly billing and a human approach.` ``; en la insignia de `trust` (línea 79) usar `` `Locally Owned & Operated · ${site.location}` ``. No tocar la lista `cities` (Miami Lakes sigue como zona de servicio).
- [X] T008 [P] [US1] En `src/data/faqContent.ts` (línea 83): importar `site` desde `./site` y reescribir la respuesta como `` `We're based in ${site.location} and regularly serve Miami Lakes, Hialeah, Doral, Miramar, Pembroke Pines, Wynwood, Miami Springs, Hialeah Gardens, and Opa-locka. We also handle long-distance moves anywhere within Florida directly.` ``. Comprobar que el schema FAQ de `src/components/sections/FAQSection.astro` sigue generándose con el texto nuevo.
- [X] T009 [P] [US1] En `src/data/movingServices.ts` (línea 27): cambiar "Pro Elite Movers" por "ProElite Movers" en `imageAlt`.
- [X] T010 [P] [US1] En `src/lib/resend.ts`: importar `site` desde `../data/site`; `DEFAULT_TO_EMAIL = site.email` y `` DEFAULT_FROM_EMAIL = `${site.name} <quotes@proelitemovers.com>` ``. Mantener la prioridad de `QUOTE_TO_EMAIL` y `QUOTE_FROM_EMAIL`; no tocar `wrangler.jsonc`, `.env.example` ni `astro.config.mjs` (FR-009a).
- [X] T011 [P] [US1] En `src/data/guarantee.ts`: cambiar `eyebrow: "Why ProElite"` por `eyebrow: "Why ProElite Movers"` (línea 5) y "They arrive in ProElite uniform." por "They arrive in ProElite Movers uniforms." (línea 29). Regla (FR-001): la marca aparece solo como "ProElite Movers"; el wordmark del logo en `src/data/site.ts` no se toca.

**Checkpoint**: `npm run astro -- check` vuelve a pasar y US1 está completa.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Validar los criterios de éxito con [quickstart.md](quickstart.md).

- [X] T012 Ejecutar `npm run astro -- check` en la raíz: 0 errores. *(Resultado: 3 errores, todos previos y ajenos a esta especificación: faltan los tipos de Node para `process` en `astro.config.mjs`. Sin los cambios da los mismos 3.)*
- [X] T013 Ejecutar `npm run build` en la raíz: termina sin errores (SC-007).
- [X] T014 Ejecutar las búsquedas de la sección 2 de [quickstart.md](quickstart.md) sobre `src` y `dist/client`: 0 resultados en las cinco primeras; `PROELITE MOVING LLC` con 1 aparición en cada HTML generado; solo `tel:+17862817825` en los enlaces de llamada (SC-002, SC-003, SC-005). Corregir cualquier resultado inesperado en el archivo que lo contenga. *(Resultado: el nombre legal salía 2 veces por página porque `Navbar.astro` pasaba todo `site` a la isla `NavMenu`, que lo escribía en el HTML. Se corrigió pasando solo `name`, `phone` y `phoneHref` en `src/components/layout/Navbar.astro` y `src/components/react/NavMenu.tsx`. Ahora sale 1 vez por página.)*
- [ ] T015 Ejecutar `npm run preview` y revisar las páginas según la sección 3 de [quickstart.md](quickstart.md): pie de página, bloque de contacto de `/get-a-quote/` y botones de llamada (SC-001, SC-004).
- [X] T016 Prueba de fuente única según la sección 4 de [quickstart.md](quickstart.md): cambiar temporalmente el teléfono en `src/data/site.ts`, recompilar, comprobar el cambio en todas las páginas y en todos los `tel:`, y deshacer el cambio (SC-006).

---

## Dependencies & Execution Order

- **Setup (T001)** → **Foundational (T002 → T003)** → **US1 (T004–T011)** → **Polish (T012 → T013 → T014 → T015 → T016)**.
- T003 depende de T002 (el tipo debe admitir `legalName` y `location`).
- T004 y T005 dependen de T003 (usan `site.location` y `site.legalName`).
- T011 no depende de ninguna otra tarea.
- T006–T010 solo necesitan `site.phoneHref`, `site.location`, `site.email` y `site.name`, así que también dependen de T003.
- T014 y T015 dependen de T013 (necesitan `dist/client`).

### Parallel Opportunities

Las ocho tareas de US1 (T004–T011) tocan archivos distintos y pueden hacerse a la vez:

```text
T004 Footer.astro      T005 get-a-quote.astro   T006 hero.ts
T007 aboutUs.ts        T008 faqContent.ts       T009 movingServices.ts
T010 resend.ts         T011 guarantee.ts
```

## Implementation Strategy

### MVP

US1 es toda la funcionalidad: T001–T011 entregan el MVP y T012–T016 lo validan. No hay entregas intermedias útiles, porque publicar la fuente corregida sin actualizar el pie o el hero dejaría datos mezclados.

### Después de esta especificación

- El dueño actualiza Google Business Profile (teléfono nuevo, negocio con zona de servicio, sin dirección visible).
- Siguiente paso propuesto: cambiar el principio VI de la constitución (schema MovingCompany solo en la home) y crear la especificación 003.
