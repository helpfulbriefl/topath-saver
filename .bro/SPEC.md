# SPEC · topath-saver · frozen after W0/W2, change only via D-xx
## §1 Goal
Chrome MV3 extension: switch the download subfolder in 2 clicks (popup) or 1 shortcut. Public repo, Web Store later.
## §2 Users + v1 scenario (user's eyes)
User clicks toolbar icon → sees 6 rows (Chrome default, Documents, Images, Video, Archives, Custom) → clicks Images → badge IMG → downloads any jpg → file is in Downloads/Images; status line «photo.jpg → Images/ · just now». Auto-sort checkbox routes by type; «Only for the next download» = one-shot.
## §3 Scope · in / out
in: 4 presets + custom (relative to Downloads, auto-create), auto-sort, once, editable presets, shortcuts Alt+Shift+1..4 (toggle), badge, error notifications (Retry/Open folder/Show file), i18n EN(default)/RU/ZH_CN/ES own selector, light + dark toggle, support card ETH + links.
out: paths outside Downloads (no native helper, D-03), cloud sync, per-site rules (v2 idea), analytics, any network.
## §4 Data + contracts
`chrome.storage.local.state` = lib/types.ts `State` v1 (mode, presets[4], customFolder, recentCustom≤5, autoSort, once, settings{lang,theme,shortcuts,badge,notifyErrors}, last{file,folder,status,at,id}, downloadsRoot). Pending routes: `chrome.storage.session`. Router: lib/router.ts `routeFor(state, item)` → relative folder | null. Path rules: lib/paths.ts (forbidden `<>:"|?*`, no abs/drive/.., reserved Win names, ≤ 8 levels).
## §5 Screens → Mxx
M01 main · M02 auto-sort on · M03 custom folder + validation · M04 settings + support · M05 dark. Style P-02 «Paper × AtomicCRM».
## §6 Non-functional
Chrome ≥116, unpacked ≤ 400 KB, popup opens < 150 ms, no network, a11y: radiogroup/switch/alert roles, keyboard nav, contrast AA. Win11 primary, works on Linux/macOS.
## §7 Acceptance = S4 scenario on real build
`npm run gates` green on Windows: Playwright loads .output/chrome-mv3 into real Chromium, real downloads from 127.0.0.1 land in Downloads/<Preset>/ (tests/stand/extension.spec.ts 01–07).
