import { DEFAULT_PRESETS, ICON_NAMES, MODE_ORDER, makeDefaultState } from './defaults';
import { isValidFolder, normalizeFolder } from './paths';
import type { IconName, Lang, LastEvent, ModeId, Preset, State, IconSet } from './types';

const LANGS: Lang[] = ['en', 'ru', 'zh', 'es'];
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const bool = (x: unknown, d: boolean) => (typeof x === 'boolean' ? x : d);

function normPreset(base: Preset, raw: unknown): Preset {
  if (!isObj(raw)) return { ...base };
  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim().slice(0, 40) : null;
  const folder = typeof raw.folder === 'string' && isValidFolder(raw.folder) ? normalizeFolder(raw.folder) : base.folder;
  const icon = ICON_NAMES.includes(raw.icon as IconName) ? (raw.icon as IconName) : base.icon;
  return { id: base.id, name, folder, icon, badge: base.badge };
}

function normLast(raw: unknown): LastEvent | null {
  if (!isObj(raw)) return null;
  const { id, file, folder, status, error, at } = raw;
  if (typeof id !== 'number' || typeof file !== 'string' || typeof at !== 'number') return null;
  if (status !== 'ok' && status !== 'conflict' && status !== 'error') return null;
  return {
    id, file, at, status,
    folder: typeof folder === 'string' ? folder : null,
    ...(typeof error === 'string' ? { error } : {}),
  };
}

/** Turn anything read from storage into a valid State. Corrupt data falls back to defaults, never throws. */
export function normalizeState(raw: unknown): State {
  const d = makeDefaultState();
  if (!isObj(raw)) return d;
  const rawPresets = Array.isArray(raw.presets) ? raw.presets : [];
  const presets = DEFAULT_PRESETS.map((base) => normPreset(base, rawPresets.find((p) => isObj(p) && p.id === base.id)));
  const customFolder = typeof raw.customFolder === 'string' && isValidFolder(raw.customFolder) ? normalizeFolder(raw.customFolder) : '';
  let mode: ModeId = MODE_ORDER.includes(raw.mode as ModeId) ? (raw.mode as ModeId) : 'default';
  if (mode === 'custom' && !customFolder) mode = 'default';
  let prevMode: ModeId = MODE_ORDER.includes(raw.prevMode as ModeId) ? (raw.prevMode as ModeId) : 'default';
  if (prevMode === 'custom' && !customFolder) prevMode = 'default';
  const recentCustom = (Array.isArray(raw.recentCustom) ? raw.recentCustom : [])
    .filter((x): x is string => typeof x === 'string' && isValidFolder(x))
    .map(normalizeFolder)
    .filter((x, i, a) => a.indexOf(x) === i)
    .slice(0, 5);
  const s = isObj(raw.settings) ? raw.settings : {};
  return {
    v: 1,
    mode,
    presets,
    customFolder,
    recentCustom,
    autoSort: bool(raw.autoSort, d.autoSort),
    once: bool(raw.once, d.once),
    prevMode,
    settings: {
      lang: LANGS.includes(s.lang as Lang) ? (s.lang as Lang) : d.settings.lang,
      theme: s.theme === 'dark' ? 'dark' : 'light',
      icons: (['lucide', 'phosphor', 'fluent', 'fluent3d'] as const).includes(s.icons as IconSet) ? (s.icons as IconSet) : d.settings.icons,
      shortcuts: bool(s.shortcuts, d.settings.shortcuts),
      badge: bool(s.badge, d.settings.badge),
      notifyErrors: bool(s.notifyErrors, d.settings.notifyErrors),
    },
    last: normLast(raw.last),
    downloadsRoot: typeof raw.downloadsRoot === 'string' && raw.downloadsRoot ? raw.downloadsRoot : null,
  };
}

export function pushRecent(list: string[], folder: string): string[] {
  return [folder, ...list.filter((x) => x !== folder)].slice(0, 5);
}
