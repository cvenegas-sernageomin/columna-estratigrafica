# ════════════════════════════════════════════════════════════════
#  build.ps1 — Genera el HTML autocontenido (offline) a partir de
#  src/app.jsx + src/template.html + vendor/*.js
#
#  Uso:   .\build.ps1
#  Salida: dist\Columna_Estratigrafica.html
# ════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

function Read-Text($p) { [System.IO.File]::ReadAllText($p) }

# Evita que un "</script>" dentro del JS corte el <script> contenedor.
# Es seguro: en JS sólo aparece dentro de strings/regex, donde \/ === /
function Protect-Script($s) { $s -replace '</script', '<\/script' }

$template = Read-Text (Join-Path $root "src\template.html")
$app      = Read-Text (Join-Path $root "src\app.jsx")
$react    = Read-Text (Join-Path $root "vendor\react.production.min.js")
$reactDom = Read-Text (Join-Path $root "vendor\react-dom.production.min.js")
$babel    = Read-Text (Join-Path $root "vendor\babel.min.js")

# .Replace() es reemplazo literal (ordinal): no interpreta $1, \, etc.
$out = $template
$out = $out.Replace("/*__REACT__*/",    (Protect-Script $react))
$out = $out.Replace("/*__REACTDOM__*/", (Protect-Script $reactDom))
$out = $out.Replace("/*__BABEL__*/",    (Protect-Script $babel))
$out = $out.Replace("/*__APP__*/",      (Protect-Script $app))

$distDir = Join-Path $root "dist"
if (-not (Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir | Out-Null }

# UTF-8 con BOM para que los acentos se vean bien al abrir con doble clic
$enc = New-Object System.Text.UTF8Encoding($true)
# Archivo para compartir (nombre claro) y entrada de la PWA (index.html)
$dest = Join-Path $distDir "Columna_Estratigrafica.html"
[System.IO.File]::WriteAllText($dest, $out, $enc)
[System.IO.File]::WriteAllText((Join-Path $distDir "index.html"), $out, $enc)

# Recursos PWA: manifest, service worker e íconos
Copy-Item (Join-Path $root "src\pwa\*") $distDir -Force
# .nojekyll: evita el procesamiento Jekyll al servir en GitHub Pages
[System.IO.File]::WriteAllText((Join-Path $distDir ".nojekyll"), "")

$kb = [math]::Round((Get-Item $dest).Length / 1KB, 1)
Write-Host "OK  ->  dist\Columna_Estratigrafica.html  +  dist\index.html  ($kb KB)" -ForegroundColor Green
Write-Host "OK  ->  PWA: manifest.webmanifest, sw.js, icon-192/512, apple-touch-icon" -ForegroundColor Green
