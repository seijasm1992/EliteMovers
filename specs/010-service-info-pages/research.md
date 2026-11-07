# Research: Páginas informativas para cada servicio del menú "Services"

No quedaron puntos "NEEDS CLARIFICATION" en el contexto técnico. Estas decisiones resuelven cómo aplicar el patrón existente.

## R1. Un archivo `.astro` por ruta y un archivo de datos

- **Decision**: 5 archivos en `src/pages/` (`packing-services.astro`, etc.), cada uno con 3 líneas que llaman a `getServiceInfoPage(slug)` y renderizan `ServiceInfoTemplate`. El contenido vive en `src/data/serviceInfoPages.ts`, en el orden del menú.
- **Rationale**: Es el patrón de la spec 007 (`local-moving.astro` + `movingServicePages.ts`). Las URLs quedan en la raíz con barra final, como pide FR-002.
- **Alternatives considered**: Una ruta dinámica `[slug].astro` con `getStaticPaths`. Captura cualquier slug de la raíz y rompe el patrón del proyecto.

## R2. Componentes nuevos en `service-info/`, sin tocar `service-page/`

- **Decision**: `ServiceInfoTemplate`, `ServiceInfoHero`, `ServiceInfoSteps` y `ServiceInfoClosing`. El encabezado copia la grilla y la foto de `ServiceHero` (spec 007), sin eyebrow ni botones, y reutiliza `SERVICE_HERO_IMAGE_SIZES`. Los pasos siguen el estilo visual de `MoveSteps` del home (lista numerada 01–03).
- **Rationale**: El dueño pidió un encabezado sin botones y solo con nombre, frases y foto. Agregar props condicionales a `ServiceHero` y generalizar `MovingServicePage` tocaría las 6 páginas de Moving ya publicadas. Mantener el estilo visual de componentes existentes hace que las páginas se vean del mismo sitio.
- **Alternatives considered**: Reutilizar `ServiceHero` con `showActions={false}`; reutilizar `MoveSteps` con props (hoy lee `steps.ts` directamente, y cambiarlo toca el home, fuera de alcance).

## R3. Fuentes permitidas para el contenido

- **Decision**: Solo texto ya publicado en el home: `includedServices.ts` ("What's Included"), `faqContent.ts` (FAQ), `guarantee.ts` (garantías) y `steps.ts` (proceso). `aboutUs.ts` solo para la idea de "una sola reserva en lugar de contratar por separado". Cada afirmación de [contracts/page-content.md](contracts/page-content.md) indica su fuente.
- **Rationale**: FR-005 a FR-007 y las Assumptions de la spec. La verificación de antecedentes y la revisión antes de cargar, pedidas para High-Value Items, salen de `guarantee.ts` y `steps.ts`.
- **Alternatives considered**: Ninguna; inventar datos queda prohibido por el principio II.

## R4. Fotos: recortes 4:3 de `library/`

- **Decision**: Una foto distinta por página, de `public/images/library/`, sin repetir las 6 de Moving. Con `sharp` (script de un solo uso en el scratchpad, no se versiona) se recortan en 4:3 y se generan WebP de 480, 720 y 960 px en `public/images/services/<slug>-*.webp`, sin metadatos, con el mismo objetivo de peso que la spec 007 (720 px ≲ 60 KB). Candidatas, a confirmar mirando cada foto al implementar:

  | Página | Foto candidata | Motivo |
  |--------|----------------|--------|
  | Packing Services | `stacked-boxes-hand-truck-moving-truck.webp` | Cajas cerradas y apiladas |
  | Installation | `wrapped-dresser-storage-bins-truck.webp` | Muebles envueltos listos para armar |
  | High-Value Items | `padded-wrapped-furniture-truck.webp` | Muebles con mantas acolchadas y plástico de burbujas |
  | Furniture Protection | `wrapped-doors-moving-truck.webp` | Piezas envueltas, protección visible |
  | Move Coordination | `trailer-boxes-pallet-jack.webp` | Carga organizada en el camión |

  Si una candidata no sirve al verla (por ejemplo, muestra un depósito y sugiere almacenamiento), se cambia por otra de `library/` no usada, descartando las `storage-unit-*` y `warehouse-*`, para no insinuar un servicio de almacenamiento que se quita del menú. El `alt` se escribe después de ver la foto.
- **Rationale**: Mismo pipeline y tamaños que las páginas de Moving; las de `included/` son 3:4 y ya se usan en el acordeón del home.
- **Alternatives considered**: Reusar los archivos de `public/images/included/` sin generar nada (verticales, y 3 de 5 no encajan con el servicio); servir los originales (230–440 KB, arriesga el LCP).

