# Implementation Plan: Menú de navegación estable y botón Call Now destacado

**Branch**: `004-stable-nav-menu` | **Date**: 2026-11-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-stable-nav-menu/spec.md`

## Summary

Los cuatro menús desplegables del navbar de escritorio se cierran solos o pierden el clic. Las causas están en el island `NavMenu.tsx` ([research.md](./research.md), R0):

- El header cierra el menú cuando pierde el foco con `relatedTarget` nulo, que es lo que pasa en Safari al hacer clic en un enlace.
- La capa oscura cierra el menú solo con pasar el cursor.
- El foco abre los menús.
- El primer toque navega en vez de abrir.
- Al cambiar de menú se solapan dos paneles.
- El margen de cierre de 140 ms es demasiado corto.

La corrección reescribe solo la lógica del menú de escritorio dentro del mismo island:

- Pointer Events, para distinguir ratón de toque.
- Cierre diferido de 300 ms por `<li>`.
- Cierre por foco solo cuando el foco va a otro elemento.
- Clic o toque fuera, incluida la capa, que se mantiene visible.
- Teclado según las clarificaciones.
- `aria-expanded` y `aria-controls`.

Call Now pasa a usar siempre `brand-yellow` y texto `brand-primary` (14.2:1). Los elementos del navbar oscuro reciben un foco visible propio. El cajón móvil conserva su comportamiento y solo se cierra al cambiar al ancho de escritorio.

## Technical Context

**Language/Version**: TypeScript (estricto, vía `astro check`), React 19, Node ≥ 22.12

**Primary Dependencies**: Astro 6, React 19 (island `NavMenu` con `client:load`), Tailwind CSS 4. Sin dependencias nuevas.

**Storage**: N/A

**Testing**: Sin scripts de test en el proyecto. `npm run astro -- check`, `npm run build` y verificación manual con [quickstart.md](./quickstart.md) en varios navegadores y dispositivos.

**Target Platform**: Navegadores actuales de escritorio (Chrome, Safari, Firefox), tabletas y móviles (iOS Safari, Chrome en Android). Despliegue en Cloudflare.

**Project Type**: Sitio web estático con islands (Astro).

**Performance Goals**: INP < 200 ms en móvil (constitución IX). Los manejadores son síncronos y triviales, sin listeners de `scroll` nuevos.

**Constraints**:

- Sin JS nuevo fuera del island existente (X).
- Sin cambios de enlaces, teléfono ni páginas (IV, VII, FR-015).
- `let` y `const`, nunca `var`.
- Cambio mínimo (XII).

**Scale/Scope**: 1 componente principal (`src/components/react/NavMenu.tsx`, unas 436 líneas). 4 menús con 3 a 6 opciones cada uno. Todas las páginas comparten el navbar.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|---|---|---|
| I Precios transparentes / II Honestidad / III Imágenes reales | No toca contenido, precios ni imágenes. | ✅ |
| IV Cero rutas rotas | No cambia `href`. El destino del principal sigue alcanzable con ratón (clic), toque (2.º toque) y teclado (Enter con el menú abierto). | ✅ |
| V / VI SEO | El HTML de los enlaces sigue en el marcado del island; sin cambios en títulos, H1, canonical ni schema. | ✅ |
| VII NAP consistente | Teléfono y `phoneHref` sin cambios. | ✅ |
| VIII Contenido local / Idioma inglés | Sin texto nuevo visible. | ✅ |
| IX Rendimiento | No añade peso relevante, listeners de scroll ni cambios de layout (CLS 0). Un listener de `pointerdown` solo mientras hay un menú abierto. | ✅ |
| X JavaScript mínimo | Se trabaja dentro del island que ya existe; no se añaden islands. | ✅ |
| XI Mobile first | Call Now más visible; el cajón móvil conserva su botón de llamar. | ✅ |
| XII Simplicidad | Sin dependencias ni utilidades nuevas. Se descartan el "safe triangle" y los menús ARIA con flechas (research R2 y R3). | ✅ |
| Tecnología y código | Astro, React y Tailwind; sin `var`. | ✅ |

**Resultado**: pasa sin excepciones. **Re-check tras la fase 1**: el diseño ([data-model.md](./data-model.md), [contracts/nav-menu-ui.md](./contracts/nav-menu-ui.md)) no introduce archivos, dependencias, rutas ni texto visible nuevos. Sigue pasando.

## Project Structure

### Documentation (this feature)

```text
specs/004-stable-nav-menu/
├── plan.md              # Este archivo
├── research.md          # Fase 0: diagnóstico C1–C8 y decisiones R1–R10
├── data-model.md        # Fase 1: estado del menú y transiciones
├── quickstart.md        # Fase 1: guía de verificación manual
├── contracts/
│   └── nav-menu-ui.md   # Fase 1: contrato de interacción, ARIA y Call Now
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks; no lo crea este comando)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── layout/
│   │   └── Navbar.astro          # Sin cambios (monta <NavMenu client:load …/>)
│   └── react/
│       └── NavMenu.tsx           # ÚNICO archivo de código que cambia
├── data/
│   └── navigation.ts             # Sin cambios (FR-015)
├── types/
│   └── content.ts                # Sin cambios
└── styles/
    └── global.css                # Sin cambios (el foco del navbar se resuelve con utilidades en NavMenu)
```

**Structure Decision**: Todo el cambio vive en `src/components/react/NavMenu.tsx`, dentro de la estructura actual de Astro con islands. Cambios previstos dentro del archivo:

1. Constante `CLOSE_DELAY_MS = 300` y ref `lastPointerType`.
2. `<li>` con `onPointerEnter` y `onPointerLeave` (solo ratón), `onBlur` por `<li>` y `onKeyDown` en el principal. Se quita `onFocus`.
3. `onClick` en el principal: abre con toque si está cerrado y, en los demás casos, navega.
4. Efecto con `pointerdown` en `document` mientras haya un menú abierto, y efecto con `matchMedia("(min-width: 64rem)")`.
5. Capa oscura: se quita `onMouseEnter` y se añade `onClick` que cierra.
6. Panel con `id`, `aria-controls`, sin `aria-haspopup`, sin transición al cambiar de menú y con `motion-reduce`.
7. Call Now con clases fijas y foco visible. Foco amarillo en el logo y en los principales.
8. Se elimina `handleBlur` del header.

## Complexity Tracking

Sin violaciones de la constitución; no aplica.
