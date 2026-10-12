/**
 * Human-like stand on the REAL build (.output/chrome-mv3) with REAL downloads from a local server.
 * Proof → $BRO_PROOF (default test-results/proof). DOCS=1 also writes README screenshots to docs/screenshots.
 */
import { test as base, expect, chromium, type BrowserContext, type Page, type Worker } from '@playwright/test';
import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';

const EXT = path.resolve('.output/chrome-mv3');
if (!fs.existsSync(path.join(EXT, 'manifest.json'))) {
  throw new Error(`No build in ${EXT}. Run "npm run stand" (it builds first) or "npm run build".`);
}
const PR = process.env.BRO_PROOF ?? 'test-results/proof';
const DOCS = process.env.DOCS === '1' ? 'docs/screenshots' : null;

let DL_ROOT = ''; // temp Downloads of the stand profile (masked in README screenshots)

type Fx = { ext: BrowserContext; sw: Worker; extensionId: string; origin: string };

const test = base.extend<{}, Fx>({
  ext: [async ({}, use) => {
    // Isolated profile whose Chrome download folder is a temp dir (no writes to the real ~/Downloads).
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'topath-stand-'));
    const downloads = path.join(root, 'Downloads');
    const profile = path.join(root, 'profile');
    fs.mkdirSync(downloads, { recursive: true });
    fs.mkdirSync(path.join(profile, 'Default'), { recursive: true });
    fs.writeFileSync(path.join(profile, 'Default', 'Preferences'), JSON.stringify({
      download: { default_directory: downloads, prompt_for_download: false, directory_upgrade: true },
    }));
    const context = await chromium.launchPersistentContext(profile, {
      channel: 'chromium',
      acceptDownloads: true,
      args: [`--disable-extensions-except=${EXT}`, `--load-extension=${EXT}`],
    });
    // Playwright's own download handling renames files to GUIDs and bypasses extensions.
    // Give downloads back to Chrome ("default") so onDeterminingFilename really routes them.
    const page = context.pages()[0] ?? (await context.newPage());
    const cdp = await context.newCDPSession(page);
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'default' });
    DL_ROOT = downloads;
    fs.writeFileSync(path.join(PR, 'downloads-root.txt'), priv(`${downloads}\n`));
    await use(context);
    await context.close();
  }, { scope: 'worker' }],
  sw: [async ({ ext }, use) => {
    let [sw] = ext.serviceWorkers();
    if (!sw) sw = await ext.waitForEvent('serviceworker', { timeout: 20_000 }).catch(() => {
      throw new Error(`Extension service worker did not start. Pages: ${ext.pages().map((p) => p.url()).join(', ') || 'none'}`);
    });
    await use(sw);
  }, { scope: 'worker' }],
  extensionId: [async ({ sw }, use) => use(new URL(sw.url()).host), { scope: 'worker' }],
  origin: [async ({}, use) => {
    const server = http.createServer((req, res) => {
      const name = decodeURIComponent((req.url ?? '/').slice(1));
      res.writeHead(200, { 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="${name}"` });
      res.end(`test file ${name}\n`);
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    await use(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
    server.close();
  }, { scope: 'worker' }],
});

for (const d of ['screens', 'aria']) fs.mkdirSync(`${PR}/${d}`, { recursive: true });
if (DOCS) fs.mkdirSync(DOCS, { recursive: true });

async function shot(page: Page, name: string) {
  await page.waitForTimeout(250); // let the 180 ms enter animation finish
  await page.screenshot({ path: `${PR}/screens/${name}.png` });
  if (DOCS) {
    // README screenshots must not show the local temp path / user name.
    await page.evaluate((root) => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        if (root && n.textContent?.includes(root)) n.textContent = n.textContent.split(root).join('Downloads');
      }
    }, DL_ROOT);
    await page.screenshot({ path: `${DOCS}/${name}.png` });
  }
}

/** Start a real download from the extension and wait until Chrome finishes it. Returns the absolute path. */
async function download(sw: Worker, url: string): Promise<{ filename: string; state: string }> {
  return sw.evaluate(async (u) => {
    const id = await chrome.downloads.download({ url: u });
    for (let i = 0; i < 100; i++) {
      const [it] = await chrome.downloads.search({ id });
      if (it && it.state !== 'in_progress') return { filename: it.filename, state: it.state };
      await new Promise((r) => setTimeout(r, 100));
    }
    return { filename: '', state: 'timeout' };
  }, url);
}

const stateOf = (sw: Worker) => sw.evaluate(async () => (await chrome.storage.local.get('state')).state as Record<string, any>);
const badge = (sw: Worker) => sw.evaluate(() => chrome.action.getBadgeText({}));
const sep = (p: string) => p.replace(/\\/g, '/');
/** Proof files go to a public repo: hide the user's home folder (C:\Users\<name> → ~). */
const priv = (t: string) => t.split(os.homedir()).join('~');

test.describe.configure({ mode: 'serial' });

test('01 main popup: default mode, all rows visible', async ({ ext, extensionId }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('heading', { name: 'ToPath Saver' })).toBeVisible();
  const group = page.getByRole('radiogroup', { name: 'Download folder' });
  for (const n of ['Chrome default', 'Documents', 'Images', 'Video', 'Archives', 'Custom']) {
    await expect(group.getByRole('radio', { name: new RegExp(n) })).toBeVisible();
  }
  await expect(group.getByRole('radio', { name: /Chrome default/ })).toHaveAttribute('aria-checked', 'true');
  await shot(page, 'm01-main');
  fs.writeFileSync(`${PR}/aria/m01-main.yml`, await page.locator('body').ariaSnapshot());
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.close();
});

test('02 pick Images → real download lands in Downloads/Images, badge IMG', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByRole('radio', { name: /Images/ }).click();
  await expect(page.getByRole('radio', { name: /Images/ })).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => badge(sw)).toBe('IMG');
  // Picking a folder only sets the target: it never starts a download by itself.
  await page.waitForTimeout(500);
  expect(await sw.evaluate(async () => (await chrome.downloads.search({})).length)).toBe(0);
  const r = await download(sw, `${origin}/photo.jpg`);
  expect(r.state).toBe('complete');
  expect(sep(r.filename)).toMatch(/\/Images\/photo( \(\d+\))?\.jpg$/);
  fs.writeFileSync(`${PR}/download-images.txt`, priv(`${r.state} ${r.filename}\n`));
  await expect.poll(async () => (await stateOf(sw)).last?.status).toBe('ok');
  await page.reload();
  await expect(page.getByRole('status')).toContainText('In Images/: photo.jpg');
  await shot(page, 'm01-images-selected');
  await page.close();
});

test('02b two downloads at once (Gmail "download all") both land in Documents', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByRole('radio', { name: /Documents/ }).click();
  await expect.poll(() => badge(sw)).toBe('DOC');
  const [a, b] = await Promise.all([download(sw, `${origin}/contract-1.docx`), download(sw, `${origin}/contract-2.docx`)]);
  expect(sep(a.filename)).toMatch(/\/Documents\/contract-1( \(\d+\))?\.docx$/);
  expect(sep(b.filename)).toMatch(/\/Documents\/contract-2( \(\d+\))?\.docx$/);
  const diag = await sw.evaluate(async () => (await chrome.storage.local.get('diag')).diag as { ext: string; want: string; status: string }[]);
  expect(diag.filter((d) => d.ext === 'docx' && d.want === 'Documents' && d.status === 'ok').length).toBe(2);
  fs.writeFileSync(`${PR}/download-parallel.txt`, priv(`${a.filename}\n${b.filename}\n`));
  await page.getByRole('radio', { name: /Chrome default/ }).click();
  await page.close();
});

test('03 auto-sort: pdf → Documents, exe → Chrome default', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByLabel('Auto-sort by file type').check();
  await expect(page.getByText('Auto-sort is on')).toBeVisible();
  await expect.poll(() => badge(sw)).toBe('AUTO');
  await shot(page, 'm02-auto-sort');
  const pdf = await download(sw, `${origin}/report.pdf`);
  expect(sep(pdf.filename)).toMatch(/\/Documents\/report( \(\d+\))?\.pdf$/);
  const exe = await download(sw, `${origin}/setup.exe`);
  expect(sep(exe.filename)).not.toMatch(/\/(Documents|Images|Video|Archives)\//);
  fs.writeFileSync(`${PR}/download-autosort.txt`, priv(`${pdf.filename}\n${exe.filename}\n`));
  await page.getByLabel('Auto-sort by file type').uncheck();
  await page.close();
});

test('04 custom folder: invalid input blocked, fix, save, real download', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByRole('radio', { name: /Custom/ }).click();
  await expect(page.getByRole('heading', { name: 'Custom folder' })).toBeVisible();
  const input = page.getByLabel('Folder inside Downloads');
  await input.fill('Work/Q4:report?');
  await expect(page.getByRole('alert')).toContainText('not allowed');
  await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
  await shot(page, 'm03-custom-error');
  await input.fill('C:\\Windows');
  await expect(page.getByRole('alert')).toContainText('not a full path');
  await input.fill('Work/Q4:report?');
  await page.getByRole('button', { name: 'Fix automatically' }).click();
  await expect(input).toHaveValue('Work/Q4report');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('radio', { name: /Custom/ })).toHaveAttribute('aria-checked', 'true');
  await expect.poll(() => badge(sw)).toBe('DIR');
  const r = await download(sw, `${origin}/notes.txt`);
  expect(sep(r.filename)).toMatch(/\/Work\/Q4report\/notes( \(\d+\))?\.txt$/);
  fs.writeFileSync(`${PR}/download-custom.txt`, priv(`${r.filename}\n`));
  await page.close();
});

test('05 once: Video for one download, then back to the mode chosen before (Chrome default)', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByRole('radio', { name: /Chrome default/ }).click();
  await page.getByRole('radio', { name: /Video/ }).click();
  await page.getByLabel('Only for the next download').check();
  await expect.poll(async () => (await stateOf(sw)).once).toBe(true);
  const first = await download(sw, `${origin}/clip.mp4`);
  expect(sep(first.filename)).toMatch(/\/Video\/clip( \(\d+\))?\.mp4$/);
  await expect.poll(async () => (await stateOf(sw)).mode).toBe('default');
  const second = await download(sw, `${origin}/clip2.mp4`);
  expect(sep(second.filename)).not.toMatch(/\/Video\//);
  fs.writeFileSync(`${PR}/download-once.txt`, priv(`${first.filename}\n${second.filename}\n`));
  await page.close();
});

test('06 settings: language, dark theme, support card, reset', async ({ ext, extensionId, sw }) => {
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 1100 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
  await expect(page.getByText('0x50153B5CC3eae905291d62602226C80896Aa64f2')).toBeVisible();
  await expect(page.getByRole('link', { name: /Open in wallet/ })).toHaveAttribute('href', 'ethereum:0x50153B5CC3eae905291d62602226C80896Aa64f2');
  await shot(page, 'm04-settings');
  fs.writeFileSync(`${PR}/aria/m04-settings.yml`, await page.locator('body').ariaSnapshot());
  for (const [code, title] of [['RU', 'Настройки'], ['CN', '设置'], ['ES', 'Ajustes'], ['EN', 'Settings']] as const) {
    await page.getByRole('radio', { name: code, exact: true }).click();
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  }
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await shot(page, 'm05-settings-dark');
  await page.getByRole('button', { name: 'Back' }).click();
  await page.setViewportSize({ width: 340, height: 560 });
  await shot(page, 'm05-main-dark');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('switch', { name: 'Dark theme' }).click();
  await page.getByRole('button', { name: 'Reset to defaults' }).click();
  await page.getByRole('button', { name: /Click again/ }).click();
  await expect.poll(async () => (await stateOf(sw)).mode).toBe('default');
  await page.close();
});

test('07 failed download → error recorded, file never lost', async ({ ext, extensionId, sw }) => {
  const r = await sw.evaluate(async () => {
    const id = await chrome.downloads.download({ url: 'http://127.0.0.1:9/nothing.bin' });
    for (let i = 0; i < 100; i++) {
      const [it] = await chrome.downloads.search({ id });
      if (it && it.state !== 'in_progress') return { state: it.state, error: it.error ?? '' };
      await new Promise((res) => setTimeout(res, 100));
    }
    return { state: 'timeout', error: '' };
  });
  expect(r.state).toBe('interrupted');
  await expect.poll(async () => (await stateOf(sw)).last?.status).toBe('error');
  const page = await ext.newPage();
  await page.setViewportSize({ width: 340, height: 560 });
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('status')).toContainText('download failed');
  fs.writeFileSync(`${PR}/download-error.txt`, priv(`${r.state} ${r.error}\n`));
  await page.close();
});

test('08 Download all from Gmail: batch keeps one-time folder, then returns to previous', async ({ ext, extensionId, sw, origin }) => {
  const page = await ext.newPage();
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  // Not a Gmail tab → button disabled with a hint.
  await expect(page.getByRole('button', { name: /Download all from Gmail/ })).toBeDisabled();
  await expect(page.getByText('Open a Gmail email with attachments')).toBeVisible();
  await page.getByRole('radio', { name: /Documents/ }).click();
  await page.getByRole('radio', { name: /Images/ }).click();
  await page.getByRole('checkbox', { name: /Only for the next download/ }).check();
  await expect.poll(async () => (await stateOf(sw)).once).toBe(true);
  const files = [{ url: `${origin}/contract-1.docx`, name: 'contract-1.docx' }, { url: `${origin}/contract-2.docx`, name: 'contract-2.docx' }];
  await page.evaluate((f) => chrome.runtime.sendMessage({ type: 'gmail-all', files: f }), files);
  await expect.poll(async () => sw.evaluate(async () => (await chrome.storage.local.get('job')).job), { timeout: 15000 })
    .toMatchObject({ total: 2, done: 2, failed: 0, running: false, label: 'Images' });
  const got = await sw.evaluate(async () => (await chrome.downloads.search({ orderBy: ['-startTime'], limit: 2 })).map((d) => d.filename));
  for (const g of got) expect(sep(g)).toMatch(/\/Images\/contract-\d( \(\d+\))?\.docx$/);
  fs.writeFileSync(`${PR}/download-gmail-all.txt`, priv(got.join('\n') + '\n'));
  const s = await stateOf(sw);
  expect(s.mode).toBe('documents');
  expect(s.once).toBe(false);
  await expect(page.getByText(/2 files saved · Images/)).toBeVisible();
  await page.getByRole('radio', { name: /Chrome default/ }).click();
  await page.close();
});
