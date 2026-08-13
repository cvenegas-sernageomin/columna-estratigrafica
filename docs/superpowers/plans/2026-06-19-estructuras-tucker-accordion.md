# Estructuras Tucker + Acordeón PWA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expandir el catálogo de estructuras sedimentarias con 10 nuevas entradas basadas en Tucker (2003), mejorar glífos SVG existentes, convertir el selector de estructuras en un acordeón colapsable optimizado para PWA, y agregar 7 nuevos ambientes depositacionales.

**Architecture:** Todo el cambio reside en `src/app.jsx` (único archivo fuente). Se modifican tres secciones independientes: (1) el array `STRUCTS` + función `glyphEls`, (2) el componente `StructPicker` en el panel de edición, y (3) el array `ENVS` + el `<select>` de ambiente. Cada tarea produce un build verificable con `.\build.ps1`.

**Tech Stack:** React 18.3.1 (global via vendor/), Babel Standalone, SVG inline, PowerShell build, sin bundler ni tests automatizados — verificación manual en navegador.

---

## Archivos a modificar

- **Modify:** `src/app.jsx` — única fuente de verdad; 4 zonas de edición claramente delimitadas

---

## Task 1: Agregar 10 nuevas estructuras a `STRUCTS` + glífos en `glyphEls`

**Files:**
- Modify: `src/app.jsx` líneas ~286–309 (array STRUCTS) y ~320–344 (switch en glyphEls)

- [ ] **Step 1: Reemplazar el array STRUCTS completo** (líneas 286–309 en app.jsx)

Localizar la sección:
```js
const STRUCTS = [
  ["planar_lam", ...
  ...
  ["nodules", ...
];
```

Reemplazar con la versión expandida y reorganizada por grupo:

```js
const STRUCTS = [
  // ── Estratificación interna ──
  ["planar_lam",     "Laminación paralela",            "Estratificación"],
  ["parting_lin",    "Lineación de partición",          "Estratificación"],
  ["cross_bed",      "Est. cruzada planar (tabular)",   "Estratificación"],
  ["trough_xbed",    "Est. cruzada en artesa (trough)", "Estratificación"],
  ["herringbone",    "Est. cruzada espiga (herringbone)","Estratificación"],
  ["hcs",            "HCS – Hummocky cross-strat.",     "Estratificación"],
  ["massive",        "Capa masiva (sin estructura)",    "Estratificación"],
  // ── Ondulitas ──
  ["current_ripple", "Ondulitas de corriente",          "Ondulitas"],
  ["wave_ripple",    "Ondulitas de oleaje",             "Ondulitas"],
  ["climbing_ripple","Ripples escalantes (climbing)",   "Ondulitas"],
  // ── Heterolítica ──
  ["flaser",         "Estratificación flaser",          "Heterolítica"],
  ["wavy_bed",       "Estratificación ondulada (wavy)", "Heterolítica"],
  ["lenticular",     "Estratificación lenticular",      "Heterolítica"],
  // ── Gradación ──
  ["graded_normal",  "Gradación normal",                "Gradación"],
  ["graded_reverse", "Gradación inversa",               "Gradación"],
  // ── Sole / base ──
  ["flute_cast",     "Calcos de flujo (flute)",         "Sole / base"],
  ["groove_cast",    "Calcos de surco (groove)",        "Sole / base"],
  ["load_cast",      "Calcos de carga (load)",          "Sole / base"],
  ["scour",          "Base erosiva / scour",            "Sole / base"],
  // ── Deformación sinsedimentaria ──
  ["convolute",      "Laminación convoluta",            "Deformación sinsed."],
  ["slump",          "Slump / pliegue sinsed.",         "Deformación sinsed."],
  ["flame",          "Estructuras de llama (flame)",    "Deformación sinsed."],
  ["dish_pillar",    "Dish-and-pillar (dewatering)",    "Deformación sinsed."],
  // ── Exposición / diagénesis ──
  ["mudcrack",       "Grietas de desecación",           "Exposición / diagénesis"],
  ["syneresis",      "Grietas de sineresis",            "Exposición / diagénesis"],
  ["nodules",        "Nódulos / concreciones",          "Exposición / diagénesis"],
  // ── Biogénicas ──
  ["bioturbation",   "Bioturbación general",            "Biogénicas"],
  ["vert_burrow",    "Galerías verticales (Skolithos)", "Biogénicas"],
  ["u_burrow",       "Galería en U (Diplocraterion)",   "Biogénicas"],
  ["rootlets",       "Raíces / rizolitos",              "Biogénicas"],
  ["bioclasts",      "Bioclastos / conchillas",         "Biogénicas"],
  // ── Carbonáticas ──
  ["stromatolite",   "Estromatolitos",                  "Carbonáticas"],
  ["tepee",          "Tepees (carbonático)",             "Carbonáticas"],
  ["hardground",     "Hardground / fondo endurecido",   "Carbonáticas"],
];
```

