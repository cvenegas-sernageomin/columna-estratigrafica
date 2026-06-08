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
$dest = Join-Path $distDir "Columna_Estratigrafica.html"

# UTF-8 con BOM para que los acentos se vean bien al abrir con doble clic
$enc = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($dest, $out, $enc)

$kb = [math]::Round((Get-Item $dest).Length / 1KB, 1)
Write-Host "OK  ->  dist\Columna_Estratigrafica.html  ($kb KB)" -ForegroundColor Green
