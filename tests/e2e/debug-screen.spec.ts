import { test } from '@playwright/test';

test.describe('Debug Screen Screenshots', () => {
  test('01 - Characters list with sprites', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'screenshots/debug/01-characters-list.png' });
  });

  test('02 - Player unit detail (Ren)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-ren"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/02-ren-detail.png' });
  });

  test('03 - Player unit detail (Kael - Cavalier)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-kael"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/03-kael-detail.png' });
  });

  test('04 - Player unit detail (Senna - Mage)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-senna"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/04-senna-detail.png' });
  });

  test('05 - Player unit detail (Lira - Cleric)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-lira"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/05-lira-detail.png' });
  });

  test('06 - Enemy unit detail (Bone - Boss)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-bone"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/06-bone-detail.png' });
  });

  test('07 - Weapons tab with icons', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-tab-items"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/07-weapons-list.png' });
  });

  test('08 - Weapon detail (Iron Sword)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-tab-items"]');
    await page.waitForTimeout(100);
    await page.click('[data-testid="debug-weapon-iron_sword"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/08-iron-sword-detail.png' });
  });

  test('09 - Weapon detail (Fire tome)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-tab-items"]');
    await page.waitForTimeout(100);
    await page.click('[data-testid="debug-weapon-fire"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/09-fire-detail.png' });
  });

  test('10 - Weapon detail (Heal Staff)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-tab-items"]');
    await page.waitForTimeout(100);
    await page.click('[data-testid="debug-weapon-heal_staff"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/10-heal-staff-detail.png' });
  });

  test('11 - Consumables tab (Vulnerary)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-tab-items"]');
    await page.waitForTimeout(100);
    await page.click('[data-testid="debug-subtab-consumables"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/11-consumables.png' });
  });

  test('12 - Enemy unit detail (Soldier with guard AI)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-soldier_1"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/12-soldier-guard.png' });
  });
});