- [ ] **Step 2: Agregar los 10 nuevos glífos en `glyphEls`** (switch dentro de la función, líneas ~320–344)

Localizar el bloque `switch (id) {` en `glyphEls`. Después del último `case` existente (`nodules`) y antes del `default`, agregar:

```js
    case "parting_lin":   return [ln(-9,-5,9,-5,1),ln(-7,-2,7,-2,1),ln(-9,1,9,1,1),ln(-7,4,7,4,1)];
    case "herringbone":   return [pa("M-10,8 L0,-2 L10,8",1.4), pa("M-10,-2 L0,8 L10,-2",1.4)];
    case "hcs":           return [pa("M-11,4 Q-7,-5 -3,4 Q1,-5 5,4 Q9,-5 11,4"),pa("M-11,-2 Q-7,7 -3,-2 Q1,7 5,-2 Q9,7 11,-2")];
    case "massive":       return [pa("M-9,-8 L9,-8 L9,8 L-9,8 Z",1),ci(0,0,1.2)];
    case "wavy_bed":      return [pa("M-11,5 Q-7,-1 -3,5 Q1,-1 5,5 Q9,-1 11,5"),ln(-11,1,11,1,0.8),pa("M-11,-3 Q-7,3 -3,-3 Q1,3 5,-3 Q9,3 11,-3")];
    case "groove_cast":   return [ln(-10,-5,10,-5),ln(-10,-1,10,-1),ln(-10,3,10,3),ln(-10,7,10,7)];
    case "flame":         return [pa("M-5,9 C-7,2 -2,-4 0,-9 C2,-4 7,2 5,9"),pa("M-3,9 C-4,4 -1,0 0,-5"),ln(-9,9,9,9,1.2)];
    case "dish_pillar":   return [pa("M-9,2 Q-5,8 0,2 Q5,8 9,2"),ln(0,-8,0,2,1.4)];
    case "syneresis":     return [pa("M-8,-3 l3,3 l-4,5"),pa("M0,-5 l2,6 l-3,4"),pa("M6,-2 l-2,4 l3,4")];
    case "stromatolite":  return [pa("M-9,8 Q-9,-2 0,-8 Q9,-2 9,8"),pa("M-6,8 Q-6,0 0,-5 Q6,0 6,8"),ln(-9,8,9,8,1)];
    case "tepee":         return [pa("M-10,6 L0,-8 L10,6"),pa("M-6,6 L0,-3 L6,6"),ln(-10,6,10,6,1.2)];
    case "hardground":    return [ln(-9,-6,9,-6,2),ci(-6,-2,2),ci(0,-2,2),ci(6,-2,2),ln(-9,4,9,4,0.8)];
```

- [ ] **Step 3: Mejorar glífo de `flaser`** (ya existente, reemplazar solo ese case)

El glífo actual de flaser es genérico. Reemplazarlo para que muestre la onda de arena sobre el lodo (más fiel a Tucker Fig. 5.21):

Localizar:
```js
    case "flaser":         return [pa("M-11,4 Q-7,-3 -3,4 Q1,-3 5,4 Q9,-3 11,4"),el(-5,1,2.4,1),el(4,1,2.4,1)];
```

Reemplazar con:
```js
    case "flaser":         return [ln(-11,6,11,6,1),pa("M-11,6 Q-7,-1 -3,6 Q1,-1 5,6 Q9,-1 11,6"),el(-4,-1,3,1.5),el(5,0,2.5,1.5)];
```

- [ ] **Step 4: Verificar build sin errores**

```powershell
cd C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica
.\build.ps1
```

