import { test, expect } from '@playwright/test';

test.describe('Unit Movement', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('clicking a player unit shows movement range', async ({ page }) => {
    // Eirik is at (10, 10)
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Eirik has mov=5 as a lord. Should see blue movement tiles
    // Check a tile within range (one step left from Eirik)
    const moveTile = page.locator('[data-testid="move-range-9-10"]');
    await expect(moveTile).toBeVisible();

    // Check another tile in range
    const moveTile2 = page.locator('[data-testid="move-range-11-10"]');
    await expect(moveTile2).toBeVisible();
  });

  test('clicking a valid movement tile shows action menu', async ({ page }) => {
    // Select Eirik
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Click a tile within movement range (9,9 — plain in new 25-col map)
    await page.click('[data-testid="tile-9-9"]');
    await page.waitForTimeout(200);

    // Action menu should appear
    const actionMenu = page.locator('[data-testid="action-menu"]');
    await expect(actionMenu).toBeVisible();

    // Wait button should be present
    await expect(page.locator('[data-testid="action-wait"]')).toBeVisible();
  });

  test('Wait action moves unit and marks it as acted', async ({ page }) => {
    // Select Eirik
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Move to (9, 9)
    await page.click('[data-testid="tile-9-9"]');
    await page.waitForTimeout(200);

    // Click Wait
    await page.click('[data-testid="action-wait"]');
    await page.waitForTimeout(300);

    // Eirik should now be at (9, 9)
    const unitAtNewPos = page.locator('[data-testid="tile-9-9"] [data-testid="unit-eirik"]');
    await expect(unitAtNewPos).toBeVisible();

    // Unit should be marked as acted (grayed out)
    await expect(unitAtNewPos).toHaveAttribute('data-acted', 'true');

    // Original tile should not have Eirik
    const unitAtOldPos = page.locator('[data-testid="tile-10-10"] [data-testid="unit-eirik"]');
    await expect(unitAtOldPos).not.toBeVisible();
  });

  test('Escape cancels selection', async ({ page }) => {
    // Select Eirik
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // A move-range tile should be visible
    await expect(page.locator('[data-testid="move-range-9-10"]')).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Move range tiles should be gone
    await expect(page.locator('[data-testid="move-range-9-10"]')).not.toBeVisible();
  });

  test('Cancel in action menu returns to move target', async ({ page }) => {
    // Select Eirik
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Move to (9, 9)
    await page.click('[data-testid="tile-9-9"]');
    await page.waitForTimeout(200);

    // Cancel from action menu
    await page.click('[data-testid="action-cancel"]');
    await page.waitForTimeout(200);

    // Should go back to move target — move range tiles should be visible
    await expect(page.locator('[data-testid="move-range-9-9"]')).toBeVisible();

    // Action menu should be gone
    await expect(page.locator('[data-testid="action-menu"]')).not.toBeVisible();
  });

  test('cannot select enemy units', async ({ page }) => {
    // fighter_3 is at (11, 4) — try clicking it
    await page.click('[data-testid="tile-11-4"]');
    await page.waitForTimeout(200);

    // No move-range tiles should appear (enemies can't be selected)
    const moveRangeCount = await page.locator('[data-testid^="move-range-"]').count();
    expect(moveRangeCount).toBe(0);
  });

  test('clicking occupied tile switches selection to that unit', async ({ page }) => {
    // Select Eirik at (10, 10)
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Try to click Seth's position (13, 10) — should switch selection to Seth
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);

    // Should now have Seth selected — Seth is cavalier with mov=7, so range extends further
    // Check a tile that's far from Eirik but within Seth's range
    const moveTile = page.locator('[data-testid="move-range-13-5"]');
    await expect(moveTile).toBeVisible();
  });
});
