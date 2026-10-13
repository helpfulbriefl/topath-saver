import fs from 'node:fs';
import sharp from 'sharp';

const source = 'docs/store/assets';
const output = 'docs/store/proof-downscales';
fs.mkdirSync(output, { recursive: true });
for (const name of ['01-folders.png', '02-auto-sort.png', '03-icon-styles.png', '04-dark.png']) {
  await sharp(`${source}/${name}`).resize(640, 400).png().toFile(`${output}/${name}`);
  console.log(`${output}/${name} 640x400`);
}
