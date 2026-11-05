# Research: Medición de visitas reales y contactos, filtrando bots

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Date**: 2026-11-05

## R1. Cómo llega Web Analytics a las páginas

- **Decision**: Activar Cloudflare Web Analytics con la configuración automática del dominio (inyección en el borde). No se añade ningún fragmento ni token al repositorio.
- **Rationale**: El dominio está con proxy de Cloudflare (custom domain del Worker en `wrangler.jsonc`). La inyección automática funciona en zonas con proxy, y hay informes de que el beacon ya se inyecta en sitios de Workers con static assets cuando la petición es HTML. Así se cumple FR-014 (sin token en el repo). Web Analytics cuenta con un beacon de JavaScript, de modo que los bots que no ejecutan JS no cuentan como visitas (FR-001).
- **Riesgos conocidos**: `Cache-Control: no-transform` impediría la inyección; `public/_headers` no lo usa. No hay CSP, así que no hay que permitir `static.cloudflareinsights.com`. En el plan gratuito, RUM excluye por defecto el tráfico de la UE; no afecta a un público de Miami.
- **Alternatives considered**: Fragmento manual con token en `BaseLayout.astro`. Se descarta porque pone un identificador en el repo y choca con la inyección automática si ambas quedan activas.

## R2. Cómo llega Zaraz a las páginas

- **Decision**: Zaraz con inyección automática. Si la verificación del quickstart muestra que no se inyecta en las respuestas del Worker, se usa la carga manual documentada: `<script src="/cdn-cgi/zaraz/i.js" referrerpolicy="origin"></script>` antes de `</body>`, con la inyección automática desactivada en el panel.
- **Rationale**: La carga manual no contiene ningún identificador (la configuración vive en el panel), así que sigue cumpliendo FR-014. Solo se añade si hace falta.
- **Alternatives considered**: gtag.js directo en el sitio. Se descarta: el dueño pidió Zaraz, gtag pondría el ID de medición en el repo y añadiría más JavaScript de terceros en el navegador (principio IX).

## R3. Cómo se registran llamadas y mensajes de texto

- **Decision**: Un único listener de clic delegado en `document`, dentro del `<script>` empaquetado de `BaseLayout.astro`, que detecta `a[href^="tel:"]` y `a[href^="sms:"]` y llama a `trackContact()` de `src/lib/analytics.ts`. Esta función llama a `window.zaraz?.track(...)` y no hace nada si Zaraz no está cargado.
- **Rationale**: Cubre todos los enlaces actuales y futuros (pie de página, `NavMenu`, `hero.ts`, `QuoteSection`, `get-a-quote`, botón de SMS de `Contacto`) sin tocar cada componente ni añadir islas. La lógica queda versionada en el repo. Son unas pocas líneas de JS estático (principio X).
- **Alternatives considered**: Disparadores "Click listener" configurados solo en el panel de Zaraz. Funcionan sin código, pero la regla no queda en el repo y es fácil romperla sin darse cuenta. Otra opción era añadir `onClick` en cada componente; se descarta por repetición y porque se olvidaría en enlaces nuevos.

## R4. Nombres y parámetros de los eventos

- **Decision**: `contact_call`, `contact_text`, `contact_form`. Único parámetro propio: `page_path` = `location.pathname` (sin query string). Detalle en [contracts/analytics-events.md](contracts/analytics-events.md).
- **Rationale**: Un nombre por tipo (FR-004), en snake_case como pide GA4, con prefijo común para filtrarlos juntos. `page_path` sin parámetros evita que llegue algo personal por la URL (FR-013).
- **Alternatives considered**: Un evento `contact` con parámetro `method`; la especificación pide nombre propio por tipo. `generate_lead` (evento recomendado de GA4) para el formulario; se descarta para mantener los tres nombres coherentes, y los informes de clave funcionan igual marcándolos como key events.

## R5. Origen de la visita y Google Business Profile

