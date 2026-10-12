import { categoryOf } from './rules';
import { basename, isValidFolder, normalizeFolder, sanitizeFileName } from './paths';
import type { State } from './types';

export interface Target {
  folder: string | null;
  reason: 'default' | 'mode' | 'auto' | 'fallback';
}

/** Where should this download go? null folder = leave it to Chrome. */
export function resolveTarget(state: State, item: { filename: string; mime?: string }): Target {
  if (state.autoSort) {
    const cat = categoryOf(basename(item.filename), item.mime);
    const preset = cat ? state.presets.find((p) => p.id === cat) : undefined;
    if (preset && isValidFolder(preset.folder)) return { folder: normalizeFolder(preset.folder), reason: 'auto' };
    return { folder: null, reason: 'default' };
  }
  if (state.mode === 'default') return { folder: null, reason: 'default' };
  const raw = state.mode === 'custom' ? state.customFolder : state.presets.find((p) => p.id === state.mode)?.folder ?? '';
  if (!isValidFolder(raw)) return { folder: null, reason: 'fallback' };
  return { folder: normalizeFolder(raw), reason: 'mode' };
}

export function buildFilename(folder: string, original: string): string {
  return `${folder}/${sanitizeFileName(original)}`;
}

/** "Only for the next download": after one routed download, go back to Chrome default. */
export function afterRouted(state: State, target: Target): Partial<State> | null {
  if (state.once && !state.autoSort && target.reason === 'mode') return { mode: 'default', once: false };
  return null;
}

export const BADGE_INK = '#1F1D1A';
export const BADGE_ONCE = '#C9772F';
export const BADGE_OK = '#3F8F63';

export function badgeFor(state: State): { text: string; color: string } {
  if (!state.settings.badge) return { text: '', color: BADGE_INK };
  const color = state.once && !state.autoSort ? BADGE_ONCE : BADGE_INK;
  if (state.autoSort) return { text: 'AUTO', color };
  if (state.mode === 'default') return { text: '', color };
  if (state.mode === 'custom') return { text: 'DIR', color };
  return { text: state.presets.find((p) => p.id === state.mode)?.badge ?? '', color };
}
