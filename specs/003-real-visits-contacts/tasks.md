# Tasks: Medición de visitas reales y contactos, filtrando bots

**Input**: Design documents from `specs/003-real-visits-contacts/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/analytics-events.md](contracts/analytics-events.md), [contracts/quote-api.md](contracts/quote-api.md), [quickstart.md](quickstart.md)

**Tests**: La especificación no pide tests y el proyecto no tiene scripts de test. La validación usa `astro check`, el build, `curl` y las pruebas de [quickstart.md](quickstart.md) (fase final).

**Organization**:

- US1 (P1): visitas y contactos medidos, más la política de privacidad que exige GA4.
- US2 (P2): campo trampa y mensaje genérico.
- US3 (P3): guía de Bot Fight Mode.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede hacerse en paralelo (archivo distinto, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1, US2, US3)

## Path Conventions

Proyecto Astro en la raíz del repositorio: código en `src/`, guía del dueño en `docs/` y salida del build en `dist/`.

---

## Phase 1: Setup

**Purpose**: Punto de partida limpio.

- [X] T001 Crear y cambiar a la rama `003-real-visits-contacts` desde `master` (`git switch -c 003-real-visits-contacts`). Ejecutar `npm run build` en la raíz para confirmar que el build funciona antes de los cambios.

---

## Phase 2: Foundational (Blocking Prerequisites)

No hay prerrequisitos compartidos. Cada historia arranca después de T001.

---

## Phase 3: User Story 1 - El dueño ve visitas reales y contactos (Priority: P1) 🎯 MVP

**Goal**:

- Cada pulsación de llamada o de texto y cada formulario aceptado se envían a Zaraz como `contact_call`, `contact_text` o `contact_form`, con `page_path`.
- El sitio tiene `/privacy-policy/` enlazada desde el pie de página.
- La guía del dueño explica cómo activar Web Analytics, Zaraz, GA4, los key events, las alertas y la etiqueta UTM de Google Business Profile.

**Independent Test**: [quickstart.md](quickstart.md) secciones 1 y 2. Con `window.zaraz` simulado, pulsar llamar, pulsar "Chat with us" y enviar un formulario aceptado muestra los tres eventos con `page_path`. Sin el stub no hay errores. En producción, la sección 4 (SC-001, SC-002, SC-005, SC-010, SC-011).

### Implementation for User Story 1

- [X] T002 [P] [US1] Crear `src/lib/analytics.ts` según [contracts/analytics-events.md](contracts/analytics-events.md):
  - Exportar `type ContactEvent = "contact_call" | "contact_text" | "contact_form"`.
  - Declarar en `declare global` `interface Window { zaraz?: { track: (name: string, properties?: Record<string, unknown>) => void } }`.
  - Exportar `trackContact(event: ContactEvent): void`, que llama a `window.zaraz?.track(event, { page_path: window.location.pathname })` dentro de `try { } catch { }`.
  - Reglas: "`trackContact()` MUST NOT lanzar excepciones ni bloquear la navegación. Si `window.zaraz` no existe (desarrollo, bloqueadores), no hace nada." `page_path` va "sin query string ni hash". No se envía ninguna otra propiedad.
  - Usar `const`, nunca `var`.
- [X] T003 [US1] En `src/layouts/BaseLayout.astro` (depende de T002), añadir un segundo `<script>` empaquetado (no `is:inline`) después del script de scroll-reveal:
  - Importar `trackContact` de `../lib/analytics`.
  - Registrar un único `document.addEventListener("click", ...)`. Si `event.target` es un `Element`, buscar `target.closest('a[href^="tel:"], a[href^="sms:"]')`: llamar a `trackContact("contact_call")` si el `href` empieza por `tel:` y a `trackContact("contact_text")` si empieza por `sms:`.
  - No llamar a `preventDefault()` ni cambiar la navegación.
  - No tocar el script de Microsoft Clarity.
- [X] T004 [US1] En `src/components/react/QuoteForm.tsx` (depende de T002):
  - Importar `trackContact` de `../../lib/analytics`.
  - Añadir `ok?: boolean` al tipo del `body` de la respuesta.
  - En la rama de éxito, justo antes de `setSubmissionSucceeded(true)`, llamar a `trackContact("contact_form")` solo si `body?.ok === true`.
  - Regla: "`contact_form` se envía como mucho una vez por envío aceptado. Nunca se envía ante 4xx, 5xx o un error de red."
  - No enviar ningún valor del formulario.
- [X] T005 [P] [US1] En `src/types/content.ts`, añadir y exportar `interface PrivacyPolicyContent { meta: { title: string; description: string }; title: string; updated: string; sections: { heading: string; paragraphs: string[] }[] }`, según [data-model.md](data-model.md).
- [X] T006 [US1] Crear `src/data/privacyPolicy.ts` (depende de T005), que exporte `privacyPolicy: PrivacyPolicyContent`.
  - **Formato**: en inglés natural y sin tono legalista (Language and Tone). Importar `site` de `./site` y usar `site.name` y `site.email` en lugar de escribirlos a mano (principio VII).
  - **Meta**: `meta.title: \`Privacy Policy | ${site.name}\``. `meta.description` única, que diga qué se mide y que los datos del formulario no van a las estadísticas.
  - **Cabecera**: `title: "Privacy Policy"` y `updated: "November 5, 2026"`.
  - **Secciones**, en este orden y describiendo solo lo que el sitio hace de verdad (principio II):
    1. Qué medimos: visitas a las páginas y pulsaciones en llamar, texto y formulario enviado, con la página donde ocurren y de dónde llegó la visita.
    2. Servicios que usamos: Cloudflare Web Analytics, Cloudflare Zaraz, Google Analytics 4 y Microsoft Clarity. Google Analytics y Clarity pueden usar cookies.
    3. Datos del formulario: nombre, teléfono, correo, ciudades, fecha y tamaño solo se usan para responder la solicitud, llegan por correo a la empresa y no se envían a ninguna herramienta de estadísticas.
    4. Protección contra spam: Cloudflare Turnstile verifica que el envío viene de una persona.
    5. Cómo limitar la medición: ajustes de cookies del navegador o bloqueadores.
    6. Contacto: dudas a `site.email`.
