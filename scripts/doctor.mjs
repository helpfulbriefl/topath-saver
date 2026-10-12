// Prints environment facts that matter for gates. Safe: no secrets, no network.
import fs from 'node:fs';
import path from 'node:path';
const v = (m) => { try { return JSON.parse(fs.readFileSync(`node_modules/${m}/package.json`, 'utf8')).version; } catch { return 'missing'; } };
const up = [];
for (let d = path.dirname(process.cwd()); ; d = path.dirname(d)) {
  for (const f of ['node_modules', 'package.json', 'vitest.config.ts', 'vitest.workspace.ts']) if (fs.existsSync(path.join(d, f))) up.push(path.join(d, f));
  if (path.dirname(d) === d) break;
}
const out = {
  node: process.version, platform: `${process.platform} ${process.arch}`,
  cwd: process.cwd(), realpath: fs.realpathSync.native(process.cwd()),
  vitest: v('vitest'), '@vitest/runner': v('@vitest/runner'), wxt: v('wxt'), '@playwright/test': v('@playwright/test'), playwright: v('playwright'),
  build: fs.existsSync('.output/chrome-mv3/manifest.json'),
  vitestCopies: fs.readdirSync('node_modules', { recursive: true }).filter((p) => /(^|[\\/])vitest[\\/]package\.json$/.test(String(p))).length,
  parentsWithNodeStuff: up,
  NODE_OPTIONS: process.env.NODE_OPTIONS ?? '', VITEST: process.env.VITEST ?? '',
};
console.log(JSON.stringify(out, null, 2));
