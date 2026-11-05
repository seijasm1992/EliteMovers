# Quickstart: validar la medición y la protección contra bots

## Requisitos previos

- Node >= 22.12 y `npm install`.
- `.dev.vars` con `ENABLE_TURNSTILE=false` para las pruebas locales del formulario.
- Para las pruebas en producción: Web Analytics, Zaraz y GA4 configurados según `docs/analytics-and-bot-protection.md`.

## 1. Comprobaciones locales

```sh
npm run astro -- check
npm run build
```

Ambos deben terminar sin errores.

- `dist/` contiene `privacy-policy/index.html`, y `sitemap.xml` incluye `/privacy-policy/`.
- Cada página generada enlaza a `/privacy-policy/` desde el pie de página.
- `src/` no contiene tokens nuevos ni el ID de medición de GA4 (búsqueda de `G-` seguido de mayúsculas y números, y de `data-cf-beacon`). El único identificador de medición presente es el ID público de Clarity que ya existía (SC-006, ver [research.md](research.md) R8).

## 2. Eventos en desarrollo (sin Zaraz)

1. `npm run dev` y abrir el sitio.
2. En la consola: `window.zaraz = { track: (n, p) => console.log(n, p) }`.
3. Pulsar un enlace de llamada → aparece `contact_call { page_path: "/" }`.
4. En móvil (o con la vista móvil), desplazar hasta que aparezca "Chat with us" y pulsarlo → aparece `contact_text`.
5. Enviar un formulario válido. Si `RESEND_API_KEY` falta, el envío falla → no aparece `contact_form` y se ve "We couldn't send your request. Please call or text us."
6. Sin el stub de `window.zaraz`, repetir los pasos 3 y 4: no hay errores en la consola y los enlaces funcionan.

## 3. Campo trampa

```sh
curl -i -X POST http://localhost:4321/api/quote -H "Content-Type: application/json" \
  -d '{"originCity":"Miami","destinationCity":"Doral","moveDate":"2099-01-01","homeSize":"studio","fullName":"Test Bot","phone":"3055550100","email":"bot@example.com","website":"http://spam.example"}'
```

Resultado esperado: `400` con `{"ok":false}`, sin `message`, y ningún correo enviado. Con el tabulador no se llega al campo `website`, y un lector de pantalla no lo anuncia.

## 4. Producción (tras desplegar y configurar los paneles)

| Prueba | Resultado esperado | Criterio |
|--------|--------------------|----------|
| Ver el código fuente de una página | Contiene `beacon.min.js` (Web Analytics) y `/cdn-cgi/zaraz/` (Zaraz). Si falta Zaraz, aplicar la carga manual de [research.md](research.md) R2. | FR-001, FR-004 |
| Visitar el sitio desde un navegador normal | Aparece en Web Analytics en menos de 24 h | SC-001 |
| Pulsar llamar, pulsar "Chat with us" y enviar un formulario real | `contact_call`, `contact_text` y `contact_form` en GA4 → Tiempo real, con `page_path` | SC-002 |
| Revisar los parámetros de esos eventos | Sin nombre, teléfono, correo ni ciudades | SC-005 |
| Entrar con `?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing` y llamar | El contacto aparece con la campaña `gbp_listing` | SC-011 |
| Activar Bot Fight Mode, enviar un formulario y usar la inspección de URL de Search Console | Formulario aceptado y página accesible para Google | SC-007 |
| Crear una alerta de GA4 (Custom insights) | Llega el correo de la alerta | SC-009 |
| PageSpeed Insights en móvil | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 | SC-008 |
