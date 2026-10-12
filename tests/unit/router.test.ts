import { makeDefaultState } from '../../lib/defaults';
import { afterRouted, badgeFor, buildFilename, resolveTarget } from '../../lib/router';
import type { State } from '../../lib/types';

const st = (patch: Partial<State> = {}): State => ({ ...makeDefaultState(), ...patch });

test('default mode leaves the file to Chrome', () => {
  expect(resolveTarget(st(), { filename: 'a.jpg' })).toEqual({ folder: null, reason: 'default' });
});

test('preset and custom modes', () => {
  expect(resolveTarget(st({ mode: 'images' }), { filename: 'a.pdf' })).toEqual({ folder: 'Images', reason: 'mode' });
  expect(resolveTarget(st({ mode: 'custom', customFolder: 'Work\\Q4' }), { filename: 'a' })).toEqual({ folder: 'Work/Q4', reason: 'mode' });
  expect(resolveTarget(st({ mode: 'custom', customFolder: '../x' }), { filename: 'a' })).toEqual({ folder: null, reason: 'fallback' });
});

test('auto-sort wins over mode; unknown types stay default', () => {
  const s = st({ mode: 'images', autoSort: true });
  expect(resolveTarget(s, { filename: 'C:\\x\\report.pdf' })).toEqual({ folder: 'Documents', reason: 'auto' });
  expect(resolveTarget(s, { filename: 'setup.exe' })).toEqual({ folder: null, reason: 'default' });
});

test('once returns to default only after a routed manual download', () => {
  expect(afterRouted(st({ mode: 'video', once: true }), { folder: 'Video', reason: 'mode' })).toEqual({ mode: 'default', once: false });
  expect(afterRouted(st({ mode: 'video', once: false }), { folder: 'Video', reason: 'mode' })).toBeNull();
  expect(afterRouted(st({ once: true, autoSort: true }), { folder: 'Images', reason: 'auto' })).toBeNull();
});

test('buildFilename sanitizes the name', () => {
  expect(buildFilename('Images', 'C:\\t\\a:b.jpg')).toBe('Images/a_b.jpg');
});

test('badge text', () => {
  expect(badgeFor(st()).text).toBe('');
  expect(badgeFor(st({ mode: 'images' })).text).toBe('IMG');
  expect(badgeFor(st({ mode: 'custom', customFolder: 'W' })).text).toBe('DIR');
  expect(badgeFor(st({ autoSort: true })).text).toBe('AUTO');
  expect(badgeFor(st({ mode: 'images', once: true })).color).toBe('#C9772F');
  expect(badgeFor(st({ mode: 'images', settings: { ...makeDefaultState().settings, badge: false } })).text).toBe('');
});
