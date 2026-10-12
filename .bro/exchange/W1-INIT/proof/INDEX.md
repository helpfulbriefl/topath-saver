# PROOF W1-INIT

| # | requirement | proof file(s) | ok |
|---|---|---|---|
| 1 | gh login = helpfulbriefl; ls-remote OK for topath-saver and global-promt-system | ../logs/preflight.log | ✅ |
| 2 | SYS origin = helpfulbriefl/global-promt-system; upstream push DISABLED; 0 Apex4Coder hits in md | ../logs/sys.log | ✅ |
| 3 | P is clone of helpfulbriefl/topath-saver; status clean after clone | ../logs/a-status.log | ✅ |
| 4 | npm run gates exit 0: tsc, vitest 38 pass, wxt build, stand 7/7 | ../logs/gates.log, ../logs/stand-docs.log | ✅ |
| 5 | download-*.txt show real Windows paths (Images, Documents, Work\Q4report, Video, setup.exe and clip2.mp4 in Downloads) | download-images.txt, download-autosort.txt, download-custom.txt, download-once.txt, download-error.txt, downloads-root.txt | ✅ |
| 6 | docs/screenshots has 7 png (m01-main, m01-images-selected, m02-auto-sort, m03-custom-error, m04-settings, m05-settings-dark, m05-main-dark) | ../../../docs/screenshots/ | ✅ |
| 7 | tag w1-init-done pushed, bro finish OK, metrics pushed to SYS | - | ❌ not yet (task 6) |

Extra files: screens/*.png, aria/m01-main.yml, aria/m04-settings.yml, trace.zip (copied from test-results/extension-02-*).
