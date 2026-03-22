import { test, expect } from '@playwright/test';

test.describe('Right-Click Unit Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('right-click player unit during idle opens detail modal', async ({ page }) => {
    // Right-click Ren at (10, 10)
    await page.click('[data-testid="tile-10-10"]', { button: 'right' });
    await page.waitForTimeout(200);

    const detail = page.locator('[data-testid="unit-detail-screen"]');
    await expect(detail).toBeVisible();

    // Close by pressing Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(detail).not.toBeVisible();
  });

  test('right-click enemy unit during idle opens detail modal', async ({ page }) => {
    // Right-click enemy fighter at (11, 4)
    await page.click('[data-testid="tile-11-4"]', { button: 'right' });
    await page.waitForTimeout(200);

    const detail = page.locator('[data-testid="unit-detail-screen"]');
    await expect(detail).toBeVisible();
  });

  test('right-click empty tile during idle does nothing', async ({ page }) => {
    // Right-click empty tile
    await page.click('[data-testid="tile-0-0"]', { button: 'right' });
    await page.waitForTimeout(200);

    const detail = page.locator('[data-testid="unit-detail-screen"]');
    await expect(detail).not.toBeVisible();
  });

  test('right-click during move selection cancels action', async ({ page }) => {
    // Select Ren to enter move_target phase
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Move range should be visible
    const moveRange = page.locator('[data-testid="move-range-9-10"]');
    await expect(moveRange).toBeVisible();

    // Right-click to cancel
    await page.click('[data-testid="tile-10-10"]', { button: 'right' });
    await page.waitForTimeout(200);

    // Should be back to idle — move range gone
    await expect(moveRange).not.toBeVisible();
  });
});
