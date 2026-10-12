# PROOF W1-INIT

| # | requirement | proof file(s) | ok |
|---|---|---|---|
| 1 | gh login = helpfulbriefl; ls-remote OK for topath-saver and global-promt-system | `logs/preflight.log` | ✅ |
| 2 | SYS origin = helpfulbriefl/global-promt-system; upstream push DISABLED; 0 Apex4Coder hits in md | `logs/sys.log` | ✅ |
| 3 | P is clone of helpfulbriefl/topath-saver; status clean after clone | `logs/a-status.log` | ✅ |
| 4 | npm run gates: tsc, vitest 38 pass, wxt build, stand 7/7 | `logs/gates.log` | ✅ |
| 5 | download-*.txt show real Windows paths (Images, Documents, Work/Q4report, Video, setup.exe and clip2.mp4 in Downloads) | `proof/download-images.txt` | ✅ |
| 6 | docs/screenshots has 7 png (m01-main, m01-images-selected, m02-auto-sort, m03-custom-error, m04-settings, m05-settings-dark, m05-main-dark) | `docs/screenshots/m01-main.png` | ✅ |
| 7 | tag w1-init-done pushed, bro finish OK, metrics pushed to SYS | - | ❌ not yet (task 6) |

Extra files: `proof/screens/*.png`, `proof/aria/m01-main.yml`, `proof/aria/m04-settings.yml`, `proof/trace.zip` (copied from test-results/extension-02-*), `proof/download-autosort.txt`, `proof/download-custom.txt`, `proof/download-error.txt`, `proof/download-once.txt`, `proof/downloads-root.txt`.
