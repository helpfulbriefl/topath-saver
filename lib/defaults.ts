import type { IconName, ModeId, Preset, State } from './types';

export const MODE_ORDER: ModeId[] = ['default', 'documents', 'images', 'video', 'archives', 'custom'];

export const ICON_NAMES: IconName[] = [
  'file-text', 'image', 'video', 'archive', 'music', 'folder', 'book', 'code', 'briefcase', 'camera',
];

export const DEFAULT_PRESETS: readonly Preset[] = [
  { id: 'documents', name: null, folder: 'Documents', icon: 'file-text', badge: 'DOC' },
  { id: 'images', name: null, folder: 'Images', icon: 'image', badge: 'IMG' },
  { id: 'video', name: null, folder: 'Video', icon: 'video', badge: 'VID' },
  { id: 'archives', name: null, folder: 'Archives', icon: 'archive', badge: 'ZIP' },
];

export function makeDefaultState(): State {
  return {
    v: 1,
    mode: 'default',
    presets: DEFAULT_PRESETS.map((p) => ({ ...p })),
    customFolder: '',
    recentCustom: [],
    autoSort: false,
    once: false,
    prevMode: 'default',
    settings: { lang: 'en', theme: 'light', icons: 'fluent', shortcuts: true, badge: true, notifyErrors: true },
    last: null,
    downloadsRoot: null,
  };
}