Resultado esperado: `dist\Columna_Estratigrafica.html` regenerado sin errores de JS.

- [ ] **Step 5: Abrir en navegador y verificar**

Abrir `dist\Columna_Estratigrafica.html`. Crear una unidad, abrir el panel de edición y verificar que el selector de estructuras muestra los 9 grupos con las 34 estructuras, y que los nuevos glífos (HCS, espiga, etc.) se renderizan.

- [ ] **Step 6: Commit**

```powershell
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica add src/app.jsx
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica commit -m "feat: expand STRUCTS to 34 symbols from Tucker 2003, improve flaser glyph"
```

---

## Task 2: Convertir selector de estructuras en acordeón colapsable (PWA)

**Files:**
- Modify: `src/app.jsx` — sección del selector de estructuras (líneas ~2360–2394) y la inicialización de estado del panel (búsqueda de `useState` en el componente `EditPanel`)

- [ ] **Step 1: Agregar estado de grupos expandidos en el componente de edición**

Localizar en la función del panel principal (cerca de línea ~1550) el bloque de `useState` que gestiona el form de unidades. Buscar el bloque de `toggleStruct`:

```js
  const toggleStruct = id => setF(p => {
```

Justo antes de esa línea, agregar:

```js
  const [openStructGroups, setOpenStructGroups] = React.useState(() => {
    // Expandir por defecto los grupos que tengan estructuras activas
    const active = new Set((f.structSymbols || []).map(id => {
      const s = STRUCTS.find(s => s[0] === id);
      return s ? s[2] : null;
    }).filter(Boolean));
    return active.size > 0 ? active : new Set(["Estratificación"]);
  });
  const toggleStructGroup = g => setOpenStructGroups(prev => {
    const next = new Set(prev);
    next.has(g) ? next.delete(g) : next.add(g);
    return next;
  });
```

- [ ] **Step 2: Reemplazar el bloque del selector de estructuras con acordeón**

Localizar el bloque completo (líneas ~2368–2393):

```jsx
              <div style={{ marginTop: 3, border: `1px solid ${T.border}`, borderRadius: 3,
                maxHeight: 170, overflowY: "auto", background: T.inputBg }}>
                {STRUCT_GROUPS.map(g => (
                  <div key={g}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.text3,
                      padding: "3px 8px", background: T.panelAlt,
                      borderBottom: `1px solid ${T.border}`, letterSpacing: "0.04em",
                      textTransform: "uppercase" }}>{g}</div>
                    {STRUCTS.filter(s => s[2] === g).map(s => {
                      const on = (f.structSymbols || []).includes(s[0]);
                      return (
                        <label key={s[0]} style={{ display: "flex", alignItems: "center",
                          gap: 7, padding: "4px 8px", cursor: "pointer",
                          background: on ? "#E8F2E3" : "transparent",
                          borderBottom: `1px solid ${T.cardEdge}` }}>
                          <input type="checkbox" checked={on}
                            onChange={() => toggleStruct(s[0])}
                            style={{ cursor: "pointer", accentColor: T.green }} />
                          <span style={{ fontSize: 11, color: on ? T.green : T.text,
                            fontWeight: on ? 600 : 400 }}>{s[1]}</span>
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>
```

Reemplazar con:

```jsx
              <div style={{ marginTop: 3, border: `1px solid ${T.border}`, borderRadius: 3,
                background: T.inputBg }}>
                {STRUCT_GROUPS.map(g => {
                  const groupItems = STRUCTS.filter(s => s[2] === g);
                  const activeInGroup = groupItems.filter(s => (f.structSymbols || []).includes(s[0])).length;
                  const isOpen = openStructGroups.has(g);
                  return (
                    <div key={g}>
                      <button
                        type="button"
                        onPointerDown={e => { e.preventDefault(); toggleStructGroup(g); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "5px 8px", background: T.panelAlt,
                          border: "none", borderBottom: `1px solid ${T.border}`,
                          cursor: "pointer", textAlign: "left", minHeight: 34 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: T.text3,
                          letterSpacing: "0.04em", textTransform: "uppercase" }}>{g}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {activeInGroup > 0 && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: T.green,
                              background: "#D6EDD5", borderRadius: 8, padding: "1px 5px" }}>
                              {activeInGroup}
                            </span>
                          )}
                          <span style={{ fontSize: 10, color: T.text3 }}>{isOpen ? "▲" : "▼"}</span>
                        </span>
                      </button>
                      {isOpen && groupItems.map(s => {
                        const on = (f.structSymbols || []).includes(s[0]);
                        return (
                          <label key={s[0]} style={{ display: "flex", alignItems: "center",
                            gap: 7, padding: "5px 8px", cursor: "pointer",
                            background: on ? "#E8F2E3" : "transparent",
                            borderBottom: `1px solid ${T.cardEdge}`,
                            minHeight: 34 }}>
                            <input type="checkbox" checked={on}
                              onChange={() => toggleStruct(s[0])}
                              style={{ cursor: "pointer", accentColor: T.green, width: 16, height: 16 }} />
                            <StructIcon id={s[0]} size={18} />
                            <span style={{ fontSize: 11, color: on ? T.green : T.text,
                              fontWeight: on ? 600 : 400, flex: 1 }}>{s[1]}</span>
                          </label>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
```

