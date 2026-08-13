# Modificadores de zona por unidad estratigráfica

**Fecha:** 2026-06-17  
**Proyecto:** columna-estratigrafica  
**Estado:** aprobado por usuario

---

## Contexto

Las unidades estratigráficas frecuentemente presentan características diagenéticas o biogénicas secundarias concentradas en su techo o muro (paleosuelos, trazas fósiles, cementos, oxidación, etc.). Actualmente no hay forma de representar estas zonas sin crear una unidad separada, lo que rompe la relación genética con el estrato principal.

---

## Objetivo

Permitir al usuario definir hasta dos modificadores por unidad (uno en techo, uno en muro), con tipo, espesor real de campo en cm, y nota opcional. Los modificadores se renderizan como bandas semitransparentes superpuestas al patrón de litología principal en el SVG de la columna.

---

## Modelo de datos

Cada unidad estratigráfica (`DF` / unidad) gana dos campos opcionales:

```js
modTecho: { type: "paleosuelo", cm: 30, notes: "rizolitos de Stigmaria" }
modMuro:  { type: "oxidacion",  cm: 15, notes: "" }
```

Valor por defecto: `null` (sin modificador).

### Tipos de modificador disponibles (catálogo `MOD_TYPES`)

| id | nombre UI |
|----|-----------|
| `paleosuelo` | Paleosuelo |
| `trazas` | Trazas fósiles |
| `bioturbacion` | Bioturbación |
| `oxidacion` | Oxidación / hematita |
| `cemento_calc` | Cemento calcáreo |
| `silicificacion` | Silicificación |
| `nodulos` | Nódulos / concreciones |
| `materia_org` | Materia orgánica / carbón |

---

## Renderizado SVG

Después de dibujar el rectángulo de litología principal de la unidad:

1. **Techo:** si `modTecho` existe, calcular `hTecho = min(modTecho.cm / 100, u.thickness) / escala`. Dibujar un `<rect>` en la parte superior del rectángulo de la unidad con `fill="url(#mod-{type})"` y `fill-opacity` entre 0.55–0.70 según el tipo. Agregar una línea punteada horizontal `stroke-dasharray="3,2"` en el límite inferior de la banda.
2. **Muro:** misma lógica, banda en la parte inferior del rectángulo.
3. **Clip:** ambas bandas usan `clipPath` al rectángulo de la unidad — nunca desbordan al estrato vecino.
4. **Colisión:** si ambos modificadores suman más que la altura de la unidad, el techo tiene prioridad y el muro se recorta al espacio restante.

### Patrones SVG (`<pattern>`) a agregar en `SvgDefs`

Ocho patrones nuevos con prefijo `mod-`:

| id | visual |
|----|--------|
| `mod-paleosuelo` | fondo marrón + círculos irregulares (moteado) |
| `mod-trazas` | líneas sinuosas + puntos terminales |
| `mod-bioturbacion` | elipses superpuestas + línea vertical |
| `mod-oxidacion` | fondo rojo semitransparente + reticulado |
| `mod-cemento-calc` | fondo celeste + líneas horizontales + puntos |
| `mod-silicificacion` | fondo beige + triángulos (cristales) |
| `mod-nodulos` | elipses rellenas irregulares |
| `mod-materia-org` | fondo oscuro + láminas finas |

---

## Formulario (tab Unidades)

Dentro del formulario de edición de unidad, agregar una sección colapsable al final:

```
▾ Modificadores de zona
  [ Techo ]  Tipo: [selector▼]  Espesor: [__] cm  Notas: [____________]
  [ Muro  ]  Tipo: [selector▼]  Espesor: [__] cm  Notas: [____________]
```

- El selector muestra "— sin modificador —" como opción vacía (borra el campo).
- El campo de espesor es numérico, mínimo 1 cm, máximo `floor(u.thickness * 100)` cm (= espesor de la unidad en cm). Si el usuario ingresa un valor mayor, se clampea automáticamente al máximo y se muestra un aviso en el toast.
- Notas: texto libre, máx ~120 caracteres.
- La sección está colapsada por defecto; se expande si la unidad ya tiene algún modificador definido.

---

## Persistencia y exportación

### `.col.json`
Los campos `modTecho` y `modMuro` se serializan directamente en cada objeto de unidad. La importación aplica defaults `null` si no existen (retrocompatibilidad total).

### CSV
Seis columnas nuevas al final del CSV:

| columna | descripción |
|---------|-------------|
| `modTechoType` | id del modificador o vacío |
| `modTechoCm` | espesor en cm o vacío |
| `modTechoNotes` | texto libre |
| `modMuroType` | id del modificador o vacío |
| `modMuroCm` | espesor en cm o vacío |
| `modMuroNotes` | texto libre |

El CSV template y el CSV exportado incluyen estas columnas. La guía CSV (`showHelp`) lista los ids válidos.

### `DF` (default de unidad)
```js
modTecho: null,
modMuro: null,
```

---

## Leyenda SVG

Los modificadores que aparecen al menos una vez en la columna se agregan automáticamente a la sección de leyenda, con su patrón y nombre en español, separados de las litologías.

---

## Fuera de alcance (esta versión)

- Más de un modificador por posición (techo/muro).
- Modificadores en zona central de la unidad (no techo/muro).
- Exportación de modificadores al KMZ.
- Símbolo de modificador en la lista de unidades del panel izquierdo (posible mejora futura).
