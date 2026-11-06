# Guía: medición de visitas y contactos, y protección contra bots

Guía para el dueño de ProElite Movers. Explica qué activar en los paneles de Cloudflare, Google Analytics 4 y Google Business Profile. Todo se hace en esos paneles. No hay que guardar ningún ID ni token en el código.

El sitio ya envía tres eventos de contacto:

| Evento | Cuándo ocurre |
|--------|---------------|
| `contact_call` | Alguien pulsa un enlace o botón de llamada |
| `contact_text` | Alguien pulsa un enlace o botón de mensaje de texto ("Chat with us") |
| `contact_form` | El servidor acepta un formulario de presupuesto y envía el correo |

Cada evento lleva `page_path`, la página donde ocurrió (por ejemplo, `/get-a-quote/`). Nunca llevan nombre, teléfono, correo ni ciudades del cliente.

---

## 1. Cloudflare Web Analytics (visitas reales)

1. En el panel de Cloudflare, abre **Analytics & Logs → Web Analytics**.
2. Pulsa **Add a site** y elige `proelitemovers.com` con la configuración automática (**Enable** con inyección automática).
3. No añadas además el fragmento de JavaScript manual: las dos formas chocan entre sí.
4. Comprobación: abre `https://proelitemovers.com/` en el navegador, haz clic derecho → **Ver código fuente** y busca `beacon.min.js`. Repite en `/get-a-quote/`, `/about-us/` y `/privacy-policy/`.
5. En unas horas (como mucho 24) verás tus visitas en **Web Analytics**. Esa cifra solo cuenta navegadores reales: la mayoría de los bots no ejecutan el código que la registra.

## 2. Cloudflare Zaraz + Google Analytics 4 (contactos)

### 2.1 Crear la propiedad de GA4

