# Research: Páginas propias para cada servicio del menú "Moving"

Fase 0 del plan. La spec no deja preguntas abiertas: las decisiones de abajo resuelven cómo construir las páginas, no qué construir.

## R1. Rutas: 6 archivos de página en lugar de una ruta dinámica

- **Decision**: Un archivo por página en `src/pages/` (`local-moving.astro`, etc.). Cada uno importa su entrada de `movingServicePages.ts` y la pasa a `ServicePageTemplate.astro`.
- **Rationale**: Las URLs van en la raíz (aclaración Q1). Una ruta `src/pages/[slug].astro` competiría con cualquier página futura de la raíz y obligaría a mantener `getStaticPaths`. Con 6 archivos, cada URL tiene un archivo que se encuentra con una búsqueda y que el build prerenderiza por defecto.
- **Alternatives considered**: `[slug].astro` con `getStaticPaths`, que duplica menos pero es una captura amplia en la raíz. `/moving/[slug].astro`, descartada por la aclaración Q1.

## R2. Una sola fuente para la lista de servicios

- **Decision**: `movingServicePages.ts` exporta un arreglo ordenado con `slug`, `label` y `href` de cada página. `navigation.ts` construye los hijos de "Moving" desde ese arreglo, y `ServiceRelated` y `sitemap.xml.ts` lo leen también.
- **Rationale**: Una sola lista evita que el navbar, el footer, los enlaces cruzados y el sitemap se desincronicen (FR-013, FR-016, FR-018). Las etiquetas del menú no cambian.
- **Alternatives considered**: Escribir los `href` a mano en `navigation.ts`, que obliga a repetir las rutas en 3 lugares.

## R3. Datos de cobro sin montos

- **Decision**: `pricing.ts` guarda solo lo que se puede publicar: `minimumHours: 4`, la lista de lo que incluye la tarifa (truck, 2 movers, moving pads, plastic wrap, tools), que se pueden sumar movers y el área base ("Miami-Dade and Broward, up to Pompano Beach"), con un texto para zonas más lejanas. Los USD 135 y USD 40 por hora no se escriben en el repositorio.
- **Rationale**: El dueño decidió dar los montos solo al cotizar. Lo que no está en el código no se puede filtrar en el HTML ni en el schema, y el repositorio es público (spec 006). FR-009a pide una sola fuente.
- **Alternatives considered**: Guardar los montos con una bandera `publish: false`, descartado porque basta un error para mostrarlos.

## R4. Preguntas frecuentes con `<details>` nativo

- **Decision**: `ServiceFaq.astro` pinta cada pregunta como `<details>`/`<summary>` y las estiliza con Tailwind. No usa `FAQSection.tsx`.
- **Rationale**: Principio X. Cada página tiene entre 4 y 6 preguntas de un solo tema, así que el filtro por categorías del componente React del home no aporta nada. `<details>` es accesible con teclado y lector de pantalla sin JS.
- **Alternatives considered**: Reutilizar `FAQSection.tsx` con `client:visible`, que suma una isla de React a cada página.

## R5. Imágenes: fotos de `library/` con variantes de 480 y 720 px

- **Decision**: Una foto por página, tomada de `public/images/library/` (aprobada en las specs 001 y 006). Con `sharp` se generan dos variantes WebP en `public/images/services/<slug>-480.webp` y `-720.webp`, sin metadatos, con la proporción del encabezado (igual que `AboutHero`, 3:4). Candidatas, a confirmar mirando cada foto al implementar:

  | Página | Foto candidata |
  |--------|----------------|
  | Local Moving | `box-truck-liftgate-house-driveway.webp` |
  | Long Distance Moving | `mattress-boxes-strapped-moving-truck.webp` |
  | Office Moving | `stacked-storage-totes-moving-truck.webp` |
  | Commercial Moving | `box-truck-warehouse-dock-door.webp` |
  | Small Moves | `condo-room-packed-boxes-bags.webp` |
  | Large Moves | `wrapped-furniture-shelving-truck.webp` |

  El `alt` se escribe después de ver la foto, describiendo lo que muestra.
- **Rationale**: Los originales pesan 226–438 KB a 1536 px; servirlos en móvil arriesga el LCP (principio IX). La spec 006 ya usó `sharp` como herramienta de un solo uso. Las fotos no se repiten entre páginas y no coinciden con la foto del hero del home.
- **Alternatives considered**: `astro:assets`, que obliga a mover las fotos a `src/` y cambia el patrón del proyecto, que sirve todo desde `public/`. Usar los originales tal cual.

## R6. Precarga de la imagen del encabezado