> Nota: se agrega `<StructIcon id={s[0]} size={18} />` en cada fila para mostrar el glífo junto al nombre — mejora la usabilidad en móvil/PWA.

- [ ] **Step 3: Sincronizar grupos abiertos cuando cambia la unidad activa**

Cuando el usuario cambia de unidad (selecciona otra fila), los grupos con estructuras activas deben abrirse automáticamente. Localizar el `useEffect` que inicializa `f` cuando cambia `selIdx` (cerca de donde se ve `setF(units[selIdx]...)`). Después de ese `setF(...)`, agregar:

```js
    const syms = (units[selIdx]?.structSymbols || []);
    const activeGroups = new Set(syms.map(id => {
      const s = STRUCTS.find(s => s[0] === id);
      return s ? s[2] : null;
    }).filter(Boolean));
    setOpenStructGroups(activeGroups.size > 0 ? activeGroups : new Set(["Estratificación"]));
```

> Si no hay un `useEffect` explícito sino que `f` se computa derivado de `units[selIdx]`, agregar este bloque como un `useEffect` separado con dependencia en `selIdx`.

- [ ] **Step 4: Build y verificar acordeón**

```powershell
cd C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica
.\build.ps1
```

Abrir `dist\Columna_Estratigrafica.html`. En el panel de edición:
- Los 9 grupos aparecen como encabezados colapsables.
- Hacer click en "Ondulitas" → se expande y muestra 3 estructuras con sus glífos.
- Hacer click de nuevo → se cierra.
- Activar "Ondulitas de corriente" → el encabezado de grupo muestra badge verde "1".
- En PWA (Chrome DevTools mobile 375px) el acordeón es usable sin scroll excesivo.

- [ ] **Step 5: Commit**

```powershell
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica add src/app.jsx
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica commit -m "feat: collapsible accordion struct picker with glyph icons, PWA touch targets"
```

---

## Task 3: Expandir y agrupar ambientes depositacionales

**Files:**
- Modify: `src/app.jsx` — array `ENVS` (líneas ~240–249) y el `<select>` de ambiente (líneas ~2417–2423)

- [ ] **Step 1: Reemplazar `ENVS` por estructura agrupada**

Localizar:
```js
const ENVS = [
  "Fluvial – canal braided",
  ...
];
```

Reemplazar con un array de grupos para usar `<optgroup>`:

```js
const ENV_GROUPS = [
  { label: "Fluvial / continental", envs: [
    "Fluvial – canal braided",
    "Fluvial – canal meandroso",
    "Fluvial – planicie inundación",
    "Fluvial – planicie mareal",
    "Abanico aluvial",
    "Lacustre",
    "Eólico",
    "Glacial / periglacial",
    "Pedogénico / paleosuelo",
  ]},
  { label: "Transicional", envs: [
    "Deltaico – canal distributario",
    "Deltaico – prodelta / plataforma deltaica",
    "Estuarino",
    "Laguna costera",
    "Litoral / shoreface",
  ]},
  { label: "Marino siliciclástico", envs: [
    "Marino somero (plataforma)",
    "Turbidítico",
    "Abanico submarino",
    "Marino profundo / pelágico",
  ]},
  { label: "Carbonático", envs: [
    "Carbonático – lagoon / planicie mareal",
    "Carbonático arrecifal",
    "Carbonático – plataforma",
  ]},
  { label: "Especial", envs: [
    "Evaporítico",
    "Volcánico subaéreo",
    "Volcánico submarino",
  ]},
];
// Mantener ENVS plano para retrocompatibilidad (CSV template, etc.)
const ENVS = ENV_GROUPS.flatMap(g => g.envs);
```

