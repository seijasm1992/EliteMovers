# Quickstart: Validar los datos de la empresa

## Requisitos

- Node >= 22.12 y `npm install` hecho.
- `PUBLIC_TURNSTILE_SITE_KEY` en `.env` (lo exige `astro build`; ver CLAUDE.md).

## 1. Tipos y build

```sh
npm run astro -- check   # 0 errores; un uso olvidado de site.address falla aquí
npm run build            # termina sin errores
```

## 2. Búsquedas en código y HTML generado (SC-002, SC-003, SC-005)

Cada comando debe devolver **0 resultados**:

```sh
# Teléfono antiguo en cualquier formato
grep -rnE "407[^0-9]{0,3}984[^0-9]{0,3}9218|4079849218" src dist/client

# Dirección y marca mal escrita
grep -rnE "1050 SW 70th|Pro Elite Movers" src dist/client

# Forma corta "ProElite" sin "Movers" (el wordmark del logo en site.ts no cuenta)
grep -rnE "ProElite" src --include=*.ts --include=*.tsx --include=*.astro | grep -v "ProElite Movers" | grep -v "wordmark"

# Miami Lakes como sede
grep -rniE "based in Miami Lakes|Miami Lakes, FL|Miami Lakes moving" src dist/client

# Datos de contacto escritos fuera de la fuente única
grep -rnE "786[^0-9]{0,3}281[^0-9]{0,3}7825|tel:\+1|info@proelitemovers\.com" src | grep -v "src/data/site.ts"
```

Y estas deben dar el resultado indicado:

```sh
# Nombre legal: solo en el pie (1 aparición por página generada)
grep -rc "PROELITE MOVING LLC" dist/client --include=*.html   # cada página: 1

# Enlace de llamada correcto en el HTML
grep -rhoE 'href="tel:[^"]+"' dist/client --include=*.html | sort -u   # solo tel:+17862817825
```

Miami Lakes debe seguir apareciendo solo en la lista de zonas de "About" y en la lista de zonas atendidas de las preguntas frecuentes.

## 3. Revisión en el navegador (SC-001, SC-004)

```sh
npm run preview
```

- En cada página, el pie muestra `+1 (786) 281-7825`, `info@proelitemovers.com`, `Miami, FL` sin enlace, la línea de copyright con "ProElite Movers" y la línea "ProElite Movers is operated by PROELITE MOVING LLC."
- En `/get-a-quote/`, el bloque de contacto muestra el correo, el teléfono y "Location: Miami, FL" sin enlace.
- En un móvil, cada botón de llamada (cabecera, menú, hero, pie) abre el marcador con +1 (786) 281-7825.

## 4. Fuente única (SC-006)

Cambiar temporalmente el teléfono en `src/data/site.ts`, recompilar y comprobar que cambia en todas las páginas y en todos los `tel:`. Deshacer el cambio.
