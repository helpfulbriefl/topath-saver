---
ver: v3.0 · build: JOIN · wave: W1-INIT · layer: integration
t_issued: 2026-10-12 21:30 · tasks: 6 · pass_criteria: 7 · an_turn: 1
allow: docs/screenshots/**; package-lock.json
modules: STAND · mirror: %LOCALAPPDATA%\BRO-MIRROR\topath-saver · risky: no
road: W0-BRIEF=done!:Бриф; W1-INIT=run:Проверка и запуск; W2-STORE=todo!:Web Store; W3-POLISH=todo:Полировка
---
# TASK W1-INIT — check access, move SYS to own mirror, clone project, prove it works on Windows
<!-- Analyst already wrote ALL code (D-10). You verify on Windows, make proof, commit screenshots. Do NOT edit code. -->
## 0 Read
.bro/MAP.md · .bro/SPEC.md · .bro/LOG.md (L-001) · README.md · package.json · tests/stand/extension.spec.ts (after task 3 clone)
## 1 Context
ToPath Saver — Chrome MV3 extension, switch download subfolder in 2 clicks. P=C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver. SYS=C:\Users\BazaCode\AppData\Local\global-promt-system. Win11/PowerShell. Stack (verified, lock): WXT 0.21.4, React 19.3, TS 5.9.3, Tailwind 4.3.3, Vitest 4.1.11, Playwright 1.64.0, Node ≥22. Last accepted: none (first wave). Repo https://github.com/helpfulbriefl/topath-saver (public). System mirror https://github.com/helpfulbriefl/global-promt-system (private, OUR copy). Remote mirror: none.
Account: everything is **helpfulbriefl**. `Apex4Coder` = other owner: read-only upstream, never push, never log in as it.
Order note (C8): P is empty except `.bro` (the 01-TASK you saved + first `bro init` output); the repo already has this same TASK + MAP/SPEC/LOG/NEXT → clone first (task 3), then `bro init` / `bro begin`.
## 2 Decisions (don't change)
D-01 BRO v3.0 · D-03 no native helper · D-04 stack as lock · D-09 SYS = own mirror helpfulbriefl, upstream Apex4Coder read-only · D-10 analyst writes code, coder verifies · P-03 chat to Owner in RU
## 3 PASS + stand
PASS: 1 `gh api user --jq .login` = `helpfulbriefl`; `git ls-remote` OK for helpfulbriefl/topath-saver AND helpfulbriefl/global-promt-system · 2 SYS `origin` = helpfulbriefl/global-promt-system, `upstream` push URL = DISABLED, 0 hits of `Apex4Coder/global-promt-system` in SYS\*.md · 3 P is a clone of helpfulbriefl/topath-saver, `git status` clean after clone · 4 `npm run gates` exit 0 on Windows (tsc · vitest 38 pass · wxt build · stand 7/7) · 5 download-*.txt show real Windows paths: `…\Downloads\Images\photo.jpg`, `…\Downloads\Documents\report.pdf`, `…\Downloads\Work\Q4report\notes.txt`, `…\Downloads\Video\clip.mp4`; `setup.exe` and `clip2.mp4` directly in `…\Downloads\` · 6 `docs/screenshots/` has 7 png (m01-main, m01-images-selected, m02-auto-sort, m03-custom-error, m04-settings, m05-settings-dark, m05-main-dark), committed · 7 tag `w1-init-done` pushed, `bro finish` OK, metrics pushed to helpfulbriefl SYS
Stand, plain words: Playwright opens the REAL build in real Chromium → sees popup with 6 rows → clicks Images → badge IMG → real download from 127.0.0.1 lands in Downloads\Images → auto-sort pdf → Documents → custom `Work/Q4:report?` shows error, Fix automatically, Save → file in Work\Q4report → once: Video for one file then default → broken URL → error status → settings: 4 languages, dark theme, ETH card, reset.
Proof: proof/INDEX.md + logs/preflight.log, logs/sys.log, logs/gates.log, logs/stand-docs.log, download-*.txt (5), downloads-root.txt, screens/*.png (7), aria/m01-main.yml, aria/m04-settings.yml, trace.zip
gates: `npm run gates` (with BRO_PROOF=.bro\exchange\W1-INIT\proof)
## 4 Key code (paste VERBATIM)
none — all code is in the repo. Do not change any file outside `allow` + `.bro\`.
## 5 Tasks
1 Preflight (read-only) → `.bro\exchange\W1-INIT\logs\preflight.log` (create the folder in %TEMP% first if P has no clone yet; copy into P after task 3) + table «check · result» in REPORT:
   `node -v` (≥22, else `winget install -e --id OpenJS.NodeJS.LTS`) · `npm -v` · `git --version` · `git config --global credential.helper` · `gh --version` (missing → `winget install -e --id GitHub.cli`, reopen terminal) · `gh auth status` · `gh api user --jq .login` · `gh auth setup-git` · `git ls-remote https://github.com/helpfulbriefl/topath-saver HEAD` · `git ls-remote https://github.com/helpfulbriefl/global-promt-system HEAD` · `Test-Path "$env:LOCALAPPDATA\global-promt-system\tools\bro.ps1"`.
   Not logged in / login ≠ helpfulbriefl / ls-remote 403·404 → `gh auth login --hostname github.com --git-protocol https --web` → chat to Owner: «Открой https://github.com/login/device, войди как helpfulbriefl, введи код XXXX-XXXX» → wait → `gh auth setup-git` → rerun checks.
   Still no access to any helpfulbriefl repo → STOP, chat exactly: «СТОП: нет доступа к helpfulbriefl/<repo> (код ошибки …) — Owner, проверь вход в GitHub» and wait. Never print tokens (C2), never switch to Apex4Coder.
   → check: login line = helpfulbriefl, both ls-remote print a hash.
2 SYS → own mirror → `logs\sys.log`:
   `$SYS="$env:LOCALAPPDATA\global-promt-system"` · `git -C $SYS status --short` · `git -C $SYS remote -v` (log both) · `Rename-Item $SYS global-promt-system.apex-old` · `git clone https://github.com/helpfulbriefl/global-promt-system $SYS` · `git -C $SYS remote add upstream https://github.com/Apex4Coder/global-promt-system` · `git -C $SYS remote set-url --push upstream DISABLED` · `robocopy "$SYS.apex-old\metrics" "$SYS\metrics" /E /XC /XN /XO` (adds only missing files; exit code <8 = OK) · `git -C $SYS remote -v` · `Select-String -Path "$SYS\*\*.md","$SYS\*.md" -Pattern "Apex4Coder/global-promt-system"` (expect 0). Keep `.apex-old` folder (Owner decides later).
   → check: origin fetch+push = helpfulbriefl, upstream push = DISABLED, bro.ps1 exists in new SYS.
3 Project into P:
   `$P="C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver"` · `Get-ChildItem -Force $P` → anything except `.bro` → move to `$env:TEMP\topath-first-extra`, list in REPORT as Q-01 · `Move-Item "$P\.bro" "$env:TEMP\topath-bro-first"` · `git clone https://github.com/helpfulbriefl/topath-saver $P` · `fc.exe "$env:TEMP\topath-bro-first\exchange\W1-INIT\01-TASK.md" "$P\.bro\exchange\W1-INIT\01-TASK.md"` (differs → repo wins, note in REPORT) · copy preflight.log + sys.log into `$P\.bro\exchange\W1-INIT\logs\` · `bro init $P W1-INIT JOIN` · `bro begin $P` · `git -C $P status` → `logs\a-status.log`.
   → check: `git -C $P remote get-url origin` = https://github.com/helpfulbriefl/topath-saver(.git).
4 Install + gates + stand (from P, logs via C5):
   `cmd /c "npm ci > .bro\exchange\W1-INIT\logs\npm-ci.log 2>&1"` · `cmd /c "npx playwright install chromium > .bro\exchange\W1-INIT\logs\pw-install.log 2>&1"` · `cmd /c "set BRO_PROOF=.bro\exchange\W1-INIT\proof&& npm run gates > .bro\exchange\W1-INIT\logs\gates.log 2>&1"` · `cmd /c "set DOCS=1&& npm run stand > .bro\exchange\W1-INIT\logs\stand-docs.log 2>&1"` · copy `test-results\extension-02-*\trace.zip` → `.bro\exchange\W1-INIT\proof\trace.zip`.
   FAIL → do NOT edit code (not in allow): max 2 reruns (flaky), then report ❌ with the failing test name + first error lines from gates.log in REPORT. `npm ci` changes package-lock.json → keep, mention in REPORT.
   → check: gates.log ends with `7 passed`, exit 0; `docs\screenshots\` has 7 png.
5 Proof + report: `proof\INDEX.md` rows = PASS 1–7 with files from §3 Proof (✅ only if file exists and shows it) · copy 5 `download-*.txt` lines into REPORT · fill `02-REPORT.md` keys marked `you` · Owner check for later (not blocking): Owner can load `P\.output\chrome-mv3` via chrome://extensions → Load unpacked.
   → check: every ✅ row points to an existing file.
6 Ship: D3 `git add -A` · `git commit -m "W1-INIT: verified on Windows, README screenshots"` · `git tag w1-init-done` · `git push -u origin HEAD` · `git push origin --tags` → D4 `bro finish $P` (fix what it lists) → D5 commit report + push; before SYS push run `git -C $SYS remote get-url --push origin` — must contain helpfulbriefl, else STOP. Do NOT create `v*` tags (release = analyst after ACCEPT).
   → check: `git ls-remote --tags origin w1-init-done` prints hash; GitHub Actions «Checks» started (`gh run list -L 1`).
## Z Defects from ACCEPT -
- none
