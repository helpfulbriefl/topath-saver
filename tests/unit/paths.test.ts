import { describe, expect, test } from 'vitest';
import { endsWithFolder, normalizeFolder, sanitizeFileName, sanitizeFolder, stripFolder, validateFolder } from '../../lib/paths';

describe('validateFolder', () => {
  test('accepts simple and nested folders', () => {
    expect(validateFolder('Images')).toEqual([]);
    expect(validateFolder('Work/Projects/2026')).toEqual([]);
    expect(validateFolder('Work\\Projects')).toEqual([]);
  });
  test.each([
    ['', 'empty'], ['   ', 'empty'], ['C:\\Users', 'absolute'], ['/etc', 'absolute'], ['~/x', 'absolute'],
    ['a/../b', 'dots'], ['./a', 'dots'], ['Q4:report?', 'chars'], ['a<b', 'chars'], ['CON', 'reserved'],
    ['nul.txt', 'reserved'], ['lpt1/x', 'reserved'], ['name.', 'trailing'], ['name /x', 'trailing'], ['a/ b', 'trailing'],
    ['a'.repeat(201), 'tooLong'], ['1/2/3/4/5/6/7/8/9', 'tooDeep'],
  ])('%s → %s', (input, err) => {
    expect(validateFolder(input)).toContain(err);
  });
});

describe('sanitizeFolder', () => {
  test('repairs common mistakes', () => {
    expect(sanitizeFolder('Work/Q4:report?')).toBe('Work/Q4report');
    expect(sanitizeFolder('C:\\Users\\me\\Docs')).toBe('Users/me/Docs');
    expect(sanitizeFolder('../a/./b/')).toBe('a/b');
    expect(sanitizeFolder('CON/x.')).toBe('_CON/x');
    expect(sanitizeFolder('???')).toBe('');
  });
  test('result is always valid or empty', () => {
    for (const s of ['a/../b', ' x ', 'aux', '1/2/3/4/5/6/7/8/9/10', 'é/中文/ok']) {
      const r = sanitizeFolder(s);
      expect(r === '' || validateFolder(r).length === 0).toBe(true);
    }
  });
  test('keeps unicode', () => {
    expect(normalizeFolder('Документы/图片')).toBe('Документы/图片');
  });
});

describe('file names', () => {
  test('sanitizeFileName strips path parts and bad chars', () => {
    expect(sanitizeFileName('C:\\tmp\\photo.jpg')).toBe('photo.jpg');
    expect(sanitizeFileName('a:b?.pdf')).toBe('a_b_.pdf');
    expect(sanitizeFileName('')).toBe('download');
    expect(sanitizeFileName('con.txt')).toBe('_con.txt');
  });
  test('shortens long names but keeps extension', () => {
    const r = sanitizeFileName(`${'x'.repeat(300)}.pdf`);
    expect(r.length).toBe(150);
    expect(r.endsWith('.pdf')).toBe(true);
  });
});

describe('endsWithFolder / stripFolder', () => {
  test('windows and posix paths', () => {
    expect(endsWithFolder('C:\\Users\\me\\Downloads\\Images', 'Images')).toBe(true);
    expect(endsWithFolder('/home/me/Downloads/Work/Q4', 'work/q4')).toBe(true);
    expect(endsWithFolder('/home/me/Downloads', 'Images')).toBe(false);
    expect(stripFolder('C:\\Users\\me\\Downloads\\Work\\Q4', 'Work/Q4')).toBe('C:\\Users\\me\\Downloads');
  });
});
