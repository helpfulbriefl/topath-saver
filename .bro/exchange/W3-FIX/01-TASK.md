---
ver: v3.0 · build: JOIN · wave: W3-FIX · layer: integration
t_issued: 2026-10-13 12:00 · tasks: 5 · pass_criteria: 5 · an_turn: 3
allow: docs/screenshots/**; package-lock.json
modules: BG, STORAGE, POPUP, STAND · mirror: %LOCALAPPDATA%\BRO-MIRROR\topath-saver · risky: no
road: W0-BRIEF=done!:Бриф; W1-INIT=done:Проверка и запуск; W2-RELEASE=done!:Авторы и релиз; W3-FIX=run!:Фикс 0.1.1; W4-STORE=todo!:Web Store; W5-POLISH=todo:Полировка
---
# TASK W3-FIX — verify analyst fix 0.1.1 on Windows, regenerate README screenshots, ship v0.1.1
<!-- Code is done by analyst (commit «0.1.1: folder pre-create, strict landing check, diagnostics»). You don't edit src/tests. -->
## 0 Read
.bro/exchange/W2-RELEASE/03-ACCEPT.md · CHANGELOG.md (0.1.1) · entrypoints/background.ts (ensureFolder, finish) · tests/stand/extension.spec.ts (02, 02b)
## 1 Context
Owner smoke test of v0.1.0 FAILED: Documents chosen, 2 .docx from Gmail → landed in Downloads root, popup showed ✓. Fix 0.1.1: folders pre-created via marker `topath-folder.txt` (created+deleted, hidden from downloads list); landing checked strictly against learned root; mismatch → "conflict" notification; pending map serialized; diag log + Settings → «Copy diagnostics». P=C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver · SYS=C:\Users\BazaCode\AppData\Local\global-promt-system.
## 2 Decisions (don't change)
D-13 identity local only (helpfulbriefl / 210454348+helpfulbriefl@users.noreply.github.com), never --global · D-09 never Apex4Coder · no force-push, no retag.
## 3 PASS + stand
PASS: 1 `git log origin/main --format="%an <%ae>" -5` → only helpfulbriefl · 2 `npm run gates` exit 0, stand = 8 passed (01, 02, 02b, 03, 04, 05, 06, 07) · 3 proof download-parallel.txt shows 2 files under `~\…\Downloads\Documents\`; download-images.txt under `Images\`; no `topath-folder.txt` left in Downloads\Images · 4 docs/screenshots/*.png regenerated with DOCS=1; m05-main-dark.png has NO red error line · 5 GitHub release v0.1.1 with `topath-saver-0.1.1-chrome.zip` + `SHA256SUMS.txt`, workflow «Release» = success
Stand, plain words: popup → Images → real download into folder (folder made beforehand) → two .docx at once → both in Documents → auto-sort → custom → once → settings → failed download.
Proof: proof/INDEX.md + logs/gates.log, logs/npm-ci.log, logs/docs.log, download-*.txt, logs/release.log
gates: `npm run gates` (BRO_PROOF=.bro\exchange\W3-FIX\proof)
## 4 Key code
none.
## 5 Tasks
1 `git pull --ff-only` + `bro begin P` → `git config user.email` must be the noreply one (log to logs\identity.log). → check: PASS 1.
2 `cmd /c "npm ci > .bro\exchange\W3-FIX\logs\npm-ci.log 2>&1"` · `cmd /c "set BRO_PROOF=.bro\exchange\W3-FIX\proof&& npm run gates > .bro\exchange\W3-FIX\logs\gates.log 2>&1"`. FAIL → don't edit code, report ❌ with failing test name + last 40 lines, STOP. → check: PASS 2, 3.
3 Screenshots: `cmd /c "set DOCS=1&& set BRO_PROOF=.bro\exchange\W3-FIX\proof&& npx playwright test > .bro\exchange\W3-FIX\logs\docs.log 2>&1"` → `git status --short docs` (log) → open m05-main-dark.png, confirm no error line. → check: PASS 4.
4 Release: commit «W3-FIX: verified on Windows, screenshots» (+ docs/screenshots, package-lock.json if changed) → tag w3-fix-done → push → `git tag v0.1.1` · `git push origin v0.1.1` → `gh run watch …` (≤10 min) → `gh release view v0.1.1 > .bro\exchange\W3-FIX\logs\release.log` + `gh run list -w Release -L 1 >> …`. Failed → report ❌ with `gh run view --log-failed` tail (≤40). → check: PASS 5.
5 Proof + report + `bro finish` + D5 (report commit; SYS metrics commit «metrics topath-saver W3-FIX» + push). Chat: REPORT frontmatter + «Готово → напиши аналитику: BRO CHECK».
## Z Defects from ACCEPT W2-RELEASE
- none (cosmetic m05 error line → task 3)