## R5. Encabezado: H1 igual al nombre del menú

- **Decision**: El H1 es exactamente la etiqueta del menú ("Packing Services", "Installation", etc.). Sin eyebrow.
- **Rationale**: La spec pide "nombre del servicio, 2 o 3 frases y foto". El H1 coincide con lo que el visitante pulsó.
- **Alternatives considered**: Un H1 más largo con "in Miami"; la localidad va en el título de la página y en la meta description.

## R6. Sección de pasos: título propio por página

- **Decision**: La sección tiene un eyebrow fijo "How We Do It" y un H2 propio por página ("How We Pack Your Home", etc.). Cada paso tiene título corto y una frase o dos.
- **Rationale**: Un H2 por sección mantiene la jerarquía (un H1, principio VI), y un título propio cumple FR-008.

## R7. Línea de cierre como enlace de texto

- **Decision**: Un `<p>` centrado con un único `<a href="/get-a-quote/">` cuyo texto es la línea completa, terminada en "→". El enlace usa el estilo de enlace del sitio (color de marca, subrayado al pasar el cursor), no las clases de `Button`. La flecha va dentro del texto y se oculta a lectores de pantalla con `aria-hidden`.
- **Rationale**: FR-003 punto 3: "una sola línea de texto con enlace, no es un botón".

## R8. Menú "Services" derivado de los datos

- **Decision**: En `navigation.ts`, `children: serviceInfoPages.map(({ label, href }) => ({ label, href }))`. El `href` del padre "Services" (`/#included`) no cambia.
- **Rationale**: Igual que el menú "Moving". Elimina "Storage Solutions" y evita que menú y páginas se desincronicen. El footer recorre `navigation`, así que no se edita.

## R9. SEO: metadatos, schema y sitemap

- **Decision**: `meta.title` y `meta.description` por página en los datos. `ServiceInfoTemplate` pasa a `BaseLayout` el título, la descripción, la foto de 960 px como imagen social con su alt, y `preloadImage`. JSON-LD `MovingCompany` (nombre, URL, teléfono, email y `areaServed` Miami-Dade y Broward desde `site.ts`) y `BreadcrumbList` Home → página, igual que `ServicePageTemplate`. `sitemap.xml.ts` suma `serviceInfoPages.map((p) => p.href)`.
- **Rationale**: Principio VI y FR-015 a FR-017. El bloque de schema se duplica en cada plantilla, que es lo que ya hacen `faq.astro` y `ServicePageTemplate`; extraerlo sería una refactorización no pedida.

## Imágenes elegidas (T002–T003, 2026-11-07)

Se miraron las 5 candidatas de R4 y 2 alternativas. Cambios respecto de R4:

- **Installation**: `wrapped-doors-moving-truck.webp` en lugar de `wrapped-dresser-storage-bins-truck.webp`. Muestra puertas y paneles desarmados, que encajan con desarmado y armado; la otra mostraba cajas plásticas y papel higiénico arriba.
- **Furniture Protection**: `green-wrapped-furniture-truck.webp`, recortada a la derecha para dejar fuera las cajas de Home Depot y U-Haul.
- **Move Coordination**: `trailer-boxes-pallet-jack.webp` se descartó porque las cajas U-Haul (marca de mudanzas) se ven en primer plano. Se usó `public/images/included/boxes-loading-ramp-960.webp` (no hay original en `library/`; mide 960 px de ancho, así que el recorte de 960 no se amplía). Ya aparece en el acordeón del home, pero no en otra página de servicio.
- **Packing Services**: recorte que deja fuera la bolsa con el precio "Move Deal $10" de un tercero y el texto de la rampa.

Recorte 4:3, WebP sin metadatos, `effort: 6`. Calidad por foto ajustada para que la de 720 px pese ≤ 60 KB (74, 74, 66, 42 y 54); 720 px entre 30 y 59 KB.

| Página | Foto | Alt |
|--------|------|-----|
| Packing Services | `library/stacked-boxes-hand-truck-moving-truck.webp` | Rows of packed and taped moving boxes stacked inside a truck |
| Installation | `library/wrapped-doors-moving-truck.webp` | Disassembled white furniture panels and louvered doors wrapped in plastic, standing upright in a moving truck |
| High-Value Items | `library/padded-wrapped-furniture-truck.webp` | Furniture covered in bubble wrap, moving blankets and padded bags, loaded upright in a moving truck |
| Furniture Protection | `library/green-wrapped-furniture-truck.webp` | Furniture wrapped in moving blankets and stretch wrap inside a moving truck |
| Move Coordination | `included/boxes-loading-ramp-960.webp` | Mover loading boxes into a trailer parked in a residential driveway, with a loading ramp in place |
