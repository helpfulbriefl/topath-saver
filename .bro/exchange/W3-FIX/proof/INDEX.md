# PROOF W3-FIX

Evidence repaired in W4-STORE on 2026-10-13: recovered actual local logs, normalized UTF-8 and removed ANSI/user-home paths; retained historical errors. Historical process exit codes were not present and are not reconstructed. Fresh W4 gate execution explicitly recorded exit 0.

| # | requirement | proof file(s) | ok |
|---|---|---|---|
| 1 | Historical authors and configured identity (Owner commits preserved) | [identity-author](../logs/identity-author.log), [identity and original command errors](../logs/identity.log) `../logs/identity-author.log` `../logs/identity.log` | ✅ |
| 2 | Actual W3 gate log: 38 unit + 10 stand; fresh W4 rerun records exit 0 | [W3 gates](../logs/gates.log), [W4 exit code](../../W4-STORE/proof/gates-exit.txt), [W4 gates](../../W4-STORE/logs/gates.log), [npm ci](../logs/npm-ci.log) `../logs/gates.log` `../logs/npm-ci.log` `../../W4-STORE/proof/gates-exit.txt` `../../W4-STORE/logs/gates.log` | ✅ |
| 3 | Real downloads: Images, Documents (parallel 2), Gmail batch | [Images](download-images.txt), [parallel](download-parallel.txt), [Gmail batch](download-gmail-all.txt) `download-images.txt` `download-parallel.txt` `download-gmail-all.txt` | ✅ |
| 4 | Actual DOCS run: 10 passed; regenerated dark screenshot | [docs log](../logs/docs.log), [docs status](../logs/docs-status.log), [dark capture](../../../../docs/screenshots/m05-main-dark.png) `../logs/docs.log` `../logs/docs-status.log` `docs/screenshots/m05-main-dark.png` | ✅ |
| 5 | Release v0.2.0 assets and independently fetched successful workflow (38/10) | [W3 release](../logs/release.log), [run metadata](../../W4-STORE/logs/gh-run.log), [actual gate excerpt](../../W4-STORE/proof/release-gates.txt) `../logs/release.log` `../../W4-STORE/logs/gh-run.log` `../../W4-STORE/proof/release-gates.txt` | ✅ |
