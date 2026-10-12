import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/stand',
  workers: 1,
  timeout: 60_000,
  reporter: [['list']],
  use: { trace: 'on' },
});
