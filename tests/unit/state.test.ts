import { expect, test } from 'vitest';
import { makeDefaultState } from '../../lib/defaults';
import { normalizeState, pushRecent } from '../../lib/state';

test('garbage → defaults, never throws', () => {
  for (const raw of [null, undefined, 42, 'x', [], { mode: 7 }, { presets: 'no' }]) {
    expect(normalizeState(raw)).toEqual(makeDefaultState());
  }
});

test('keeps valid values and repairs invalid ones', () => {
  const s = normalizeState({
    mode: 'images',
    autoSort: true,
    presets: [{ id: 'images', name: ' Pics ', folder: 'Pics/2026', icon: 'camera' }, { id: 'video', folder: '../bad', icon: 'nope' }],
    settings: { lang: 'ru', theme: 'dark', shortcuts: false, badge: 'yes' },
    recentCustom: ['A', 'A', '../x', 'B'],
  });
  expect(s.mode).toBe('images');
  expect(s.autoSort).toBe(true);
  expect(s.presets.find((p) => p.id === 'images')).toMatchObject({ name: 'Pics', folder: 'Pics/2026', icon: 'camera', badge: 'IMG' });
  expect(s.presets.find((p) => p.id === 'video')).toMatchObject({ folder: 'Video', icon: 'video' });
  expect(s.settings).toEqual({ lang: 'ru', theme: 'dark', shortcuts: false, badge: true, notifyErrors: true });
  expect(s.recentCustom).toEqual(['A', 'B']);
});

test('custom mode without a valid folder falls back to default', () => {
  expect(normalizeState({ mode: 'custom', customFolder: 'C:\\x' }).mode).toBe('default');
  expect(normalizeState({ mode: 'custom', customFolder: 'Work' }).mode).toBe('custom');
});

test('pushRecent keeps 5 unique, newest first', () => {
  expect(pushRecent(['a', 'b', 'c', 'd', 'e'], 'c')).toEqual(['c', 'a', 'b', 'd', 'e']);
  expect(pushRecent(['a', 'b', 'c', 'd', 'e'], 'f')).toEqual(['f', 'a', 'b', 'c', 'd']);
});
