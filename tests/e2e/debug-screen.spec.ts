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

  test('02 - Player unit detail (Shigeru)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-shigeru"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/02-shigeru-detail.png' });
  });

  test('03 - Player unit detail (Akira - Cavalier)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-akira"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/03-akira-detail.png' });
  });

  test('04 - Player unit detail (Lisette - Mage)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-lisette"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/04-lisette-detail.png' });
  });

  test('05 - Player unit detail (Mirelle - Cleric)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="debug-btn"]');
    await page.waitForSelector('[data-testid="debug-screen"]', { timeout: 5000 });
    await page.click('[data-testid="debug-unit-mirelle"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/debug/05-mirelle-detail.png' });
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
