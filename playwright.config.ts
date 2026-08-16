import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:5178',
    viewport: { width: 1920, height: 1080 },
    // Pin the language. The game ships in Japanese and the specs assert on
    // English strings — 'Turn 1', 'Rout:', 'Shaman' — because what they are
    // checking is the game logic behind the label, not the translation. Without
    // this, changing the default language breaks a third of the suite and says
    // nothing about whether the game works.
    storageState: {
      cookies: [],
      origins: [
        { origin: 'http://localhost:5178', localStorage: [{ name: 'lang', value: 'en' }] },
      ],
    },
  },
  webServer: {
    command: 'npx vite --port 5178',
    url: 'http://localhost:5178',
    reuseExistingServer: true,
  },
});
