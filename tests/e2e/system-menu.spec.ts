import { test, expect } from '@playwright/test';

test.describe('System Menu (総合メニュー)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('click empty tile during idle opens system menu', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();
  });

  test('system menu has all 5 items', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="system-menu-units"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-objective"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-settings"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-suspend"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-menu-end-turn"]')).toBeVisible();
  });

  test('Escape closes system menu', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(menu).not.toBeVisible();
  });

  test('clicking the map closes system menu', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).toBeVisible();

    // There is no backdrop — the map itself stays clickable and dismisses.
    await page.click('[data-testid="tile-8-8"]');
    await page.waitForTimeout(200);
    await expect(menu).not.toBeVisible();
  });

  test('system menu does not dim or cover the map', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
    await page.waitForTimeout(200);
    await expect(page.locator('[data-testid="system-menu"]')).toBeVisible();

    // No blocking overlay should exist at all.
    await expect(page.locator('[data-testid="system-menu-backdrop"]')).toHaveCount(0);

    // A tile well away from the top-left menu must still be the topmost element.
    const reachable = await page.evaluate(() => {
      const t = document.querySelector('[data-testid="tile-8-8"]');
      if (!t) return false;
      const r = t.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!top && t.contains(top);
    });
    expect(reachable).toBe(true);
  });

  test('unit list sub-panel opens and closes', async ({ page }) => {
    await page.click('[data-testid="tile-5-6"]');
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
    await page.click('[data-testid="tile-5-6"]');
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
    await page.click('[data-testid="tile-5-6"]');
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
    await page.click('[data-testid="tile-5-6"]');
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
    // Click Shigeru at (11, 10) — should select unit, not open menu
    await page.click('[data-testid="tile-11-10"]');
    await page.waitForTimeout(200);

    const menu = page.locator('[data-testid="system-menu"]');
    await expect(menu).not.toBeVisible();

    // Move range should be visible instead
    const moveRange = page.locator('[data-testid="move-range-10-10"]');
    await expect(moveRange).toBeVisible();
  });

  test('clicking enemy unit does not open system menu', async ({ page }) => {
    // Inspecting an enemy must not be treated as clicking empty ground.
    await page.click('[data-testid="tile-12-7"]');
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="system-menu"]')).not.toBeVisible();
  });

  test('clicking already-acted player unit does not open system menu', async ({ page }) => {
    // Select Shigeru at (11, 10)
    await page.click('[data-testid="tile-11-10"]');
    await page.waitForTimeout(200);

    // Move to adjacent tile
    await page.click('[data-testid="tile-9-10"]');
    await page.waitForTimeout(500);

    // Wait action from action menu
    const waitBtn = page.locator('[data-testid="action-wait"]');
    await expect(waitBtn).toBeVisible();
    await waitBtn.click();
    await page.waitForTimeout(300);

    // Clicking the spent unit is an inspect, not empty ground.
    await page.click('[data-testid="tile-9-10"]');
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="system-menu"]')).not.toBeVisible();
  });
});
