# Tasks: Menú de navegación estable y botón Call Now destacado

**Input**: Design documents from `specs/004-stable-nav-menu/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/nav-menu-ui.md](./contracts/nav-menu-ui.md), [quickstart.md](./quickstart.md)

**Tests**: La spec no pide tests automáticos y el proyecto no tiene scripts de test (CLAUDE.md; constitución XII prohíbe dependencias no pedidas). La verificación es `npm run astro -- check`, `npm run build` y las secciones de [quickstart.md](./quickstart.md).

**Organization**: Tareas agrupadas por historia de usuario. Todo el código cambia en un solo archivo, `src/components/react/NavMenu.tsx`, así que las tareas de código son secuenciales (sin `[P]`). No se tocan `src/data/navigation.ts`, `src/types/content.ts`, `src/components/layout/Navbar.astro` ni `src/styles/global.css` (FR-015, plan).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias)
- **[Story]**: Historia de usuario (US1, US2, US3)

## Path Conventions

- Código: `src/components/react/NavMenu.tsx` (abreviado como **NavMenu**)
- "Principal" = el `<a>` de primer nivel de un `NavItem` con `children` (Moving, Locations, Services, Company)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Partir de un estado conocido.

- [X] T001 Crear la rama `004-stable-nav-menu` desde `master` (`git switch -c 004-stable-nav-menu`) y confirmar que `npm run astro -- check` y `npm run build` pasan antes de cambiar nada, para separar errores previos de los nuevos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Limpiar las causas compartidas del fallo (research R0: C1, C2, C3) y crear las piezas comunes de estado que usan US1 y US2.

**⚠️ CRITICAL**: US1 y US2 dependen de esta fase.

- [X] T002 En `src/components/react/NavMenu.tsx`, renombrar el estado `openDropdown` a `openMenu` (`string | null`, data-model) en todos sus usos, añadir la constante de módulo `const CLOSE_DELAY_MS = 300;` y una ref `lastPointerType = useRef<string | null>(null)`. Crear las funciones `openMenuNow(label)` (cancela `closeTimer` y fija `openMenu`), `closeMenuNow()` (cancela `closeTimer` y pone `null`) y `scheduleClose()` (reprograma `closeTimer` a `CLOSE_DELAY_MS`), sustituyendo `openMenu`/`scheduleClose` actuales (140 ms). Mantener `openMobileMenu` cerrando el menú de escritorio.
- [X] T003 En `src/components/react/NavMenu.tsx`, eliminar `handleBlur` y el `onBlur={handleBlur}` del `<header>` (causa C1), y eliminar el `onFocus` del principal para que recibir el foco no abra el menú (C3, FR-007).
- [X] T004 En `src/components/react/NavMenu.tsx`, en la capa oscura "Desktop dropdown overlay": quitar `onMouseEnter={scheduleClose}` (C2) y añadir `onClick={closeMenuNow}`. Mantener sus clases visuales (`bg-ink/20 backdrop-blur-[1px]`) y su visibilidad ligada a `openMenu !== null` (FR-004a, research R5).
- [X] T005 En `src/components/react/NavMenu.tsx`, dar a cada panel de escritorio `id={\`desktop-submenu-${slug}\`}` (slug = `label` en minúsculas con espacios → `-`) y al principal `aria-controls` con ese id y `aria-expanded={isOpen}`; quitar `aria-haspopup` (contrato §1, research R6, FR-008).

**Checkpoint**: `npm run astro -- check` pasa. El menú todavía abre con hover (aún con `onMouseEnter`), ya no lo cierra la capa ni la pérdida de foco.

---

## Phase 3: User Story 1 - Abrir un menú con el cursor y llegar a sus opciones (Priority: P1) 🎯 MVP

**Goal**: Con ratón, cada menú se abre, permite llegar y hacer clic en todas sus opciones, perdona salidas cortas y cambia de menú sin parpadeo.

**Independent Test**: [quickstart.md](./quickstart.md) sección A en Chrome, Safari y Firefox (ventana ≥ 1024px).

### Implementation for User Story 1

- [X] T006 [US1] En `src/components/react/NavMenu.tsx`, sustituir en cada `<li>` de escritorio `onMouseEnter`/`onMouseLeave` por `onPointerEnter={(e) => e.pointerType === "mouse" && item.children && openMenuNow(item.label)}` y `onPointerLeave={(e) => e.pointerType === "mouse" && item.children && scheduleClose()}`; quitar los `onMouseEnter`/`onMouseLeave` duplicados del contenedor del panel (el panel es descendiente del `<li>`, así que el `<li>` cubre enlace, hueco `pt-3` y panel). Cumple FR-002, FR-003 y el escenario "vuelvo enseguida".
- [X] T007 [US1] En `src/components/react/NavMenu.tsx`, añadir un efecto que, solo mientras `openMenu !== null`, registre `pointerdown` en `document` y llame a `closeMenuNow()` si el objetivo no está dentro del `<li>` abierto (usar una ref o `closest("[data-nav-item]")` con `data-nav-item={item.label}` en el `<li>`); limpiar el listener al cerrar (research R3, contrato §2 "clic fuera").
- [X] T008 [US1] En `src/components/react/NavMenu.tsx`, añadir `onClick={closeMenuNow}` a cada enlace de opción del panel de escritorio, sin `preventDefault`, para que navegue y cierre (FR-009).
- [X] T009 [US1] En `src/components/react/NavMenu.tsx`, hacer que el panel saliente desaparezca sin transición cuando otro menú se abre: si `!isOpen && openMenu !== null`, aplicar `transition-none` en lugar de `transition-all duration-200`; la transición de salida queda solo cuando `openMenu === null`. Añadir `motion-reduce:transition-none motion-reduce:translate-y-0` al panel (research R4 y R8, FR-004, SC-003).
- [ ] T010 [US1] Verificar US1 con [quickstart.md](./quickstart.md) A1–A7 (incluido A7, clic en "About" en Safari al primer intento) y con `npm run astro -- check`.

**Checkpoint**: Con ratón, los cuatro menús funcionan en los tres navegadores. Táctil y teclado aún sin tratar.

---

## Phase 4: User Story 2 - Abrir y cerrar menús con toque o teclado de forma predecible (Priority: P1)

**Goal**: Primer toque abre y el segundo navega; Enter/Espacio/Escape/Tab según la clarificación 2; lectores de pantalla anuncian el estado; el cajón móvil sigue igual.

**Independent Test**: [quickstart.md](./quickstart.md) secciones B, C, D y F.

### Implementation for User Story 2

- [X] T011 [US2] En `src/components/react/NavMenu.tsx`, en el principal: `onPointerDown={(e) => { lastPointerType.current = e.pointerType; }}` y `onClick` que, si `item.children`, `lastPointerType.current` es `"touch"` o `"pen"` y `!isOpen`, haga `e.preventDefault()` y `openMenuNow(item.label)`; en cualquier otro caso deja la navegación por defecto. Tras el clic, reiniciar `lastPointerType.current = null` para que un Enter posterior no se confunda con un toque (FR-005, FR-005a, research R1, contrato §2).
- [X] T012 [US2] En `src/components/react/NavMenu.tsx`, añadir `onKeyDown` al principal (solo si `item.children`): menú cerrado + `Enter` o `" "` → `preventDefault()` y `openMenuNow`; menú abierto + `" "` → `preventDefault()` y `closeMenuNow`; menú abierto + `Enter` → no hacer nada (navega por defecto) (FR-006, clarificación 2).
- [X] T013 [US2] En `src/components/react/NavMenu.tsx`, Escape: añadir una ref por principal (p. ej. `Map<string, HTMLAnchorElement>` en `useRef`) y cambiar el manejador global de `keydown` para que, sin cajón móvil abierto y con `openMenu !== null`, cierre el menú y, si `document.activeElement` está dentro del `<li>` abierto, devuelva el foco a su principal (FR-006, US2 escenario 7). El comportamiento de Escape del cajón móvil no cambia.
- [X] T014 [US2] En `src/components/react/NavMenu.tsx`, añadir `onBlur` a cada `<li>` de escritorio: cerrar solo si `e.relatedTarget` es un `Node` no nulo y `!e.currentTarget.contains(e.relatedTarget)`; si `relatedTarget` es `null`, no cerrar (research R3; corrige C1 y cumple "Tab tras la última opción cierra").
- [X] T015 [US2] En `src/components/react/NavMenu.tsx`, añadir un efecto con `window.matchMedia("(min-width: 64rem)")` que, en su evento `change`, llame a `closeMenuNow()` al pasar a `matches === false` y a `setIsMobileMenuOpen(false)` / `setActiveAccordion(null)` al pasar a `matches === true` (sin mover el foco a la hamburguesa oculta); limpiar el listener al desmontar (research R8, casos límite de cambio de tamaño, contrato §7).
- [ ] T016 [US2] Verificar US2 con [quickstart.md](./quickstart.md) B1–B5 (tableta o emulación táctil), C1–C6, D1–D2 (VoiceOver o NVDA) y F1–F4 (cajón móvil sin regresiones, FR-011).

**Checkpoint**: US1 y US2 funcionan juntas con ratón, toque y teclado.

---

## Phase 5: User Story 3 - Ver Call Now siempre destacado (Priority: P2)

**Goal**: Call Now siempre amarillo con texto oscuro legible y foco visible; foco visible en todo el navbar oscuro.

**Independent Test**: [quickstart.md](./quickstart.md) sección E y C1.

### Implementation for User Story 3

- [X] T017 [US3] En `src/components/react/NavMenu.tsx`, en el enlace Call Now de escritorio, sustituir el ternario sobre `scrolled` por clases fijas `bg-brand-yellow text-brand-primary hover:bg-[#ffe36f]`, y añadir `focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white`. No cambiar `href={site.phoneHref}`, `site.phone` ni el texto "Call Now" (FR-012, FR-013, FR-014, FR-015, contrato §5). Contraste documentado: 14.2:1 (teléfono) y 6.6:1 (etiqueta al 70 %).
- [X] T018 [US3] En `src/components/react/NavMenu.tsx`, añadir `focus-visible:outline-brand-yellow` al enlace del logo y a los principales de escritorio (y al botón hamburguesa), para que el contorno de foco global (`ink`) no quede invisible sobre `brand-primary` (contrato §6, research R7). Las opciones dentro del panel blanco conservan el foco global.
- [ ] T019 [US3] Verificar US3 con [quickstart.md](./quickstart.md) E1–E4 y C1.

**Checkpoint**: Las tres historias funcionan de forma independiente.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T020 Revisar `src/components/react/NavMenu.tsx`: sin `var`, sin código muerto (`handleBlur`, `openDropdown`, `onMouseEnter`/`onMouseLeave` restantes del escritorio, `aria-haspopup`), sin dependencias nuevas en `package.json`, y sin cambios en `src/data/navigation.ts` (`git diff --stat` solo muestra `NavMenu.tsx` y archivos de `specs/`). Constitución IV, VII, X, XII.
- [X] T021 Ejecutar `npm run astro -- check` y `npm run build`; ambos deben terminar sin errores.
- [ ] T022 Pasar la verificación completa de [quickstart.md](./quickstart.md) (A–G) en Chrome, Safari y Firefox de escritorio, una tableta y un móvil, y anotar en el resumen de la implementación cualquier punto no verificado (por ejemplo, si no hay un dispositivo real disponible).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de T001; bloquea US1 y US2.
- **US1 (Phase 3)** y **US2 (Phase 4)**: dependen de la fase 2. US2 reutiliza `openMenuNow`, `closeMenuNow` y el efecto de clic fuera de T007, así que se hace después de US1.
- **US3 (Phase 5)**: solo depende de T001; no usa el estado del menú. Se puede hacer antes o después de US1/US2, pero en serie porque edita el mismo archivo.
- **Polish (Phase 6)**: después de todas las historias.

### User Story Dependencies

- **US1 (P1)**: tras la fase 2.
- **US2 (P1)**: tras US1 (T007 cubre "tocar fuera").
- **US3 (P2)**: independiente.

### Within Each User Story

- Las tareas de código van en orden de ID; la tarea de verificación cierra cada historia.

### Parallel Opportunities

- Pocas: todo el código está en `NavMenu.tsx`. Lo único paralelizable es la verificación manual entre navegadores y dispositivos (T010, T016, T019, T022) si hay varias personas probando.

---

## Parallel Example: User Story 1

```text
# Tras T009, verificar en paralelo en distintos navegadores:
T010 (Chrome)  ·  T010 (Safari)  ·  T010 (Firefox)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Fase 1 → Fase 2 → Fase 3.
2. **Parar y validar**: quickstart A en los tres navegadores. Resuelve el fallo principal reportado (Company se cierra solo).

### Incremental Delivery

1. Fases 1–2 → base limpia.
2. US1 → ratón estable (MVP).
3. US2 → táctil, teclado, lector de pantalla y cambio de tamaño.
4. US3 → Call Now siempre amarillo y foco visible.
5. Fase 6 → revisión, build y verificación completa.

---

## Notes

- Un solo archivo de código: hacer commit al final de cada fase facilita revertir.
- Los valores de data-model se aplican literalmente: `CLOSE_DELAY_MS = 300`, breakpoint `(min-width: 64rem)`, `openMenu: string | null`.
- No cambiar textos visibles, `href`, el teléfono ni las páginas (FR-015).

## Registro de implementación (2026-11-06)

- Tareas de código T001–T009, T011–T015, T017, T018, T020 y T021 hechas. Solo cambia `src/components/react/NavMenu.tsx`.
- `npm run astro -- check`: 0 errores en `NavMenu.tsx`. Los 3 errores que aparecen son de `astro.config.mjs` (`process` sin tipos de Node) y ya existían antes de este feature.
- `npm run build`: pasa con `ENABLE_TURNSTILE=false`. Sin esa variable, la build local se detiene porque `.env` no tiene `PUBLIC_TURNSTILE_SITE_KEY`; también pasaba antes de este feature.
- Prueba automática en Chrome sin interfaz, vía protocolo DevTools (script en el scratchpad; no se añadió nada al repositorio): 26/28. Cubre quickstart A1–A6, B1–B5, C1–C6, E1 y F1–F4. Los 2 "fallos" (C7, C8) leyeron el color del contorno durante su `transition-colors` de 150 ms (rgb(254,254,254) en vez de blanco, rgb(255,217,81) en vez de #ffd84d); los colores finales son correctos.
- Pendiente de verificación manual, por eso T010, T016, T019 y T022 siguen abiertas: Safari y Firefox de escritorio, tableta y móvil reales, lector de pantalla (quickstart D), movimiento reducido (G) y contraste con un comprobador WCAG (E4).
