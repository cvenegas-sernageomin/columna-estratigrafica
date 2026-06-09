// Browser build: React llega como global (vendor/react.*). Sin bundler.
const { useState, useMemo, useRef } = React;

// ═══════════════════════════════════════════════════════════════
// THEME — Warm geological field-notebook palette
// ═══════════════════════════════════════════════════════════════
const T = {
  pageBg:    "#E5D8BD",
  panel:     "#F4ECD8",
  panelAlt:  "#EBE0C2",
  card:      "#FCF7E8",
  cardEdge:  "#C9B894",
  border:    "#B8A480",
  borderDk:  "#8B6B40",
  hdrBg:     "#3A2818",
  hdrFg:     "#F5E8CC",
  text:      "#2A1F12",
  text2:     "#5C4A33",
  text3:     "#8B7355",
  ink:       "#1F1610",
  green:     "#2D5F4E",
  rust:      "#A8553C",
  indigo:    "#2C5577",
  gold:      "#A87C2A",
  danger:    "#8B2818",
  inputBg:   "#FFFCF2",
  inputBd:   "#B8A480",
};

const SERIF = '"Iowan Old Style", "Palatino Linotype", Georgia, serif';
const MONO  = '"SF Mono", "Roboto Mono", Menlo, Consolas, monospace';
const SANS  = "system-ui, -apple-system, sans-serif";

// ═══════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════
const MT = 78;
// Escala vertical dinámica (px por metro). FIT_TARGET = alto útil aprox. de la
// columna para que entre en una hoja Carta; se clampa entre MIN y MAX.
const SPX_MIN = 2.5, SPX_MAX = 80, FIT_TARGET = 780;
const AGX = 8,   AGW = 42;   // columna Edad (cronoestratigrafía)
const FMX = 52,  FMW = 48;   // columna Formación / Miembro (litoestratigrafía)
const AX  = 140;             // eje de metros (línea vertical)
const SX  = 146, SAW = 46;   // pista de muestras
const CX  = 200, CW  = 92;   // columna litológica
const STX = CX + CW + 8;     // pista de estructuras (der. de la columna)
const STW = 36;              // ancho pista de estructuras
const LX  = STX + STW + 8;   // inicio de etiquetas de texto
const SW  = 840;
const PHX = SW - 100;
const PHW = 80, PHH = 60;

// ═══════════════════════════════════════════════════════════════
// LITHOLOGY CATALOGUE  [id, name, pattern, defaultGrain, group]
// ═══════════════════════════════════════════════════════════════
const LITH = [
  // ── Sedimentarias clásticas ──
  ["conglomerate", "Conglomerado",            "p-congl",   "cobble", "Sedimentarias clásticas"],
  ["breccia",      "Brecha sedimentaria",     "p-brecc",   "cobble", "Sedimentarias clásticas"],
  ["sandstone",    "Arenisca masiva",         "p-sand",    "ms",     "Sedimentarias clásticas"],
  ["xbedded_sand", "Arenisca est. cruzada",   "p-xsand",   "cs",     "Sedimentarias clásticas"],
  ["ripple_sand",  "Arenisca con ripples",    "p-rsand",   "fs",     "Sedimentarias clásticas"],
  ["siltstone",    "Limolita",                "p-silt",    "silt",   "Sedimentarias clásticas"],
  ["shale",        "Pelita / Lutita",         "p-shale",   "clay",   "Sedimentarias clásticas"],
  // ── Carbonatos y químicas ──
  ["limestone",    "Caliza",                  "p-lime",    "ms",     "Carbonatos y químicas"],
  ["nodular_lime", "Caliza nodular",          "p-nlime",   "silt",   "Carbonatos y químicas"],
  ["dolostone",    "Dolomita",                "p-dolo",    "ms",     "Carbonatos y químicas"],
  ["chert",        "Chert / Ftanita",         "p-chert",   "clay",   "Carbonatos y químicas"],
  ["gypsum",       "Yeso / Evaporita",        "p-gyps",    "clay",   "Carbonatos y químicas"],
  ["coal",         "Carbón",                  "p-coal",    "clay",   "Carbonatos y químicas"],
  // ── Volcánicas — lavas y coladas ──
  ["basalt",       "Lava basáltica",          "p-bslt",    "coherent", "Volcánicas — lavas y coladas"],
  ["andesite",     "Lava andesítica",         "p-andes",   "coherent", "Volcánicas — lavas y coladas"],
  ["dacite",       "Lava dacítica",           "p-dacit",   "coherent", "Volcánicas — lavas y coladas"],
  ["rhyolite",     "Lava riolítica",          "p-rhyo",    "coherent", "Volcánicas — lavas y coladas"],
  ["pillow_lava",  "Lava almohadillada",      "p-pillow",  "coherent", "Volcánicas — lavas y coladas"],
  ["autobreccia",  "Autobrecha de lava",      "p-autobr",  "cobble",   "Volcánicas — lavas y coladas"],
  // ── Volcánicas — piroclásticas ──
  ["ash_tuff",     "Toba de ceniza",          "p-ashtuff", "silt",     "Volcánicas — piroclásticas"],
  ["lapilli_tuff", "Toba de lapilli",         "p-lapilli", "granule",  "Volcánicas — piroclásticas"],
  ["block_tuff",   "Toba de bloques y bombas","p-blocktuff","cobble",  "Volcánicas — piroclásticas"],
  ["ignimbrite",   "Ignimbrita / toba soldada","p-ignim",  "fs",       "Volcánicas — piroclásticas"],
  ["agglomerate",  "Aglomerado volcánico",    "p-agglom",  "cobble",   "Volcánicas — piroclásticas"],
  ["volc_breccia", "Brecha volcánica / piroclástica","p-vbrecc","cobble","Volcánicas — piroclásticas"],
  // ── Volcaniclásticas / epiclásticas ──
  ["tuffite",          "Tufita",                  "p-tuffite",  "fs",     "Volcaniclásticas / epiclásticas"],
  ["lapillite",        "Lapillita (epiclástica)", "p-lapillite","granule","Volcaniclásticas / epiclásticas"],
  ["epiclastic",       "Roca epiclástica (retrabajada)","p-epiclas","ms", "Volcaniclásticas / epiclásticas"],
  ["epiclastic_breccia","Brecha epiclástica",     "p-epibrecc","cobble","Volcaniclásticas / epiclásticas"],
  // ── Intrusivas plutónicas (grano grueso, cristalizadas en profundidad) ──
  ["granite",      "Granito",                 "p-gran",    "coherent", "Intrusivas plutónicas"],
  ["granodiorite", "Granodiorita",            "p-grdior",  "coherent", "Intrusivas plutónicas"],
  ["tonalite",     "Tonalita",                "p-tonal",   "coherent", "Intrusivas plutónicas"],
  ["diorite",      "Diorita",                 "p-dior",    "coherent", "Intrusivas plutónicas"],
  ["gabbro",       "Gabro",                   "p-gabbro",  "coherent", "Intrusivas plutónicas"],
  // ── Intrusivas hipabisales / subvolcánicas (cuerpos menores) ──
  ["porphyry",     "Pórfido",                 "p-porph",   "coherent", "Intrusivas hipabisales / subvolcánicas"],
  ["subvolc_dike", "Dique subvolcánico (and./dac.)","p-svdike","coherent","Intrusivas hipabisales / subvolcánicas"],
  // ── Metamórficas (clasificadas por textura, protolito indefinido) ──
  ["slate",        "Pizarra",                 "p-slate",   "coherent", "Metamórficas (por textura)"],
  ["phyllite",     "Filita",                  "p-phyll",   "coherent", "Metamórficas (por textura)"],
  ["schist",       "Esquisto",                "p-schist",  "coherent", "Metamórficas (por textura)"],
  ["gneiss",       "Gneis",                   "p-gneiss",  "coherent", "Metamórficas (por textura)"],
  ["amphibolite",  "Anfibolita",              "p-amphib",  "coherent", "Metamórficas (por textura)"],
];

const LITH_GROUPS = [...new Set(LITH.map(l => l[4]))];

// Backward-compat aliases for older CSV files
const LITHO_ALIAS = { tuff: "ash_tuff", volcanic_breccia: "volc_breccia" };

// ═══════════════════════════════════════════════════════════════
// GRAIN SIZE  [id, label, widthRatio]
// ═══════════════════════════════════════════════════════════════
const GRAIN = [
  ["clay",     "Arcilla / ceniza muy fina",         0.10],
  ["silt",     "Limo / ceniza fina",                0.22],
  ["vfs",      "Arena muy fina",                    0.34],
  ["fs",       "Arena fina / ceniza gruesa",        0.46],
  ["ms",       "Arena media",                       0.57],
  ["cs",       "Arena gruesa",                      0.68],
  ["vcs",      "Arena muy gruesa",                  0.79],
  ["granule",  "Gránulo / lapilli (2–64 mm)",       0.87],
  ["cobble",   "Grava / bloque / bomba (>64 mm)",   1.00],
  ["coherent", "Roca coherente (lava / intrusivo)", 0.90],
];

// Abreviaturas para el eje granulométrico (escala de Wentworth)
const GRAIN_ABBR = {
  clay: "Ac", silt: "Li", vfs: "mf", fs: "f", ms: "m",
  cs: "g", vcs: "mg", granule: "Gr", cobble: "Bl",
};

// Paleta Munsell — chips comunes en rocas/sedimentos  [notación, nombre, hex aprox.]
const MUNSELL = [
  ["N8",      "gris muy claro",        "#D2D2D0"],
  ["N7",      "gris claro",            "#B7B7B4"],
  ["N6",      "gris medio",            "#969693"],
  ["N5",      "gris",                  "#787875"],
  ["N4",      "gris oscuro",           "#5C5C59"],
  ["N3",      "gris muy oscuro",       "#403F3D"],
  ["N2",      "negro grisáceo",        "#2A2927"],
  ["5Y 8/1",  "gris amarillento cl.",  "#DCD8C2"],
  ["5Y 6/1",  "gris claro oliva",      "#A8A593"],
  ["5Y 4/1",  "gris oliva oscuro",     "#6E6C5C"],
  ["5Y 6/4",  "oliva pálido",          "#9C9460"],
  ["5GY 4/1", "gris verdoso oscuro",   "#5E665C"],
  ["10Y 5/2", "gris verdoso",          "#7C8478"],
  ["5GY 6/1", "gris verde claro",      "#9CA298"],
  ["10YR 8/2","marrón muy pálido",     "#E0D2B4"],
  ["10YR 6/4","marrón amarillento",    "#B89A66"],
  ["10YR 5/3","marrón",                "#9A7C54"],
  ["10YR 4/2","marrón grisáceo osc.",  "#6E6048"],
  ["7.5YR 5/4","marrón fuerte",        "#9A6E4A"],
  ["5YR 5/3", "marrón rojizo",         "#9C6E58"],
  ["5YR 4/4", "marrón rojizo osc.",    "#824E38"],
  ["2.5YR 4/6","rojo",                 "#8E3F2E"],
  ["10R 4/6", "rojo oscuro",           "#8A3528"],
  ["10R 3/4", "rojo muy oscuro",       "#5E2E26"],
  ["5YR 6/6", "amarillo rojizo",       "#C8884E"],
  ["10YR 7/6","amarillo parduzco",     "#D6A24E"],
  ["2.5Y 8/4","amarillo pálido",       "#E2CE96"],
  ["5R 4/2",  "rojo grisáceo",         "#7E5450"],
  ["5P 4/2",  "púrpura grisáceo",      "#6A5E6E"],
  ["5B 6/2",  "azul grisáceo",         "#8C9AA0"],
];

const CONTACTS = [
  ["sharp",        "Neto concordante"   ],
  ["gradational",  "Gradacional"        ],
  ["erosive",      "Erosivo"            ],
  ["unconformity", "Discordancia angular"],
];

const ENVS = [
  "Fluvial – canal braided",
  "Fluvial – canal meandroso",
  "Fluvial – planicie inundación",
  "Deltaico","Estuarino",
  "Litoral / shoreface","Marino somero (plataforma)","Marino profundo",
  "Turbidítico","Lacustre","Abanico aluvial","Eólico",
  "Glacial / periglacial","Carbonático arrecifal","Evaporítico",
  "Volcánico subaéreo","Volcánico submarino",
];

const WEATH = [
  "fresco","ligeramente alterado","moderadamente alterado",
  "muy alterado","completamente alterado",
];

const findL = id => LITH.find(l => l[0] === id) ?? LITH[2];
const findG = id => GRAIN.find(g => g[0] === id) ?? GRAIN[4];

// ═══════════════════════════════════════════════════════════════
// SEDIMENTARY STRUCTURES — librería de símbolos  [id, label, group]
// ═══════════════════════════════════════════════════════════════
const STRUCTS = [
  ["planar_lam",     "Laminación paralela",       "Laminación / estratificación"],
  ["cross_bed",      "Estratificación cruzada",   "Laminación / estratificación"],
  ["trough_xbed",    "Estrat. cruzada en artesa", "Laminación / estratificación"],
  ["convolute",      "Laminación convoluta",      "Laminación / estratificación"],
  ["current_ripple", "Ondulitas de corriente",    "Ondulitas"],
  ["wave_ripple",    "Ondulitas de oleaje",       "Ondulitas"],
  ["climbing_ripple","Ripples escalantes",        "Ondulitas"],
  ["graded_normal",  "Gradación normal",          "Gradación"],
  ["graded_reverse", "Gradación inversa",         "Gradación"],
  ["load_cast",      "Calcos de carga",           "Base / erosión"],
  ["flute_cast",     "Calcos de flujo (flute)",   "Base / erosión"],
  ["scour",          "Base erosiva / scour",      "Base / erosión"],
  ["mudcrack",       "Grietas de desecación",     "Deformación / exposición"],
  ["slump",          "Slump / pliegue sinsed.",   "Deformación / exposición"],
  ["flaser",         "Estratificación flaser",    "Heterolítica"],
  ["lenticular",     "Estratificación lenticular","Heterolítica"],
  ["bioturbation",   "Bioturbación",              "Biogénicas"],
  ["vert_burrow",    "Galerías verticales",       "Biogénicas"],
  ["u_burrow",       "Galería en U",              "Biogénicas"],
  ["rootlets",       "Raíces / rizolitos",        "Biogénicas"],
  ["bioclasts",      "Bioclastos / conchillas",   "Biogénicas"],
  ["nodules",        "Nódulos / concreciones",    "Diagénesis"],
];
const STRUCT_GROUPS = [...new Set(STRUCTS.map(s => s[2]))];
const findS = id => STRUCTS.find(s => s[0] === id);

