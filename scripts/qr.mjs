// Regenerates the Ethereum QR code used in the popup and README (no network at runtime).
import fs from 'node:fs';
import QRCode from 'qrcode';

const ADDRESS = '0x50153B5CC3eae905291d62602226C80896Aa64f2';
const svg = await QRCode.toString(`ethereum:${ADDRESS}`, {
  type: 'svg', errorCorrectionLevel: 'M', margin: 1, color: { dark: '#1F1D1A', light: '#FFFFFF' },
});
fs.writeFileSync(new URL('../assets/eth-qr.svg', import.meta.url), svg);
fs.mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../docs/eth-qr.svg', import.meta.url), svg);
console.log('qr: assets/eth-qr.svg, docs/eth-qr.svg');
