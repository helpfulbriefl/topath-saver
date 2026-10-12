---
ver: v3.0 · build: JOIN · wave: W2-RELEASE · layer: integration
t_issued: 2026-10-13 00:30 · tasks: 6 · pass_criteria: 6 · an_turn: 2
allow: tests/stand/extension.spec.ts; package-lock.json
modules: STAND · mirror: %LOCALAPPDATA%\BRO-MIRROR\topath-saver · risky: yes
road: W0-BRIEF=done!:Бриф; W1-INIT=done:Проверка и запуск; W2-RELEASE=run!:Авторы и релиз; W3-STORE=todo!:Web Store; W4-POLISH=todo:Полировка
---
# TASK W2-RELEASE — fix commit authorship (no Apex4Coder), push metrics, ship v0.1.0 release
<!-- Code is done. tests/stand/extension.spec.ts in allow only because analyst changed it (home → ~ masking); you don't edit it. -->
## 0 Read
.bro/exchange/W1-INIT/03-ACCEPT.md (Z, MAP block) · .bro/MAP.md §2 §4 §7 · .github/workflows/release.yml
## 1 Context
ToPath Saver, Chrome MV3. P=C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver · SYS=C:\Users\BazaCode\AppData\Local\global-promt-system (clone of helpfulbriefl/global-promt-system). Win11/PowerShell. Last accepted: W1-INIT @a43d9c8 tag w1-init-done (PARTIAL). Repo https://github.com/helpfulbriefl/topath-saver. `gh` active = helpfulbriefl (Apex4Coder stays inactive in keyring — don't touch, don't use).
## 2 Decisions (don't change)
D-13 identity per repo = `helpfulbriefl` / `210454348+helpfulbriefl@users.noreply.github.com`, local config only, NEVER `git config --global` · D-09 never push to Apex4Coder · S3 approved by Owner (analyst chat 2026-10-13): ONE-TIME exception to C3 for task 2 only — `git rebase` + `git push --force-with-lease` on main and `-f` for tag w1-init-done. Nothing else forced.
## 3 PASS + stand
PASS: 1 `git -C P config user.email` and `git -C SYS config user.email` = `210454348+helpfulbriefl@users.noreply.github.com`; `git config --global user.email` unchanged (log before/after) · 2 `git log origin/main --format="%an <%ae>" | Sort-Object -Unique` → no line contains `Apex4Coder` or `Jany` · 3 tag w1-init-done points to the rewritten «W1-INIT: verified on Windows» commit · 4 SYS: commit «metrics topath-saver W1-INIT/W2-RELEASE» on helpfulbriefl/global-promt-system, author helpfulbriefl · 5 `npm run gates` exit 0 after rewrite; proof download-*.txt start with `~\AppData\…` (no user name) · 6 GitHub release v0.1.0 exists with `topath-saver-0.1.0-chrome.zip` + `SHA256SUMS.txt`, workflow «Release» = success
Stand, plain words: same 7 steps as W1 (popup → Images → real download → auto-sort → custom → once → error → settings) on the real build after the history rewrite.
Proof: proof/INDEX.md + logs/identity.log, logs/rewrite.log (before/after author list, old→new hashes), logs/sys-metrics.log, logs/gates.log, download-*.txt, logs/release.log (`gh release view v0.1.0` + `gh run list -w Release -L 1`)
gates: `npm run gates` (BRO_PROOF=.bro\exchange\W2-RELEASE\proof)
## 4 Key code (paste VERBATIM)
none (analyst already pushed stand change). Commands for task 2 — run exactly, in P, after task 1:
```powershell
git fetch origin
git status --short                     # must be empty; else commit .bro files first ("W2-RELEASE: begin")
git log --format="%h %an <%ae> %s" 9a94045..HEAD > .bro\exchange\W2-RELEASE\logs\rewrite-before.txt
git rebase 9a94045 --exec "git commit --amend --no-edit --reset-author"
git log --format="%h %an <%ae> %s" 9a94045..HEAD > .bro\exchange\W2-RELEASE\logs\rewrite-after.txt
$c = git log --format=%H --grep "W1-INIT: verified on Windows" -1
git tag -f w1-init-done $c
git push --force-with-lease origin HEAD:main
git push -f origin w1-init-done
```
Conflict or error inside rebase → `git rebase --abort`, STOP, chat «СТОП: переписывание авторов не прошло — нужен аналитик» + rewrite logs.
## 5 Tasks
1 Identity → logs\identity.log: `git config --global user.email` (log, don't change) · in P and SYS: `git config user.name helpfulbriefl` · `git config user.email 210454348+helpfulbriefl@users.noreply.github.com` · print both back. → check: PASS 1.
2 Rewrite authors (§4 commands, after `git pull --ff-only` + `bro begin P`) → logs\rewrite.log = before/after files + `git log origin/main --format="%an <%ae>" | Sort-Object -Unique`. → check: PASS 2, 3.
3 SYS metrics (Z-02): `git -C $SYS status --short` → `git -C $SYS add metrics` → commit «metrics topath-saver W1-INIT/W2-RELEASE» → `git -C $SYS remote get-url --push origin` contains helpfulbriefl → `git -C $SYS push` → logs\sys-metrics.log. → check: PASS 4.
4 Gates (also Z-03): append to `.bro\exchange\W1-INIT\logs\preflight.log` one correct line: `Test-Path "$env:LOCALAPPDATA\global-promt-system\tools\bro.ps1"` → True · `cmd /c "npm ci > .bro\exchange\W2-RELEASE\logs\npm-ci.log 2>&1"` · `cmd /c "set BRO_PROOF=.bro\exchange\W2-RELEASE\proof&& npm run gates > .bro\exchange\W2-RELEASE\logs\gates.log 2>&1"`. FAIL → don't edit code, report ❌, skip task 5. → check: PASS 5.
5 Release: commit + push wave files first (D3: commit «W2-RELEASE: authors fixed, gates», tag w2-release-done, push) → `git tag v0.1.0` · `git push origin v0.1.0` → wait ≤10 min: `gh run watch $(gh run list -w Release -L 1 --json databaseId -q ".[0].databaseId")` → `gh release view v0.1.0 > .bro\exchange\W2-RELEASE\logs\release.log` + `gh run list -w Release -L 1 >> …release.log`. Release failed → don't retag, report ❌ with `gh run view --log-failed` tail (≤40 lines). → check: PASS 6.
6 Proof + report + `bro finish` + D5 (report commit, SYS metrics push again if bro finish changed metrics). Chat: REPORT frontmatter + «Готово → напиши аналитику: BRO CHECK».
## Z Defects from ACCEPT W1-INIT
- Z-01 Apex4Coder authorship → tasks 1–2
- Z-02 metrics not in SYS → task 3
- Z-03 preflight Test-Path line → task 4
