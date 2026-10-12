import type { PresetId } from './types';

/** Auto-sort rules: file extension → preset. Unknown types stay in the Chrome default folder. */
export const TYPE_RULES: Record<PresetId, readonly string[]> = {
  documents: ['pdf', 'doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'xls', 'xlsx', 'ods', 'csv', 'ppt', 'pptx', 'odp', 'epub', 'djvu'],
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'heic', 'heif', 'avif', 'tif', 'tiff', 'ico'],
  video: ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v', 'wmv', 'flv', 'mpeg', 'mpg'],
  archives: ['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', 'iso', 'dmg'],
};

const BY_EXT = new Map<string, PresetId>();
for (const [id, exts] of Object.entries(TYPE_RULES) as [PresetId, readonly string[]][]) {
  for (const e of exts) BY_EXT.set(e, id);
}

export function extOf(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? '';
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

export function categoryOf(fileName: string, mime?: string): PresetId | null {
  const byExt = BY_EXT.get(extOf(fileName));
  if (byExt) return byExt;
  const m = (mime ?? '').toLowerCase();
  if (m.startsWith('image/')) return 'images';
  if (m.startsWith('video/')) return 'video';
  if (m === 'application/pdf' || m.startsWith('text/')) return 'documents';
  if (/zip|x-7z|x-rar|x-tar|gzip/.test(m)) return 'archives';
  return null;
}
