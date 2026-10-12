import {
  Archive, BookOpen, Briefcase, Camera, Code, Download, FileText, Folder, FolderPlus, Image, Music, Settings, Video,
  type LucideIcon, type LucideProps,
} from 'lucide-react';
import { createContext, useContext } from 'react';
import { PNG_3D } from '../../../lib/icons3d';
import { SVG_SETS } from '../../../lib/iconsets';
import type { IconName, IconSet } from '../../../lib/types';

/** Icon style chosen in Settings (lucide = thin lines, phosphor = duotone, fluent = Windows 11, fluent3d = 3D). */
export const IconSetContext = createContext<IconSet>('fluent');

type Glyph = IconName | 'download' | 'folder-plus' | 'gear';
const LUCIDE: Record<Glyph, LucideIcon> = {
  'file-text': FileText, image: Image, video: Video, archive: Archive, music: Music,
  folder: Folder, book: BookOpen, code: Code, briefcase: Briefcase, camera: Camera,
  download: Download, 'folder-plus': FolderPlus, gear: Settings,
};
/** Colour of each glyph in the coloured styles. */
const TONE: Record<Glyph, string> = {
  'file-text': 'blue', image: 'green', video: 'red', archive: 'amber', music: 'pink', folder: 'violet',
  book: 'teal', code: 'slate', briefcase: 'brown', camera: 'cyan', download: 'gray', 'folder-plus': 'violet', gear: 'gray',
};

export function ThemedIcon({ glyph, size = 16, set: forced, ...rest }: { glyph: Glyph; size?: number; set?: IconSet } & Omit<LucideProps, 'ref'>) {
  const ctx = useContext(IconSetContext);
  const set = forced ?? ctx;
  if (set === 'lucide') {
    const L = LUCIDE[glyph];
    return <L size={size} {...rest} />;
  }
  if (set === 'fluent3d') {
    const px = Math.round(size * 1.45);
    return <img className="ti ti-3d" data-tone={TONE[glyph]} src={PNG_3D[glyph]} width={px} height={px} alt="" aria-hidden draggable={false} />;
  }
  const px = set === 'fluent' ? size + 2 : size + 3;
  return (
    <span
      className={`ti ti-${set}`}
      data-tone={TONE[glyph]}
      style={{ width: px, height: px }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: SVG_SETS[set][glyph] ?? '' }}
    />
  );
}

const make = (glyph: Glyph) => {
  const C = (p: Omit<LucideProps, 'ref'>) => <ThemedIcon glyph={glyph} size={typeof p.size === 'number' ? p.size : 16} className={p.className} />;
  C.displayName = `Icon(${glyph})`;
  return C as unknown as LucideIcon;
};

export const PRESET_ICONS: Record<IconName, LucideIcon> = {
  'file-text': make('file-text'), image: make('image'), video: make('video'), archive: make('archive'), music: make('music'),
  folder: make('folder'), book: make('book'), code: make('code'), briefcase: make('briefcase'), camera: make('camera'),
};
export const DefaultIcon = make('download');
export const CustomIcon = make('folder-plus');
export const GearIcon = make('gear');
/** Logo always stays the same. */
export const LogoIcon = Download;