- **Decision**: `BaseLayout.astro` recibe una prop opcional `preloadImage` (`{ href, srcset, sizes }`) y la usa en lugar de la condición fija `isHomePage`. Si la prop no llega, el home se comporta igual que hoy.
- **Rationale**: Hoy la precarga solo existe para el home. La foto del encabezado puede ser el elemento LCP de cada página de servicio.
- **Alternatives considered**: Sin precarga, que arriesga el LCP. Un `<link>` en cada página, que obliga a meter un slot en el `<head>` del layout.

## R7. JSON-LD por página

- **Decision**: `ServicePageTemplate` arma tres objetos y los escapa como en `about-us.astro`:
  1. `MovingCompany`: `name`, `url` (home), `telephone` y `email` desde `site.ts`; `areaServed` con Miami-Dade County y Broward County, que es lo que la página muestra en "How pricing works". Sin `address`, `priceRange`, `aggregateRating` ni `review`.
  2. `BreadcrumbList`: Home → nombre del servicio.
  3. `FAQPage` con las preguntas visibles de esa página.
- **Rationale**: Principio VI (schema coherente con lo visible) y principio II (sin calificaciones). El sitio no publica dirección, así que el schema tampoco.
- **Alternatives considered**: `Service` con `provider: MovingCompany`, válido pero sin ganancia clara. Se puede agregar más adelante sin cambiar el contenido.

## R8. Reseñas condicionales

- **Decision**: `reviews.ts` exporta `reviews: Review[] = []`. `ServiceReviews` no pinta nada si no hay reseñas del servicio de la página (o generales). La plantilla mantiene su posición, después de Garantías y antes de FAQ.
- **Rationale**: Aclaración Q2 y principio II. Cuando el dueño entregue reseñas, se agregan como datos y la sección aparece sin tocar las páginas.
- **Alternatives considered**: No crear el componente hasta tener reseñas, lo que obligaría a volver a tocar la plantilla. El costo del componente es mínimo.

## R9. Garantías: qué se puede afirmar

- **Decision**: Se muestran 3 tarjetas con datos ya publicados en `guarantee.ts` y `faqContent.ts`:
  - **Furniture and property protection**: wrap, protección de pisos, puertas y áreas de paso.
  - **Background-checked crew**: con verificación de antecedentes, capacitado y con uniforme.
  - **Insured**: "general liability insurance, subject to standard exclusions", con la invitación a pedir los detalles de cobertura.

  La tarjeta de licencia no se pinta mientras `pricing`/`credentials` no tenga un número confirmado.
- **Rationale**: FR-005, FR-006 y el caso límite de la licencia en la spec.
- **Alternatives considered**: Una tarjeta "Licensed in Florida" sin número, descartada por el principio II.

## R10. Contenido propio por servicio

- **Decision**: Cada entrada de `movingServicePages.ts` lleva su propio texto para el encabezado, "What's included" (4–6 puntos), "How it works" (4 pasos adaptados), una frase de cobro propia del servicio, FAQ (4–6) y metadatos. Ángulo de cada página:

  | Página | Ángulo | Temas propios |
  |--------|--------|---------------|
  | Local Moving | Distancia corta dentro del área base | Reglas de mudanza de condominios y edificios, ascensor de carga, estacionamiento, por qué el reloj corre igual en mudanzas cortas, mudanza el mismo día |
  | Long Distance Moving | Mudanzas dentro de Florida fuera del área base | Planificación de ruta y orden de carga, sujeción para el viaje, ventana de entrega, cotización aparte fuera del área base, entre estados con un socio de referidos |
  | Office Moving | Oficinas y equipos de trabajo | Estaciones de trabajo, archivos, TI, etiquetado por escritorio, mudanza fuera de horario o en fin de semana, contacto único |
  | Commercial Moving | Locales, tiendas y almacenes | Mercancía, estanterías, muelles de carga, reglas del administrador de la propiedad, mudanza por fases para no cerrar |
  | Small Moves | Estudio, 1 habitación o pocos muebles | El mínimo de 4 horas explicado con claridad, qué cabe en una mudanza chica, sumar empaque o armado en la misma reserva |
  | Large Moves | Casas y apartamentos de 3 o más habitaciones | Movers adicionales, empaque previo (mínimo de 3 horas), desarmado y armado, protección de la casa durante un día largo |

- **Rationale**: FR-007 y SC-005. Los datos de negocio repetidos (horario, sin depósito, mínimo de 4 horas) pueden aparecer en varias páginas, pero redactados para cada contexto.
- **Alternatives considered**: Una plantilla de texto con el nombre del servicio intercalado, que viola FR-007.

## R11. Metadatos