- [X] T007 [US1] Crear `src/pages/privacy-policy.astro` (depende de T006), con la misma estructura que `src/pages/about-us.astro`:
  - `<BaseLayout title={privacyPolicy.meta.title} description={privacyPolicy.meta.description}>`, `<Navbar />`, `<main id="main-content">` y `<Footer />`.
  - Un solo `<h1>` con `privacyPolicy.title`, la fecha `updated` y cada sección con `<h2>` y sus párrafos `<p>`.
  - Estilos con las clases existentes (`container-x`, clases `type-*` como en `src/components/sections/AboutStory.astro`), con un ancho de lectura cómodo en móvil.
  - Script `BreadcrumbList` igual que en `about-us.astro`: Home → "Privacy Policy" con `item: "https://proelitemovers.com/privacy-policy/"`, serializado con `.replace(/</g, "\\u003c")`.
  - Sin MovingCompany (research R10).
- [X] T008 [P] [US1] En `src/pages/sitemap.xml.ts`, añadir `"/privacy-policy/"` al array `routes`.
- [X] T009 [P] [US1] En `src/components/layout/Footer.astro`, añadir en la franja inferior un enlace `<a href="/privacy-policy/">Privacy Policy</a>`, debajo de las dos líneas de copyright y del nombre legal, con el estilo de texto de esa franja y `hover:text-gold`. Debe verse en todas las páginas (FR-013b).
- [X] T010 [P] [US1] Crear `docs/analytics-and-bot-protection.md`, guía en español para el dueño, sin IDs ni tokens reales (FR-014). Secciones:
  1. **Cloudflare Web Analytics**: activarlo con la configuración automática del dominio `proelitemovers.com` y comprobar que el código fuente de una página contiene `beacon.min.js`. Advertir de que no hay que añadir además el fragmento manual.
  2. **Cloudflare Zaraz + GA4**: activar Zaraz con inyección automática, crear la propiedad de GA4 y añadir la herramienta Google Analytics 4 con su ID de medición en el panel.
     - Disparador Pageview.
     - Tres disparadores con regla "Event Name" igual a `contact_call`, `contact_text` y `contact_form`, cada uno con una acción de evento del mismo nombre que reenvía `page_path`.
     - Comprobar que el HTML contiene `/cdn-cgi/zaraz/`. Si no lo contiene, la persona desarrolladora añade la carga manual de [research.md](../specs/003-real-visits-contacts/research.md) R2 y la inyección automática se desactiva.
  3. **Key events**: marcar los tres eventos en GA4.
  4. **Google Business Profile**: cambiar la URL del sitio web del perfil a `https://proelitemovers.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing`.
  5. **Ver contactos por origen**: informe de adquisición de tráfico con los key events y filtro por campaña `gbp_listing`.
  6. **Alertas por correo**: GA4 → Insights → Custom insights. Ejemplos: ningún contacto en un día, o más contactos de lo normal (FR-008b).
  7. **Bot Fight Mode**: encabezado vacío, que se completa en T014.

