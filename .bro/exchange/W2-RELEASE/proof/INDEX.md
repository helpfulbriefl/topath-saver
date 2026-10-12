# PROOF W2-RELEASE

| # | requirement | proof file(s) | ok |
|---|---|---|---|
| 1 | P and SYS user.email = 210454348+helpfulbriefl@users.noreply.github.com; global config unchanged | `logs/identity.log` | ✅ |
| 2 | git log origin/main unique authors: no Apex4Coder, no Jany | `logs/rewrite.log` | ✅ |
| 3 | tag w1-init-done points to rewritten «W1-INIT: verified on Windows» commit | `logs/rewrite.log` | ✅ |
| 4 | SYS commit «metrics topath-saver W1-INIT/W2-RELEASE» pushed to helpfulbriefl, author helpfulbriefl | `logs/sys-metrics.log` | ✅ |
| 5 | npm run gates exit 0 after rewrite; download-*.txt start with ~\AppData\... (no user name) | `logs/gates.log` | ✅ |
| 6 | GitHub release v0.1.0 with topath-saver-0.1.0-chrome.zip + SHA256SUMS.txt, workflow Release = success | `logs/release.log` | ⏳ pending task 5 |

Extra: `logs/rewrite-before.txt`, `logs/rewrite-after.txt`, `logs/npm-ci.log`, `proof/download-images.txt`, `proof/download-autosort.txt`, `proof/download-custom.txt`, `proof/download-once.txt`, `proof/download-error.txt`, `proof/downloads-root.txt`, `proof/screens/*.png`, `proof/aria/*.yml`.