- **Decision**: Título con el formato `<Servicio> in Miami | ProElite Movers`, ajustado a ≤ 60 caracteres. Meta description propia de 140–160 caracteres, sin precios. Long Distance usa "Florida" en lugar de "Miami".
- **Rationale**: FR-015. El formato sigue al de `about-us` y deja el nombre de marca al final.
- **Alternatives considered**: Títulos sin ciudad, que pierden relevancia local (principio VIII).

## Imágenes elegidas (T001, 2026-11-07)

Se miraron las 6 candidatas y se usaron todas. Ninguna muestra marcas de otras empresas de mudanzas ni clientes identificables. Las cajas de Home Depot y Public Storage son productos de terceros y ya se aprobaron en las specs 001 y 006.

**Cambio respecto de R5**: Las fotos son verticales y en la de Local casi la mitad es cielo. Se recortan en horizontal 4:3, para un encabezado de dos columnas en escritorio con la foto debajo del texto en móvil, y se generan en 480, 720 y 960 px. La de 720 px pesa como máximo 53 KB.

| Página | Foto | Alt |
|--------|------|-----|
| Local Moving | `box-truck-liftgate-house-driveway.webp` | Moving truck with its liftgate down in front of a two-story house, with hand trucks in the driveway |
| Long Distance Moving | `mattress-boxes-strapped-moving-truck.webp` | Boxes and a plastic-covered mattress secured with ratchet straps inside a moving truck |
| Office Moving | `stacked-storage-totes-moving-truck.webp` | Rows of black and yellow storage totes stacked tightly inside a moving truck |
| Commercial Moving | `box-truck-warehouse-dock-door.webp` | Box truck parked at an open warehouse dock door, with a pallet jack on the concrete floor |
| Small Moves | `condo-room-packed-boxes-bags.webp` | Packed boxes, bags and a blanket-wrapped piece of furniture ready to go in a condo |
| Large Moves | `wrapped-furniture-shelving-truck.webp` | Moving truck loaded with plastic-wrapped furniture, boxes, a wire shelf and a bench |

---

## Revisión 2026-11-07: alcance reducido a 2 secciones

La spec pasó de 8 secciones a 2 (encabezado y "Qué incluye"). Estas decisiones reemplazan a las anteriores donde se contradicen:

| Decisión anterior | Estado |
|-------------------|--------|
| R1 (6 archivos de página), R2 (lista única de servicios), R5 e "Imágenes elegidas", R6 (precarga), R11 (metadatos) | Siguen vigentes |
| R3 (datos de cobro), R4 (FAQ con `<details>`), R8 (reseñas condicionales), R9 (garantías) | **Obsoletas**: sus secciones quedaron fuera de alcance |
| R7 (JSON-LD) | Vigente sin `FAQPage` (R14) |
| R10 (ángulos de contenido) | Vigente solo para el párrafo del encabezado y "Qué incluye" |

## R12. El contenido actual ya cumple los nuevos límites

- **Decision**: Se mantienen tal cual los párrafos del encabezado y los puntos de "Qué incluye" de `movingServicePages.ts`.
- **Rationale**: Los 6 párrafos tienen 2 frases (la spec pide de 2 a 3) y las listas tienen 5 puntos, salvo Small Moves con 4 (la spec pide de 3 a 5). Ya pasaron la comparación de frases repetidas entre páginas y la revisión de datos sin fuente.
- **Alternatives considered**: Reescribir el texto para compensar las secciones retiradas, sin pedido del dueño. Se puede hacer después si el dueño quiere páginas más largas.

## R13. Borrar el código fuera de alcance en lugar de dejarlo inactivo

- **Decision**: Se borran `ServiceProcess`, `ServicePricing`, `ServiceGuarantees`, `ServiceReviews`, `ServiceFaq` y `ServiceRelated`, `src/data/pricing.ts`, `src/data/reviews.ts`, los tipos `PricingFacts`, `Credentials` y `Review`, y los campos `process`, `pricingNote`, `faq`, `relatedIntro` e `included.intro` de `MovingServicePage`.
- **Rationale**: Principio XII. Dejar componentes sin usar invita a que vuelvan a aparecer sin revisión. Si las secciones vuelven en una feature futura, se recuperan del historial de git (commit de esta rama antes de la reducción) y se revisan contra la spec de ese momento.
- **Alternatives considered**: Quitar las secciones solo de la plantilla y conservar los archivos. Es más rápido, pero deja código y datos sin uso, incluidos textos de cobro que el dueño no aprobó para publicar en esta versión.

## R14. JSON-LD sin `FAQPage`

- **Decision**: Cada página emite solo `MovingCompany` y `BreadcrumbList`.
- **Rationale**: Principio VI: el schema debe coincidir con lo visible. Sin preguntas en la página, un `FAQPage` sería contenido marcado que el visitante no ve, algo que Google desaconseja.
- **Alternatives considered**: Ninguna razonable.
