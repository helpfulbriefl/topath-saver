// Renders assets/icon.svg into public/icon/{16,32,48,128}.png (run automatically on npm install).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const svg = fs.readFileSync(new URL('../assets/icon.svg', import.meta.url));
const out = new URL('../public/icon/', import.meta.url);
fs.mkdirSync(out, { recursive: true });
for (const size of [16, 32, 48, 128]) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(fileURLToPath(new URL(`${size}.png`, out)));
}
console.log('icons: public/icon/16,32,48,128.png');
