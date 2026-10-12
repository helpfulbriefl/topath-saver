import { browser } from 'wxt/browser';
import { MODE_ORDER } from '../lib/defaults';
import { downloadErrorKey } from '../lib/errors';
import { t, type Key } from '../lib/i18n';
import { basename, dirname, endsWithFolder, isValidFolder, normalizeFolder, relativeTo, samePath, stripFolder } from '../lib/paths';
import { extOf } from '../lib/rules';
import { BADGE_OK, afterRouted, revertOnce, badgeFor, buildFilename, resolveTarget } from '../lib/router';
import { normalizeState } from '../lib/state';
import { jobActive, loadState, logDiag, readJob, saveState, setPending, takePending, updateJob, updateState, type Job } from '../lib/storage';
import type { GFile } from '../lib/gmail';
import type { LastEvent, State } from '../lib/types';

const ICON = '/icon/128.png';

async function applyBadge(state: State): Promise<void> {
  const { text, color } = badgeFor(state);
  try {
    await browser.action.setBadgeText({ text });
    if (text) await browser.action.setBadgeBackgroundColor({ color });
    await browser.action.setBadgeTextColor?.({ color: '#FFFFFF' });
  } catch (e) {
    console.warn('[topath] badge', e);
  }
}

function flashOk(state: State): void {
  if (!state.settings.badge) return;
  void browser.action.setBadgeText({ text: '✓' });
  void browser.action.setBadgeBackgroundColor({ color: BADGE_OK });
  setTimeout(() => void loadState().then(applyBadge), 1500);
}

function notify(id: string, state: State, title: Key, message: string, buttons: Key[] = []): void {
  if (!state.settings.notifyErrors) return;
  const lang = state.settings.lang;
  void browser.notifications
    .create(id, {
      type: 'basic',
      iconUrl: browser.runtime.getURL(ICON),
      title: t(lang, title),
      message,
      buttons: buttons.map((b) => ({ title: t(lang, b) })),
    })
    .catch((e: unknown) => console.warn('[topath] notify', e));
}

async function route(item: { id: number; filename: string; mime?: string; byExtensionId?: string }) {
  const state = await loadState();
  const target = resolveTarget(state, item);
  await setPending(item.id, target.folder);
  void logDiag(item.id, {
    mode: state.mode, auto: state.autoSort, ext: extOf(item.filename) || '-', mime: item.mime ?? '', want: target.folder,
  });
  if (!target.folder) return null;
  const patch = afterRouted(state, target);
  const job = await readJob();
  // During "Download all from Gmail" a one-time mode stays until the whole batch is done.
  if (patch && !(jobActive(job) && job.hold)) await updateState((s) => ({ ...s, ...patch }));
  return { filename: buildFilename(target.folder, item.filename), conflictAction: 'uniquify' as const };
}

/** Count one batch file as done/failed; when the batch is over, release a held one-time mode. */
async function bump(match: (j: Job) => boolean, ok: boolean, id?: number): Promise<void> {
  const out = { over: false, hold: false };
  await updateJob((j) => {
    if (!j || !j.running || !match(j)) return null;
    const n: Job = { ...j, done: j.done + (ok ? 1 : 0), failed: j.failed + (ok ? 0 : 1) };
    if (id !== undefined) n.ids = j.ids.filter((x) => x !== id);
    if (n.done + n.failed >= n.total) { n.running = false; out.over = true; out.hold = n.hold; }
    return n;
  });
  if (out.over && out.hold) await updateState((s) => (s.once ? { ...s, ...revertOnce(s) } : s));
}

async function startGmail(files: GFile[]): Promise<{ ok: boolean }> {
  if (!files.length || jobActive(await readJob())) return { ok: false };
  const state = await loadState();
  const hold = state.once && !state.autoSort && state.mode !== 'default';
  const label = state.autoSort ? '*'
    : state.mode === 'default' ? null
    : state.mode === 'custom' ? normalizeFolder(state.customFolder)
    : state.presets.find((p) => p.id === state.mode)?.folder ?? null;
  await updateJob(() => ({ ids: [], total: files.length, done: 0, failed: 0, label, hold, running: true, at: Date.now() }));
  for (const f of files) {
    try {
      // saveAs:false — no "Save as" dialog per file even if Chrome asks where to save.
      const id = await browser.downloads.download({ url: f.url, saveAs: false, conflictAction: 'uniquify' });
      await updateJob((j) => (j ? { ...j, ids: [...j.ids, id] } : j));
    } catch (e) {
      console.warn('[topath] gmail download', e);
      await bump(() => true, false);
    }
  }
  return { ok: true };
}