1. En [analytics.google.com](https://analytics.google.com), crea una propiedad para `proelitemovers.com` y un flujo de datos web.
2. Copia el **ID de medición** (empieza por `G-`, **no** por `GTM-`). Solo lo vas a pegar en Zaraz; no lo envíes para que se guarde en el código.
3. Si GA4 o Google Tag Manager te muestran un código para "instalar manualmente" en el `<head>`, ciérralo. No hace falta: Zaraz hace esa parte. No uses Google Tag Manager.

### 2.2 Activar Zaraz

1. Abre Zaraz para `proelitemovers.com`. En el menú nuevo de Cloudflare no aparece como opción propia: usa el buscador del panel (**Ctrl + K** → "Zaraz") o el enlace directo `https://dash.cloudflare.com/?to=/:account/:zone/zaraz` y elige el dominio.
2. En **Settings**, deja activada la inyección automática (**Auto-inject script**).
3. En **Tools Configuration → Third-party tools → Add new tool**, añade **Google Analytics 4** y pega el ID de medición.
4. En **Automated actions** de la herramienta, deja activadas:
   - **Pageviews**: cuenta las visitas y le dice a GA4 de dónde llegó cada una.
   - **Events**: envía a GA4 todos los eventos del sitio (`contact_call`, `contact_text`, `contact_form`) con su `page_path`.
   - **E-commerce** puede quedar desactivado.
5. **No crees disparadores ni acciones personalizadas** para estos eventos: con **Events** activado, cada contacto llegaría dos veces a GA4.
6. Pulsa **Publish** (o **Save**) si el panel lo pide.
7. Solo si tu panel no tiene la acción automática **Events**: crea en **Triggers** un disparador por evento (**Match rule**, variable `{{ client.__zarazTrack }}`, **Equals**, valor `contact_call`; igual para `contact_text` y `contact_form`). Después, en la herramienta GA4, crea en **Custom actions** una acción de tipo **Event** por disparador, con el mismo nombre y el campo `page_path` = `{{ client.page_path }}`.
8. Comprobación: en el código fuente de cualquier página busca `/cdn-cgi/zaraz/`. Si no aparece, Zaraz no se está inyectando en las páginas del sitio. En ese caso pide a quien mantenga el sitio que añada la carga manual descrita en [research.md, R2](../specs/003-real-visits-contacts/research.md), y desactiva la inyección automática.

### 2.3 Ver la página de cada contacto en GA4

1. En GA4, abre **Administrar → Definiciones personalizadas → Crear dimensión personalizada**.
2. Nombre: `Page path`. Ámbito: **Evento**. Parámetro de evento: `page_path`.
3. Guarda. Desde ese momento los informes muestran la página de cada contacto. Los eventos anteriores a este paso no la tendrán.

## 3. Marcar los contactos como key events

1. En GA4, abre **Administrar → Eventos** cuando los tres eventos ya hayan llegado una vez. Haz una prueba: pulsa llamar, pulsa "Chat with us" en el móvil y envía un formulario.
2. Activa **Marcar como evento clave** en `contact_call`, `contact_text` y `contact_form`.

## 4. Separar Google Business Profile de la búsqueda normal

1. En tu perfil de Google Business Profile, edita el **Sitio web**.
2. Cambia la dirección a:

   ```text
   https://proelitemovers.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp_listing
   ```

3. Guarda. A partir de ahí, las visitas desde el perfil y desde Maps aparecerán con la campaña `gbp_listing`. Las búsquedas normales de Google seguirán como `google / organic` sin campaña. El enlace canónico de la página no cambia, así que no afecta al SEO.

## 5. Ver los contactos por origen

1. En GA4, abre **Informes → Adquisición → Adquisición de tráfico**.
2. En la tabla, elige como métrica los **Eventos clave** y filtra por `contact_call`, `contact_text` o `contact_form`.
3. La columna **Grupo de canales predeterminado de la sesión** separa *Organic Search*, *Direct*, *Organic Social* y *Referral*. Para ver Google Business Profile, cambia la dimensión a **Campaña de la sesión** y busca `gbp_listing`.

## 6. Alertas por correo

GA4 puede avisarte por correo. No hay un aviso por cada pulsación, pero sí cuando algo cambia.

1. En GA4, abre **Inicio → Ver todas las estadísticas (Insights) → Crear**.
2. Ejemplos útiles:
   - **Sin contactos**: frecuencia diaria, condición "Eventos clave" = 0.
   - **Más contactos de lo normal**: frecuencia diaria, condición "Eventos clave" con un aumento superior al 50 %.
3. En **Correo electrónico**, escribe tu dirección y guarda.

---

## 7. Bot Fight Mode

Bot Fight Mode es la protección gratuita de Cloudflare contra bots automáticos.

### Dónde activarlo

Panel de Cloudflare → `proelitemovers.com` → **Security → Settings** → **Bot Fight Mode** → activar.

### Qué esperar

- En el plan gratuito **no se puede excluir ninguna ruta**, tampoco `/api/quote`. Las reglas de WAF y las Page Rules no lo saltan. Por eso hay que probar el formulario después de activarlo.
- Los bots verificados, como **Googlebot**, no se bloquean. El SEO no debería notarlo.
- El formulario sigue protegido por Turnstile y por un campo trampa invisible, actives o no Bot Fight Mode.

### Pruebas después de activarlo

Hazlas en el móvil con datos (no wifi) y en un ordenador:

1. Abre la portada, `/get-a-quote/`, `/about-us/` y `/privacy-policy/`. Todas deben cargar sin pantallas de verificación extrañas.
2. Envía un formulario real y confirma que llega el correo a `info@proelitemovers.com`.
3. En [Google Search Console](https://search.google.com/search-console), abre **Inspección de URL**, escribe `https://proelitemovers.com/` y pulsa **Probar URL publicada**. Debe decir que la URL está disponible para Google.
4. Al día siguiente, comprueba que siguen llegando visitas a Web Analytics.

### Señales de problema

- El formulario muestra "We couldn't send your request. Please call or text us." en un envío normal.
- Search Console informa de páginas bloqueadas o errores de rastreo nuevos.
- Las visitas en Web Analytics caen de golpe.

### Vuelta atrás

1. Desactiva el mismo interruptor: **Security → Settings → Bot Fight Mode**.
2. Repite las pruebas anteriores para confirmar que todo vuelve a funcionar.