**Checkpoint**: US1 está completa. `npm run astro -- check` y `npm run build` pasan, y [quickstart.md](quickstart.md) secciones 1 y 2 se cumplen.

---

## Phase 4: User Story 2 - Los bots no envían formularios ni inflan los contactos (Priority: P2)

**Goal**: Un envío con el campo trampa relleno recibe `400 { ok: false }`, no envía correo ni registra `contact_form`, y quien lo envió ve "We couldn't send your request. Please call or text us."

**Independent Test**: [quickstart.md](quickstart.md) sección 3. El `curl` con `website` relleno devuelve `400` con `{"ok":false}` y no envía ningún correo. El campo no se alcanza con el tabulador y el lector de pantalla no lo anuncia. Un envío normal sigue funcionando.

### Implementation for User Story 2

- [X] T011 [P] [US2] En `src/pages/api/quote.ts`, según [contracts/quote-api.md](contracts/quote-api.md):
  - Ampliar `quoteSubmissionSchema` con `website: z.string().max(200).optional()` (regla: "Máx. 200 caracteres").
  - Justo después de la validación del esquema y antes del bloque `if (ENABLE_TURNSTILE)`, añadir `if (parsed.data.website?.trim()) return json({ ok: false }, 400);`, sin `message` y sin llamar a Turnstile ni a Resend.
  - No usar `website` en el correo.
- [X] T012 [P] [US2] En `src/data/quoteForm.ts`, cambiar `errorMessage` de `"Something went wrong. Please try again."` a `"We couldn't send your request. Please call or text us."` (research R9).
- [X] T013 [US2] En `src/components/react/QuoteForm.tsx` (después de T004, mismo archivo), añadir el campo trampa según la sección "Campo trampa en el formulario" de [contracts/quote-api.md](contracts/quote-api.md):
  - Crear `const honeypotRef = useRef<HTMLInputElement>(null);`.
  - Dentro del `<form>`, antes del botón de envío, añadir un `<div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">` con `<label htmlFor="quote-website">Leave this field empty</label>` y `<input ref={honeypotRef} id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />`.
  - No registrar el campo en react-hook-form, no añadirlo a `fieldNames` y no contarlo en la barra de progreso.
  - En el `JSON.stringify` del envío, añadir `website: honeypotRef.current?.value ?? ""`.
  - Comprobar que no aparece desplazamiento horizontal en móvil.

**Checkpoint**: US1 y US2 funcionan. Los rechazos (campo trampa, 422, 5xx) muestran el mensaje genérico y no envían `contact_form`.

---

## Phase 5: User Story 3 - El dueño activa la protección contra bots sin romper el sitio (Priority: P3)

**Goal**: La guía explica cómo activar Bot Fight Mode en el plan gratuito, cómo comprobar el sitio, el formulario y Googlebot, y cómo desactivarlo.

**Independent Test**: Seguir la sección de la guía en producción. El sitio carga, un formulario real se envía y la inspección de URL de Search Console muestra la página accesible (SC-007).

### Implementation for User Story 3