- **Decision**: El origen lo atribuye GA4 a partir de la vista de página que Zaraz envía (referrer y parámetros UTM). Para separar Google Business Profile, el dueño cambia la URL del sitio web en el perfil a `https://proelitemovers.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing`. La guía lo explica.
- **Rationale**: No requiere código ni datos del cliente (FR-005a). Es la práctica habitual para distinguir GBP de la búsqueda orgánica (FR-005b). La etiqueta canónica ya ignora la query string, así que no crea páginas duplicadas para SEO.
- **Alternatives considered**: Detectar el referrer en el cliente y enviarlo como parámetro. Duplica lo que GA4 ya hace y no distingue GBP, porque el referrer de GBP es simplemente google.com.

## R6. Campo trampa

- **Decision**: Campo de texto `website` dentro del formulario, en un contenedor fuera de pantalla (no `display:none`), con `aria-hidden="true"`, `tabIndex={-1}` y `autoComplete="off"`. El esquema del servidor lo acepta como opcional (máx. 200). Si llega con contenido, `/api/quote` responde `400 { ok: false }` sin `message`, antes de verificar Turnstile y sin enviar correo. Detalle en [contracts/quote-api.md](contracts/quote-api.md).
- **Rationale**: Sin `message` y con un estado distinto de 403, el cliente muestra el mensaje genérico (FR-011). Se comprueba antes que Turnstile para no gastar una verificación con un bot. Un contenedor fuera de pantalla es más difícil de detectar para un bot que `display:none`.
- **Alternatives considered**: Responder 200 falso (opción A de la clarificación, descartada por el dueño). Campo con un nombre inventado: los bots rellenan sobre todo nombres comunes como `website`.

## R7. Bot Fight Mode en el plan gratuito

- **Decision**: Documentar la activación, las pruebas y cómo desactivarlo. No se crean reglas de WAF.
- **Rationale**: En el plan gratuito, Bot Fight Mode no se puede saltar con reglas personalizadas de WAF ni con Page Rules, así que no hay forma de excluir `/api/quote`. Los bots verificados como Googlebot no se bloquean. La protección del formulario sigue siendo Turnstile más el campo trampa. La guía incluye la prueba en Search Console y la vuelta atrás (FR-012).
- **Alternatives considered**: Super Bot Fight Mode con reglas de salto; es de pago y queda fuera de alcance.

## R8. ID de Microsoft Clarity ya presente en el repositorio

- **Finding**: `BaseLayout.astro` contiene el ID de proyecto de Clarity (`z930kdbxjd`), añadido en la especificación anterior. FR-014 y SC-006 piden 0 identificadores de medición en el repo.
- **Decision**: Se mantiene. El ID de Clarity es público por diseño (va en el HTML de cada página) y el dueño pidió no incluir "claves ni identificadores secretos". Por decisión del dueño (2026-11-05), FR-014 y SC-006 se redactaron de nuevo: cubren claves, tokens e identificadores secretos, y ningún identificador de medición nuevo. Todo lo nuevo vive en los paneles.
- **Alternatives considered**: Mover Clarity a Zaraz como HTML personalizado para sacar el ID del repo. Contradice el supuesto "Clarity se mantiene sin cambios" y añade pasos de configuración en el panel sin una ventaja real.

## R9. Mensaje de error genérico

- **Decision**: `quoteForm.form.errorMessage` pasa de "Something went wrong. Please try again." a "We couldn't send your request. Please call or text us." El 403 de Turnstile sigue mostrando su mensaje propio, porque la persona puede resolverlo repitiendo la verificación.
- **Rationale**: La clarificación fija ese texto como el genérico de todos los fallos.

## R10. Página de política de privacidad

- **Decision**: `src/pages/privacy-policy.astro` con contenido en `src/data/privacyPolicy.ts` (con su tipo en `src/types/content.ts`), igual que `about-us`. Añadida a `sitemap.xml.ts` como `/privacy-policy/` y enlazada en la franja inferior del pie de página. Incluye `BreadcrumbList` como `about-us`. No se añade MovingCompany, porque ninguna página lo tiene todavía (FR-013c).
- **Rationale**: Sigue los patrones existentes. El contacto de la página sale de `site`.
