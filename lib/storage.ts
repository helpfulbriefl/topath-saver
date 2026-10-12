import { browser } from 'wxt/browser';
import { normalizeState } from './state';
import type { State } from './types';

const KEY = 'state';
let queue: Promise<unknown> = Promise.resolve();

export async function loadState(): Promise<State> {
  try {
    const got = await browser.storage.local.get(KEY);
    return normalizeState(got[KEY]);
  } catch {
    return normalizeState(null);
  }
}

export async function saveState(state: State): Promise<void> {
  await browser.storage.local.set({ [KEY]: state });
}

/** Serialized read-modify-write so two quick updates never overwrite each other. */
export function updateState(fn: (s: State) => State): Promise<State> {
  const run = queue.then(async () => {
    const next = normalizeState(fn(await loadState()));
    await saveState(next);
    return next;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function onStateChange(cb: (s: State) => void): () => void {
  const listener = (changes: Record<string, { newValue?: unknown }>, area: string) => {
    if (area === 'local' && KEY in changes) cb(normalizeState(changes[KEY]?.newValue));
  };
  browser.storage.onChanged.addListener(listener);
  return () => browser.storage.onChanged.removeListener(listener);
}

/* Pending downloads live in session storage so they survive a service-worker restart. */
const PENDING = 'pending';
type Pending = Record<string, string | null>;

export async function setPending(id: number, folder: string | null): Promise<void> {
  const got = await browser.storage.session.get(PENDING);
  const map = (got[PENDING] ?? {}) as Pending;
  map[String(id)] = folder;
  const keys = Object.keys(map);
  if (keys.length > 200) for (const k of keys.slice(0, keys.length - 200)) delete map[k];
  await browser.storage.session.set({ [PENDING]: map });
}

export async function takePending(id: number): Promise<{ known: boolean; folder: string | null }> {
  const got = await browser.storage.session.get(PENDING);
  const map = (got[PENDING] ?? {}) as Pending;
  const k = String(id);
  if (!(k in map)) return { known: false, folder: null };
  const folder = map[k] ?? null;
  delete map[k];
  await browser.storage.session.set({ [PENDING]: map });
  return { known: true, folder };
}
