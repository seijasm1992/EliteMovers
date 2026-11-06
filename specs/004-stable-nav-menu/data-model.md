# Data Model: Menú de navegación estable y botón Call Now destacado

**Feature**: [spec.md](./spec.md) | **Date**: 2026-11-06

No hay datos persistentes. El "modelo" es el estado de interfaz del island `NavMenu` y los datos de navegación que ya existen. El tipo `NavItem` y el contenido de `src/data/navigation.ts` no cambian (FR-015).

## Entidades existentes (sin cambios)

- **NavItem** (`src/types/content.ts`): `label`, `href`, `children?: NavLink[]`. Los cuatro con `children` (Moving, Locations, Services, Company) son menús desplegables.
- **NavSite**: `name`, `phone`, `phoneHref`. Lo usa Call Now; no cambia.

## Estado del menú de escritorio

| Campo | Tipo | Significado |
|---|---|---|
| `openMenu` | `string \| null` | `label` del único menú abierto; `null` si no hay ninguno. Garantiza FR-004 por construcción. |
| `closeTimer` | ref a temporizador `\| null` | Cierre pendiente tras salir con el ratón (`CLOSE_DELAY_MS = 300`). |
| `lastPointerType` | ref `"mouse" \| "touch" \| "pen" \| null` | Tipo del último `pointerdown` sobre un enlace principal; decide si el clic abre o navega (R1). |
| `switching` | derivado | `true` cuando un panel se oculta porque otro se abre; ese panel se oculta sin transición (R4). |

Derivados: `overlayVisible = openMenu !== null`; por cada item, `isOpen = openMenu === item.label`.

### Transiciones de estado

```text
                 ┌──────────────────────────────────────────────┐
                 ▼                                              │
  [Cerrado] ── hover ratón / 1er toque / Enter|Espacio ──▶ [Abierto: X]
     ▲                                                          │
     │   cierre inmediato:                                      │ hover ratón / toque / Enter|Espacio en Y
     │   Escape · Espacio en X · clic/toque fuera ·             ▼
     │   clic en capa oscura · clic en opción ·          [Abierto: Y]  (X se oculta sin transición)
     │   foco sale del <li> · ancho < 64rem                     
     │                                                          
     └── cierre diferido: ratón sale del <li> ─▶ [Cierre pendiente 300 ms] ── ratón vuelve ──▶ [Abierto: X]
```

| Desde | Evento | Hasta | Efecto extra |
|---|---|---|---|
| Cerrado | `pointerenter` (mouse) en `<li>` X | Abierto X | — |
| Cerrado | toque en principal X | Abierto X | `preventDefault` del clic |
| Cerrado | Enter/Espacio en principal X | Abierto X | `preventDefault` |
| Abierto X | `pointerenter` (mouse) / toque / Enter/Espacio en Y | Abierto Y | cancela temporizador; X sin transición |
| Abierto X | `pointerleave` (mouse) del `<li>` X | Cierre pendiente | inicia temporizador de 300 ms |
| Cierre pendiente | `pointerenter` (mouse) en `<li>` X | Abierto X | cancela temporizador |
| Cierre pendiente | vence el temporizador | Cerrado | — |
| Abierto X | 2.º toque o clic de ratón o Enter en principal X | (navega) | navegación por defecto |
| Abierto X | Espacio en principal X | Cerrado | `preventDefault` |
| Abierto X | Escape con el foco dentro de `<li>` X | Cerrado | foco al principal X |
| Abierto X | Escape con el foco fuera | Cerrado | — |
| Abierto X | `pointerdown` fuera de `<li>` X (incluye la capa) | Cerrado | — |
| Abierto X | clic en una opción | Cerrado | navegación por defecto |
| Abierto X | foco pasa a un elemento fuera de `<li>` X | Cerrado | — |
| Abierto X | `relatedTarget` del blur es `null` | Abierto X | sin cambio (corrige C1) |
| Abierto X | el ancho baja de 64rem | Cerrado | — |
| Cualquiera | se abre el cajón móvil | Cerrado | ya existe (`openMobileMenu`) |

## Estado del cajón móvil (sin cambios de comportamiento)

`isMobileMenuOpen: boolean` y `activeAccordion: string | null`, como hoy. Se añade una sola transición: el ancho sube a 64rem o más → se cierra el cajón (R8).

## Reglas de validación

- Como mucho un panel visible (`openMenu` es único).
- `aria-expanded` de cada principal es igual a `openMenu === item.label` en todo momento.
- El panel cerrado está `invisible` (sin foco ni lectura).
- Call Now no depende de `scrolled`.
