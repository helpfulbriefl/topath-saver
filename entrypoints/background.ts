import { browser } from 'wxt/browser';
import { MODE_ORDER } from '../lib/defaults';
import { downloadErrorKey } from '../lib/errors';
import { t, type Key } from '../lib/i18n';
import { basename, dirname, endsWithFolder, isValidFolder, stripFolder } from '../lib/paths';
import { BADGE_OK, afterRouted, badgeFor, buildFilename, resolveTarget } from '../lib/router';
import { normalizeState } from '../lib/state';
import { loadState, saveState, setPending, takePending, updateState } from '../lib/storage';
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

async function route(item: { id: number; filename: string; mime?: string }) {
  const state = await loadState();
  const target = resolveTarget(state, item);
  await setPending(item.id, target.folder);
  if (!target.folder) return null;
  const patch = afterRouted(state, target);
  if (patch) await updateState((s) => ({ ...s, ...patch }));
  return { filename: buildFilename(target.folder, item.filename), conflictAction: 'uniquify' as const };
}

async function finish(id: number, error: string | null): Promise<void> {
  const pending = await takePending(id);
  if (!pending.known) return; // started before we were listening
  const [item] = await browser.downloads.search({ id });
  if (!item) return;
  const abs = item.filename ?? '';
  const file = basename(abs) || basename(item.url ?? '') || 'download';
  const folder = pending.folder;
  const state = await loadState();
  const lang = state.settings.lang;
  const at = Date.now();

  if (error) {
    if (error === 'USER_CANCELED') return;
    const last: LastEvent = { id, file, folder, status: 'error', error, at };
    await updateState((s) => ({ ...s, last }));
    notify(`err:${id}`, state, 'n.failTitle', `${file} — ${t(lang, downloadErrorKey(error) as Key)}`, ['n.retry', 'n.openFolder']);
    return;
  }

  const dir = dirname(abs);
  if (folder && abs && !endsWithFolder(dir, folder)) {
    const last: LastEvent = { id, file, folder, status: 'conflict', at };
    await updateState((s) => ({ ...s, last }));
    notify(`conflict:${id}`, state, 'n.conflictTitle', t(lang, 'n.conflictMsg', { path: abs }), ['n.showFile']);
    return;
  }
  const root = folder ? stripFolder(dir, folder) : dir;
  const last: LastEvent = { id, file, folder, status: 'ok', at };
  const next = await updateState((s) => ({
    ...s,
    last,
    // Learn the Downloads root only from routed files, or once from a default download.
    downloadsRoot: root && (folder || !s.downloadsRoot) ? root : s.downloadsRoot,
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
    if (area === 'local' && changes.state) void applyBadge(normalizeState(changes.state.newValue));
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
    if (st === 'complete') void finish(delta.id, null).catch((e: unknown) => console.warn('[topath] finish', e));
    else if (st === 'interrupted') void finish(delta.id, delta.error?.current ?? 'UNKNOWN').catch((e: unknown) => console.warn('[topath] finish', e));
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
    await updateState((s) => ({ ...s, mode, autoSort: false }));
  });
});
