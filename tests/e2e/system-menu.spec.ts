import { test, expect } from '@playwright/test';

test.describe('System Menu (総合メニュー)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('click empty tile during idle opens system menu', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();
  });

  test('system menu has all 5 items', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="system-menu-units"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-objective"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-settings"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-suspend"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-end-turn"]')).toBeVisible();
  });

  test('Escape closes system menu', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(menu).not.toBeVisible();
  });

  test('click backdrop closes system menu', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();

    // Click far right side (backdrop area)
    await page.click('[data-testid="system-menu-backdrop"]', { position: { x: 900, y: 400 } });
    await page.waitForTimeout(200);
    await expect(menu).not.toBeVisible();
  });

  test('unit list sub-panel opens and closes', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="system-menu-units"]');
    await page.waitForTimeout(200);

    const panel = page.locator('[data-testid="system-menu-unit-list-panel"]');
    await expect(panel).toBeVisible();

    // Escape closes sub-panel but keeps menu open
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(panel).not.toBeVisible();
    await expect(page.locator('[data-testid="system-menu"]')).toBeVisible();
  });

  test('objective sub-panel opens and closes', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="system-menu-objective"]');
    await page.waitForTimeout(200);

    const panel = page.locator('[data-testid="system-menu-objective-panel"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(panel).not.toBeVisible();
  });

  test('settings sub-panel opens and closes', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="system-menu-settings"]');
    await page.waitForTimeout(200);

    const panel = page.locator('[data-testid="system-menu-settings-panel"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(panel).not.toBeVisible();
  });

  test('end turn button closes menu and advances to enemy phase', async ({ page }) => {
    await page.click('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="system-menu-end-turn"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).not.toBeVisible();

    // Phase banner should show enemy phase
    const banner = page.locator('[data-testid="phase-banner"]');
    await expect(banner).toBeVisible();
  });

  test('clicking player unit does not open system menu', async ({ page }) => {
    // Click Ren at (10, 10) — should select unit, not open menu
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).not.toBeVisible();

    // Move range should be visible instead
    const moveRange = page.locator('[data-testid="move-range-9-10"]');
    await expect(moveRange).toBeVisible();
  });

  test('clicking enemy unit opens system menu', async ({ page }) => {
    // Click enemy fighter at (11, 4) — no selectable player unit, should open menu
    await page.click('[data-testid="tile-11-4"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();
  });

  test('clicking already-acted player unit opens system menu', async ({ page }) => {
    // Select Ren at (10, 10)
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Move to adjacent tile
    await page.click('[data-testid="tile-9-10"]');
    await page.waitForTimeout(500);

    // Wait action from action menu
    const waitBtn = page.locator('[data-testid="action-wait"]');
    await expect(waitBtn).toBeVisible();
    await waitBtn.click();
    await page.waitForTimeout(300);

    // Now click the acted unit — should open system menu
    await page.click('[data-testid="tile-9-10"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();
  });
});
