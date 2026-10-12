import { defineConfig } from 'vitest/config';
// globals: describe/test/expect come from the running Vitest instance, not from an import.
// Avoids "failed to find the current suite" when Windows resolves `vitest` twice (path case / junctions).
export default defineConfig({ test: { include: ['tests/unit/**/*.test.ts'], globals: true } });
