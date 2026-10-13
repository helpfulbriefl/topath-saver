---
wave: W4-STORE · ver: v3.0 · t_start: 2026-10-13 14:30 · t_report: 2026-10-13 17:04
commit: 2ae70c1 · tag: w4-store-done · push: ✅ · bundle: ✅ · pack: ✅ · exchange: ✅
tasks: 4 · done: 4 · gates_first: yes · repair: 1 · proof_ok: 6 · proof_req: 6
diff_files: 26 · diff_add: 495 · diff_del: 3 · out_of_scope: 1 · q: 0 · contradictions: 1
K1: 1 · K2: 1 · K3: 1 · K4: 1 · k_why: - · friction_cd: #env
cd_in: 7529 · cd_out: 7411 · prompt_weight: 4515 · an_in_prev: 711 · an_out_prev: 3914
---
# REPORT W4-STORE — evidence repair and Chrome Web Store upload kit

## Tasks
1 ✅ `.bro/exchange/W3-FIX/logs/gates.log:1` — recovered seven actual W3 logs as sanitized UTF-8, force-added only named safe files, repaired W3 proof links, and independently captured release run 38323606254 (`7d751ef`, success). Fresh W4 `npm run gates` exited 0: 38 unit and 10 stand.
2 ✅ `docs/store/capture.mjs:1` — preserved original screenshots byte-for-byte; created and inspected isolated real-build full captures for light Images-selected and dark Chrome-default states. Generated, inspected and downscaled four store screenshots, promo and icon.
3 ✅ `docs/store/listing-en.md:1` — prepared EN/RU/ZH-CN/ES listing copy (summaries 115/103/47/107), revised policy wording, and documented five built-manifest permissions without remote code or host permissions.
4 ✅ `docs/store/files-index.md:1` — verified original immutable v0.2.0 ZIP SHA-256 `e4423dd5be31fa7f8eec6dfad6947a9b00e0524959f6a8cd4f4d79241302ed99`; prepared upload checklist, files index and kit checksums. No store interaction occurred.

## Gates
`npm run gates` ✅ — `tsc --noEmit` ✅ · Vitest 38/38 ✅ · WXT production build ✅ · Playwright stand 10/10 ✅. Actual exit 0: `proof/gates-exit.txt`. Release workflow actual log independently confirms 38/10: `proof/release-gates.txt`.

## Spots for analyst
- `.bro/exchange/W4-STORE/proof/store-assets.txt:1` — original 01/04 clipping retained as initial defect; full-source provenance and final/native/downscaled visual QA establish resolution.
- `docs/store/captures/provenance.json:1` — real build `6695ce0c8d042fba9d5904e7a7e22df9678596c0`, manifest 0.2.0; bottom controls measured visible.
- `docs/store/privacy-practices.md:1` — exact five permissions, no host permissions, remote code No, transient Gmail links and local diagnostics disclosures.
- `docs/store/SHA256SUMS.txt:1` — checksums cover delivered kit files and exclude itself and original extension ZIP.
- `.bro/exchange/W4-STORE/logs/check-http-log-paths.ps1:1` — Analyst-approved local path/status check confirmed removed HTTP log absent from tracked, staged, proof, and mirror locations before commit.

## Q / contradictions
- C-01 resolved: TASK’s fixed x=880 for a native 340px-wide second image violates 64px right safe area (`880+340 > 1216`). Final generator uses x=876, preserving native size and safe area.

## Out of scope
- None. Application code, tests, original screenshots, tags `v0.2.0`, release asset, account, payment and Store submission were untouched.

Secrets not opened: yes