// Glifo dibujado en una caja [-12,12]. Devuelve un array de elementos SVG.
function glyphEls(id, k = "g") {
  const S = "#2A1F12", W = 1.3;
  const ln = (x1,y1,x2,y2,w=W) => <line key={`${k}l${x1}${y1}${x2}${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={S} strokeWidth={w} strokeLinecap="round"/>;
  const pa = (d,w=W) => <path key={`${k}p${d}`} d={d} stroke={S} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round"/>;
  const el = (cx,cy,rx,ry) => <ellipse key={`${k}e${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} fill={S}/>;
  const ci = (cx,cy,r)   => <circle key={`${k}c${cx}${cy}`} cx={cx} cy={cy} r={r} fill={S}/>;
  switch (id) {
    case "planar_lam":     return [ln(-9,-6,9,-6),ln(-9,-2,9,-2),ln(-9,2,9,2),ln(-9,6,9,6)];
    case "cross_bed":      return [pa("M-10,8 L10,8 L10,-8 L-10,-8 Z",1),ln(-10,8,2,-8),ln(-4,8,8,-8),ln(2,8,10,-3)];
    case "trough_xbed":    return [pa("M-11,-6 Q-5,4 1,-6"),pa("M-3,-1 Q3,9 9,-1"),pa("M-7,4 Q0,12 7,4")];
    case "convolute":      return [pa("M-10,0 C-7,-9 -3,9 0,0 C3,-9 7,9 10,0")];
    case "current_ripple": return [pa("M-11,4 L-5,-5 L-1,4 L5,-5 L9,4"),ln(-11,7,9,7,1)];
    case "wave_ripple":    return [pa("M-11,3 Q-7,-6 -3,3 Q1,-6 5,3 Q9,-6 11,3")];
    case "climbing_ripple":return [pa("M-10,7 l4,-7 l4,7"),pa("M-2,3 l4,-7 l4,7"),pa("M6,-1 l4,-7")];
    case "graded_normal":  return [pa("M-8,-8 L8,-8 L0,8 Z")];
    case "graded_reverse": return [pa("M0,-8 L8,8 L-8,8 Z")];
    case "load_cast":      return [ln(-10,-4,10,-4),pa("M-9,-4 Q-9,7 -4,7 Q1,7 1,-4"),pa("M1,-4 Q1,8 6,8 Q10,8 10,-4")];
    case "flute_cast":     return [pa("M-9,-3 Q-9,6 -4,6 Q0,6 -1,-3"),pa("M2,-3 Q2,7 7,6 Q10,5 9,-3")];
    case "scour":          return [pa("M-11,-4 Q-7,4 -3,-4 Q1,4 5,-4 Q9,4 11,-4")];
    case "mudcrack":       return [ln(0,-9,0,9),pa("M0,-3 l-6,5"),pa("M0,2 l6,4"),pa("M0,0 l-6,-4")];
    case "slump":          return [pa("M-9,6 C-3,6 -6,-6 0,-6 C6,-6 3,6 9,6")];
    case "flaser":         return [pa("M-11,4 Q-7,-3 -3,4 Q1,-3 5,4 Q9,-3 11,4"),el(-5,1,2.4,1),el(4,1,2.4,1)];
    case "lenticular":     return [el(-5,-3,5,2),el(4,4,5,2)];
    case "bioturbation":   return [pa("M-6,-9 C-9,-4 -3,-2 -6,3 C-9,7 -3,8 -6,9"),pa("M5,-9 C2,-4 8,-2 5,3 C2,7 8,8 5,9")];
    case "vert_burrow":    return [pa("M-5,-9 L-5,5 Q-5,9 -2,9"),pa("M5,-9 L5,5 Q5,9 2,9")];
    case "u_burrow":       return [pa("M-6,-8 L-6,3 Q-6,9 0,9 Q6,9 6,3 L6,-8")];
    case "rootlets":       return [ln(0,-9,0,9),pa("M0,-2 l-5,4"),pa("M0,2 l5,4"),pa("M0,5 l-4,4")];
    case "bioclasts":      return [pa("M-9,2 Q-4,-9 5,-3 Q9,-1 7,3"),pa("M-9,2 Q-2,5 7,3",1)];
    case "nodules":        return [ci(-4,-2,3.4),ci(5,3,2.6)];
    default:               return [ci(0,0,2)];
  }
}
function StructIcon({ id, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="-14 -14 28 28" style={{ display: "block" }}>
      {glyphEls(id, id)}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAMPLES — tipos de muestra  [id, label, color]
// ═══════════════════════════════════════════════════════════════
const SAMPLE_TYPES = [
  ["geoquimica",     "Geoquímica",            "#2C5577"],
  ["datacion",       "Datación geocron.",     "#8B2818"],
  ["paleomag",       "Paleomagnetismo",       "#6A2E7A"],
  ["petrografia",    "Petrografía / corte",   "#2D5F4E"],
  ["micropaleo",     "Micropaleo / bioestrat.","#A87C2A"],
  ["drx",            "DRX / mineralogía",     "#3A2818"],
  ["sedimentologia", "Sedimentología",        "#A8553C"],
  ["otra",           "Otra",                  "#5C4A33"],
];
const findST = id => SAMPLE_TYPES.find(t => t[0] === id) ?? SAMPLE_TYPES[7];

// Fusiona unidades consecutivas con el mismo valor de `field` en bandas {val,bot,top}
function bandsOf(units, cumH, field) {
  const out = [];
  units.forEach((u, i) => {
    const val = (u[field] || "").trim();
    const bot = cumH[i], top = cumH[i] + u.thickness;
    const last = out[out.length - 1];
    if (last && last.val === val) last.top = top;
    else out.push({ val, bot, top });
  });
  return out;
}

// ═══════════════════════════════════════════════════════════════
// CONTACT GEOMETRY
// ═══════════════════════════════════════════════════════════════
const ERO_DY = [-3, 5, -4, 2, -6, 3, -5, 4, -3, 6];
function cPath(type, x1, x2, y) {
  if (type === "sharp") return `M${x1},${y}L${x2},${y}`;
  if (type === "gradational") {
    const n = 8, s = (x2 - x1) / n; let d = `M${x1},${y}`;
    for (let i = 0; i < n; i++) {
      const dy = i % 2 === 0 ? 3 : -3;
      d += ` C${x1+i*s+s*.3},${y+dy} ${x1+i*s+s*.7},${y+dy} ${x1+(i+1)*s},${y}`;
    }
    return d;
  }
  if (type === "erosive") {
    const n = 10, s = (x2 - x1) / n; let d = `M${x1},${y}`;
    for (let i = 0; i < n; i++)
      d += ` L${x1+i*s+s*.5},${y+ERO_DY[i]} L${x1+(i+1)*s},${y}`;
    return d;
  }
  const n = 8, s = (x2 - x1) / n; let d = `M${x1},${y}`;
  for (let i = 0; i < n; i++)
    d += ` L${x1+i*s+s*.5},${y+(i%2===0?-7:7)} L${x1+(i+1)*s},${y}`;
  return d;
}
const cClr = t => t==="unconformity" ? T.danger : t==="erosive" ? T.rust : T.ink;
const cWid = t => (t==="unconformity"||t==="erosive") ? 2 : 1.3;

// ═══════════════════════════════════════════════════════════════
// CSV UTILITIES
// ═══════════════════════════════════════════════════════════════
const CSV_HEADERS = ["thickness","lithology","lithology2","lithoRatio","color","grainSize","structures",
  "structSymbols","fossilsDating","contactBottom","environment","paleocurrent","weathering","notes",
  "age","formation"];

const CSV_TEMPLATE = `thickness,lithology,lithology2,lithoRatio,color,grainSize,structures,fossilsDating,contactBottom,environment,paleocurrent,weathering,notes
3.50,andesite,,,"5GY 4/1 gris verdoso oscuro",coherent,"Disyunción columnar, vesículas",,sharp,Volcánico subaéreo,,ligeramente alterado,Colada de lava basal
1.80,autobreccia,,,"5YR 4/2 gris rojizo",cobble,"Fragmentos angulosos monomícticos de lava",,gradational,Volcánico subaéreo,,moderadamente alterado,Autobrecha de techo de colada
20.00,lapilli_tuff,lapillite,0.6,"5YR 5/3 marrón rojizo",granule,"Intercalación rítmica, gradaciones normales por evento",,sharp,Volcánico subaéreo,,fresco,Paquete intercalado toba-lapillita (60/40)
0.90,ash_tuff,,,"N7 gris claro",silt,"Laminación fina, masiva",,gradational,Volcánico subaéreo,,fresco,Toba de ceniza fina
4.10,ignimbrite,,,"5YR 5/2 marrón rojizo pálido",fs,"Fiamme, soldamiento, juntas de enfriamiento",,erosive,Volcánico subaéreo,,ligeramente alterado,Ignimbrita soldada — flujo piroclástico
1.40,tuffite,,,"5Y 6/2 gris oliva",fs,"Estratificación, mezcla piroclástica-epiclástica","Restos vegetales",gradational,Lacustre,SE 120°,fresco,Retrabajo en ambiente lacustre
2.60,epiclastic,sandstone,0.7,"10YR 5/3 marrón",ms,"Est. cruzada, clastos volcánicos redondeados",,erosive,Fluvial – canal braided,NE 050°,fresco,Volcaniclástica retrabajada con interestratificación arenosa
1.20,block_tuff,,,"5YR 4/3 marrón rojizo",cobble,"Bloques y bombas, soporte matriz",,unconformity,Volcánico subaéreo,,moderadamente alterado,Depósito proximal — discordancia
`;

const META_KEYS = ["project","locality","author","date","datum","utmZone","utmHemi",
  "utmE","utmN","elevation","azimuth","description"];
function parseCsvMeta(text) {
  const out = {};
  text.replace(/^﻿/, "").split(/\r?\n/).forEach(line => {
    const mt = line.match(/^\s*#\s*([A-Za-z]+)\s*=\s*(.*)$/);
    if (mt && META_KEYS.includes(mt[1])) out[mt[1]] = mt[2].trim();
  });
  return out;
}

function parseCsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/)
    .filter(l => l.trim().length > 0 && !l.trim().startsWith("#"));
  if (lines.length < 2) return [];
  const rowOf = (row) => {
    const out = []; let cur = "", q = false;
    for (let i = 0; i < row.length; i++) {
      const c = row[i];
      if (c === '"') {
        if (q && row[i + 1] === '"') { cur += '"'; i++; }
        else q = !q;
      } else if (c === "," && !q) { out.push(cur); cur = ""; }
      else cur += c;
    }
    out.push(cur);
    return out;
  };
  const headers = rowOf(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = rowOf(line);
    const o = {};
    headers.forEach((h, i) => o[h] = (cells[i] ?? "").trim());
    return o;
  });
}

function generateCsv(units, meta, samples) {
  const esc = v => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = units.map(u => CSV_HEADERS.map(h => {
    const map = {
      thickness: u.thickness, lithology: u.lithoId,
      lithology2: u.lithoId2 || "",
      lithoRatio: u.lithoId2 ? u.lithoRatio : "",
      color: u.color,
      grainSize: u.grainSize, structures: u.structures,
      structSymbols: (u.structSymbols || []).join(";"),
      fossilsDating: u.fossilsDating,
      contactBottom: u.contactBottom, environment: u.environment,
      paleocurrent: u.paleocurrent, weathering: u.weathering, notes: u.notes,
      age: u.age, formation: u.formation,
    };
    return esc(map[h]);
  }).join(","));
  const body = [CSV_HEADERS.join(","), ...rows].join("\n");
  const head = [];
  if (meta) META_KEYS
    .filter(k => String(meta[k] ?? "").trim() !== "")
    .forEach(k => head.push(`#${k}=${String(meta[k]).replace(/[\r\n]+/g, " / ")}`));
  if (Array.isArray(samples)) samples
    .filter(s => s && s.code)
    .forEach(s => head.push(`#sample=${s.height}|${String(s.code).replace(/[|\r\n]/g, " ")}|${s.type || "otra"}`));
  return head.length ? head.join("\n") + "\n" + body : body;
}
function parseCsvSamples(text) {
  const valid = new Set(SAMPLE_TYPES.map(t => t[0]));
  const out = [];
  text.replace(/^﻿/, "").split(/\r?\n/).forEach(line => {
    const mt = line.match(/^\s*#\s*sample\s*=\s*(.*)$/);
    if (!mt) return;
    const [h, code, type] = mt[1].split("|");
    if (code && code.trim())
      out.push({ height: parseFloat(h) || 0, code: code.trim(),
        type: valid.has((type || "").trim()) ? type.trim() : "otra" });
  });
  return out;
}

function downloadFile(filename, content, mime = "text/csv;charset=utf-8") {
  downloadBlob(filename, new Blob([content], { type: mime }));
}
function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ═══════════════════════════════════════════════════════════════
// GEO — UTM → lat/long (WGS84, Transverse Mercator inverso)
// ═══════════════════════════════════════════════════════════════
function utmToLatLon(easting, northing, zone, isSouth) {
  const a = 6378137.0, f = 1 / 298.257223563, k0 = 0.9996;
  const e2 = f * (2 - f), e1sq = e2 / (1 - e2);
  const x = easting - 500000.0;
  let y = northing; if (isSouth) y -= 10000000.0;
  const m = y / k0;
  const mu = m / (a * (1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256));
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const fp = mu
    + (3*e1/2 - 27*e1**3/32) * Math.sin(2*mu)
    + (21*e1**2/16 - 55*e1**4/32) * Math.sin(4*mu)
    + (151*e1**3/96) * Math.sin(6*mu)
    + (1097*e1**4/512) * Math.sin(8*mu);
  const sinFp = Math.sin(fp), cosFp = Math.cos(fp), tanFp = Math.tan(fp);
  const C1 = e1sq * cosFp*cosFp, T1 = tanFp*tanFp;
  const N1 = a / Math.sqrt(1 - e2*sinFp*sinFp);
  const R1 = a*(1 - e2) / Math.pow(1 - e2*sinFp*sinFp, 1.5);
  const D = x / (N1*k0);
  const lat = fp - (N1*tanFp/R1) * (D*D/2
    - (5 + 3*T1 + 10*C1 - 4*C1*C1 - 9*e1sq) * D**4/24
    + (61 + 90*T1 + 298*C1 + 45*T1*T1 - 252*e1sq - 3*C1*C1) * D**6/720);
  const lonOrigin = ((zone - 1)*6 - 180 + 3) * Math.PI/180;
  const lon = lonOrigin + (D
    - (1 + 2*T1 + C1) * D**3/6
    + (5 - 2*C1 + 28*T1 - 3*C1*C1 + 8*e1sq + 24*T1*T1) * D**5/120) / cosFp;
  return { lat: lat*180/Math.PI, lon: lon*180/Math.PI };
}

// ═══════════════════════════════════════════════════════════════
// KMZ — ZIP (método "store") + CRC32, sin librerías externas
// ═══════════════════════════════════════════════════════════════
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function dataUrlToBytes(dataUrl) {
  const bin = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function makeKmz(entries) {
  const fileParts = [], centralParts = [];
  let offset = 0;
  for (const e of entries) {
    const nameBytes = new TextEncoder().encode(e.name);
    const data = e.data, crc = crc32(data), size = data.length;
    const lh = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0,0x04034b50,true); dv.setUint16(4,20,true); dv.setUint16(6,0,true);
    dv.setUint16(8,0,true); dv.setUint16(10,0,true); dv.setUint16(12,0x21,true);
    dv.setUint32(14,crc,true); dv.setUint32(18,size,true); dv.setUint32(22,size,true);
    dv.setUint16(26,nameBytes.length,true); dv.setUint16(28,0,true);
    lh.set(nameBytes,30);
    fileParts.push(lh, data);
    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true);
    cv.setUint16(8,0,true); cv.setUint16(10,0,true); cv.setUint16(12,0,true); cv.setUint16(14,0x21,true);
    cv.setUint32(16,crc,true); cv.setUint32(20,size,true); cv.setUint32(24,size,true);
    cv.setUint16(28,nameBytes.length,true); cv.setUint16(30,0,true); cv.setUint16(32,0,true);
    cv.setUint16(34,0,true); cv.setUint16(36,0,true); cv.setUint32(38,0,true); cv.setUint32(42,offset,true);
    cd.set(nameBytes,46);
    centralParts.push(cd);
    offset += lh.length + data.length;
  }
  const centralSize = centralParts.reduce((s,c)=>s+c.length,0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0,0x06054b50,true);
  ev.setUint16(8,entries.length,true); ev.setUint16(10,entries.length,true);
  ev.setUint32(12,centralSize,true); ev.setUint32(16,offset,true); ev.setUint16(20,0,true);
  return new Blob([...fileParts, ...centralParts, eocd], { type: "application/vnd.google-earth.kmz" });
}
function svgToPngDataUrl(svgNode, scale = 2) {
  return new Promise((resolve, reject) => {
    const xml = new XMLSerializer().serializeToString(svgNode);
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth  || svgNode.width.baseVal.value;
      const h = img.naturalHeight || svgNode.height.baseVal.value;
      const canvas = document.createElement("canvas");
      canvas.width = w*scale; canvas.height = h*scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FCF7E8"; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      try { resolve(canvas.toDataURL("image/png")); } catch (err) { reject(err); }
    };
    img.onerror = reject;
    img.src = url;
  });
}
function buildKml(meta, units, lat, lon, hasImg) {
  const esc = s => String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const totalH = units.reduce((s,u)=>s+u.thickness,0);
  let acc = 0;
  const rows = units.map(u => {
    const bot = acc, top = acc + u.thickness; acc = top;
    const nm = findL(u.lithoId)[1] + (u.lithoId2 && u.lithoId2!==u.lithoId ? " ⇋ "+findL(u.lithoId2)[1] : "");
    return `<tr><td>${bot.toFixed(2)}–${top.toFixed(2)}</td><td>${esc(nm)}</td><td>${esc(u.environment||"")}</td></tr>`;
  }).reverse().join("");
  const metaRows = [
    ["Proyecto", meta.project], ["Localidad", meta.locality], ["Autor(es)", meta.author],
    ["Fecha", meta.date], ["Datum", meta.datum],
    ["UTM", `${meta.utmZone||""}${meta.utmHemi||""}  E ${meta.utmE||""} / N ${meta.utmN||""}`],
    ["Cota (m s.n.m.)", meta.elevation], ["Azimut sección", meta.azimuth],
    ["Espesor total", totalH.toFixed(2)+" m"], ["Nº unidades", String(units.length)],
  ].filter(([,v]) => v && String(v).trim())
   .map(([k,v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("");
  const desc = `<![CDATA[
<div style="font-family:sans-serif;font-size:12px;max-width:560px">
<h3 style="margin:0 0 6px">${esc(meta.locality || meta.project || "Columna estratigráfica")}</h3>
<table cellpadding="3" style="border-collapse:collapse">${metaRows}</table>
${meta.description ? `<p style="margin:8px 0">${esc(meta.description)}</p>` : ""}
${hasImg ? `<p style="margin:8px 0"><img src="files/column.png" width="300"/></p>` : ""}
<h4 style="margin:8px 0 2px">Unidades (techo → base)</h4>
<table border="1" cellpadding="3" style="border-collapse:collapse;font-size:11px">
<tr><th>Tramo (m)</th><th>Litología</th><th>Ambiente</th></tr>${rows}</table>
</div>]]>`;
  const elev = parseFloat(meta.elevation); const ele = isFinite(elev) ? elev : 0;
  const name = esc(meta.locality || meta.project || "Columna estratigráfica");
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>${name}</name>
<Placemark>
<name>${name}</name>
<description>${desc}</description>
<Point><coordinates>${lon.toFixed(8)},${lat.toFixed(8)},${ele}</coordinates></Point>
</Placemark>
</Document>
</kml>`;
}

// ═══════════════════════════════════════════════════════════════
// PHOTO COMPRESSION
// ═══════════════════════════════════════════════════════════════
function compressPhoto(file, maxDim = 1000, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ═══════════════════════════════════════════════════════════════
// SVG PATTERN DEFS
// ═══════════════════════════════════════════════════════════════
function SvgDefs({ totalH, spx }) {
  const SPX = spx;
  return (
    <defs>
      <clipPath id="colclip">
        <rect x={CX} y={MT} width={CW} height={totalH * SPX} />
      </clipPath>
      <clipPath id="colclip2">
        <rect x={STX} y={MT} width={STW} height={totalH * SPX} />
      </clipPath>
      <clipPath id="sampclip">
        <rect x={SX} y={MT} width={SAW} height={totalH * SPX} />
      </clipPath>
      <clipPath id="ageclip">
        <rect x={AGX} y={MT} width={AGW} height={totalH * SPX} />
      </clipPath>
      <clipPath id="fmclip">
        <rect x={FMX} y={MT} width={FMW} height={totalH * SPX} />
      </clipPath>

      {/* ── Sedimentarias clásticas ── */}
      <pattern id="p-congl" width="24" height="20" patternUnits="userSpaceOnUse">
        <rect width="24" height="20" fill="#D4B483"/>
        <ellipse cx="6" cy="6" rx="4" ry="3.5" fill="none" stroke="#7A4A0F" strokeWidth="1"/>
        <ellipse cx="17" cy="14" rx="5" ry="4" fill="none" stroke="#7A4A0F" strokeWidth="1"/>
        <ellipse cx="4" cy="16" rx="2.5" ry="2" fill="none" stroke="#7A4A0F" strokeWidth=".8"/>
        <circle cx="14" cy="4" r="2" fill="none" stroke="#7A4A0F" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-brecc" width="24" height="20" patternUnits="userSpaceOnUse">
        <rect width="24" height="20" fill="#C8A870"/>
        <polygon points="2,1 9,2 11,7 5,9 1,5" fill="none" stroke="#6A3F0C" strokeWidth=".9"/>
        <polygon points="13,10 20,9 22,16 15,18 11,14" fill="none" stroke="#6A3F0C" strokeWidth=".9"/>
        <polygon points="14,1 19,1 20,5 14,6" fill="none" stroke="#6A3F0C" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-sand" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#F4D580"/>
        <circle cx="3" cy="3" r=".9" fill="#A87820"/>
        <circle cx="0" cy="0" r=".9" fill="#A87820"/>
        <circle cx="6" cy="0" r=".9" fill="#A87820"/>
        <circle cx="0" cy="6" r=".9" fill="#A87820"/>
        <circle cx="6" cy="6" r=".9" fill="#A87820"/>
      </pattern>
      <pattern id="p-xsand" width="16" height="10" patternUnits="userSpaceOnUse">
        <rect width="16" height="10" fill="#E8C050"/>
        <line x1="0" y1="10" x2="16" y2="0" stroke="#8E6210" strokeWidth="1.1"/>
        <line x1="-8" y1="10" x2="8" y2="0" stroke="#8E6210" strokeWidth="1.1"/>
        <line x1="8" y1="10" x2="24" y2="0" stroke="#8E6210" strokeWidth="1.1"/>
      </pattern>
      <pattern id="p-rsand" width="20" height="8" patternUnits="userSpaceOnUse">
        <rect width="20" height="8" fill="#EDCA70"/>
        <path d="M0,4 Q5,2 10,4 Q15,6 20,4" fill="none" stroke="#8E6210" strokeWidth="1"/>
      </pattern>
      <pattern id="p-silt" width="10" height="5" patternUnits="userSpaceOnUse">
        <rect width="10" height="5" fill="#C8B48A"/>
        <line x1="0" y1="2.5" x2="4" y2="2.5" stroke="#6E5630" strokeWidth=".8"/>
        <line x1="6" y1="2.5" x2="10" y2="2.5" stroke="#6E5630" strokeWidth=".8"/>
      </pattern>
      <pattern id="p-shale" width="20" height="3" patternUnits="userSpaceOnUse">
        <rect width="20" height="3" fill="#9BA8A0"/>
        <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#3E5448" strokeWidth="1"/>
      </pattern>

      {/* ── Carbonatos y químicas ── */}
      <pattern id="p-lime" width="18" height="9" patternUnits="userSpaceOnUse">
        <rect width="18" height="9" fill="#B8C8D8"/>
        <rect x=".5" y=".5" width="15" height="7" fill="none" stroke="#356296" strokeWidth=".7"/>
        <rect x="9.5" y="4.5" width="15" height="7" fill="none" stroke="#356296" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-nlime" width="22" height="18" patternUnits="userSpaceOnUse">
        <rect width="22" height="18" fill="#A8B8C8"/>
        <ellipse cx="7" cy="6" rx="5" ry="3.5" fill="none" stroke="#356296" strokeWidth=".8"/>
        <ellipse cx="16" cy="13" rx="5.5" ry="3.5" fill="none" stroke="#356296" strokeWidth=".8"/>
      </pattern>
      <pattern id="p-dolo" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#D8C8B0"/>
        <path d="M7,1 L13,7 L7,13 L1,7 Z" fill="none" stroke="#7A5E36" strokeWidth="1"/>
      </pattern>
      <pattern id="p-chert" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#909090"/>
        <line x1="0" y1="5" x2="10" y2="5" stroke="#4A4A4A" strokeWidth="1"/>
        <line x1="5" y1="0" x2="5" y2="10" stroke="#4A4A4A" strokeWidth="1"/>
      </pattern>
      <pattern id="p-gyps" width="12" height="10" patternUnits="userSpaceOnUse">
        <rect width="12" height="10" fill="#E8E8D5"/>
        <line x1="0" y1="5" x2="12" y2="5" stroke="#A09875" strokeWidth="1"/>
        <line x1="6" y1="0" x2="6" y2="5" stroke="#A09875" strokeWidth=".6"/>
        <line x1="6" y1="5" x2="6" y2="10" stroke="#A09875" strokeWidth=".6"/>
      </pattern>
      <pattern id="p-coal" width="8" height="4" patternUnits="userSpaceOnUse">
        <rect width="8" height="4" fill="#181616"/>
        <line x1="0" y1="2" x2="8" y2="2" stroke="#322E2A" strokeWidth=".6"/>
      </pattern>

      {/* ── Volcánicas — lavas ── */}
      <pattern id="p-bslt" width="22" height="20" patternUnits="userSpaceOnUse">
        <rect width="22" height="20" fill="#3A3838"/>
        <polygon points="11,1 20,5.5 20,14.5 11,19 2,14.5 2,5.5" fill="none" stroke="#787676" strokeWidth=".9"/>
      </pattern>
      <pattern id="p-andes" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#7E8A7C"/>
        <rect x="3" y="3" width="3.2" height="1.5" fill="#D8DCD0" transform="rotate(25 4.6 3.7)"/>
        <rect x="10" y="8" width="3.4" height="1.5" fill="#D8DCD0" transform="rotate(-42 11.7 8.7)"/>
        <rect x="6" y="12" width="2.6" height="1.3" fill="#CED2C6" transform="rotate(12 7.3 12.6)"/>
        <rect x="12" y="2" width="2.4" height="1.3" fill="#CED2C6" transform="rotate(70 13.2 2.6)"/>
      </pattern>
      <pattern id="p-dacit" width="20" height="14" patternUnits="userSpaceOnUse">
        <rect width="20" height="14" fill="#A2A298"/>
        <path d="M0,4 Q5,2.6 10,4 Q15,5.4 20,4" fill="none" stroke="#84847A" strokeWidth=".7"/>
        <path d="M0,10 Q5,8.6 10,10 Q15,11.4 20,10" fill="none" stroke="#84847A" strokeWidth=".7"/>
        <rect x="4" y="6" width="3" height="1.5" fill="#DEDED4" transform="rotate(22 5.5 6.7)"/>
        <rect x="14" y="11" width="2.8" height="1.4" fill="#DEDED4" transform="rotate(-32 15.4 11.6)"/>
      </pattern>
      <pattern id="p-rhyo" width="22" height="12" patternUnits="userSpaceOnUse">
        <rect width="22" height="12" fill="#D6C4BE"/>
        <path d="M0,3 Q5.5,1.2 11,3 Q16.5,4.8 22,3" fill="none" stroke="#B29A92" strokeWidth=".8"/>
        <path d="M0,7 Q5.5,5.2 11,7 Q16.5,8.8 22,7" fill="none" stroke="#B29A92" strokeWidth=".8"/>
        <path d="M0,11 Q5.5,9.2 11,11 Q16.5,12.8 22,11" fill="none" stroke="#B29A92" strokeWidth=".8"/>
      </pattern>
      <pattern id="p-pillow" width="26" height="18" patternUnits="userSpaceOnUse">
        <rect width="26" height="18" fill="#484C48"/>
        <path d="M1,12 C1,5 12,5 12,12" fill="none" stroke="#8C9088" strokeWidth="1"/>
        <path d="M13,18 C13,11 24,11 24,18" fill="none" stroke="#8C9088" strokeWidth="1"/>
        <path d="M14,7 C14,1 25,1 25,7" fill="none" stroke="#8C9088" strokeWidth="1"/>
        <path d="M-1,18 C-1,12 9,12 9,18" fill="none" stroke="#8C9088" strokeWidth="1"/>
      </pattern>
      <pattern id="p-autobr" width="22" height="20" patternUnits="userSpaceOnUse">
        <rect width="22" height="20" fill="#5A564E"/>
        <polygon points="2,2 8,3 9,9 3,11 1,6" fill="#676359" stroke="#363229" strokeWidth=".9"/>
        <polygon points="12,7 19,6 21,13 15,16 11,12" fill="#676359" stroke="#363229" strokeWidth=".9"/>
        <polygon points="13,1 18,1 19,4 14,5" fill="#676359" stroke="#363229" strokeWidth=".7"/>
        <polygon points="3,14 8,13 9,18 4,19" fill="#676359" stroke="#363229" strokeWidth=".7"/>
      </pattern>

      {/* ── Volcánicas — piroclásticas ── */}
      <pattern id="p-ashtuff" width="18" height="16" patternUnits="userSpaceOnUse">
        <rect width="18" height="16" fill="#D2CCBE"/>
        <path d="M3,4 l1.6,2.6 l1.6,-2.6" fill="none" stroke="#968E7C" strokeWidth=".8"/>
        <path d="M11,9 l1.6,2.6 l1.6,-2.6" fill="none" stroke="#968E7C" strokeWidth=".8"/>
        <path d="M7,12.5 l1.3,2.1 l1.3,-2.1" fill="none" stroke="#968E7C" strokeWidth=".7"/>
        <circle cx="14" cy="3" r=".7" fill="#968E7C"/>
        <circle cx="5" cy="11" r=".7" fill="#968E7C"/>
      </pattern>
      <pattern id="p-lapilli" width="22" height="20" patternUnits="userSpaceOnUse">
        <rect width="22" height="20" fill="#C2B6A8"/>
        <circle cx="5" cy="5" r="2.7" fill="#9C8C76" stroke="#766850" strokeWidth=".7"/>
        <polygon points="13,3 17.5,4 17.5,8.5 13,9.5 11,6" fill="#9C8C76" stroke="#766850" strokeWidth=".7"/>
        <circle cx="16" cy="14" r="2.9" fill="#9C8C76" stroke="#766850" strokeWidth=".7"/>
        <polygon points="3,13 7.5,12 8.5,16.5 3.5,18.5" fill="#9C8C76" stroke="#766850" strokeWidth=".7"/>
        <path d="M9,10 l1.1,1.8 l1.1,-1.8" fill="none" stroke="#766850" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-blocktuff" width="32" height="28" patternUnits="userSpaceOnUse">
        <rect width="32" height="28" fill="#BAAE9E"/>
        <polygon points="3,3 13,2 16,11 8,15 1,9" fill="#988870" stroke="#6C5E48" strokeWidth="1"/>
        <ellipse cx="23" cy="9" rx="7" ry="4" fill="#988870" stroke="#6C5E48" strokeWidth="1" transform="rotate(-20 23 9)"/>
        <polygon points="18,17 28,16 30,25 21,27 16,22" fill="#988870" stroke="#6C5E48" strokeWidth="1"/>
        <path d="M5,21 l1.3,2.1 l1.3,-2.1" fill="none" stroke="#6C5E48" strokeWidth=".8"/>
      </pattern>
      <pattern id="p-ignim" width="24" height="16" patternUnits="userSpaceOnUse">
        <rect width="24" height="16" fill="#C6B2A8"/>
        <ellipse cx="6" cy="4" rx="5" ry="1.4" fill="#785850"/>
        <ellipse cx="17" cy="8" rx="6" ry="1.6" fill="#785850"/>
        <ellipse cx="5" cy="12" rx="4.6" ry="1.3" fill="#785850"/>
        <ellipse cx="20" cy="14" rx="4" ry="1.2" fill="#785850"/>
      </pattern>
      <pattern id="p-agglom" width="30" height="26" patternUnits="userSpaceOnUse">
        <rect width="30" height="26" fill="#A89684"/>
        <circle cx="8" cy="8" r="6.5" fill="#897560" stroke="#665542" strokeWidth="1.1"/>
        <ellipse cx="22" cy="17" rx="7" ry="6" fill="#897560" stroke="#665542" strokeWidth="1.1"/>
        <circle cx="26" cy="4" r="4" fill="#897560" stroke="#665542" strokeWidth=".9"/>
        <ellipse cx="4" cy="22" rx="5" ry="4" fill="#897560" stroke="#665542" strokeWidth=".9"/>
      </pattern>
      <pattern id="p-vbrecc" width="24" height="22" patternUnits="userSpaceOnUse">
        <rect width="24" height="22" fill="#9C8C7C"/>
        <polygon points="2,2 9,1 11,8 4,11 1,6" fill="#7E6E5C" stroke="#584A3A" strokeWidth=".9"/>
        <polygon points="14,5 21,4 22,12 16,15 12,10" fill="#7E6E5C" stroke="#584A3A" strokeWidth=".9"/>
        <polygon points="5,14 12,13 13,20 6,21" fill="#7E6E5C" stroke="#584A3A" strokeWidth=".9"/>
        <polygon points="16,17 22,16 23,21 17,22" fill="#7E6E5C" stroke="#584A3A" strokeWidth=".7"/>
      </pattern>

      {/* ── Volcaniclásticas / epiclásticas ── */}
      <pattern id="p-tuffite" width="20" height="14" patternUnits="userSpaceOnUse">
        <rect width="20" height="14" fill="#BCB29C"/>
        <line x1="0" y1="7" x2="20" y2="7" stroke="#8C8064" strokeWidth=".6"/>
        <line x1="0" y1="13.5" x2="20" y2="13.5" stroke="#8C8064" strokeWidth=".5" strokeDasharray="3,2"/>
        <path d="M3,2 l1.2,2 l1.2,-2" fill="none" stroke="#8C8064" strokeWidth=".7"/>
        <circle cx="12" cy="3" r=".9" fill="#8C8064"/>
        <path d="M14,9 l1.2,2 l1.2,-2" fill="none" stroke="#8C8064" strokeWidth=".7"/>
        <circle cx="6" cy="10" r=".9" fill="#8C8064"/>
      </pattern>
      <pattern id="p-lapillite" width="22" height="18" patternUnits="userSpaceOnUse">
        <rect width="22" height="18" fill="#B4A48C"/>
        <circle cx="5" cy="5" r="2.8" fill="#8C7C64" stroke="#5E5040" strokeWidth=".8"/>
        <circle cx="14" cy="4" r="2.4" fill="#8C7C64" stroke="#5E5040" strokeWidth=".7"/>
        <circle cx="9" cy="11" r="2.6" fill="#8C7C64" stroke="#5E5040" strokeWidth=".8"/>
        <circle cx="18" cy="12" r="2.5" fill="#8C7C64" stroke="#5E5040" strokeWidth=".7"/>
        <circle cx="4" cy="15" r="2.2" fill="#8C7C64" stroke="#5E5040" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-epiclas" width="22" height="16" patternUnits="userSpaceOnUse">
        <rect width="22" height="16" fill="#B0A488"/>
        <line x1="0" y1="8" x2="22" y2="8" stroke="#847858" strokeWidth=".5" strokeDasharray="4,2"/>
        <ellipse cx="5" cy="4" rx="3.2" ry="2.4" fill="#908452" stroke="#6C6042" strokeWidth=".7"/>
        <ellipse cx="15" cy="5" rx="3.6" ry="2.6" fill="#908452" stroke="#6C6042" strokeWidth=".7"/>
        <ellipse cx="9" cy="12" rx="3.4" ry="2.5" fill="#908452" stroke="#6C6042" strokeWidth=".7"/>
        <ellipse cx="18" cy="12" rx="2.8" ry="2.2" fill="#908452" stroke="#6C6042" strokeWidth=".7"/>
      </pattern>
      <pattern id="p-epibrecc" width="22" height="18" patternUnits="userSpaceOnUse">
        <rect width="22" height="18" fill="#A89880"/>
        <line x1="0" y1="9" x2="22" y2="9" stroke="#7C7054" strokeWidth=".5" strokeDasharray="4,3"/>
        <polygon points="2,2 8,1 9,6 3,8" fill="#8A7C5E" stroke="#64583E" strokeWidth=".8"/>
        <polygon points="13,2 19,3 19,7 13,8 11,5" fill="#8A7C5E" stroke="#64583E" strokeWidth=".8"/>
        <polygon points="4,11 10,10 11,15 5,17" fill="#8A7C5E" stroke="#64583E" strokeWidth=".8"/>
        <polygon points="14,11 20,11 21,16 15,17" fill="#8A7C5E" stroke="#64583E" strokeWidth=".7"/>
      </pattern>

      {/* ── Intrusivas plutónicas ── */}
      <pattern id="p-gran" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#D5C8C0"/>
        <ellipse cx="3" cy="4" rx="1.5" ry="1" fill="#7A7A7A" transform="rotate(30 3 4)"/>
        <ellipse cx="9" cy="8" rx="2" ry="1.2" fill="#332D2D" transform="rotate(60 9 8)"/>
        <ellipse cx="5" cy="11" rx="1.2" ry=".8" fill="#B0A090" transform="rotate(-20 5 11)"/>
        <ellipse cx="11" cy="3" rx="1.3" ry=".7" fill="#8E8E8E" transform="rotate(45 11 3)"/>
      </pattern>
      <pattern id="p-grdior" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#CFCEC8"/>
        <ellipse cx="3" cy="4" rx="1.5" ry="1" fill="#9A9A96" transform="rotate(30 3 4)"/>
        <ellipse cx="9" cy="8" rx="2" ry="1.2" fill="#3A3636" transform="rotate(60 9 8)"/>
        <ellipse cx="5" cy="11" rx="1.3" ry=".8" fill="#7A7672" transform="rotate(-20 5 11)"/>
        <ellipse cx="11" cy="3" rx="1.3" ry=".7" fill="#4A4646" transform="rotate(45 11 3)"/>
        <ellipse cx="12" cy="11" rx="1.1" ry=".7" fill="#8E8E8A" transform="rotate(10 12 11)"/>
      </pattern>
      <pattern id="p-tonal" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#BEC0BC"/>
        <ellipse cx="3" cy="4" rx="1.6" ry="1" fill="#3E3A3A" transform="rotate(35 3 4)"/>
        <ellipse cx="9" cy="7" rx="1.8" ry="1.1" fill="#5A5656" transform="rotate(-50 9 7)"/>
        <ellipse cx="5" cy="11" rx="1.4" ry=".9" fill="#2E2A2A" transform="rotate(20 5 11)"/>
        <ellipse cx="11" cy="11" rx="1.3" ry=".8" fill="#6E6A6A" transform="rotate(-15 11 11)"/>
        <ellipse cx="12" cy="3" rx="1.1" ry=".7" fill="#888884" transform="rotate(40 12 3)"/>
      </pattern>
      <pattern id="p-dior" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#B6B8B4"/>
        <circle cx="2" cy="3" r="1.3" fill="#262222"/>
        <circle cx="7" cy="2" r="1" fill="#E8E8E2"/>
        <circle cx="10" cy="5" r="1.4" fill="#2A2626"/>
        <circle cx="4" cy="7" r="1.1" fill="#EDEDE6"/>
        <circle cx="8" cy="9" r="1.3" fill="#302C2C"/>
        <circle cx="2" cy="10" r="1" fill="#E4E4DE"/>
        <circle cx="11" cy="10" r="1" fill="#3A3636"/>
      </pattern>
      <pattern id="p-gabbro" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#494D4A"/>
        <rect x="2" y="3" width="4" height="1.6" fill="#C8CCC4" transform="rotate(25 4 3.8)"/>
        <rect x="9" y="6" width="4.5" height="1.6" fill="#BCC0B8" transform="rotate(-40 11 6.8)"/>
        <rect x="4" y="11" width="3.6" height="1.4" fill="#C0C4BC" transform="rotate(15 5.8 11.7)"/>
        <rect x="11" y="12" width="3" height="1.3" fill="#AEB2AA" transform="rotate(60 12.5 12.6)"/>
        <circle cx="13" cy="3" r="1.4" fill="#2A2E2C"/>
        <circle cx="7" cy="8" r="1.2" fill="#222624"/>
      </pattern>

      {/* ── Intrusivas hipabisales / subvolcánicas ── */}
      <pattern id="p-porph" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="#C6BCB0"/>
        <circle cx="3" cy="6" r=".6" fill="#9A8E7E"/>
        <circle cx="14" cy="3" r=".6" fill="#9A8E7E"/>
        <circle cx="8" cy="16" r=".6" fill="#9A8E7E"/>
        <circle cx="17" cy="12" r=".6" fill="#9A8E7E"/>
        <rect x="5" y="8" width="5" height="2.4" fill="#EFE9DC" stroke="#8C7E68" strokeWidth=".5" transform="rotate(20 7.5 9.2)"/>
        <rect x="12" y="13" width="4.4" height="2.2" fill="#EFE9DC" stroke="#8C7E68" strokeWidth=".5" transform="rotate(-35 14 14)"/>
        <rect x="13" y="5" width="3.6" height="2" fill="#E6DECF" stroke="#8C7E68" strokeWidth=".5" transform="rotate(50 15 6)"/>
      </pattern>
      <pattern id="p-svdike" width="16" height="14" patternUnits="userSpaceOnUse">
        <rect width="16" height="14" fill="#8E948A"/>
        <rect x="3" y="3" width="3.2" height="1.4" fill="#D2D6CC" transform="rotate(30 4.6 3.7)"/>
        <rect x="10" y="7" width="3" height="1.3" fill="#C8CCC2" transform="rotate(-40 11.5 7.6)"/>
        <rect x="6" y="10" width="2.6" height="1.2" fill="#CED2C8" transform="rotate(15 7.3 10.6)"/>
        <circle cx="12" cy="3" r=".8" fill="#5E645C"/>
        <circle cx="3" cy="11" r=".8" fill="#5E645C"/>
        <circle cx="14" cy="12" r=".7" fill="#5E645C"/>
      </pattern>

      {/* ── Metamórficas (por textura) ── */}
      <pattern id="p-slate" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#5A5E64"/>
        <line x1="-2" y1="6" x2="6" y2="-2" stroke="#363A40" strokeWidth=".7"/>
        <line x1="0" y1="8" x2="8" y2="0" stroke="#363A40" strokeWidth=".7"/>
        <line x1="2" y1="10" x2="10" y2="2" stroke="#363A40" strokeWidth=".7"/>
        <line x1="4" y1="8" x2="8" y2="4" stroke="#474B52" strokeWidth=".5"/>
      </pattern>
      <pattern id="p-phyll" width="20" height="6" patternUnits="userSpaceOnUse">
        <rect width="20" height="6" fill="#7E8880"/>
        <path d="M0,3 Q5,1.6 10,3 Q15,4.4 20,3" fill="none" stroke="#566058" strokeWidth=".7"/>
        <path d="M0,5.5 Q5,4.2 10,5.5 Q15,6.8 20,5.5" fill="none" stroke="#9AA49C" strokeWidth=".5"/>
      </pattern>
      <pattern id="p-schist" width="22" height="12" patternUnits="userSpaceOnUse">
        <rect width="22" height="12" fill="#8A8E84"/>
        <path d="M0,3 Q5.5,1 11,3 Q16.5,5 22,3" fill="none" stroke="#565A50" strokeWidth=".8"/>
        <path d="M0,9 Q5.5,7 11,9 Q16.5,11 22,9" fill="none" stroke="#565A50" strokeWidth=".8"/>
        <ellipse cx="7" cy="6" rx="2.6" ry="1.1" fill="#C8CCC0" stroke="#5E6258" strokeWidth=".5" transform="rotate(-8 7 6)"/>
        <ellipse cx="16" cy="6.5" rx="2.2" ry="1" fill="#C8CCC0" stroke="#5E6258" strokeWidth=".5" transform="rotate(6 16 6.5)"/>
      </pattern>
      <pattern id="p-gneiss" width="24" height="16" patternUnits="userSpaceOnUse">
        <rect width="24" height="16" fill="#C4BEB2"/>
        <path d="M0,4 Q6,2 12,4 Q18,6 24,4 L24,8 Q18,10 12,8 Q6,6 0,8 Z" fill="#8A8076"/>
        <path d="M0,12 Q6,10.5 12,12 Q18,13.5 24,12" fill="none" stroke="#6E6458" strokeWidth="1"/>
        <ellipse cx="8" cy="13.5" rx="2.4" ry="1.2" fill="#E2DCCE" stroke="#8A8076" strokeWidth=".5"/>
      </pattern>
      <pattern id="p-amphib" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="#34403A"/>
        <line x1="2" y1="2" x2="6" y2="5" stroke="#1E2620" strokeWidth="1.2"/>
        <line x1="10" y1="3" x2="13" y2="8" stroke="#1E2620" strokeWidth="1.2"/>
        <line x1="4" y1="10" x2="8" y2="14" stroke="#1E2620" strokeWidth="1.2"/>
        <line x1="11" y1="11" x2="14" y2="15" stroke="#1E2620" strokeWidth="1.2"/>
        <rect x="6" y="7" width="2.4" height="1" fill="#A8B0A0" transform="rotate(30 7.2 7.5)"/>
        <rect x="12" y="5" width="2" height=".9" fill="#A8B0A0" transform="rotate(-20 13 5.4)"/>
      </pattern>
    </defs>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT FORM
// ═══════════════════════════════════════════════════════════════
const DF = {
  thickness: "", lithoId: "sandstone", lithoId2: "", lithoRatio: 0.5,
  color: "", grainSize: "ms",
  structures: "", structSymbols: [], fossilsDating: "", contactBottom: "sharp",
  environment: "", paleocurrent: "", weathering: "fresco", notes: "",
  age: "", formation: "",
  photo: null, photoCaption: "",
};
const DEFAULT_META = {
  project: "", locality: "", author: "", date: "",
  datum: "WGS84", utmZone: "19", utmHemi: "S",
  utmE: "", utmN: "", elevation: "", azimuth: "", description: "",
};
let nextId = 1;

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
function ColumnaEstratigrafica() {
  const [units,      setUnits]      = useState([]);
  const [editId,     setEditId]     = useState(null);
  const [f,          setF]          = useState(DF);
  const [photoModal, setPhotoModal] = useState(null);
  const [showHelp,   setShowHelp]   = useState(false);
  const [toast,      setToast]      = useState("");
  const [panelTab,   setPanelTab]   = useState("units");
  const [meta,       setMeta]       = useState(DEFAULT_META);
  const [samples,    setSamples]    = useState([]);
  const [scaleMode,  setScaleMode]  = useState("auto");

  const csvInputRef   = useRef(null);
  const photoInputRef = useRef(null);
  const jsonInputRef  = useRef(null);

  const ff = (k, v) => setF(p => ({ ...p, [k]: v }));
  const toggleStruct = id => setF(p => {
    const cur = p.structSymbols || [];
    return { ...p, structSymbols: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] };
  });
  const addSample = s => setSamples(p => [...p, { ...s, id: `s${nextId++}` }]);
  const delSample = id => setSamples(p => p.filter(x => x.id !== id));

  const totalH = units.reduce((s, u) => s + u.thickness, 0);
  // Escala vertical dinámica (px/m)
  const SPX = totalH <= 0 ? 50
    : scaleMode === "auto"
      ? Math.max(SPX_MIN, Math.min(SPX_MAX, FIT_TARGET / totalH))
      : (Number(scaleMode) || 50);
  const cumH = useMemo(() => {
    let a = 0;
    return units.map(u => { const c = a; a += u.thickness; return c; });
  }, [units]);
  const yOf = d => MT + (totalH - d) * SPX;

  const usedLith = LITH.filter(l => units.some(u => u.lithoId === l[0] || u.lithoId2 === l[0]));
  const legRows  = Math.ceil(Math.max(usedLith.length, 1) / 2);
  const usedStruct = STRUCTS.filter(s => units.some(u => (u.structSymbols || []).includes(s[0])));
  const structRows = Math.ceil(usedStruct.length / 2);
  const usedSampleTypes = SAMPLE_TYPES.filter(t => samples.some(s => s.type === t[0]));
  const sampRows = Math.ceil(usedSampleTypes.length / 2);
  // posiciones verticales (dentro del grupo de leyenda) — cursor secuencial
  let legCur = 82 + Math.max(1, legRows) * 17;        // fin del bloque litologías
  const structsTopY = legCur + 14;
  if (usedStruct.length) legCur = structsTopY + 18 + structRows * 17;
  const sampTopY = legCur + 14;
  if (usedSampleTypes.length) legCur = sampTopY + 18 + sampRows * 17;
  const legH = 24 + legCur + 16;
  const svgH     = MT + totalH * SPX + legH;
  const svgW     = SW;
  const metaUtm  = (meta.utmE && meta.utmN)
    ? `UTM ${meta.utmZone || ""}${meta.utmHemi || ""} ${meta.utmE}E / ${meta.utmN}N` : "";

  const tickInt = totalH <= 3 ? 0.5 : totalH <= 15 ? 1 : totalH <= 50 ? 5 : 10;
  const ticks = [];
  for (let d = 0; d <= totalH + 0.001; d += tickInt) ticks.push(parseFloat(d.toFixed(3)));

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 2400); };

  // ── Handlers ─────────────────────────────────────────────────
  const doAdd = () => {
    const t = parseFloat(f.thickness);
    if (!t || t <= 0) return;
    setUnits(p => [...p, { ...f, id: `u${nextId++}`, thickness: t }]);
    setF(p => ({ ...DF, lithoId: p.lithoId, grainSize: p.grainSize,
                 lithoId2: p.lithoId2, lithoRatio: p.lithoRatio,
                 contactBottom: p.contactBottom, environment: p.environment }));
  };
  const doSave = () => {
    const t = parseFloat(f.thickness);
    if (!t || t <= 0) return;
    setUnits(p => p.map(u => u.id === editId ? { ...f, id: editId, thickness: t } : u));
    setEditId(null); setF(DF);
  };
  const doEdit   = u => { setEditId(u.id); setF({ ...u, thickness: String(u.thickness) }); };
  const doCancel = () => { setEditId(null); setF(DF); };
  const doDel    = id => {
    setUnits(p => p.filter(u => u.id !== id));
    if (editId === id) { setEditId(null); setF(DF); }
  };
  const doMove = (id, dir) => setUnits(p => {
    const i = p.findIndex(u => u.id === id), a = [...p], j = i + dir;
    if (j < 0 || j >= a.length) return p;
    [a[i], a[j]] = [a[j], a[i]];
    return a;
  });
  const doClear = () => {
    if (units.length === 0) return;
    if (confirm("¿Borrar toda la columna? Esta acción no se puede deshacer.")) {
      setUnits([]); setEditId(null); setF(DF); setSamples([]); showToast("Columna borrada");
    }
  };

  // CSV handlers
  const onCsvChosen = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    const fileMeta = parseCsvMeta(text);
    if (rows.length === 0) { showToast("⚠ CSV vacío o inválido"); return; }
    const validLitho = new Set(LITH.map(l => l[0]));
    const validGrain = new Set(GRAIN.map(g => g[0]));
    const validCont  = new Set(CONTACTS.map(c => c[0]));
    const validWeath = new Set(WEATH);
    const validStruct = new Set(STRUCTS.map(s => s[0]));
    const parsed = rows.map(r => {
      const t = parseFloat(r.thickness);
      if (!t || t <= 0) return null;
      let lid = (r.lithology || "").trim();
      if (LITHO_ALIAS[lid]) lid = LITHO_ALIAS[lid];
      const lithoId = validLitho.has(lid) ? lid : "sandstone";
      let lid2 = (r.lithology2 || "").trim();
      if (LITHO_ALIAS[lid2]) lid2 = LITHO_ALIAS[lid2];
      const lithoId2 = (lid2 && validLitho.has(lid2) && lid2 !== lithoId) ? lid2 : "";
      const ratioRaw = parseFloat(r.lithoRatio);
      const lithoRatio = (isFinite(ratioRaw) && ratioRaw >= 0.1 && ratioRaw <= 0.9) ? ratioRaw : 0.5;
      return {
        id: `u${nextId++}`,
        thickness: t,
        lithoId,
        lithoId2,
        lithoRatio,
        color:         r.color || "",
        grainSize:     validGrain.has(r.grainSize)      ? r.grainSize      : findL(lithoId)[3],
        structures:    r.structures || "",
        structSymbols: (r.structSymbols || "").split(";").map(s => s.trim()).filter(s => validStruct.has(s)),
        fossilsDating: r.fossilsDating || "",
        contactBottom: validCont.has(r.contactBottom)   ? r.contactBottom  : "sharp",
        environment:   r.environment || "",
        paleocurrent:  r.paleocurrent || "",
        weathering:    validWeath.has(r.weathering)     ? r.weathering     : "fresco",
        notes:         r.notes || "",
        age:           r.age || "",
        formation:     r.formation || "",
        photo: null, photoCaption: "",
      };
    }).filter(Boolean);
    if (parsed.length === 0) { showToast("⚠ No se encontraron filas válidas"); return; }
    setUnits(parsed); setEditId(null); setF(DF);
    if (Object.keys(fileMeta).length) setMeta(m => ({ ...DEFAULT_META, ...fileMeta }));
    setSamples(parseCsvSamples(text).map(s => ({ ...s, id: `s${nextId++}` })));
    showToast(`✓ ${parsed.length} unidades cargadas desde CSV`);
    e.target.value = "";
  };
  const downloadTemplate = () => {
    downloadFile("columna_template.csv", CSV_TEMPLATE);
    showToast("✓ Template CSV descargado");
  };
  const exportCsv = () => {
    if (units.length === 0) { showToast("⚠ No hay datos para exportar"); return; }
    downloadFile("columna_estratigrafica.csv", generateCsv(units, meta, samples));
    showToast("✓ CSV exportado");
  };
  const exportSvg = () => {
    const svgNode = document.getElementById("colsvg");
    if (!svgNode) return;
    const xml = new XMLSerializer().serializeToString(svgNode);
    downloadFile("columna.svg", '<?xml version="1.0" encoding="UTF-8"?>\n' + xml, "image/svg+xml");
    showToast("✓ SVG exportado");
  };
  const exportKmz = async () => {
    if (units.length === 0) { showToast("⚠ No hay datos para exportar"); return; }
    const E = parseFloat(meta.utmE), N = parseFloat(meta.utmN);
    if (!isFinite(E) || !isFinite(N)) {
      showToast("⚠ Cargá las coordenadas UTM en la pestaña Ubicación");
      setPanelTab("meta"); return;
    }
    const zone = parseInt(meta.utmZone, 10) || 19;
    const isSouth = (meta.utmHemi || "S").toUpperCase() !== "N";
    const { lat, lon } = utmToLatLon(E, N, zone, isSouth);
    let pngBytes = null;
    try {
      const svgNode = document.getElementById("colsvg");
      if (svgNode) pngBytes = dataUrlToBytes(await svgToPngDataUrl(svgNode, 2));
    } catch { /* la imagen es opcional */ }
    const kml = buildKml(meta, units, lat, lon, !!pngBytes);
    const entries = [{ name: "doc.kml", data: new TextEncoder().encode(kml) }];
    if (pngBytes) entries.push({ name: "files/column.png", data: pngBytes });
    const fname = ((meta.locality || meta.project || "columna").trim() || "columna")
      .replace(/[^\w\-]+/g, "_").slice(0, 60) + ".kmz";
    downloadBlob(fname, makeKmz(entries));
    showToast(`✓ KMZ exportado (lat ${lat.toFixed(5)}, lon ${lon.toFixed(5)})`);
  };

  // ── Proyecto (.col.json) — guardado sin pérdida, incluye fotos ──
  const baseName = ((meta.locality || meta.project || "proyecto").trim() || "proyecto")
    .replace(/[^\w\-]+/g, "_").slice(0, 60);
  const exportJson = () => {
    if (units.length === 0) { showToast("⚠ No hay nada que guardar"); return; }
    const data = { app: "columna-estratigrafica", version: 3,
      savedAt: new Date().toISOString(), meta, units, samples };
    downloadFile(baseName + ".col.json", JSON.stringify(data, null, 2), "application/json");
    showToast("✓ Proyecto guardado (.col.json)");
  };
  const onJsonChosen = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const arr = Array.isArray(data.units) ? data.units : (Array.isArray(data) ? data : null);
      if (!arr) throw new Error("formato");
      const parsed = arr.map(u => ({
        ...DF, ...u, id: `u${nextId++}`,
        thickness: parseFloat(u.thickness) || 0,
        structSymbols: Array.isArray(u.structSymbols) ? u.structSymbols : [],
      })).filter(u => u.thickness > 0);
      if (!parsed.length) { showToast("⚠ El archivo no tiene unidades válidas"); return; }
      setUnits(parsed); setEditId(null); setF(DF);
      if (data.meta && typeof data.meta === "object") setMeta(m => ({ ...DEFAULT_META, ...data.meta }));
      const validST = new Set(SAMPLE_TYPES.map(t => t[0]));
      setSamples(Array.isArray(data.samples)
        ? data.samples.map(s => ({
            id: `s${nextId++}`, height: parseFloat(s.height) || 0,
            code: String(s.code || ""), type: validST.has(s.type) ? s.type : "otra" }))
          .filter(s => s.code)
        : []);
      showToast(`✓ Proyecto abierto · ${parsed.length} unidades`);
    } catch { showToast("⚠ Archivo de proyecto inválido"); }
    e.target.value = "";
  };
  const printColumn = () => {
    if (units.length === 0) { showToast("⚠ No hay columna para imprimir"); return; }
    window.print();
  };

  // Photo handlers
  const onPhotoChosen = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      const dataUrl = await compressPhoto(file, 1000, 0.8);
      ff("photo", dataUrl);
      showToast("✓ Foto agregada");
    } catch { showToast("⚠ Error al procesar foto"); }
    e.target.value = "";
  };

  // ── Styles ─────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", fontFamily: MONO, fontSize: 11.5,
    padding: "6px 8px", border: `1px solid ${T.inputBd}`,
    background: T.inputBg, color: T.text, borderRadius: 3, outline: "none",
  };
  const lblStyle = { fontSize: 10.5, color: T.text2, fontFamily: SANS,
    display: "flex", flexDirection: "column", gap: 4, fontWeight: 500 };
  const secStyle = {
    fontSize: 10, color: T.borderDk, fontFamily: SERIF, fontStyle: "italic",
    letterSpacing: ".08em", marginTop: 12, paddingTop: 9,
    borderTop: `1px solid ${T.border}`, textTransform: "uppercase",
  };
  const btnBase = {
    fontFamily: MONO, fontSize: 11, padding: "7px 11px",
    border: `1px solid ${T.borderDk}`, borderRadius: 3, cursor: "pointer",
    background: T.card, color: T.text, fontWeight: 500,
    letterSpacing: ".03em", transition: "all .12s",
  };
  const btnPrimary = {
    ...btnBase, background: T.green, color: T.hdrFg,
    border: `1px solid ${T.green}`, fontWeight: 600,
    boxShadow: "0 2px 0 rgba(45,95,78,.3)",
  };
  const btnSmall = { ...btnBase, fontSize: 10, padding: "2px 7px" };

  return (
    <div style={{
      display: "flex", flexDirection: "column", minHeight: "100vh",
      background: `
        repeating-linear-gradient(0deg, transparent 0, transparent 27px,
          rgba(139,107,71,.06) 27px, rgba(139,107,71,.06) 28px),
        radial-gradient(ellipse at top left, #EFE0C2 0%, ${T.pageBg} 60%, #D8C9A8 100%)`,
      fontFamily: SANS, color: T.text,
    }}>
      <input ref={csvInputRef}   type="file" accept=".csv,text/csv"
             onChange={onCsvChosen}   style={{ display: "none" }} />
      <input ref={photoInputRef} type="file" accept="image/*"
             onChange={onPhotoChosen} style={{ display: "none" }} />
      <input ref={jsonInputRef}  type="file" accept=".json,application/json"
             onChange={onJsonChosen}  style={{ display: "none" }} />

      {/* ═══ TOP BAR ═══ */}
      <div style={{
        background: T.hdrBg, color: T.hdrFg,
        padding: "12px 22px", display: "flex", alignItems: "center", gap: 16,
        borderBottom: `3px double ${T.gold}`, flexShrink: 0, flexWrap: "wrap",
      }}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontStyle: "italic",
                      letterSpacing: ".02em" }}>
          Columna&nbsp;Estratigráfica
        </div>
        <div style={{ fontSize: 11, fontFamily: MONO, color: T.gold,
                      letterSpacing: ".15em", borderLeft: `1px solid ${T.gold}`,
                      paddingLeft: 16, marginLeft: 6 }}>
          EDITOR DE CAMPO · v3.5
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[["💾 GUARDAR", exportJson, "Guardar proyecto completo (incluye fotos y metadata) en .col.json"],
            ["📂 ABRIR", () => jsonInputRef.current?.click(), "Abrir un proyecto .col.json"],
            ["⬇ TEMPLATE CSV", downloadTemplate, "Descargar template CSV con ejemplos"],
            ["⬆ CARGAR CSV", () => csvInputRef.current?.click(), "Cargar columna desde CSV"],
            ["EXPORTAR CSV", exportCsv, "Exportar columna actual a CSV"],
            ["EXPORTAR SVG", exportSvg, "Descargar columna como SVG"],
            ["🖨 PDF", printColumn, "Imprimir / exportar a PDF (solo la columna)"],
            ["⊕ GOOGLE EARTH", exportKmz, "Exportar a Google Earth (KMZ) usando las coordenadas UTM"]].map(([label, fn, tip]) => (
            <button key={label} onClick={fn} title={tip} style={{
              ...btnBase, background: "transparent", color: T.hdrFg,
              border: `1px solid ${T.gold}`, fontSize: 10.5,
            }}>{label}</button>
          ))}
          <button onClick={() => setShowHelp(true)} style={{
            ...btnBase, background: T.gold, color: T.hdrBg,
            border: `1px solid ${T.gold}`, fontSize: 10.5, fontWeight: 700,
          }} title="Guía de valores válidos para el CSV">?</button>
        </div>
      </div>

      {/* ═══ MAIN AREA ═══ */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

        {/* ═══ FORM PANEL ═══ */}
        <div style={{
          width: 296, flexShrink: 0, background: T.panel,
          borderRight: `1px solid ${T.border}`,
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}>
          {/* TAB BAR */}
          <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`,
                        background: T.panel, flexShrink: 0 }}>
            {[["units", "✚ Unidades"], ["meta", "⌖ Ubicación"], ["samples", "🧪 Muestras"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setPanelTab(id)} style={{
                flex: 1, fontFamily: MONO, fontSize: 10.5, padding: "9px 4px",
                cursor: "pointer", border: "none",
                borderBottom: `2px solid ${panelTab === id ? T.green : "transparent"}`,
                background: panelTab === id ? T.panelAlt : "transparent",
                color: panelTab === id ? T.text : T.text3,
                fontWeight: panelTab === id ? 700 : 500, letterSpacing: ".02em",
              }}>{lbl}</button>
            ))}
          </div>

          {panelTab === "meta" && (
            <MetaForm meta={meta} setMeta={setMeta} inputStyle={inputStyle}
              lblStyle={lblStyle} secStyle={secStyle} />
          )}

          {panelTab === "samples" && (
            <SamplesForm samples={samples} addSample={addSample} delSample={delSample}
              totalH={totalH} inputStyle={inputStyle} lblStyle={lblStyle}
              secStyle={secStyle} btnPrimary={btnPrimary} btnSmall={btnSmall} />
          )}

          {panelTab === "units" && (<>
          <div style={{
            padding: "10px 16px", background: T.panelAlt,
            borderBottom: `1px solid ${T.border}`,
            fontFamily: SERIF, fontSize: 13, fontStyle: "italic",
            color: T.text, display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ color: editId ? T.rust : T.green, fontSize: 16 }}>
              {editId ? "✎" : "✚"}
            </span>
            {editId ? "Editando unidad" : "Nueva unidad"}
          </div>

          <div style={{ padding: "12px 16px", display: "flex",
                        flexDirection: "column", gap: 9, flex: 1 }}>

            <div style={{ ...secStyle, marginTop: 0, paddingTop: 0,
                          borderTop: "none" }}>· Litología ·</div>

            <label style={lblStyle}>Espesor (m)
              <input type="number" min="0.01" step="0.1" placeholder="0.0"
                value={f.thickness} onChange={e => ff("thickness", e.target.value)}
                style={inputStyle} />
            </label>

            <label style={lblStyle}>Litología
              <select value={f.lithoId} style={inputStyle}
                onChange={e => {
                  const li = findL(e.target.value);
                  ff("lithoId", e.target.value); ff("grainSize", li[3]);
                }}>
                {LITH_GROUPS.map(grp => (
                  <optgroup key={grp} label={grp}>
                    {LITH.filter(l => l[4] === grp).map(l => (
                      <option key={l[0]} value={l[0]}>{l[1]}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>

            <label style={lblStyle}>Color (Munsell / descriptivo)
              <input type="text" placeholder="5Y 6/2 · gris oliva pálido"
                value={f.color} onChange={e => ff("color", e.target.value)}
                style={inputStyle} />
            </label>
            <details style={{ marginTop: -4 }}>
              <summary style={{ fontSize: 10, color: T.indigo, cursor: "pointer",
                fontFamily: SANS, userSelect: "none" }}>🎨 Paleta Munsell</summary>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
                gap: 3, marginTop: 5 }}>
                {MUNSELL.map(m => (
                  <button key={m[0]} type="button" title={`${m[0]} · ${m[1]}`}
                    onClick={() => ff("color", `${m[0]} · ${m[1]}`)}
                    style={{ aspectRatio: "1", background: m[2], cursor: "pointer",
                      border: `1px solid ${T.borderDk}`, borderRadius: 2 }} />
                ))}
              </div>
            </details>

            <label style={lblStyle}>Granulometría
              <select value={f.grainSize} style={inputStyle}
                onChange={e => ff("grainSize", e.target.value)}>
                {GRAIN.map(g => <option key={g[0]} value={g[0]}>{g[1]}</option>)}
              </select>
            </label>

            <div style={{
              marginTop: 4, padding: "8px 10px",
              background: f.lithoId2 ? "#F5E8CC" : T.panelAlt,
              border: `1px solid ${f.lithoId2 ? T.gold : T.border}`,
              borderRadius: 3, transition: "all .15s",
            }}>
              <label style={{ ...lblStyle, flexDirection: "row",
                alignItems: "center", gap: 7, cursor: "pointer", fontWeight: 600 }}>
                <input type="checkbox" checked={!!f.lithoId2}
                  onChange={e => {
                    if (e.target.checked) {
                      const def = f.lithoId === "shale" ? "sandstone" : "shale";
                      ff("lithoId2", def);
                      if (!f.lithoRatio) ff("lithoRatio", 0.5);
                    } else ff("lithoId2", "");
                  }}
                  style={{ cursor: "pointer" }} />
                <span style={{ color: f.lithoId2 ? T.borderDk : T.text2 }}>
                  Paquete de intercalación
                </span>
              </label>
              {f.lithoId2 && (
                <div style={{ marginTop: 8, display: "flex",
                  flexDirection: "column", gap: 7 }}>
                  <label style={lblStyle}>Litología secundaria
                    <select value={f.lithoId2} style={inputStyle}
                      onChange={e => ff("lithoId2", e.target.value)}>
                      {LITH_GROUPS.map(grp => (
                        <optgroup key={grp} label={grp}>
                          {LITH.filter(l => l[4] === grp && l[0] !== f.lithoId).map(l => (
                            <option key={l[0]} value={l[0]}>{l[1]}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                  <label style={lblStyle}>
                    Proporción {Math.round(f.lithoRatio * 100)}% / {Math.round((1 - f.lithoRatio) * 100)}%
                    <input type="range" min="0.1" max="0.9" step="0.05"
                      value={f.lithoRatio}
                      onChange={e => ff("lithoRatio", parseFloat(e.target.value))}
                      style={{ width: "100%", accentColor: T.green }} />
                  </label>
                  <div style={{ fontSize: 9.5, color: T.text3, fontStyle: "italic",
                    fontFamily: SERIF, marginTop: -2 }}>
                    Se visualiza como bandas alternadas en la columna.
                  </div>
                </div>
              )}
            </div>

            <div style={secStyle}>· Crono / Litoestratigrafía ·</div>

            <label style={lblStyle}>Edad (cronoestratigrafía)
              <input type="text" placeholder="Jurásico Sup. · Titoniano"
                value={f.age} onChange={e => ff("age", e.target.value)}
                style={inputStyle} />
            </label>
            <label style={lblStyle}>Formación / Miembro
              <input type="text" placeholder="Fm. Río Damas · Mb. inferior"
                value={f.formation} onChange={e => ff("formation", e.target.value)}
                style={inputStyle} />
            </label>

            <div style={secStyle}>· Sedimentología ·</div>

            <div style={lblStyle}>
              <span>Estructuras — símbolos</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
                gap: 4, marginTop: 3 }}>
                {STRUCTS.map(s => {
                  const on = (f.structSymbols || []).includes(s[0]);
                  return (
                    <button key={s[0]} type="button" title={s[1]}
                      onClick={() => toggleStruct(s[0])}
                      style={{ display: "flex", alignItems: "center",
                        justifyContent: "center", padding: 2, cursor: "pointer",
                        borderRadius: 3, aspectRatio: "1",
                        border: `1px solid ${on ? T.green : T.border}`,
                        background: on ? "#E3EEDD" : T.inputBg,
                        boxShadow: on ? `inset 0 0 0 1px ${T.green}` : "none" }}>
                      <StructIcon id={s[0]} size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <label style={lblStyle}>Estructuras — descripción
              <textarea rows={2} placeholder="Detalle: fiamme, disyunción columnar, sets de 20 cm..."
                value={f.structures} onChange={e => ff("structures", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <label style={lblStyle}>Fósiles · Datación geocronológica
              <input type="text" placeholder="Bivalvos; U-Pb 87±2 Ma"
                value={f.fossilsDating} onChange={e => ff("fossilsDating", e.target.value)}
                style={inputStyle} />
            </label>

            <div style={secStyle}>· Contacto & Ambiente ·</div>

            <label style={lblStyle}>Tipo de contacto basal
              <select value={f.contactBottom} style={inputStyle}
                onChange={e => ff("contactBottom", e.target.value)}>
                {CONTACTS.map(c => <option key={c[0]} value={c[0]}>{c[1]}</option>)}
              </select>
            </label>

            <label style={lblStyle}>Ambiente deposicional
              <select value={f.environment} style={inputStyle}
                onChange={e => ff("environment", e.target.value)}>
                <option value="">— seleccionar —</option>
                {ENVS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </label>

            <label style={lblStyle}>Paleocorriente
              <input type="text" placeholder="NE → SW, 045°"
                value={f.paleocurrent} onChange={e => ff("paleocurrent", e.target.value)}
                style={inputStyle} />
            </label>

            <label style={lblStyle}>Nivel de meteorización
              <select value={f.weathering} style={inputStyle}
                onChange={e => ff("weathering", e.target.value)}>
                {WEATH.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </label>

            <label style={lblStyle}>Notas
              <textarea rows={2} placeholder="Observaciones..."
                value={f.notes} onChange={e => ff("notes", e.target.value)}
                style={{ ...inputStyle, resize: "vertical" }} />
            </label>

            <div style={secStyle}>· Fotografía ·</div>

            {f.photo ? (
              <div style={{ position: "relative", border: `2px solid ${T.borderDk}`,
                background: T.hdrBg, padding: 4, borderRadius: 2 }}>
                <img src={f.photo} alt="preview" style={{
                  width: "100%", display: "block", maxHeight: 120,
                  objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setPhotoModal({ photo: f.photo, label: "Vista previa" })}/>
                <div style={{ display: "flex", gap: 5, marginTop: 6, padding: "0 2px" }}>
                  <button onClick={() => photoInputRef.current?.click()}
                    style={{ ...btnBase, flex: 1, fontSize: 10, padding: "4px 8px",
                             background: T.gold, color: T.hdrBg, border: `1px solid ${T.gold}` }}>
                    REEMPLAZAR
                  </button>
                  <button onClick={() => ff("photo", null)}
                    style={{ ...btnBase, fontSize: 10, padding: "4px 8px",
                             background: T.card, color: T.danger, border: `1px solid ${T.danger}` }}>✕</button>
                </div>
              </div>
            ) : (
              <button onClick={() => photoInputRef.current?.click()}
                style={{ ...btnBase, padding: "12px 8px", background: T.card,
                         color: T.text2, borderStyle: "dashed", borderWidth: 1.5 }}>
                📷  Subir foto clave del intervalo
              </button>
            )}

            <label style={{ ...lblStyle, marginTop: 4 }}>Pie de foto
              <input type="text" placeholder="Vista de afloramiento..."
                value={f.photoCaption} onChange={e => ff("photoCaption", e.target.value)}
                style={inputStyle} />
            </label>

            <div style={{ display: "flex", gap: 6, marginTop: 14, marginBottom: 4 }}>
              {editId ? (
                <>
                  <button onClick={doSave} style={{ ...btnPrimary, flex: 1 }}>
                    GUARDAR CAMBIOS</button>
                  <button onClick={doCancel} style={btnBase}>✕</button>
                </>
              ) : (
                <button onClick={doAdd} style={{ ...btnPrimary, flex: 1 }}>
                  ✚  AGREGAR UNIDAD ↑</button>
              )}
            </div>
          </div>

          {/* UNIT LIST */}
          {units.length > 0 && (
            <div style={{ borderTop: `1px solid ${T.border}`, background: T.panel }}>
              <div style={{
                padding: "7px 16px", background: T.hdrBg, color: T.hdrFg,
                fontSize: 10.5, fontFamily: MONO, letterSpacing: ".09em",
                fontWeight: 500, display: "flex", justifyContent: "space-between",
                alignItems: "center" }}>
                <span>{units.length} CAPAS · {totalH.toFixed(2)} m</span>
                <button onClick={doClear} style={{
                  ...btnBase, fontSize: 9, padding: "1px 6px",
                  background: "transparent", color: T.gold,
                  border: `1px solid ${T.gold}`, opacity: .85 }}>VACIAR</button>
              </div>
              {units.map((u, i) => {
                const bot = cumH[i].toFixed(1);
                const top = (cumH[i] + u.thickness).toFixed(1);
                const li  = findL(u.lithoId);
                return (
                  <div key={u.id} style={{
                    padding: "7px 14px", borderBottom: `1px solid ${T.border}`,
                    background: editId === u.id ? "#F8EFD0" : "transparent",
                    display: "flex", gap: 8 }}>
                    {u.photo && (
                      <img src={u.photo} alt="" style={{
                        width: 36, height: 28, objectFit: "cover", flexShrink: 0,
                        border: `1px solid ${T.borderDk}`, cursor: "pointer" }}
                        onClick={() => setPhotoModal({ photo: u.photo,
                          label: `${bot}–${top} m · ${li[1]}${u.photoCaption ? " · " + u.photoCaption : ""}` })}/>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between",
                                    alignItems: "baseline", marginBottom: 3 }}>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.text,
                                       fontFamily: MONO }}>{bot}–{top} m</span>
                        <span style={{ fontSize: 9.5, color: T.text3, maxWidth: 118,
                                       overflow: "hidden", textOverflow: "ellipsis",
                                       whiteSpace: "nowrap", fontStyle: "italic" }}>
                          {u.lithoId2 && u.lithoId2 !== u.lithoId
                            ? `${li[1]} ⇋ ${findL(u.lithoId2)[1]}`
                            : li[1]}</span>
                      </div>
                      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        <button onClick={() => doEdit(u)} style={btnSmall}>editar</button>
                        <button onClick={() => doMove(u.id, -1)} disabled={i === 0}
                          style={btnSmall} title="Hacia la base">▲</button>
                        <button onClick={() => doMove(u.id, +1)}
                          disabled={i === units.length - 1}
                          style={btnSmall} title="Hacia el techo">▼</button>
                        <button onClick={() => doDel(u.id)}
                          style={{ ...btnSmall, color: T.danger, borderColor: T.danger }}>✕</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>)}
        </div>

        {/* ═══ COLUMN PANEL ═══ */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px",
                      minWidth: 0, display: "flex", flexDirection: "column" }}>
          {units.length === 0 ? (
            <div style={{
              alignSelf: "center", margin: "auto",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", minHeight: 400, color: T.text3,
              gap: 14, textAlign: "center", background: T.card,
              padding: "40px 60px", border: `1px solid ${T.cardEdge}`,
              borderRadius: 4, boxShadow: "0 4px 16px rgba(58,40,24,.12)",
              maxWidth: 480 }}>
              <div style={{ fontSize: 40, color: T.borderDk }}>⊞</div>
              <div style={{ fontFamily: SERIF, fontStyle: "italic",
                            fontSize: 17, color: T.text }}>Listo para comenzar</div>
              <div style={{ fontSize: 12, lineHeight: 1.7 }}>
                Ingrese unidades en el panel izquierdo de <i>base → techo</i>,<br/>
                o cargue un archivo CSV para construir la columna.
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={downloadTemplate} style={btnBase}>⬇ Descargar template</button>
                <button onClick={() => csvInputRef.current?.click()} style={btnPrimary}>⬆ Cargar CSV</button>
              </div>
            </div>
          ) : (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: 8,
              margin: "0 auto 10px", flexWrap: "wrap",
              fontFamily: SANS, fontSize: 11.5, color: T.text2 }}>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", color: T.text }}>
                Escala vertical:</span>
              <select value={scaleMode} onChange={e => setScaleMode(e.target.value)}
                style={{ fontFamily: MONO, fontSize: 11, padding: "4px 8px",
                  border: `1px solid ${T.inputBd}`, background: T.inputBg,
                  color: T.text, borderRadius: 3 }}>
                <option value="auto">Auto · ajustar a 1 página (Carta)</option>
                <option value="80">80 px/m · detalle</option>
                <option value="50">50 px/m</option>
                <option value="25">25 px/m</option>
                <option value="10">10 px/m</option>
                <option value="5">5 px/m · compacto</option>
              </select>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: T.text3 }}>
                {SPX.toFixed(1)} px/m · alto ≈ {Math.round(MT + totalH * SPX + legH)} px</span>
            </div>
            <div id="printarea" style={{
              background: T.card, border: `1px solid ${T.cardEdge}`,
              borderRadius: 4,
              boxShadow: "0 4px 18px rgba(58,40,24,.16), inset 0 1px 0 rgba(255,255,255,.5)",
              padding: "8px 12px 14px", margin: "0 auto" }}>
              <svg id="colsvg" width={svgW} height={svgH} xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", fontFamily: SANS }}>
                <SvgDefs totalH={totalH} spx={SPX} />

                <text x={svgW / 2} y={26} textAnchor="middle" style={{
                  fontSize: 17, fontFamily: SERIF, fontStyle: "italic",
                  fill: T.text, fontWeight: 600 }}>
                  {meta.locality || meta.project || "Columna Litoestratigráfica"}</text>
                <line x1={svgW * 0.35} y1={32} x2={svgW * 0.65} y2={32}
                  stroke={T.gold} strokeWidth="1" />
                <text x={svgW / 2} y={48} textAnchor="middle" style={{
                  fontSize: 10, fontFamily: MONO, fill: T.text2, letterSpacing: ".06em" }}>
                  ESPESOR {totalH.toFixed(2)} m · {units.length} UNIDADES · ESC. 1 m = {SPX.toFixed(1)} px{metaUtm ? " · " + metaUtm : ""}</text>

                {/* Escala granulométrica de Wentworth (rotulada) */}
                <line x1={CX} y1={MT - 6} x2={CX + CW} y2={MT - 6}
                  stroke={T.border} strokeWidth="0.7" />
                <line x1={CX} y1={MT - 9} x2={CX} y2={MT - 4} stroke={T.border} strokeWidth="0.6" />
                {(() => {
                  const clastic = GRAIN.filter(g => g[0] !== "coherent");
                  let prev = 0;
                  return clastic.map(g => {
                    const r = g[2], xr = CX + r * CW, xm = CX + ((prev + r) / 2) * CW;
                    prev = r;
                    return (
                      <g key={g[0]}>
                        <line x1={xr} y1={MT - 9} x2={xr} y2={MT - 4}
                          stroke={T.border} strokeWidth="0.6" />
                        <text x={xm} y={MT - 10} textAnchor="middle" style={{
                          fontSize: 6.2, fontFamily: MONO, fill: T.text3 }}>{GRAIN_ABBR[g[0]]}</text>
                      </g>
                    );
                  });
                })()}
                <text x={CX} y={MT - 19} style={{ fontSize: 7.5, fontFamily: MONO,
                  fill: T.text3, fontStyle: "italic" }}>granulometría (Wentworth) →</text>

                {/* Encabezados de columnas izquierdas */}
                <text x={AGX + AGW / 2} y={MT - 9} textAnchor="middle" style={{
                  fontSize: 8, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>Edad</text>
                <text x={FMX + FMW / 2} y={MT - 9} textAnchor="middle" style={{
                  fontSize: 8, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>Formación</text>
                <text x={AX} y={MT - 9} textAnchor="end" style={{
                  fontSize: 8, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>m</text>

                {/* Fondos de columnas crono/litoestratigráficas */}
                <rect x={AGX} y={MT} width={AGW} height={totalH * SPX}
                  fill="#F7F0DD" stroke={T.ink} strokeWidth="0.9" />
                <rect x={FMX} y={MT} width={FMW} height={totalH * SPX}
                  fill="#FBF6E6" stroke={T.ink} strokeWidth="0.9" />

                {/* Bandas de Edad (cronoestratigrafía) */}
                <g clipPath="url(#ageclip)">
                  {bandsOf(units, cumH, "age").map((b, i) => {
                    const y1 = yOf(b.top), y2 = yOf(b.bot), bh = y2 - y1;
                    return (
                      <g key={`ag${i}`}>
                        {i > 0 && <line x1={AGX} y1={y2} x2={AGX + AGW} y2={y2}
                          stroke={T.ink} strokeWidth="0.7" />}
                        {b.val && bh >= 20 && (
                          <text x={AGX + AGW / 2} y={(y1 + y2) / 2} textAnchor="middle"
                            transform={`rotate(-90,${AGX + AGW / 2},${(y1 + y2) / 2})`}
                            style={{ fontSize: 8.5, fontFamily: SERIF, fill: T.text }}>{b.val}</text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Bandas de Formación / Miembro (litoestratigrafía) */}
                <g clipPath="url(#fmclip)">
                  {bandsOf(units, cumH, "formation").map((b, i) => {
                    const y1 = yOf(b.top), y2 = yOf(b.bot), bh = y2 - y1;
                    return (
                      <g key={`fm${i}`}>
                        {i > 0 && <line x1={FMX} y1={y2} x2={FMX + FMW} y2={y2}
                          stroke={T.ink} strokeWidth="0.7" />}
                        {b.val && bh >= 20 && (
                          <text x={FMX + FMW / 2} y={(y1 + y2) / 2} textAnchor="middle"
                            transform={`rotate(-90,${FMX + FMW / 2},${(y1 + y2) / 2})`}
                            style={{ fontSize: 8.5, fontFamily: SERIF, fontStyle: "italic",
                              fill: T.text }}>{b.val}</text>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* Eje de metros */}
                <line x1={AX} y1={MT} x2={AX} y2={MT + totalH * SPX}
                  stroke={T.ink} strokeWidth="1" />
                {ticks.map(d => {
                  const y = yOf(d);
                  const isInt = Math.abs(d - Math.round(d)) < 0.001;
                  return (
                    <g key={d}>
                      <line x1={isInt ? AX - 10 : AX - 6} y1={y} x2={AX} y2={y}
                        stroke={T.ink} strokeWidth={isInt ? 1 : 0.6} />
                      {isInt && (
                        <text x={AX - 13} y={y + 4} textAnchor="end" style={{
                          fontSize: 10, fontFamily: MONO, fill: T.text, fontWeight: 500 }}>
                          {Math.round(d)}</text>
                      )}
                    </g>
                  );
                })}

                <rect x={CX + 3} y={MT + 3} width={CW} height={totalH * SPX}
                  fill="rgba(58,40,24,.08)" />

                {/* Pista de muestras */}
                <text x={SX + SAW / 2} y={MT - 16} textAnchor="middle" style={{
                  fontSize: 9, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>muestras</text>
                <rect x={SX} y={MT} width={SAW} height={totalH * SPX}
                  fill="#FBF6E6" stroke={T.border} strokeWidth="0.8" />
                <g clipPath="url(#sampclip)">
                  {samples.map(s => {
                    const h = parseFloat(s.height);
                    if (!isFinite(h) || h < 0 || h > totalH) return null;
                    const y = yOf(h);
                    const col = findST(s.type)[2];
                    return (
                      <g key={s.id}>
                        <line x1={SX + 2} y1={y} x2={SX + SAW} y2={y} stroke={col} strokeWidth="0.9" />
                        <circle cx={SX + SAW - 5} cy={y} r="3.2" fill={col}
                          stroke="#FCF7E8" strokeWidth="0.7" />
                        <text x={SX + 3} y={y - 2.5} style={{ fontSize: 8,
                          fontFamily: MONO, fill: T.text }}>{s.code}</text>
                      </g>
                    );
                  })}
                </g>

                {/* Pista de estructuras sedimentarias */}
                <text x={STX + STW / 2} y={MT - 16} textAnchor="middle" style={{
                  fontSize: 9, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>estruct.</text>
                <rect x={STX} y={MT} width={STW} height={totalH * SPX}
                  fill="#FBF6E6" stroke={T.border} strokeWidth="0.8" />

                <g clipPath="url(#colclip)">
                  {units.map((u, i) => {
                    const topY = yOf(cumH[i] + u.thickness);
                    const hpx  = u.thickness * SPX;
                    const li   = findL(u.lithoId);
                    const gi   = findG(u.grainSize);
                    const uw   = CW * gi[2];
                    const hasInter = u.lithoId2 && u.lithoId2 !== u.lithoId;

                    if (!hasInter) {
                      return (
                        <g key={u.id}>
                          <rect x={CX} y={topY} width={uw} height={hpx} fill={`url(#${li[2]})`} />
                          {uw < CW && (
                            <rect x={CX + uw} y={topY} width={CW - uw} height={hpx}
                              fill={T.card} opacity="0.94" />
                          )}
                        </g>
                      );
                    }

                    // Intercalated package — alternating horizontal bands
                    const li2    = findL(u.lithoId2);
                    const ratio  = u.lithoRatio ?? 0.5;
                    const nCyc   = Math.max(2, Math.min(28, Math.floor(hpx / 30)));
                    const cycH   = hpx / nCyc;
                    const aH     = cycH * ratio;
                    const bands  = [];
                    for (let k = 0; k < nCyc; k++) {
                      const yStart = topY + k * cycH;
                      bands.push(
                        <rect key={`${u.id}-a${k}`} x={CX} y={yStart}
                          width={uw} height={aH} fill={`url(#${li[2]})`} />,
                        <rect key={`${u.id}-b${k}`} x={CX} y={yStart + aH}
                          width={uw} height={cycH - aH} fill={`url(#${li2[2]})`} />,
                        <line key={`${u.id}-s${k}`} x1={CX} y1={yStart + aH}
                          x2={CX + uw} y2={yStart + aH}
                          stroke="rgba(0,0,0,0.22)" strokeWidth="0.4" />
                      );
                    }
                    return (
                      <g key={u.id}>
                        {bands}
                        {uw < CW && (
                          <rect x={CX + uw} y={topY} width={CW - uw} height={hpx}
                            fill={T.card} opacity="0.94" />
                        )}
                      </g>
                    );
                  })}
                </g>

                {units.map((u, i) => {
                  if (i === 0) return null;
                  const y = yOf(cumH[i]);
                  return (
                    <path key={`c${u.id}`} d={cPath(u.contactBottom, CX, CX + CW, y)}
                      fill="none" stroke={cClr(u.contactBottom)}
                      strokeWidth={cWid(u.contactBottom)} strokeLinecap="round" />
                  );
                })}

                <rect x={CX} y={MT} width={CW} height={totalH * SPX}
                  fill="none" stroke={T.ink} strokeWidth="1.2" />
                <line x1={CX} y1={MT} x2={CX + CW} y2={MT}
                  stroke={T.ink} strokeWidth="2.4" />

                {units.map((u, i) => {
                  const topY = yOf(cumH[i] + u.thickness);
                  const hpx  = u.thickness * SPX;
                  if (hpx < 16) return null;
                  const dark = ["coal","basalt","pillow_lava","autobreccia",
                                "gabbro","amphibolite","slate"].includes(u.lithoId);
                  return (
                    <text key={`th${u.id}`} x={CX + 4} y={topY + hpx - 5} style={{
                      fontSize: 9.5, fontFamily: MONO,
                      fill: dark ? "#bbb" : "rgba(0,0,0,0.55)", fontWeight: 500 }}>
                      {u.thickness.toFixed(2)}m</text>
                  );
                })}

                {/* Símbolos de estructuras en la pista */}
                <g clipPath="url(#colclip2)">
                  {units.map((u, i) => {
                    const syms = (u.structSymbols || []).filter(findS);
                    if (!syms.length) return null;
                    const topY = yOf(cumH[i] + u.thickness);
                    const hpx  = u.thickness * SPX;
                    const midY = topY + hpx / 2;
                    const gs   = 20;
                    const maxN = Math.max(1, Math.floor(hpx / gs));
                    const shown = syms.slice(0, maxN);
                    const cx = STX + STW / 2;
                    const y0 = midY - (shown.length - 1) * gs / 2;
                    return shown.map((sid, j) => (
                      <g key={`${u.id}sym${j}`}
                        transform={`translate(${cx},${y0 + j * gs}) scale(${gs / 24})`}>
                        {glyphEls(sid, `${u.id}_${j}`)}
                      </g>
                    ));
                  })}
                </g>

                {units.map((u, i) => {
                  const topY = yOf(cumH[i] + u.thickness);
                  const hpx  = u.thickness * SPX;
                  const midY = topY + hpx / 2;
                  const li   = findL(u.lithoId);
                  const botM = cumH[i], topM = cumH[i] + u.thickness;
                  const hasPhoto = !!u.photo;

                  const lns = [];
                  lns.push({ t: `${botM.toFixed(2)}–${topM.toFixed(2)} m`,
                             b: true, s: 11, c: T.text, fam: MONO });
                  lns.push({ t: li[1], b: true, s: 10.5, c: T.text, fam: SERIF, it: true });
                  if (u.lithoId2 && u.lithoId2 !== u.lithoId) {
                    const li2 = findL(u.lithoId2);
                    const r = Math.round((u.lithoRatio ?? 0.5) * 100);
                    lns.push({ t: `↳ intercalada c/ ${li2[1]} (${r}/${100-r})`,
                               s: 9.5, c: T.borderDk, fam: SERIF, it: true });
                  }
                  if (u.color)
                    lns.push({ t: `Color: ${u.color}`, s: 9.5, c: T.text2 });
                  if (u.structures)
                    lns.push({ t: u.structures.length > 50 ? u.structures.slice(0,48)+"…" : u.structures,
                               s: 9.5, c: T.text2, it: true });
                  if (u.fossilsDating)
                    lns.push({ t: `◆ ${u.fossilsDating.slice(0, 48)}`, s: 9.5, c: T.indigo });
                  if (u.environment)
                    lns.push({ t: `⬡ ${u.environment}`, s: 9.5, c: T.green });
                  if (u.paleocurrent)
                    lns.push({ t: `↻ ${u.paleocurrent}`, s: 9.5, c: T.rust });
                  if (u.weathering && u.weathering !== "fresco")
                    lns.push({ t: `Meteo: ${u.weathering}`, s: 9, c: T.text3 });
                  if (u.notes)
                    lns.push({ t: `Nota: ${u.notes.slice(0, 45)}`, s: 9, c: T.text3 });

                  const maxL = Math.max(1, Math.min(lns.length, Math.floor(hpx / 11.5)));
                  const vis  = lns.slice(0, maxL);
                  const sY   = midY - (vis.length * 11.5) / 2 + 9;
                  const photoY = midY - PHH / 2;

                  return (
                    <g key={`lbl${u.id}`}>
                      <line x1={STX + STW + 2} y1={midY} x2={LX - 4} y2={midY}
                        stroke={T.text3} strokeWidth="0.6" strokeDasharray="2,3" />
                      {vis.map((ln, j) => (
                        <text key={j} x={LX} y={sY + j * 11.5} style={{
                          fontSize: ln.s, fontFamily: ln.fam || SANS,
                          fontWeight: ln.b ? 600 : 400,
                          fontStyle: ln.it ? "italic" : "normal",
                          fill: ln.c ?? T.text }}>{ln.t}</text>
                      ))}
                      {hasPhoto && (
                        <g style={{ cursor: "pointer" }}
                          onClick={() => setPhotoModal({ photo: u.photo,
                            label: `${botM.toFixed(2)}–${topM.toFixed(2)} m · ${li[1]}${
                              u.photoCaption ? " · " + u.photoCaption : ""}` })}>
                          <rect x={PHX - 3} y={photoY - 3} width={PHW + 6} height={PHH + 6}
                            fill={T.hdrBg} />
                          <image href={u.photo} x={PHX} y={photoY}
                            width={PHW} height={PHH} preserveAspectRatio="xMidYMid slice" />
                          <rect x={PHX} y={photoY} width={PHW} height={PHH}
                            fill="none" stroke={T.gold} strokeWidth="0.6" />
                          <text x={PHX + PHW / 2} y={photoY + PHH + 11} textAnchor="middle"
                            style={{ fontSize: 8, fontFamily: SERIF, fontStyle: "italic",
                                     fill: T.text3 }}>foto ➜ click p/ ampliar</text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* LEGEND */}
                <g transform={`translate(${CX},${MT + totalH * SPX + 24})`}>
                  <text x={0} y={0} style={{ fontSize: 12, fontFamily: SERIF,
                    fontStyle: "italic", fill: T.text, fontWeight: 600 }}>
                    Simbología de contactos</text>
                  <line x1={0} y1={4} x2={150} y2={4} stroke={T.gold} strokeWidth=".8" />
                  {CONTACTS.map(([ct, name], ci) => {
                    const lx = (ci % 2) * 215, ly = 20 + Math.floor(ci / 2) * 18;
                    return (
                      <g key={ct} transform={`translate(${lx},${ly})`}>
                        <path d={cPath(ct, 0, 55, 0)} fill="none"
                          stroke={cClr(ct)} strokeWidth={cWid(ct)} />
                        <text x={62} y={4} style={{ fontSize: 10, fontFamily: SANS,
                          fill: T.text2 }}>{name}</text>
                      </g>
                    );
                  })}

                  <text x={0} y={62} style={{ fontSize: 12, fontFamily: SERIF,
                    fontStyle: "italic", fill: T.text, fontWeight: 600 }}>
                    Litologías presentes</text>
                  <line x1={0} y1={66} x2={150} y2={66} stroke={T.gold} strokeWidth=".8" />
                  {usedLith.map((l, i) => {
                    const lx = (i % 2) * 270, ly = 82 + Math.floor(i / 2) * 17;
                    return (
                      <g key={l[0]} transform={`translate(${lx},${ly})`}>
                        <rect width="22" height="12" fill={`url(#${l[2]})`}
                          stroke={T.ink} strokeWidth=".5" />
                        <text x={28} y={10} style={{ fontSize: 9.5, fontFamily: SANS,
                          fill: T.text2 }}>{l[1]}</text>
                      </g>
                    );
                  })}

                  {usedStruct.length > 0 && (
                    <g transform={`translate(0,${structsTopY})`}>
                      <text x={0} y={0} style={{ fontSize: 12, fontFamily: SERIF,
                        fontStyle: "italic", fill: T.text, fontWeight: 600 }}>
                        Estructuras presentes</text>
                      <line x1={0} y1={4} x2={150} y2={4} stroke={T.gold} strokeWidth=".8" />
                      {usedStruct.map((s, i) => {
                        const lx = (i % 2) * 270, ly = 18 + Math.floor(i / 2) * 17;
                        return (
                          <g key={s[0]} transform={`translate(${lx},${ly})`}>
                            <g transform="translate(10,5) scale(0.5)">{glyphEls(s[0], `lg${s[0]}`)}</g>
                            <text x={28} y={9} style={{ fontSize: 9.5, fontFamily: SANS,
                              fill: T.text2 }}>{s[1]}</text>
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {usedSampleTypes.length > 0 && (
                    <g transform={`translate(0,${sampTopY})`}>
                      <text x={0} y={0} style={{ fontSize: 12, fontFamily: SERIF,
                        fontStyle: "italic", fill: T.text, fontWeight: 600 }}>
                        Muestras</text>
                      <line x1={0} y1={4} x2={150} y2={4} stroke={T.gold} strokeWidth=".8" />
                      {usedSampleTypes.map((t, i) => {
                        const lx = (i % 2) * 270, ly = 18 + Math.floor(i / 2) * 17;
                        return (
                          <g key={t[0]} transform={`translate(${lx},${ly})`}>
                            <circle cx={6} cy={5} r="3.5" fill={t[2]}
                              stroke="#FCF7E8" strokeWidth="0.6" />
                            <text x={18} y={9} style={{ fontSize: 9.5, fontFamily: SANS,
                              fill: T.text2 }}>{t[1]}</text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              </svg>
            </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ PHOTO MODAL ═══ */}
      {photoModal && (
        <div onClick={() => setPhotoModal(null)} style={{
          position: "fixed", inset: 0, background: "rgba(20,14,6,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 40, cursor: "zoom-out" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, border: `10px solid ${T.hdrBg}`,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            maxWidth: "92vw", maxHeight: "92vh", cursor: "default",
            display: "flex", flexDirection: "column" }}>
            <img src={photoModal.photo} alt="" style={{
              maxWidth: "85vw", maxHeight: "75vh", display: "block",
              borderBottom: `2px solid ${T.gold}` }} />
            <div style={{
              padding: "12px 18px", fontFamily: SERIF, fontStyle: "italic",
              fontSize: 13, color: T.text, background: T.panel,
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 16 }}>
              <span>{photoModal.label}</span>
              <button onClick={() => setPhotoModal(null)} style={btnBase}>Cerrar ✕</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HELP MODAL ═══ */}
      {showHelp && (
        <div onClick={() => setShowHelp(false)} style={{
          position: "fixed", inset: 0, background: "rgba(20,14,6,0.82)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, border: `8px solid ${T.hdrBg}`,
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            maxWidth: 740, maxHeight: "88vh", overflowY: "auto",
            padding: "20px 28px", fontFamily: SANS, color: T.text }}>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20,
              marginBottom: 6, color: T.text }}>Guía de valores para el CSV</div>
            <div style={{ borderBottom: `1px solid ${T.gold}`, marginBottom: 14,
              paddingBottom: 8, fontSize: 11.5, color: T.text2 }}>
              Use el template como punto de partida. En negrita el identificador aceptado;
              en cursiva el nombre descriptivo.
            </div>

            <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600,
              color: T.borderDk, letterSpacing: ".05em", marginBottom: 8,
              textTransform: "uppercase" }}>lithology (litología)</div>
            {LITH_GROUPS.map(grp => (
              <div key={grp} style={{ marginBottom: 9 }}>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 11.5,
                  color: T.green, marginBottom: 3 }}>{grp}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "3px 14px", fontSize: 10.5, fontFamily: MONO }}>
                  {LITH.filter(l => l[4] === grp).map(l => (
                    <div key={l[0]} style={{ color: T.text2 }}>
                      <span style={{ color: T.text, fontWeight: 600 }}>{l[0]}</span>
                      <span style={{ color: T.text3, fontStyle: "italic", fontFamily: SANS }}>
                        {" "}— {l[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Section title="grainSize (granulometría)" items={GRAIN.map(g => [g[0], g[1]])} />
            <Section title="structSymbols (símbolos de estructuras · separar con ;)" items={STRUCTS.map(s => [s[0], s[1]])} />
            <Section title="contactBottom (contacto basal)" items={CONTACTS.map(c => [c[0], c[1]])} />
            <Section title="weathering (meteorización)" items={WEATH.map(w => [w, w])} simple />
            <Section title="environment (ambiente, valor libre)" items={ENVS.map(e => [e, ""])} simple />

            <div style={{ marginTop: 16, padding: "12px 14px", background: T.panelAlt,
              border: `1px solid ${T.border}`, fontSize: 11.5, lineHeight: 1.7 }}>
              <b style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13 }}>Notas:</b><br/>
              · <b>thickness</b> es obligatorio, numérico positivo (e.g. <code>2.50</code>).<br/>
              · Para lavas e intrusivos use <code>coherent</code> en grainSize (columna ancha, no clástica).<br/>
              · Lapilli = <code>granule</code> (2–64 mm); bloques/bombas = <code>cobble</code> (&gt;64 mm); ceniza = <code>silt</code>/<code>clay</code>.<br/>
              · <b>Intercalaciones:</b> rellene <code>lithology2</code> con la litología secundaria y <code>lithoRatio</code> entre 0.1–0.9 (proporción de la primaria). Se renderizan como bandas alternadas en la columna.<br/>
              · Distinguir <code>lapilli_tuff</code> (piroclástica, fragmentos angulosos en matriz cinerítica) de <code>lapillite</code> (epiclástica, clastos redondeados retrabajados).<br/>
              · Campos con comas o saltos de línea van entre <code>"comillas"</code>.<br/>
              · El orden del CSV define base → techo (primera fila = base).<br/>
              · Cargar CSV reemplaza la columna actual. Valores no reconocidos usan defaults.<br/>
              · Aliases aceptados: <code>tuff</code>→toba de ceniza, <code>volcanic_breccia</code>→brecha volcánica.
            </div>

            <div style={{ textAlign: "right", marginTop: 18 }}>
              <button onClick={() => setShowHelp(false)} style={btnPrimary}>Entendido</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%",
          transform: "translateX(-50%)", zIndex: 200,
          background: T.hdrBg, color: T.hdrFg, padding: "10px 22px",
          borderRadius: 3, fontFamily: MONO, fontSize: 12, letterSpacing: ".04em",
          border: `1px solid ${T.gold}`, boxShadow: "0 6px 24px rgba(0,0,0,.3)" }}>
          {toast}</div>
      )}
    </div>
  );
}

function Section({ title, items, simple }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600,
        color: T.borderDk, letterSpacing: ".05em", marginBottom: 6,
        textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "grid",
        gridTemplateColumns: simple ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: "4px 14px", fontSize: 10.5, fontFamily: MONO }}>
        {items.map(([k, v], i) => (
          <div key={i} style={{ color: T.text2 }}>
            <span style={{ color: T.text, fontWeight: 600 }}>{k}</span>
            {v && v !== k && (
              <span style={{ color: T.text3, fontStyle: "italic", fontFamily: SANS }}>
                {" "}— {v}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// META FORM — Ubicación y metadatos del afloramiento / sección
// ═══════════════════════════════════════════════════════════════
function MetaForm({ meta, setMeta, inputStyle, lblStyle, secStyle }) {
  const m = (k, v) => setMeta(p => ({ ...p, [k]: v }));
  const hint = { fontSize: 9.5, color: T.text3, fontStyle: "italic", fontFamily: SERIF };
  return (
    <div style={{ padding: "12px 16px", display: "flex",
                  flexDirection: "column", gap: 9, flex: 1 }}>
      <div style={{ ...secStyle, marginTop: 0, paddingTop: 0,
                    borderTop: "none" }}>· Identificación ·</div>

      <label style={lblStyle}>Proyecto / Estudio
        <input type="text" placeholder="Hoja geológica, tesis, faena..."
          value={meta.project} onChange={e => m("project", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Localidad / Sección / Afloramiento
        <input type="text" placeholder="Quebrada del Carrizo, perfil 1"
          value={meta.locality} onChange={e => m("locality", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Autor(es)
        <input type="text" placeholder="C. Venegas"
          value={meta.author} onChange={e => m("author", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Fecha
        <input type="date" value={meta.date}
          onChange={e => m("date", e.target.value)} style={inputStyle} />
      </label>

      <div style={secStyle}>· Coordenadas UTM ·</div>

      <div style={{ display: "flex", gap: 8 }}>
        <label style={{ ...lblStyle, flex: 1 }}>Datum
          <select value={meta.datum} onChange={e => m("datum", e.target.value)}
            style={inputStyle}>
            <option>WGS84</option>
            <option>PSAD56</option>
            <option>SIRGAS-Chile</option>
            <option>SAD69</option>
          </select>
        </label>
        <label style={{ ...lblStyle, width: 70 }}>Huso
          <input type="text" placeholder="19" value={meta.utmZone}
            onChange={e => m("utmZone", e.target.value)} style={inputStyle} />
        </label>
        <label style={{ ...lblStyle, width: 64 }}>Hemisf.
          <select value={meta.utmHemi} onChange={e => m("utmHemi", e.target.value)}
            style={inputStyle}>
            <option value="S">S</option>
            <option value="N">N</option>
          </select>
        </label>
      </div>

      <label style={lblStyle}>Este (m E)
        <input type="number" step="any" placeholder="345678"
          value={meta.utmE} onChange={e => m("utmE", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Norte (m N)
        <input type="number" step="any" placeholder="6123456"
          value={meta.utmN} onChange={e => m("utmN", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Cota / Elevación (m s.n.m.)
        <input type="number" step="any" placeholder="1240"
          value={meta.elevation} onChange={e => m("elevation", e.target.value)}
          style={inputStyle} />
      </label>
      <div style={hint}>
        Chile continental: huso 18 o 19, hemisferio S, datum WGS84. Las UTM se
        convierten a lat/long al exportar a <b>Google Earth (KMZ)</b>.
      </div>

      <div style={secStyle}>· Sección ·</div>
      <label style={lblStyle}>Azimut / rumbo de la sección
        <input type="text" placeholder="N30°E"
          value={meta.azimuth} onChange={e => m("azimuth", e.target.value)}
          style={inputStyle} />
      </label>
      <label style={lblStyle}>Observaciones generales
        <textarea rows={4} placeholder="Acceso, contexto regional, unidad formacional..."
          value={meta.description} onChange={e => m("description", e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }} />
      </label>

      <div style={{ marginTop: 6, padding: "9px 11px", background: T.panelAlt,
        border: `1px solid ${T.border}`, borderRadius: 3, ...hint, lineHeight: 1.6 }}>
        Estos datos viajan en el título de la columna, en el CSV (líneas
        <code> #clave=valor</code>) y en el archivo <b>.kmz</b> para Google Earth.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SAMPLES FORM — gestión de muestras (altura, código, tipo)
// ═══════════════════════════════════════════════════════════════
function SamplesForm({ samples, addSample, delSample, totalH, inputStyle, lblStyle, secStyle, btnPrimary, btnSmall }) {
  const [h, setH] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("geoquimica");
  const submit = () => {
    const hv = parseFloat(h);
    if (!isFinite(hv) || !code.trim()) return;
    addSample({ height: hv, code: code.trim(), type });
    setH(""); setCode("");
  };
  const sorted = [...samples].sort((a, b) => b.height - a.height);
  const hint = { fontSize: 9.5, color: T.text3, fontStyle: "italic", fontFamily: SERIF };
  return (
    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
      <div style={{ ...secStyle, marginTop: 0, paddingTop: 0, borderTop: "none" }}>· Nueva muestra ·</div>
      <label style={lblStyle}>Altura desde la base (m)
        <input type="number" step="any" placeholder="0.0" value={h}
          onChange={e => setH(e.target.value)} style={inputStyle} />
      </label>
      <label style={lblStyle}>Código
        <input type="text" placeholder="M-12, U-Pb-3, PM-07..." value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }} style={inputStyle} />
      </label>
      <label style={lblStyle}>Tipo
        <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
          {SAMPLE_TYPES.map(t => <option key={t[0]} value={t[0]}>{t[1]}</option>)}
        </select>
      </label>
      <button onClick={submit} style={{ ...btnPrimary }}>＋  Agregar muestra</button>
      <div style={hint}>
        Se ubica a esa altura en la pista de muestras. Base = 0 m; techo = {totalH.toFixed(2)} m.
      </div>

      {sorted.length > 0 && (
        <>
          <div style={secStyle}>· {samples.length} muestra{samples.length !== 1 ? "s" : ""} ·</div>
          {sorted.map(s => {
            const t = findST(s.type);
            const out = s.height > totalH || s.height < 0;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8,
                padding: "5px 4px", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
                  background: t[2], border: `1px solid ${T.borderDk}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, fontFamily: MONO, color: T.text }}>
                    {s.code} <span style={{ color: T.text3, fontWeight: 400 }}>· {s.height} m{out ? " ⚠" : ""}</span>
                  </div>
                  <div style={{ fontSize: 9.5, color: T.text3, fontStyle: "italic" }}>{t[1]}</div>
                </div>
                <button onClick={() => delSample(s.id)}
                  style={{ ...btnSmall, color: T.danger, borderColor: T.danger }}>✕</button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ── Montaje en el navegador ──
ReactDOM.createRoot(document.getElementById("root")).render(<ColumnaEstratigrafica />);
