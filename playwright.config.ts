import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:5178',
    viewport: { width: 1920, height: 1080 },
  },
  webServer: {
    command: 'npx vite --port 5178',
    url: 'http://localhost:5178',
    reuseExistingServer: true,
  },
});
