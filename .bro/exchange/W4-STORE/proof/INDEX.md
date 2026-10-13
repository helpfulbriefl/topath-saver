# PROOF W4-STORE

| # | requirement | proof file(s) | ok |
|---|---|---|---|
| 1 | W3 evidence repaired: tracked UTF-8 logs, actual W4 gates exit 0 (38 unit, 10 stand), release run independently verified | `evidence-repair.txt` `gates-exit.txt` `release-gates.txt` `../logs/gates.log` `../logs/gh-run.log` `../../W3-FIX/proof/INDEX.md` | ✅ |
| 2 | Four 1280×800 screenshots, promo, and icon are inspected at native and 640×400; original screenshot files unchanged | `store-assets.txt` `asset-hashes.txt` `../../../../docs/store/captures/provenance.json` `../../../../docs/store/assets/01-folders.png` `../../../../docs/store/assets/02-auto-sort.png` `../../../../docs/store/assets/03-icon-styles.png` `../../../../docs/store/assets/04-dark.png` `../../../../docs/store/assets/small-promo.png` `../../../../docs/store/assets/icon-128.png` | ✅ |
| 3 | Four localized listings retain title, approved summaries, detailed caveats, and summary length proof | `store-assets.txt` `../../../../docs/store/listing-en.md` `../../../../docs/store/listing-ru.md` `../../../../docs/store/listing-zh-CN.md` `../../../../docs/store/listing-es.md` | ✅ |
| 4 | Built manifest’s five permissions and honest policy disclosures are documented; public policy URL was retrieved successfully | `../../../../docs/store/privacy-practices.md` `../logs/release-verify.log` | ✅ |
| 5 | Original release ZIP was downloaded and hash-checked; handoff index, checklist and kit checksums exist | `../logs/release-verify.log` `../../../../docs/store/files-index.md` `../../../../docs/store/upload-checklist.md` `../../../../docs/store/SHA256SUMS.txt` | ✅ |
| 6 | Removed HTTP response log is absent from tracked, staged, proof and mirror locations before commit | `../logs/check-http-log-paths.ps1` | ✅ |
