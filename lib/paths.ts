/** Folder and file-name rules. Chrome only accepts paths relative to the Downloads folder. */
export type PathError =
  | 'empty' | 'absolute' | 'dots' | 'chars' | 'reserved' | 'trailing' | 'tooLong' | 'tooDeep';

export const MAX_LEN = 200;
export const MAX_DEPTH = 8;
const INVALID = /[<>:"|?*\u0000-\u001F]/;
const INVALID_G = /[<>:"|?*\u0000-\u001F]/g;
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
const ABSOLUTE = /^([a-zA-Z]:|[\\/]|~)/;

function segments(s: string): string[] {
  return s.replace(/\\/g, '/').split('/').filter((x) => x !== '');
}

export function validateFolder(input: string): PathError[] {
  const s = input.trim();
  if (!s) return ['empty'];
  const errors = new Set<PathError>();
  if (ABSOLUTE.test(s)) errors.add('absolute');
  const segs = segments(s);
  if (segs.length === 0) errors.add('empty');
  for (const seg of segs) {
    if (seg === '.' || seg === '..') { errors.add('dots'); continue; }
    if (INVALID.test(seg)) errors.add('chars');
    if (RESERVED.test(seg)) errors.add('reserved');
    if (/[ .]$/.test(seg) || /^\s/.test(seg)) errors.add('trailing');
  }
  if (segs.join('/').length > MAX_LEN) errors.add('tooLong');
  if (segs.length > MAX_DEPTH) errors.add('tooDeep');
  return [...errors];
}

export function isValidFolder(input: string): boolean {
  return validateFolder(input).length === 0;
}

/** Canonical form of a valid folder: forward slashes, no empty segments. */
export function normalizeFolder(input: string): string {
  return segments(input.trim()).join('/');
}

/** Best-effort repair of any input into a valid folder ('' when nothing is left). */
export function sanitizeFolder(input: string): string {
  let s = input.trim().replace(/\\/g, '/');
  s = s.replace(/^[a-zA-Z]:/, '').replace(/^~/, '');
  const out: string[] = [];
  for (const raw of s.split('/')) {
    let seg = raw.replace(INVALID_G, '').trim().replace(/[ .]+$/, '').trim();
    if (!seg || seg === '.' || seg === '..') continue;
    if (RESERVED.test(seg)) seg = `_${seg}`;
    out.push(seg);
    if (out.length === MAX_DEPTH) break;
  }
  let joined = out.join('/');
  if (joined.length > MAX_LEN) joined = joined.slice(0, MAX_LEN).replace(/[ ./]+$/, '');
  return joined;
}

export function basename(p: string): string {
  const parts = p.split(/[\\/]/);
  return parts[parts.length - 1] ?? '';
}

export function dirname(p: string): string {
  const i = Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'));
  return i < 0 ? '' : p.slice(0, i);
}

/** Safe single file name; keeps the extension when shortening. */
export function sanitizeFileName(name: string, max = 150): string {
  let base = basename(name).replace(INVALID_G, '_').trim().replace(/[ .]+$/, '');
  if (!base) base = 'download';
  if (RESERVED.test(base)) base = `_${base}`;
  if (base.length > max) {
    const dot = base.lastIndexOf('.');
    const ext = dot > 0 && base.length - dot <= 16 ? base.slice(dot) : '';
    base = base.slice(0, max - ext.length) + ext;
  }
  return base;
}

/** Does absolute directory `dir` end with relative `folder` (case-insensitive, any separator)? */
export function endsWithFolder(dir: string, folder: string): boolean {
  const d = segments(dir).map((x) => x.toLowerCase());
  const f = segments(folder).map((x) => x.toLowerCase());
  if (f.length === 0 || f.length > d.length) return false;
  return f.every((seg, i) => d[d.length - f.length + i] === seg);
}

/** Remove the trailing `folder` part from `dir`, returning the Downloads root. */
export function stripFolder(dir: string, folder: string): string {
  const n = segments(folder).length;
  let rest = dir.replace(/[\\/]+$/, '');
  for (let i = 0; i < n; i++) rest = dirname(rest);
  return rest;
}

/** Same folder? Case-insensitive, separator-agnostic (Windows paths). */
export function samePath(a: string, b: string): boolean {
  const x = segments(a).map((v) => v.toLowerCase());
  const y = segments(b).map((v) => v.toLowerCase());
  return x.length === y.length && x.every((v, i) => v === y[i]);
}

/** `dir` relative to `root` ('' = root itself), or null when `dir` is outside `root`. */
export function relativeTo(root: string, dir: string): string | null {
  const r = segments(root).map((v) => v.toLowerCase());
  const d = segments(dir);
  if (d.length < r.length || !r.every((v, i) => v === d[i]!.toLowerCase())) return null;
  return d.slice(r.length).join('/');
}
