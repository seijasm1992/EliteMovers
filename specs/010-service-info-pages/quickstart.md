# Quickstart: validar las páginas de servicio informativas

## Prerrequisitos

- Node.js ≥ 22.12 y `npm install` hecho.
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env` (lo exige el build; ver `CLAUDE.md`).

## 1. Tipos y build

```sh
npm run astro -- check   # 0 errores
npm run build            # termina sin errores; prerenderiza las 5 rutas
```

## 2. Rutas y estructura

Con `npm run preview`, abrir cada ruta de [contracts/routes.md](contracts/routes.md) y comprobar:

- Responde 200 y muestra un solo H1 igual a la etiqueta del menú.
- Hay exactamente 3 secciones en `<main>`: encabezado (2 o 3 frases y foto, **sin botones**), pasos (exactamente 3) y una línea de cierre.
- La línea de cierre es un enlace de texto que lleva a `/get-a-quote/`.
- No hay precios, montos, reseñas, preguntas frecuentes, listas de "qué incluye" ni botones "Get a Quote"/"Call Now" en el contenido.

## 3. Menú

- Navbar de escritorio y móvil, y footer: el grupo "Services" tiene 5 enlaces y cada uno abre su página.
- "Storage Solutions" no aparece en ninguna página (buscar en el HTML generado: 0 resultados).
- Los menús Moving, Locations y Company no cambiaron.

## 4. SEO

En el HTML generado de cada ruta:

- `<title>` y meta description coinciden con los contratos y no se repiten en otra página del sitio.
- Hay `rel="canonical"` con la URL de la página, `preload` de la foto y JSON-LD `MovingCompany` + `BreadcrumbList`, sin `address`, `priceRange`, `aggregateRating` ni `review`.
- `/sitemap.xml` incluye las 5 rutas.

## 5. Contenido

- Comparar el texto publicado con [contracts/page-content.md](contracts/page-content.md): cada afirmación tiene fuente y no hay datos nuevos.
- High-Value Items no menciona cajas a medida, seguro adicional ni pianos.
- Move Coordination dice "when the service is available" al hablar del seguimiento.
- Las 5 fotos son distintas entre sí y de las de Moving, con alt descriptivo.

## 6. Móvil y rendimiento

- A 360 px de ancho: sin scroll horizontal; el texto y la foto se leen bien.
- Lighthouse móvil en una página: CLS < 0.1, sin JS nuevo; registrar el LCP junto a la salvedad compartida de la spec 007.
- Ningún enlace de las 5 páginas lleva a un 404.
