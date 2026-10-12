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

/* Pending downloads live in session storage so they survive a service-worker restart.
   All access goes through one queue: two downloads starting together must not overwrite each other. */
const PENDING = 'pending';
type Pending = Record<string, string | null>;
let pendingQueue: Promise<unknown> = Promise.resolve();
function withPending<T>(fn: (map: Pending) => T): Promise<T> {
  const run = pendingQueue.then(async () => {
    const got = await browser.storage.session.get(PENDING);
    const map = { ...((got[PENDING] ?? {}) as Pending) };
    const out = fn(map);
    await browser.storage.session.set({ [PENDING]: map });
    return out;
  });
  pendingQueue = run.catch(() => undefined);
  return run;
}

export function setPending(id: number, folder: string | null): Promise<void> {
  return withPending((map) => {
    map[String(id)] = folder;
    const keys = Object.keys(map);
    if (keys.length > 200) for (const k of keys.slice(0, keys.length - 200)) delete map[k];
  });
}

export function takePending(id: number): Promise<{ known: boolean; folder: string | null }> {
  return withPending((map) => {
    const k = String(id);
    if (!(k in map)) return { known: false, folder: null };
    const folder = map[k] ?? null;
    delete map[k];
    return { known: true, folder };
  });
}

/* Diagnostics: last 20 routing decisions, no file names (only extension), no absolute paths. */
const DIAG = 'diag';
export interface DiagEntry {
  id: number;
  at: number;
  mode: string;
  auto: boolean;
  ext: string;
  mime: string;
  want: string | null;
  got?: string;
  status?: string;
}
let diagQueue: Promise<unknown> = Promise.resolve();
export function logDiag(id: number, patch: Partial<DiagEntry>): Promise<void> {
  const run = diagQueue.then(async () => {
    const got = await browser.storage.local.get(DIAG);
    const list = ((got[DIAG] ?? []) as DiagEntry[]).slice(-19);
    const i = list.findIndex((e) => e.id === id);
    if (i >= 0) list[i] = { ...list[i]!, ...patch };
    else list.push({ id, at: Date.now(), mode: '', auto: false, ext: '', mime: '', want: null, ...patch });
    await browser.storage.local.set({ [DIAG]: list });
  });
  diagQueue = run.catch(() => undefined);
  return run;
}
export async function readDiag(): Promise<DiagEntry[]> {
  const got = await browser.storage.local.get(DIAG);
  return (got[DIAG] ?? []) as DiagEntry[];
}
