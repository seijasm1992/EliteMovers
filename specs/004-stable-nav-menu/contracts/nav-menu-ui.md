# UI Contract: navbar de escritorio y Call Now

**Feature**: [spec.md](../spec.md) | **Date**: 2026-11-06

Este contrato fija la interfaz que el navbar ofrece al visitante y a las tecnologías de asistencia. Es la referencia para implementar y verificar. Las props del island (`navigation`, `site`) y `Navbar.astro` no cambian.

## 1. Estructura y ARIA (ancho ≥ 64rem)

Para cada `NavItem` con `children`:

```html
<li>                                   <!-- zona de hover: enlace + hueco + panel -->
  <a href="{item.href}"
     aria-expanded="true|false"
     aria-controls="desktop-submenu-{slug}">{label} <svg aria-hidden="true"/></a>
  <div id="desktop-submenu-{slug}">     <!-- invisible cuando está cerrado -->
    <ul><li><a href="{child.href}">{child.label}</a></li>…</ul>
  </div>
</li>
```

- Sin `aria-haspopup`.
- `slug` = `label` en minúsculas, espacios → `-` (mismo criterio que el cajón móvil, con prefijo `desktop-`).
- Los `href` son los actuales. No se añaden ni se quitan opciones.

## 2. Interacción

| Entrada | Menú cerrado | Menú abierto (el mismo) | Otro menú abierto |
|---|---|---|---|
| Ratón entra en el `<li>` | Abre | Sigue abierto; cancela el cierre pendiente | Cambia a este de inmediato |
| Ratón sale del `<li>` | — | Cierra a los 300 ms salvo que vuelva | — |
| Clic de ratón en el principal | Navega a `href` | Navega a `href` | Navega a `href` |
| Toque en el principal | Abre, sin navegar | Navega a `href` | Cambia a este, sin navegar |
| Enter en el principal | Abre, sin navegar | Navega a `href` | Cambia a este, sin navegar |
| Espacio en el principal | Abre | Cierra | Cambia a este |
| Escape (foco en el principal o en el panel) | — | Cierra y el foco vuelve al principal | — |
| Tab fuera del `<li>` | — | Cierra | — |
| Clic o toque fuera (incluida la capa oscura) | — | Cierra; el clic en la capa no llega a la página | — |
| Clic o toque en una opción | — | Navega y cierra | — |
| Recibir foco (Tab) | No abre | — | — |
| El ancho baja de 64rem | — | Cierra | — |

## 3. Capa oscura

- Visible solo con un menú abierto. Aspecto actual: `bg-ink/20`, `backdrop-blur-[1px]`.
- Pasar el cursor por encima no hace nada. Un clic o toque cierra el menú.

## 4. Movimiento

- Apertura con desvanecimiento y desplazamiento corto, como hoy.
- Al cambiar de menú, el saliente desaparece sin transición: nunca hay dos paneles visibles.
- Con `prefers-reduced-motion: reduce` no hay desplazamiento ni transición.

## 5. Call Now (navbar de escritorio)

| Estado | Fondo | Texto | Contraste mínimo |
|---|---|---|---|
| Arriba de la página | `brand-yellow` #ffd84d | `brand-primary` #020c15 (etiqueta al 70 %) | 4.5:1 (medido: 14.2:1 y 6.6:1) |
| Tras hacer scroll | igual | igual | igual |
| Hover | #ffe36f | igual | ≥ los valores anteriores |
| Foco con teclado | igual | igual | Contorno blanco de 2px, separado 3px; ≥ 3:1 frente al header (≈ 19.6:1) |

`href = site.phoneHref` y el teléfono mostrado no cambian.

## 6. Foco visible del resto del navbar

Logo y enlaces principales sobre el header oscuro: contorno `brand-yellow` de 2px (≈ 14.2:1 frente a #020c15). Las opciones dentro del panel blanco conservan el foco global (`ink`).

## 7. Cajón móvil (ancho < 64rem)

El comportamiento actual no cambia: hamburguesa, acordeones con `aria-expanded`, trampa de foco, Escape, botón de cerrar, clic en el fondo y botón "Call Now". Única adición: si el ancho sube a 64rem o más con el cajón abierto, el cajón se cierra.