- [ ] **Step 2: Actualizar el `<select>` de ambiente para usar `<optgroup>`**

Localizar:
```jsx
              <select value={f.environment} style={inputStyle}
                onChange={e => ff("environment", e.target.value)}>
                <option value="">— seleccionar —</option>
                {ENVS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
```

Reemplazar con:
```jsx
              <select value={f.environment} style={inputStyle}
                onChange={e => ff("environment", e.target.value)}>
                <option value="">— seleccionar —</option>
                {ENV_GROUPS.map(g => (
                  <optgroup key={g.label} label={g.label}>
                    {g.envs.map(e => <option key={e} value={e}>{e}</option>)}
                  </optgroup>
                ))}
              </select>
```

- [ ] **Step 3: Actualizar el template CSV**

El template CSV (cerca de línea ~440–447) usa algunos nombres de ambiente. Los existentes siguen siendo válidos; solo verificar que la línea de ejemplo usa un valor que sigue existiendo. No se requiere cambio si ya usa "Lacustre" o "Fluvial – canal braided".

- [ ] **Step 4: Build y verificar ambientes**

```powershell
.\build.ps1
```

Abrir `dist\Columna_Estratigrafica.html`. En el campo "Ambiente deposicional" verificar:
- El `<select>` muestra 5 grupos (`<optgroup>`) con los 24 ambientes.
- Los nombres nuevos aparecen (ej. "Abanico submarino", "Pedogénico / paleosuelo").
- Seleccionar un ambiente antiguo ("Turbidítico") funciona sin problemas.

- [ ] **Step 5: Commit**

```powershell
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica add src/app.jsx
git -C C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica commit -m "feat: expand depositional environments to 24 with optgroup categories (Tucker 2003)"
```

---

## Task 4: Build final y publicar

**Files:**
- Modify: `dist/` (salida del build, gestionada por git separado)

- [ ] **Step 1: Build de distribución final**

```powershell
cd C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica
.\build.ps1
```

Verificar tamaño del HTML final (esperado ~3.3–3.4 MB).

- [ ] **Step 2: Verificar retrocompatibilidad con .col.json antiguo**

Abrir `dist\Columna_Estratigrafica.html`. Cargar un `.col.json` existente con estructuras antiguas (ej. `bioturbation`, `cross_bed`). Verificar:
- Las estructuras antiguas siguen apareciendo marcadas.
- El alias de retrocompatibilidad funciona (los IDs no cambiaron; solo cambió el grupo de asignación).

- [ ] **Step 3: Commit y push en dist/**

```powershell
cd C:\Users\carlos.venegas\Documents\Claude\columna-estratigrafica\dist
git add .
git commit -m "v4.4: Tucker structures (34), accordion picker, 24 depositional environments"
git push origin main
```

---

## Self-Review

**Cobertura del spec:**
- ✅ 10 nuevas estructuras (HCS, espiga, wavy, groove cast, llama, dish-pillar, sineresis, estromatolitos, tepees, hardground) + parting lineation = 11 en total, sumando 12 incluyendo massive → 34 estructuras totales (plan inicial estimó +10–12)
- ✅ Glífo de flaser mejorado
- ✅ Acordeón colapsable con badge de conteo y ícono SVG en cada fila
- ✅ Touch targets ≥34px (minHeight: 34 en labels y botones)
- ✅ 7 nuevos ambientes + reorganización en optgroups
- ✅ Retrocompatibilidad: ENVS plano mantenido; IDs de estructuras sin cambio

**Riesgos a verificar:**
- El estado `openStructGroups` se inicializa con `f.structSymbols` al momento del render inicial; si `f` cambia antes de que el estado se inicialice puede haber desfase — el Step 3 del Task 2 lo corrige.
- Los `<optgroup>` en iOS Safari PWA instalada renderizan correctamente (nativo del SO).

**Placeholder scan:** Ninguno encontrado.
