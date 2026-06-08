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
const SPX = 50, CX = 80, CW = 92, MT = 78;
const SW  = 620;
const LX  = CX + CW + 20;
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
  // ── Intrusivas / metamórficas ──
  ["granite",      "Granito",                 "p-gran",    "coherent", "Intrusivas / metamórficas"],
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
  "fossilsDating","contactBottom","environment","paleocurrent","weathering","notes"];

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

function parseCsv(text) {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter(l => l.trim().length > 0);
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

function generateCsv(units) {
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
      grainSize: u.grainSize, structures: u.structures, fossilsDating: u.fossilsDating,
      contactBottom: u.contactBottom, environment: u.environment,
      paleocurrent: u.paleocurrent, weathering: u.weathering, notes: u.notes,
    };
    return esc(map[h]);
  }).join(","));
  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

function downloadFile(filename, content, mime = "text/csv;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 100);
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
function SvgDefs({ totalH }) {
  return (
    <defs>
      <clipPath id="colclip">
        <rect x={CX} y={MT} width={CW} height={totalH * SPX} />
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

      {/* ── Intrusivas ── */}
      <pattern id="p-gran" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#D5C8C0"/>
        <ellipse cx="3" cy="4" rx="1.5" ry="1" fill="#7A7A7A" transform="rotate(30 3 4)"/>
        <ellipse cx="9" cy="8" rx="2" ry="1.2" fill="#332D2D" transform="rotate(60 9 8)"/>
        <ellipse cx="5" cy="11" rx="1.2" ry=".8" fill="#B0A090" transform="rotate(-20 5 11)"/>
        <ellipse cx="11" cy="3" rx="1.3" ry=".7" fill="#8E8E8E" transform="rotate(45 11 3)"/>
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
  structures: "", fossilsDating: "", contactBottom: "sharp",
  environment: "", paleocurrent: "", weathering: "fresco", notes: "",
  photo: null, photoCaption: "",
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

  const csvInputRef   = useRef(null);
  const photoInputRef = useRef(null);

  const ff = (k, v) => setF(p => ({ ...p, [k]: v }));

  const totalH = units.reduce((s, u) => s + u.thickness, 0);
  const cumH = useMemo(() => {
    let a = 0;
    return units.map(u => { const c = a; a += u.thickness; return c; });
  }, [units]);
  const yOf = d => MT + (totalH - d) * SPX;

  const usedLith = LITH.filter(l => units.some(u => u.lithoId === l[0] || u.lithoId2 === l[0]));
  const legRows  = Math.ceil(Math.max(usedLith.length, 1) / 2);
  const legH     = 64 + legRows * 17 + 26;
  const svgH     = MT + totalH * SPX + legH;
  const svgW     = SW;

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
      setUnits([]); setEditId(null); setF(DF); showToast("Columna borrada");
    }
  };

  // CSV handlers
  const onCsvChosen = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (rows.length === 0) { showToast("⚠ CSV vacío o inválido"); return; }
    const validLitho = new Set(LITH.map(l => l[0]));
    const validGrain = new Set(GRAIN.map(g => g[0]));
    const validCont  = new Set(CONTACTS.map(c => c[0]));
    const validWeath = new Set(WEATH);
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
        fossilsDating: r.fossilsDating || "",
        contactBottom: validCont.has(r.contactBottom)   ? r.contactBottom  : "sharp",
        environment:   r.environment || "",
        paleocurrent:  r.paleocurrent || "",
        weathering:    validWeath.has(r.weathering)     ? r.weathering     : "fresco",
        notes:         r.notes || "",
        photo: null, photoCaption: "",
      };
    }).filter(Boolean);
    if (parsed.length === 0) { showToast("⚠ No se encontraron filas válidas"); return; }
    setUnits(parsed); setEditId(null); setF(DF);
    showToast(`✓ ${parsed.length} unidades cargadas desde CSV`);
    e.target.value = "";
  };
  const downloadTemplate = () => {
    downloadFile("columna_template.csv", CSV_TEMPLATE);
    showToast("✓ Template CSV descargado");
  };
  const exportCsv = () => {
    if (units.length === 0) { showToast("⚠ No hay datos para exportar"); return; }
    downloadFile("columna_estratigrafica.csv", generateCsv(units));
    showToast("✓ CSV exportado");
  };
  const exportSvg = () => {
    const svgNode = document.getElementById("colsvg");
    if (!svgNode) return;
    const xml = new XMLSerializer().serializeToString(svgNode);
    downloadFile("columna.svg", '<?xml version="1.0" encoding="UTF-8"?>\n' + xml, "image/svg+xml");
    showToast("✓ SVG exportado");
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
          EDITOR DE CAMPO · v3.0
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[["⬇ TEMPLATE CSV", downloadTemplate, "Descargar template CSV con ejemplos"],
            ["⬆ CARGAR CSV", () => csvInputRef.current?.click(), "Cargar columna desde CSV"],
            ["EXPORTAR CSV", exportCsv, "Exportar columna actual a CSV"],
            ["EXPORTAR SVG", exportSvg, "Descargar columna como SVG"]].map(([label, fn, tip]) => (
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

            <div style={secStyle}>· Sedimentología ·</div>

            <label style={lblStyle}>Estructuras (sed. / volcánicas)
              <textarea rows={3} placeholder="Est. cruzada, fiamme, disyunción columnar, gradación..."
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
            <div style={{
              background: T.card, border: `1px solid ${T.cardEdge}`,
              borderRadius: 4,
              boxShadow: "0 4px 18px rgba(58,40,24,.16), inset 0 1px 0 rgba(255,255,255,.5)",
              padding: "8px 12px 14px", margin: "0 auto" }}>
              <svg id="colsvg" width={svgW} height={svgH} xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", fontFamily: SANS }}>
                <SvgDefs totalH={totalH} />

                <text x={svgW / 2} y={26} textAnchor="middle" style={{
                  fontSize: 17, fontFamily: SERIF, fontStyle: "italic",
                  fill: T.text, fontWeight: 600 }}>
                  Columna Litoestratigráfica</text>
                <line x1={svgW * 0.35} y1={32} x2={svgW * 0.65} y2={32}
                  stroke={T.gold} strokeWidth="1" />
                <text x={svgW / 2} y={48} textAnchor="middle" style={{
                  fontSize: 10, fontFamily: MONO, fill: T.text2, letterSpacing: ".06em" }}>
                  ESPESOR {totalH.toFixed(2)} m · {units.length} UNIDADES · ESC. 1 m = {SPX} PX</text>

                <text x={CX} y={MT - 16} style={{ fontSize: 9.5, fontFamily: MONO,
                  fill: T.text3, fontStyle: "italic" }}>← fino</text>
                <text x={CX + CW} y={MT - 16} textAnchor="end" style={{
                  fontSize: 9.5, fontFamily: MONO, fill: T.text3, fontStyle: "italic" }}>grueso →</text>
                <line x1={CX} y1={MT - 6} x2={CX + CW} y2={MT - 6}
                  stroke={T.border} strokeWidth="0.7" />
                {[0, 0.22, 0.57, 0.87, 1.0].map((r, i) => (
                  <line key={i} x1={CX + r * CW} y1={MT - 9} x2={CX + r * CW} y2={MT - 4}
                    stroke={T.border} strokeWidth="0.7" />
                ))}

                <line x1={48} y1={MT} x2={48} y2={MT + totalH * SPX}
                  stroke={T.ink} strokeWidth="1" />
                <text x={14} y={MT + totalH * SPX / 2} textAnchor="middle"
                  transform={`rotate(-90,14,${MT + totalH * SPX / 2})`}
                  style={{ fontSize: 10.5, fontFamily: SERIF, fontStyle: "italic",
                           fill: T.text2, letterSpacing: ".15em" }}>METROS</text>
                {ticks.map(d => {
                  const y = yOf(d);
                  const isInt = Math.abs(d - Math.round(d)) < 0.001;
                  return (
                    <g key={d}>
                      <line x1={isInt ? 30 : 40} y1={y} x2={48} y2={y}
                        stroke={T.ink} strokeWidth={isInt ? 1 : 0.6} />
                      {isInt && (
                        <text x={28} y={y + 4} textAnchor="end" style={{
                          fontSize: 11, fontFamily: MONO, fill: T.text, fontWeight: 500 }}>
                          {Math.round(d)}</text>
                      )}
                    </g>
                  );
                })}

                <rect x={CX + 3} y={MT + 3} width={CW} height={totalH * SPX}
                  fill="rgba(58,40,24,.08)" />

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
                  const dark = ["coal","basalt","pillow_lava","autobreccia"].includes(u.lithoId);
                  return (
                    <text key={`th${u.id}`} x={CX + 4} y={topY + hpx - 5} style={{
                      fontSize: 9.5, fontFamily: MONO,
                      fill: dark ? "#bbb" : "rgba(0,0,0,0.55)", fontWeight: 500 }}>
                      {u.thickness.toFixed(2)}m</text>
                  );
                })}

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
                      <line x1={CX + CW + 2} y1={midY} x2={LX - 4} y2={midY}
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
                </g>
              </svg>
            </div>
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

// ── Montaje en el navegador ──
ReactDOM.createRoot(document.getElementById("root")).render(<ColumnaEstratigrafica />);