- [X] T014 [US3] Completar la sección "Bot Fight Mode" de `docs/analytics-and-bot-protection.md` (depende de T010), según research R7:
  1. **Dónde activarlo**: panel de Cloudflare → `proelitemovers.com` → Security → Settings → Bot Fight Mode.
  2. **Qué esperar**:
     - En el plan gratuito no se puede excluir `/api/quote` ni ninguna ruta con reglas de WAF o Page Rules.
     - Los bots verificados, como Googlebot, no se bloquean.
     - Turnstile y el campo trampa siguen protegiendo el formulario.
  3. **Pruebas después de activarlo**, en el móvil con datos y en un ordenador:
     - Cargar las páginas.
     - Enviar un formulario real y confirmar que llega el correo.
     - Search Console → Inspección de URL → Probar URL publicada.
     - Comprobar que siguen llegando visitas a Web Analytics.
  4. **Señales de problema**: el formulario falla con el mensaje genérico, Search Console informa de bloqueos, o caen las visitas.
  5. **Vuelta atrás**: desactivar el mismo interruptor y repetir las pruebas.

**Checkpoint**: Las tres historias están completas.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T015 Ejecutar `npm run astro -- check` y `npm run build` en la raíz. Ambos deben terminar sin errores.
- [X] T016 Validar [quickstart.md](quickstart.md) secciones 1, 2 y 3:
  - `dist/` contiene `privacy-policy/index.html` y `sitemap.xml` incluye `/privacy-policy/`.
  - Todas las páginas generadas enlazan a `/privacy-policy/`.
  - Una búsqueda en `src/` y `docs/` de `G-[A-Z0-9]{6,}`, `data-cf-beacon` y tokens no encuentra nada. El único identificador de medición permitido es el ID de Clarity existente (SC-006).
- [X] T017 Revisar los cambios contra la constitución:
  - `/privacy-policy/` con título y meta descripción únicos, un solo H1, canonical y entrada en el sitemap (principio VI).
  - Nada de `var` en el código nuevo.
  - Texto visible nuevo en inglés natural.
  - Ningún enlace roto (principio IV).
  - Sin dependencias nuevas en `package.json`.
- [ ] T018 Tras desplegar y configurar los paneles con la guía, el dueño ejecuta [quickstart.md](quickstart.md) sección 4 (SC-001, SC-002, SC-005, SC-007, SC-008, SC-009, SC-011).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: sin dependencias.
- **Foundational**: vacía.
- **US1 (T002–T010)**: después de T001.
- **US2 (T011–T013)**: después de T001. T013 va después de T004 porque comparten `QuoteForm.tsx`.
- **US3 (T014)**: después de T010, porque comparten la guía.
- **Polish (T015–T018)**: después de las historias que se quieran entregar. T018 requiere el despliegue.

### Within Each Story

- US1: T002 → T003 y T004. T005 → T006 → T007. T008, T009 y T010 son independientes.
- US2: T011 y T012 son independientes. T013 va después de T004.

### Parallel Opportunities

- Tras T001: T002, T005, T008, T009, T010, T011 y T012 tocan archivos distintos y pueden hacerse a la vez.

---

## Parallel Example: User Story 1

```text
T002 Crear src/lib/analytics.ts
T005 Añadir PrivacyPolicyContent en src/types/content.ts
T008 Añadir /privacy-policy/ en src/pages/sitemap.xml.ts
T009 Añadir el enlace en src/components/layout/Footer.astro
T010 Crear docs/analytics-and-bot-protection.md
```

## Parallel Example: User Story 2

```text
T011 Rechazar el campo trampa en src/pages/api/quote.ts
T012 Nuevo errorMessage en src/data/quoteForm.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001.
2. T002–T010.
3. Validar con [quickstart.md](quickstart.md) secciones 1 y 2, desplegar y configurar los paneles. Con eso ya se ven visitas y contactos.

### Incremental Delivery

1. US1: medición, política de privacidad y guía.
2. US2: campo trampa y mensaje genérico. Se puede desplegar por separado.
3. US3: sección de Bot Fight Mode. Es solo documentación y se activa después de comprobar US1 y US2 en producción.