async function finish(id: number, error: string | null): Promise<void> {
  const pending = await takePending(id);
  if (!pending.known) return; // started before we were listening (or our own marker)
  const [item] = await browser.downloads.search({ id });
  if (!item) return;
  const abs = item.filename ?? '';
  const file = basename(abs) || basename(item.url ?? '') || 'download';
  const folder = pending.folder;
  const state = await loadState();
  const lang = state.settings.lang;
  const at = Date.now();
  const dir = dirname(abs);
  const root = state.downloadsRoot;
  const rel = root ? relativeTo(root, dir) : null;
  const where = rel === null ? (root ? 'outside-downloads' : '?') : rel || '(root)';

  if (error) {
    void logDiag(id, { status: `error:${error}`, got: where });
    if (error === 'USER_CANCELED') return;
    const last: LastEvent = { id, file, folder, status: 'error', error, at };
    await updateState((s) => ({ ...s, last }));
    notify(`err:${id}`, state, 'n.failTitle', `${file} — ${t(lang, downloadErrorKey(error) as Key)}`, ['n.retry', 'n.openFolder']);
    return;
  }

  // Routed file must end up exactly in <Downloads>/<folder>. When the root is known, compare exactly:
  // a Save-as dialog can drop it into e.g. C:\Users\me\Documents, which merely *ends* with "Documents".
  const landed = folder ? (root ? samePath(dir, `${root}/${folder}`) : endsWithFolder(dir, folder)) : true;
  void logDiag(id, { status: landed ? 'ok' : 'moved', got: where });
  if (!landed) {
    const last: LastEvent = { id, file, folder, status: 'conflict', at };
    await updateState((s) => ({ ...s, last }));
    notify(`conflict:${id}`, state, 'n.conflictTitle', t(lang, 'n.conflictMsg', { path: abs }), ['n.showFile']);
    return;
  }
  const learned = folder ? stripFolder(dir, folder) : dir;
  const last: LastEvent = { id, file, folder, status: 'ok', at };
  const next = await updateState((s) => ({
    ...s,
    last,
    // Learn the Downloads root only from routed files, or once from a default download.
    downloadsRoot: learned && (folder || !s.downloadsRoot) ? learned : s.downloadsRoot,
  }));
  flashOk(next);
}

async function retry(id: number): Promise<void> {
  const [item] = await browser.downloads.search({ id });
  if (!item) return;
  if (item.canResume) {
    await browser.downloads.resume(id);
    return;
  }
  const url = item.finalUrl || item.url;
  if (url && !url.startsWith('blob:')) await browser.downloads.download({ url });
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    const s = await loadState();
    await saveState(s);
    await applyBadge(s);
  });
  browser.runtime.onStartup.addListener(async () => applyBadge(await loadState()));
  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.state) return;
    const next = normalizeState(changes.state.newValue);
    void applyBadge(next);
  });

  browser.downloads.onDeterminingFilename.addListener((item, suggest) => {
    route(item)
      .then((s) => (s ? suggest(s) : suggest()))
      .catch((e: unknown) => {
        console.warn('[topath] route failed, keeping Chrome default', e);
        suggest();
      });
    return true; // we answer asynchronously
  });

  browser.downloads.onChanged.addListener((delta) => {
    const st = delta.state?.current;
    if (st === 'complete' || st === 'interrupted') void bump((j) => j.ids.includes(delta.id), st === 'complete', delta.id);
    if (st === 'complete') void finish(delta.id, null).catch((e: unknown) => console.warn('[topath] finish', e));
    else if (st === 'interrupted') void finish(delta.id, delta.error?.current ?? 'UNKNOWN').catch((e: unknown) => console.warn('[topath] finish', e));
  });

  browser.runtime.onMessage.addListener((msg: unknown) => {
    const m = msg as { type?: string; files?: GFile[] } | null;
    if (m?.type !== 'gmail-all' || !Array.isArray(m.files)) return undefined;
    return startGmail(m.files.filter((f) => typeof f?.url === 'string').slice(0, 50));
  });

  browser.notifications.onButtonClicked.addListener((nid, index) => {
    const [kind, raw] = nid.split(':');
    const id = Number(raw);
    if (kind === 'err') void (index === 0 ? retry(id) : browser.downloads.showDefaultFolder());
    if (kind === 'conflict') browser.downloads.show(id);
    void browser.notifications.clear(nid);
  });

  browser.commands.onCommand.addListener(async (command) => {
    const m = /^mode-(\d)$/.exec(command);
    if (!m) return;
    const mode = MODE_ORDER[Number(m[1]) - 1];
    const state = await loadState();
    if (!mode || !state.settings.shortcuts) return;
    if (mode === 'custom' && !isValidFolder(state.customFolder)) {
      notify('custom-missing', state, 'mode.custom', t(state.settings.lang, 'n.missingCustom'));
      return;
    }
    await updateState((s) => ({ ...s, mode, prevMode: s.mode !== mode ? s.mode : s.prevMode, autoSort: false }));
  });
});
