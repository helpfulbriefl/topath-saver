# MAP · topath-saver · updated 2026-10-12 by W1-INIT (analyst seed)
## §1 Project
ToPath Saver — Chrome MV3 extension, switch download subfolder in 2 clicks. WXT + React 19 + TS + Tailwind 4. Public, MIT.
<details><summary>§2 Anchors · PC ↔ git ↔ mirror</summary>

| what | PC | git | mirror |
|---|---|---|---|
| root | C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver | github.com/helpfulbriefl/topath-saver (public) | %LOCALAPPDATA%\BRO-MIRROR\topath-saver |
| system | C:\Users\BazaCode\AppData\Local\global-promt-system | github.com/helpfulbriefl/global-promt-system (private, own mirror) · upstream Apex4Coder/global-promt-system = read-only, never push | - |
</details>
<details><summary>§3 Stack · versions from lock</summary>

wxt 0.21.4 · @wxt-dev/module-react 1.2.2 · react/react-dom 19.3.0 · typescript 5.9.3 · tailwindcss + @tailwindcss/vite 4.3.3 · lucide-react 1.55.0 · vitest 4.1.11 · @playwright/test 1.64.0 · sharp 0.35.5 · qrcode 1.5.4 · Node ≥22 (CI 22). Rejected: Plasmo (stale), CRXJS, TS 7, Vitest 5.
</details>
<details><summary>§4 Invariants · don't touch · secrets (paths only) · ports · Legacy</summary>

- Only relative paths inside Downloads (chrome.downloads limit). Never `conflictAction: overwrite`.
- No network calls from the extension, no analytics, no remote code.
- Permissions exactly: downloads, storage, notifications.
- ETH address `0x50153B5CC3eae905291d62602226C80896Aa64f2` — in lib/config.ts, README, docs/eth-qr.svg (regen: `npm run qr`).
- public/icon/*.png generated from assets/icon.svg on postinstall (gitignored).
- Stand: 127.0.0.1 server on random port; isolated temp profile with its own Downloads.
- Secrets: none in project. GitHub auth = `gh` credential helper only.
</details>
<details><summary>§5 Decisions · active D only</summary>

D-01 BRO v3.0 · D-02 modes default + Documents/Images/Video/Archives + Custom, folders auto-created silently · D-03 no native helper · D-04 stack §3 · D-05 style Paper × AtomicCRM = M01–M05 · D-06 i18n EN default, RU, ZH_CN, ES, own selector · D-07 shortcuts on by default, toggle in settings, 4 suggested keys · D-08 public repo, README EN (Folio style) + RU · D-09 system mirror in helpfulbriefl, upstream read-only · D-10 analyst writes code via GitHub, coder verifies on Windows · D-11 coffee = ETH ERC-20 card (QR, copy, wallet link) in README + Settings · D-12 contacts t.me/yumi_acess, helpfulbriefl.github.io, «open to work» in README
</details>
<details><summary>§6 Owner prefs · P</summary>

P-01 light theme main, dark via toggle
P-02 minimal, calm «paper» look; no clutter
P-03 Owner-facing text RU; agent files EN
</details>
<details><summary>§7 Rakes · project G</summary>

G-P01 Playwright `acceptDownloads` renames downloads to GUIDs and bypasses onDeterminingFilename → stand sets CDP `Browser.setDownloadBehavior {behavior:'default'}` + profile pref download.default_directory.
</details>
<details><summary>§8 Mockups · M → screen → file</summary>

M01 main → MainView.tsx · M02 auto-sort → MainView.tsx · M03 custom → CustomView.tsx · M04 settings → SettingsView.tsx (+PresetView.tsx) · M05 dark → style.css `.dark`. Real screens: docs/screenshots/*.png
</details>
<details><summary>§9 Top files · path · role · imported by N</summary>

entrypoints/background.ts · SW router/badge/notify/commands · 0
lib/router.ts · routeFor · 1
lib/paths.ts · validate/fix/uniquify · 5
lib/state.ts · reducers · 3
lib/i18n.ts · 89 keys × 4 langs · 5
entrypoints/popup/App.tsx · views switch · 1
tests/stand/extension.spec.ts · real-build stand 01–07 · 0
</details>

## §10 Roadmap
W1-INIT=run:Проверка и запуск; W2-STORE=todo!:Web Store; W3-POLISH=todo:Полировка · next: W1-INIT
