import { expect, test } from 'vitest';
import { categoryOf, extOf } from '../../lib/rules';

test('extOf', () => {
  expect(extOf('photo.JPG')).toBe('jpg');
  expect(extOf('archive.tar.gz')).toBe('gz');
  expect(extOf('.bashrc')).toBe('');
  expect(extOf('README')).toBe('');
});

test('categoryOf by extension and mime', () => {
  expect(categoryOf('report.pdf')).toBe('documents');
  expect(categoryOf('photo.webp')).toBe('images');
  expect(categoryOf('clip.mkv')).toBe('video');
  expect(categoryOf('backup.7z')).toBe('archives');
  expect(categoryOf('blob', 'image/png')).toBe('images');
  expect(categoryOf('noext', 'video/mp4')).toBe('video');
  expect(categoryOf('setup.exe')).toBeNull();
  expect(categoryOf('song.mp3')).toBeNull();
});
