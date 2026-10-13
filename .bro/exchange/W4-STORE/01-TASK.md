---
ver: v3.0 · build: JOIN · wave: W4-STORE · layer: integration
t_issued: 2026-10-13 10:30 UTC · tasks: 4 · pass_criteria: 5
allow: docs/store/**; scripts/store-assets.mjs; PRIVACY.md; README.md (intro no-network phrase only)
modules: STAND, METRICS · mirror: %LOCALAPPDATA%\BRO-MIRROR\topath-saver · risky: no
road: W3-FIX=done:PARTIAL proof; W4-STORE=run!:Web Store; W5-POLISH=todo:Полировка
---
# TASK W4-STORE — repair evidence + prepare store upload kit (no publication)
## 0 Read
.bro/exchange/W3-FIX/03-ACCEPT.md; README.md; README.ru.md; PRIVACY.md; tests/stand/extension.spec.ts; this TASK.
Official references: https://developer.chrome.com/docs/webstore/images ; https://developer.chrome.com/docs/webstore/cws-dashboard-privacy . Verified: screens 1280x800 preferred (640x400 also accepted); small promo 440x280 required; PNG icon 128x128 with 96x96 art and transparent margin. Privacy needs single purpose, every permission, remote-code declaration, consistent data-use disclosures.
## 1 Anchors / invariants
P=C:\Users\BazaCode\Desktop\cody-proj\win-utils\topath-saver
SYS=C:\Users\BazaCode\AppData\Local\global-promt-system
Identity LOCAL P+SYS = helpfulbriefl <210454348+helpfulbriefl@users.noreply.github.com>. No global config, force-push, retag, source/tests edits, new dependencies, registration, payment, store submission, Google login or collecting real mailbox screenshots.
Version stays 0.2.0. Original release ZIP immutable. Owner registers developer account and pays any fee himself. Produce files/checklist only.
## 2 PASS
1 W3 Z-01 resolved: actual sanitized UTF-8 logs in GitHub, INDEX links work; gates exit 0 with 38 unit and 10 stand; identity correct; release workflow status independently shown. Secrets not logged.
2 4 PNG screens exactly 1280x800, small promo 440x280, icon 128x128; no clipped source UI, overlap, fake data or unsupported claims. Inspect each output + 640x400 downscale; screenshot text readable. Proof dimensions table + visual QA notes.
3 listing-en.md, listing-ru.md, listing-zh-CN.md, listing-es.md, title ToPath Saver, summary <=132 characters, detailed description and relevant caveats.
4 privacy-practices.md reflects built manifest's FIVE permissions, no host_permissions/remote code, local settings/diagnostics, Gmail attachment links accessed transiently. Policy resolves Z-02. Public policy URL: https://github.com/helpfulbriefl/topath-saver/blob/main/PRIVACY.md (verify accessible).
5 upload-checklist.md + files-index.md + SHA256SUMS.txt for store materials; original release ZIP downloaded and its existing SHA checked; no live store submission.
## 3 Tasks
### 1 Evidence repair (must complete first)
Pull --ff-only; bro begin P; verify local identity. Apply previous ACCEPT LOG/MAP blocks via BRO. Do not silently edit older LOG entries.
Existing local W3 logs: identity.log, identity-author.log (if used), npm-ci.log, gates.log, docs.log, docs-status.log, release.log. Inspect for secrets, sanitize paths only if needed; preserve results/errors/exit codes. git add -f these specific safe log files; repair W3 proof/INDEX.md links. Never force-add whole directory blindly.
Missing actual logs -> rerun npm ci, npm run gates (BRO_PROOF=W4 proof), DOCS=1 playwright only if docs evidence missing. Record every exit code. Do not rebuild a fictional old log. Report date/base of rerun. Gates fail -> report actual error+last40 lines and STOP (no store assets, no code fixes).
Capture gh release view v0.2.0; gh run list --workflow release.yml --limit 5; gh run view appropriate v0.2.0 run --log (sanitized). Record exact run ID, commit, conclusion and 38/10 counts. Never assume latest run is the release run. No workflow rerun required when existing evidence is available.
### 2 Store assets (deterministic, reuse real captures)
Generate with existing sharp + SVG layout/text only, no new packages. Optional reproducible generator scripts/store-assets.mjs. Outputs docs/store/assets/.
Design: paper #F9F8F7, text #2C2C2B, blue #2783DE; Arial/system sans, ample whitespace, no stock art/badges/ratings. Full-bleed rectangular 1280x800 canvas, left text x64 width600, right actual capture centered x850,y400. Heading 48px, body 28px, max 3 short lines. Preserve source aspect, never crop UI. Keep all content inside 64px outer safe area. Thin border instead of heavy shadow. No invented Gmail inbox/attachment example.
01-folders.png: docs/screenshots/m01-images-selected.png (native 340x560); heading “Your downloads. Your folders.”; body “Choose a folder in two clicks.” / “Files stay inside Downloads.”
02-auto-sort.png: m02-auto-sort.png; heading “Sort by file type.”; body “Documents, images, video and archives.”
03-icon-styles.png: actual m06-icons-lucide.png + m06-icons-fluent3d.png. Place two source images side-by-side at native 340x600: x520 and x880, y100; text block x64 width400, heading 44px “Make it yours.”; body 26px “Four icon styles.” / “Light and dark themes.” Wrap text; no stretching.
04-dark.png: m05-main-dark.png; dark canvas #191919, white text; heading “One download. Or your next batch.”; body “One-time mode returns to your previous folder.” Note Gmail feature in listing, not fake screenshot.
small-promo.png 440x280: paper canvas; real project icon at x32,y88,96x96; text block x152,y80,width256; ToPath Saver 30px, subtitle 20px “Downloads, organized.” No Google logo, no unrelated artwork.
icon-128.png: use existing generated icon/128.png if compliant; otherwise place existing project's SVG artwork into 96x96 center of transparent 128x128. Do not redesign app icon or modify source icon.
Open every generated PNG individually and note one concrete QA observation. Also inspect each 640x400 downscale, check readable headings and no clipping/overlaps. Fix failures before PASS. Do not claim visual QA without inspection. Write proof/store-assets.txt with dimensions+QA results.
### 3 Listing + honest privacy
Write docs/store/listing-{en,ru,zh-CN,es}.md. Use approved copy below, localize faithfully, no added marketing promises. Title stays “ToPath Saver”. Summary translations <=132 characters; record lengths in proof.
EN summary: “Choose download folders in two clicks. Auto-sort files, save visible Gmail attachments, and use keyboard shortcuts.”
RU summary: “Папки для загрузок в два клика. Авторазбор файлов, сохранение видимых вложений Gmail и горячие клавиши.”
ZH-CN summary: “两次点击选择下载文件夹。按类型自动分类文件，保存 Gmail 中可见的附件，并使用键盘快捷键。”
ES summary: “Elige carpetas en dos clics. Clasifica archivos, guarda adjuntos visibles de Gmail y usa atajos de teclado.”
Detailed EN master (translate into each output; English can use verbatim):
“Keep your downloads organized inside Chrome's Downloads folder. Select Documents, Images, Video, Archives or your own relative subfolder. Selecting a folder does not start a download.
- Auto-sort new downloads by file type.
- Save visible attachments from the open Gmail email as separate files with Download all from Gmail (up to 50 per batch).
- Use one-time mode for one download or one Gmail batch, then return to the previous folder.
- Switch with keyboard shortcuts. Customize language, light/dark theme and four icon styles.
Settings and diagnostics stay locally on your device. No analytics, tracking or developer-server requests. Gmail files are downloaded by Chrome from Google when you click the action.
Chrome 116 or later. Folders must be inside Downloads. The extension does not move files already downloaded. Gmail discovery depends on visible attachments in the open message; hidden/collapsed attachments may not be found. Other extensions or browser settings can affect download routing.
Support: https://github.com/helpfulbriefl/topath-saver/issues
Privacy: https://github.com/helpfulbriefl/topath-saver/blob/main/PRIVACY.md”
Z-02 exact documentation edits:
PRIVACY.md bullet beginning “**No network requests.**” -> “**No developer-server requests.** The extension has no analytics, telemetry, ads or remote code and does not send data to developer servers. When you click Download all from Gmail, Chrome downloads the selected visible attachments from Google using your existing browser session.”
PRIVACY activeTab+scripting sentence ending “nothing is stored or sent anywhere.” -> “Email text is not read. Attachment links are used transiently to start the requested downloads; they are not sent to developer servers.” Preserve accurate remaining policy paragraphs. Update policy date to actual edit date.
README.md intro phrase “no tracking, no network, no setup.” -> “no tracking, no developer-server requests, no setup.” Do not rewrite other README content.
privacy-practices.md: single purpose = organize new Chrome downloads into user-selected subfolders, including user-initiated Gmail attachment downloads. Justify downloads (routing/start/open requested downloads), storage (local preferences/job state/diagnostics), notifications (failure/conflict alerts), activeTab (temporary access to current Gmail tab after extension invoked), scripting (discover visible attachment links on that tab). No host_permissions. Remote code = No. No collection/transmission to developer; explain local download filenames/history metadata and transient Gmail links rather than saying no data ever accessed. List certifications for Owner to read/confirm himself, not prechecked in a remote account.
### 4 Package / handoff / report
Download original released topath-saver-0.2.0-chrome.zip + SHA256SUMS.txt, verify SHA. Do not commit extension ZIP redundantly: docs/store/files-index.md points to original release asset. Store material SHA256SUMS covers delivered assets/listing/privacy/checklist (exclude itself). Upload-checklist: account/fee Owner-only; create item; original ZIP; 4 screenshots+promo+icon; paste localized listing+privacy URL; review permission answers/certifications; preview; submit only when Owner chooses. No guarantee of approval or fee quote without current verification.
Commit source/docs/evidence under local identity, tag w4-store-done, push; no v0.2.0 tag change. REPORT links every proof file, actual gates counts, asset dimensions, policy diff, original ZIP SHA; bro finish; SYS metrics commit “metrics topath-saver W4-STORE” + push. Include Owner-facing handoff in Russian: “Материалы готовы; регистрация/оплата/публикация не выполнялись. Напиши аналитику: BRO CHECK”.
## Z
Z-01 missing ignored Windows logs -> task1.
Z-02 blanket no-network claim -> task3. No application-code changes.
