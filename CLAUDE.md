# Columna estratigráfica — notas para Claude

Editor React → HTML único offline (`dist/Columna_Estratigrafica.html`) + PWA.
Repo `cvenegas-sernageomin/columna-estratigrafica` → https://cvenegas-sernageomin.github.io/columna-estratigrafica/
Ficha en memoria: `proyecto-columna-estratigrafica`.

## Reglas
- **`src/app.jsx` es la única fuente**; `src/template.html` la cáscara; `src/pwa/` manifest + `sw.js` con `__BUILDID__`.
- `.\build.ps1` (PowerShell, sin Node) genera `dist/` y estampa la versión del SW. No editar `dist/` a mano.
- Valores viejos de ambientes se mapean con `LEGACY_ENV_ALIAS`: no romper columnas ya guardadas.
- Convenciones geológicas que el usuario corrige (gradación, contactos, cubierto): memoria `feedback-diseno-columna-geologico`.

## Ramas y publicación
Un solo repo en GitHub con dos ramas: **`fuente`** (código; aquí es `master` siguiendo `origin/fuente`) y **`main`**
(lo publicado en Pages). **`dist/` es un clon aparte en la rama `main`** (ignorado por la raíz).
Publicar = `.\build.ps1` → commit + push de la fuente en la raíz → `cd dist` → commit + `git push origin main`.
Verificar con `curl` que `sw.js` publicado tenga el `columna-<timestamp>` del build.
