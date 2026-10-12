import { DICTS, relTime, t } from '../../lib/i18n';

test('every language has every key, none empty', () => {
  const keys = Object.keys(DICTS.en).sort();
  for (const [lang, d] of Object.entries(DICTS)) {
    expect(Object.keys(d).sort(), lang).toEqual(keys);
    for (const k of keys) expect((d as Record<string, string>)[k], `${lang}:${k}`).not.toBe('');
  }
});

test('placeholders', () => {
  expect(t('en', 'last.ok', { file: 'a.jpg', folder: 'Images/' })).toBe('In Images/: a.jpg');
  expect(relTime('ru', 0, 5 * 60000)).toBe('5 мин назад');
});
