# Columna Estratigráfica — Editor de Campo

Editor visual de columnas litoestratigráficas (sedimentarias, volcánicas,
piroclásticas, epiclásticas e intrusivas) con carga/exportación CSV, fotos
de afloramiento y exportación a SVG.

## Para compartir / usar (el archivo final)

👉 **`dist/Columna_Estratigrafica.html`**

Es un **único archivo autocontenido**: se abre con **doble clic** en cualquier
navegador moderno (Chrome, Edge, Firefox) y **funciona sin internet**. React y
el transpilador están embebidos dentro del propio archivo.

Para distribuir a colegas: enviá **solo ese archivo** (mail, USB, Drive). No
necesitan instalar nada.

> Nota: al abrirlo tarda ~1–2 s la primera vez (compila la app en el navegador).
> Eso es normal.

## Para modificar la app (desarrollo)

Todo el código vive en **`src/app.jsx`** (un componente React). El flujo es:

1. Editás `src/app.jsx` (y/o `src/template.html` para la cáscara).
2. Corrés el build:
   ```powershell
   .\build.ps1
   ```
3. Se regenera `dist/Columna_Estratigrafica.html` listo para compartir.

No requiere Node ni npm: el build es solo PowerShell + las librerías de `vendor/`.

## Estructura

```
columna-estratigrafica/
├─ src/
│  ├─ app.jsx          ← código de la app (única fuente de verdad)
│  └─ template.html    ← cáscara HTML + pantalla de carga
├─ vendor/             ← React, ReactDOM y Babel (para uso offline)
├─ build.ps1           ← genera el HTML final
├─ dist/
│  └─ Columna_Estratigrafica.html   ← ⭐ archivo a compartir
└─ README.md
```

## Funciones

- Catálogo de litologías con patrones (clásticas, carbonatos, lavas,
  piroclásticas, volcaniclásticas, intrusivas).
- Paquetes de intercalación (dos litologías en bandas alternadas).
- Granulometría que controla el ancho de la columna (perfil de competencia).
- Contactos: neto, gradacional, erosivo, discordancia angular.
- Color Munsell, estructuras, fósiles/datación, ambiente, paleocorriente,
  meteorización y notas por unidad.
- Fotos de afloramiento (se comprimen automáticamente) con visor ampliado.
- Importar / exportar **CSV** (con template y guía de valores integrada).
- Exportar la columna a **SVG** (vectorial, para informes).
