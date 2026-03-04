import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // === BATTLE — FULL WINDOW MAP ===
  await page.goto('http://localhost:5178/?seed=12345');
  await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
  await page.waitForTimeout(500);

  // Screenshot 1: Full-window map
  await page.screenshot({ path: 'screenshots/fix-01-fullmap.png' });
  console.log('Screenshot 01: Full-window map');

  // Screenshot 2: Select unit — movement range
  await page.click('[data-testid="tile-6-10"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/fix-02-selected.png' });
  console.log('Screenshot 02: Unit selected with range');

  // Screenshot 3: Action menu positioned near unit
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await page.click('[data-testid="tile-8-10"]');
  await page.waitForTimeout(200);
  await page.click('[data-testid="tile-7-5"]');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'screenshots/fix-03-action-menu.png' });
  console.log('Screenshot 03: Action menu positioned near unit');

  // Screenshot 4: Click Attack → target enemy → combat starts immediately
  await page.click('[data-testid="action-attack"]');
  await page.waitForTimeout(200);
  await page.click('[data-testid="tile-7-4"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/fix-04-combat-direct.png' });
  console.log('Screenshot 04: Combat starts directly (no confirm)');

  // Screenshot 5: After combat resolves
  await page.waitForTimeout(5000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/fix-05-after-combat.png' });
  console.log('Screenshot 05: After combat');

  // Screenshot 6: End Turn always visible
  const page2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page2.goto('http://localhost:5178/?seed=12345');
  await page2.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
  await page2.waitForTimeout(500);
  // Select a unit so we can show End Turn is still visible during action
  await page2.click('[data-testid="tile-6-10"]');
  await page2.waitForTimeout(300);
  await page2.screenshot({ path: 'screenshots/fix-06-endturn-visible.png' });
  console.log('Screenshot 06: End Turn always visible even during selection');
  await page2.close();

  await browser.close();
})();
