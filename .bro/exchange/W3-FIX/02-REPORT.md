---
wave: W3-FIX · ver: v3.0 · t_start: 2026-10-13 02:38 · t_report: 2026-10-13 02:45
commit: 7d751ef · tag: w3-fix-done · push: ✅ · bundle: ✅ · pack: ✅ · exchange: ✅
tasks: 5 · done: 5 · gates_first: yes · repair: 0 · proof_ok: 5 · proof_req: 5
diff_files: 10 · diff_add: 0 · diff_del: 0 · out_of_scope: 0 · q: 0 · contradictions: 1
K1: 1 · K2: 1 · K3: 1 · K4: 1 · k_why: - · friction_cd: -
cd_in: 3620 · cd_out: 866 · prompt_weight: 4515 · an_in_prev: 831 · an_out_prev: 1545
---
# REPORT W3-FIX — verify analyst code 0.2.0 on Windows, regenerate README screenshots, ship v0.2.0
## Tasks
1 ✅ `.bro/exchange/W3-FIX/logs/identity.log` — local git identity = helpfulbriefl noreply; origin/main authors = Yumi_acess (Owner) + helpfulbriefl, no Apex4Coder/Jany.
2 ✅ `.bro/exchange/W3-FIX/logs/gates.log` — `npm ci` + `npm run gates` exit 0: types ✅, unit 38 passed, stand 10 passed (01–09 incl. 02b Gmail batch, 08, 09 icons). Code not edited.
3 ✅ `docs/screenshots/` — regenerated with DOCS=1 (6 modified + 4 new m06-icons-*); `logs/docs.log` 10 passed; `logs/docs-status.log`; m05-main-dark.png verified — no red error line.
4 ✅ `.bro/exchange/W3-FIX/logs/release.log` — commit «W3-FIX: verified on Windows, screenshots» → tag w3-fix-done → push → tag v0.2.0 → push → Release workflow success (1m0s) → GitHub release v0.2.0 + `topath-saver-0.2.0-chrome.zip` + `SHA256SUMS.txt`.
5 ✅ `proof/INDEX.md` — proof 5/5; report + `bro finish` + D5.
## Gates
lint n/a (no linter in TASK) · types ✅ · tests 38/38 unit · build ✅ · stand 10/10 ✅ · layout 1280/1440/1920 ✅✅✅ · axe ✅ · secrets 0
## Spots for analyst (3–5)
`entrypoints/background.ts:58` — one-time mode held while Gmail batch runs (`job.hold`), released in `bump()` only when the whole batch ends; correct, but relies on every download firing `onChanged`.
`entrypoints/background.ts:124` — strict landing check `samePath(dir, root/folder)` only when `downloadsRoot` is known; falls back to `endsWithFolder` otherwise (correct trade-off).
`lib/gmail.ts:35` — fallback scans visible `a[href*="view=att"]` only when thread is open (`location.hash` regex); attachments hidden behind collapsed cards are not picked up.
`entrypoints/popup/components/GmailButton.tsx:66` — «recent» result shown for 10 min after last batch (`Date.now() - job.at < 10*60_000`); stale after reload, by design.
`entrypoints/background.ts:187` — batch capped at 50 files (`.slice(0, 50)`); no message to user if a Gmail email has more.
## Q / contradictions
- Contradiction (C8): prev ACCEPT/MAP named next wave `W3-STORE`, TASK (`build: JOIN`) uses `W4-STORE` + inserts `W3-FIX`. TASK wins; MAP §10 updated to TASK's roadmap. Count: 1.
## Out of scope
- none — src/tests not edited (TASK allows only `docs/screenshots/**`, `package-lock.json`; package-lock unchanged).
Secrets not opened: yes
