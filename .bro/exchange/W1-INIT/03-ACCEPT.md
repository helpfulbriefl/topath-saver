---
wave: W1-INIT · t_accept: 2026-10-13 00:25 · verdict: PARTIAL · spot: 3 · false_done: 0
defects: 3 · causes: E@C2;C@C3;E@D5 · O1: 1 · O2: 1 · O3: 1 · O4: 0
owner_touches: 3 · owner_fixes: 0 · gh_calls: 9 · ctx_pct: 40 · friction_an: #env
read_list: .bro/exchange/W1-INIT/02-REPORT.md; .bro/exchange/W1-INIT/proof/INDEX.md; .bro/exchange/W1-INIT/proof/download-*.txt; docs/screenshots/*.png; commits a43d9c8, 3678ff3
---
# ACCEPT W1-INIT — PARTIAL (works on Windows; identity + metrics left)
## Checks
proof ✅ 6/7 · scope ✅ (10 out_of_scope = analyst rev-2 commit 9a94045, not coder) · gates ✅ tsc · vitest 38/38 · build · stand 7/7 · spots 3/3 ✅ (download-*.txt = real Windows paths Downloads\Images|Documents|Work\Q4report|Video, setup.exe + clip2.mp4 in root · README screenshots masked, no temp path · tag w1-init-done = a43d9c8) · secrets ✅
## Defects → next TASK §Z
- Z-01 BLOCKING for release: commits a43d9c8, 3678ff3 authored as `Jany Version <38387585+Apex4Coder@users.noreply.github.com>` (global git identity of the other account) → public repo shows Apex4Coder as author. Fix: repo-local identity helpfulbriefl in P and SYS, rewrite authors, force-push once (Owner-approved S3).
- Z-02 PASS 7: metrics not pushed to helpfulbriefl SYS (mirror still has only analyst commits f055754).
- Z-03 preflight.log `Test-Path` line broken quoting → rerun line, append.
- note: tag recreated once (ok). Proof files leaked `C:\Users\<name>` → analyst masked home as `~` in stand (tests/stand/extension.spec.ts `priv`).
<!-- LOG -->
## L-003 · 2026-10-13 · W1-INIT · ◐PARTIAL @a43d9c8 · w1-init-done
#tags: windows green vitest-globals identity apex4coder metrics
Result: Windows gates green (tsc, vitest 38, build, stand 7/7 real downloads), 7 README screenshots, SYS on helpfulbriefl mirror (.apex-old kept). Defect: commits authored by Apex4Coder global identity → W2 fixes. New: G-P03, D-13.
<!-- /LOG -->
<!-- MAP -->
### §5 Decisions
D-01 BRO v3.0 · D-02 modes default + Documents/Images/Video/Archives + Custom, folders auto-created silently · D-03 no native helper · D-04 stack §3 · D-05 style Paper × AtomicCRM = M01–M05 · D-06 i18n EN default, RU, ZH_CN, ES, own selector · D-07 shortcuts on by default, toggle in settings, 4 suggested keys · D-08 public repo, README EN (Folio style) + RU · D-09 system mirror in helpfulbriefl, upstream read-only · D-10 analyst writes code via GitHub, coder verifies · D-11 coffee = ETH ERC-20 card in README + Settings · D-12 contacts t.me/yumi_acess, helpfulbriefl.github.io · D-13 git identity per repo (P, SYS) = `helpfulbriefl <210454348+helpfulbriefl@users.noreply.github.com>`; never change global config (PC also serves other work accounts)
### §7 Rakes · project G
G-P03 PC global git identity = other account (Apex4Coder) → every repo of this project sets local user.name/user.email before first commit; check `git log --format=%ae -1`.
G-P02 Vitest on Windows: «failed to find the current suite», 0 tests → `globals: true`, never import describe/test/expect from 'vitest'.
G-P01 Playwright `acceptDownloads` renames downloads to GUIDs and bypasses onDeterminingFilename → stand sets CDP `Browser.setDownloadBehavior {behavior:'default'}` + profile pref download.default_directory.
<!-- /MAP -->
## Handoff
W2-RELEASE issued: identity fix + history rewrite (Owner approved S3 in analyst chat 2026-10-13), metrics, release v0.1.0 via tag → GitHub Actions Release. Next after: W3-STORE (Web Store listing: screenshots 1280×800, promo 440×280, privacy form) — Owner stop S4 before submission.
