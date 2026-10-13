$ErrorActionPreference = 'Stop'
$target = '.bro/exchange/W4-STORE/logs/final-checks.log'
$hits = [System.Collections.Generic.List[string]]::new()

$tracked = & git ls-files -- $target
if ($tracked -contains $target) { $hits.Add("TRACKED:$target") }

$staged = & git diff --cached --name-only
if ($staged -contains $target) { $hits.Add("STAGED:$target") }

$mirror = Join-Path $env:LOCALAPPDATA 'BRO-MIRROR\topath-saver'
foreach ($root in @('.bro/exchange/W4-STORE/proof', $mirror)) {
  if (Test-Path -LiteralPath $root -PathType Container) {
    Get-ChildItem -LiteralPath $root -Recurse -Force -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -eq 'final-checks.log' } |
      ForEach-Object { $hits.Add("COPY:$($_.FullName)") }
  }
}

$pack = Join-Path $mirror 'BRO-PACK.zip'
if (Test-Path -LiteralPath $pack -PathType Leaf) {
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $zip = [System.IO.Compression.ZipFile]::OpenRead($pack)
  try {
    foreach ($entry in $zip.Entries) {
      if ($entry.FullName -like '*final-checks.log') { $hits.Add("PACK:$pack::$($entry.FullName)") }
    }
  } finally { $zip.Dispose() }
}

if ($hits.Count -gt 0) {
  $hits
  exit 1
}
'NO_HTTP_LOG_PATHS_IN_TRACKED_STAGED_PROOF_OR_MIRROR'
