export type PresetId = 'documents' | 'images' | 'video' | 'archives';
export type ModeId = 'default' | 'custom' | PresetId;
export type IconName =
  | 'file-text' | 'image' | 'video' | 'archive' | 'music'
  | 'folder' | 'book' | 'code' | 'briefcase' | 'camera';
export type Lang = 'en' | 'ru' | 'zh' | 'es';
export type Theme = 'light' | 'dark';

export interface Preset {
  id: PresetId;
  /** null = use the translated default name */
  name: string | null;
  folder: string;
  icon: IconName;
  badge: string;
}

export interface Settings {
  lang: Lang;
  theme: Theme;
  shortcuts: boolean;
  badge: boolean;
  notifyErrors: boolean;
}

export interface LastEvent {
  id: number;
  file: string;
  folder: string | null;
  status: 'ok' | 'conflict' | 'error';
  error?: string;
  at: number;
}

export interface State {
  v: 1;
  mode: ModeId;
  presets: Preset[];
  customFolder: string;
  recentCustom: string[];
  autoSort: boolean;
  once: boolean;
  /** Mode to return to after a one-time ("Only for the next download") use. */
  prevMode: ModeId;
  settings: Settings;
  last: LastEvent | null;
  /** Absolute Downloads folder learned from finished downloads; null until known. */
  downloadsRoot: string | null;
}
