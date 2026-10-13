# Columna estratigráfica — notas para Claude

Editor React → HTML único offline (`dist/Columna_Estratigrafica.html`) + PWA.
Repo `cvenegas-sernageomin/columna-estratigrafica` → https://cvenegas-sernageomin.github.io/columna-estratigrafica/
Ficha en memoria: `proyecto-columna-estratigrafica`.

## Reglas
- **`src/app.jsx` es la única fuente**; `src/template.html` la cáscara; `src/pwa/` manifest + `sw.js` con `__BUILDID__`.
- `.\build.ps1` (PowerShell, sin Node) genera `dist/` y estampa la versión del SW. No editar `dist/` a mano.
- Valores viejos de ambientes se mapean con `LEGACY_ENV_ALIAS`: no romper columnas ya guardadas.
- Convenciones geológicas que el usuario corrige (gradación, contactos, cubierto): memoria `feedback-diseno-columna-geologico`.

## Publicar
`.\build.ps1` → commit de `src/` y `dist/` → push. Verificar el sitio con `curl`.
