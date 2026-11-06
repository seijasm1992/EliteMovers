# Research: Menú de navegación estable y botón Call Now destacado

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-11-06

No quedaban `NEEDS CLARIFICATION` en el contexto técnico. Esta fase documenta las causas del fallo actual en `src/components/react/NavMenu.tsx` y las decisiones de diseño para corregirlo.

## R0. Diagnóstico del comportamiento actual

Causas encontradas leyendo el componente (líneas aproximadas):

| # | Causa | Dónde | Síntoma que explica |
|---|---|---|---|
| C1 | `handleBlur` en el `<header>` cierra el menú si `relatedTarget` está fuera del header. En Safari (y Firefox en macOS) un clic en un `<a>` no le da el foco, así que al pulsar una opción el foco sale con `relatedTarget = null` y el menú se cierra en el `mousedown`, antes del `click`. | `handleBlur`, `onBlur` del header | "No da tiempo a elegir una opción"; el clic se pierde, sobre todo en Safari. |
| C2 | La capa oscura tiene `onMouseEnter={scheduleClose}` y cubre todo el viewport, incluidas las franjas del navbar fuera de `container-x` y los huecos entre botones. Rozarla programa un cierre de 140 ms. | Overlay "Desktop dropdown overlay" | "Se abre y se cierra solo", parpadeos al mover el cursor por el navbar. |
| C3 | El enlace principal abre con `onFocus`. Tras un clic con ratón el foco queda en ese enlace; combinado con C1/C2 provoca aperturas y cierres que no siguen al cursor. Con Tab, cada menú se abre al pasar (contradice FR-007). | `onFocus` del enlace principal | Menús que se abren solos; navegación con teclado ruidosa. |
| C4 | En táctil, el toque genera `mouseenter` (abre) y `click` en el mismo gesto, así que navega a `item.href` en lugar de dejar el menú abierto. | Enlace principal sin manejo de `pointerType` | En tableta, el menú no se puede usar. |
| C5 | Al cambiar de menú, el panel anterior se desvanece con `transition-all duration-200` mientras el nuevo aparece: durante 200 ms se ven dos paneles. | Clases del panel | Parpadeo al pasar de Moving a Services. |
| C6 | Margen de cierre de 140 ms: demasiado corto para perdonar una salida accidental. | `scheduleClose` | "Si salgo por accidente, se cierra". |
| C7 | Call Now cambia a `bg-ink text-white` cuando `scrolled`. El fondo del header es siempre `brand-primary` (#020c15), así que un botón #101820 casi desaparece. | Clases del botón Call Now | "Call Now pierde visibilidad al hacer scroll". |
| C8 | El foco global (`:focus-visible { outline: 2px solid var(--color-ink) }`) es casi negro sobre el header casi negro: el foco no se ve en el navbar. | `src/styles/global.css` | Incumple FR-014 y dificulta SC-005. |

Company es donde más se nota porque es el último elemento: su panel queda junto a Call Now y la franja lateral fuera de `container-x` (C2), y sus opciones incluyen `/about-us/`, una navegación real donde el clic perdido (C1) es evidente.

## R1. Distinguir ratón, toque y teclado

- **Decision**: Usar Pointer Events y registrar el `pointerType` del último `pointerdown` sobre el enlace principal. Hover (`pointerenter`/`pointerleave`) solo actúa cuando `pointerType === "mouse"`. En el `click` del enlace principal: si el último puntero fue `touch` o `pen` y el menú está cerrado, `preventDefault()` y abrir; si está abierto, dejar navegar. Con ratón el clic navega siempre.
- **Rationale**: Cumple la clarificación B (primer toque abre, segundo navega; con ratón navega) y funciona en dispositivos híbridos, porque decide por gesto y no por tipo de dispositivo. Pointer Events está soportado en Chrome, Safari (13+) y Firefox.
- **Alternatives considered**: `matchMedia("(hover: hover)")` (falla en portátiles táctiles: decide por dispositivo, no por gesto); `touchstart` + `mouseenter` (eventos duplicados y emulados, más frágil).

## R2. Teclado

- **Decision**: `onKeyDown` en el enlace principal. Menú cerrado: Enter o Espacio → `preventDefault()` y abrir. Menú abierto: Enter → navegación por defecto; Espacio → `preventDefault()` y cerrar. Escape (en el enlace o en cualquier opción del panel) → cerrar y devolver el foco al enlace principal. Se elimina la apertura con `onFocus`.
- **Rationale**: Es exactamente la clarificación 2. El panel sigue al enlace en el orden del DOM, así que Tab recorre las opciones sin gestión extra.
- **Alternatives considered**: Flechas tipo `role="menu"` (patrón de menú de aplicación, excesivo para navegación de un sitio y exige gestionar el foco con `tabindex` móvil); dejar `onFocus` (contradice FR-007).

## R3. Cierre: margen, foco y clic fuera

- **Decision**:
  - Constante `CLOSE_DELAY_MS = 300`. Salir con el ratón del `<li>` (que contiene enlace, hueco `pt-3` y panel) programa el cierre; volver lo cancela.
  - Cierre por foco con `onBlur` en cada `<li>` (no en el header): cierra solo si `relatedTarget` es un elemento fuera de ese `<li>`. Si `relatedTarget` es `null` (clic en algo no enfocable, o clic en un enlace en Safari) no se cierra por foco.
  - Un listener de `pointerdown` en `document`, activo solo mientras hay un menú abierto, cierra si el objetivo está fuera del `<li>` abierto. Cubre "tocar fuera" y "clic fuera".
  - Al hacer clic en una opción del panel se cierra el menú inmediatamente (FR-009).
- **Rationale**: Elimina C1 (el foco nulo ya no cierra), cumple FR-003 y el escenario de Tab tras la última opción (el foco pasa a un elemento fuera del `<li>`).
- **Alternatives considered**: Mantener `onBlur` en el header (reproduce C1); "safe triangle" para el movimiento diagonal (innecesario: el panel está centrado bajo su botón, el hueco ya está cubierto por el `pt-3` dentro del `<li>` y 300 ms absorben roces con un botón vecino).

## R4. Un solo menú abierto, sin parpadeo

- **Decision**: El estado sigue siendo un único `openMenu: string | null`. Al abrir otro menú se cancela cualquier cierre pendiente y se cambia de inmediato. La transición de salida solo se aplica cuando no queda ningún menú abierto; si otro menú se está abriendo, el panel saliente se oculta sin transición.
- **Rationale**: Resuelve C5 y SC-003 sin librerías.
- **Alternatives considered**: Quitar todas las transiciones (se pierde la entrada suave que ya tiene el sitio).

## R5. Capa oscura

- **Decision**: Se mantiene el aspecto actual (clarificación 3). Se elimina `onMouseEnter`; se añade `onClick` que cierra el menú. Su visibilidad sigue ligada a `openMenu !== null`.
- **Rationale**: Resuelve C2 y cumple FR-004a. El primer clic sobre la capa cierra el menú y no activa el contenido de debajo, el comportamiento esperado de un velo.
- **Alternatives considered**: `pointer-events-none` en la capa (el clic pasaría a la página y activaría enlaces de debajo por accidente).

## R6. Accesibilidad del estado

- **Decision**: El enlace principal lleva `aria-expanded={isOpen}` y `aria-controls` con el `id` de su panel. Se quita `aria-haspopup="true"` (equivale a `menu` y anuncia un menú de aplicación que no existe). El panel cerrado queda `invisible` (fuera del árbol de accesibilidad y del orden de Tab), como hoy.
- **Rationale**: Patrón "disclosure navigation" de la ARIA APG; `aria-expanded` es válido en `link`. Cumple FR-008 y SC-006.
- **Alternatives considered**: Convertir el principal en `<button>` (rompería la clarificación B: el principal debe seguir navegando).

## R7. Call Now y foco visible

- **Decision**: Call Now usa siempre `bg-brand-yellow text-brand-primary`, con `hover:bg-[#ffe36f]`, sin depender de `scrolled`. Todos los elementos enfocables del navbar de escritorio (logo, enlaces principales, Call Now) reciben un foco visible propio: `focus-visible:outline-brand-yellow` en los enlaces sobre fondo oscuro y `focus-visible:outline-white` en Call Now (amarillo sobre amarillo no se distinguiría).
- **Contraste calculado** (WCAG 2.1):
  - `#020c15` sobre `#ffd84d`: ≈ 14.2:1 (teléfono). Pasa AA (4.5:1).
  - Etiqueta "Call Now" con `opacity-70` (color efectivo ≈ `#4e4926`) sobre `#ffd84d`: ≈ 6.6:1. Pasa AA.
  - Sobre el hover `#ffe36f` los dos ratios suben.
  - Contorno blanco sobre el header `#020c15`: ≈ 19.6:1; amarillo `#ffd84d` sobre `#020c15`: ≈ 14.2:1. Superan el 3:1 de FR-014.
- **Rationale**: Resuelve C7 y C8 sin tocar el foco global del resto del sitio.
- **Alternatives considered**: Cambiar `:focus-visible` global (afectaría a páginas fuera de alcance).

## R8. Cambio de tamaño y movimiento reducido

- **Decision**: Un `matchMedia("(min-width: 64rem)")` (el `lg` por defecto de Tailwind 4, el mismo que muestra la lista de escritorio) cierra el menú de escritorio al bajar de ese ancho y el cajón móvil al subir. Las transiciones del panel llevan `motion-reduce:transition-none motion-reduce:translate-y-0`; además `global.css` ya anula transiciones con `prefers-reduced-motion`.
- **Rationale**: Cubre los casos límite de cambio de tamaño y movimiento reducido de la spec.
- **Alternatives considered**: Escuchar `resize` (más llamadas y sin semántica de breakpoint).

## R9. Menú móvil

- **Decision**: El cajón móvil no cambia de comportamiento. Solo se verifica (quickstart) y se le aplica el cierre por cambio de tamaño de R8. Su botón de llamada (`bg-ink` sobre fondo blanco, con buen contraste) queda fuera de FR-012, que se refiere al Call Now del navbar.
- **Rationale**: FR-011 pide que siga funcionando como hoy; el principio XII prohíbe cambios no pedidos.
- **Alternatives considered**: Rehacer el cajón con el mismo patrón (no pedido).

## R10. Verificación

- **Decision**: Verificación manual con [quickstart.md](./quickstart.md) en Chrome, Safari y Firefox de escritorio, una tableta y un móvil, más el modo responsive de las herramientas de desarrollo con emulación táctil. `npm run astro -- check` y `npm run build` deben pasar.
- **Rationale**: El proyecto no tiene scripts de test (CLAUDE.md) y la constitución (XII) no permite añadir dependencias no pedidas, como Playwright.
- **Alternatives considered**: Añadir tests automáticos de navegador (requiere una nueva dependencia; se puede proponer aparte).
