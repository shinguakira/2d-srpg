import { test, expect } from '@playwright/test';

test.describe('Hover Range Preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('hovering a player unit shows movement and attack range overlay', async ({ page }) => {
    // Hover over Shigeru at (10, 10) — Lord class, mov=5
    await page.hover('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Hover range overlay should appear
    const hoverOverlay = page.locator('[data-testid="hover-range-overlay"]');
    await expect(hoverOverlay).toBeVisible();
  });

  test('hovering empty tile clears hover range', async ({ page }) => {
    // First hover a unit
    await page.hover('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    const hoverOverlay = page.locator('[data-testid="hover-range-overlay"]');
    await expect(hoverOverlay).toBeVisible();

    // Hover an empty tile far from any unit
    await page.hover('[data-testid="tile-0-0"]');
    await page.waitForTimeout(200);

    // Overlay should disappear
    await expect(hoverOverlay).not.toBeVisible();
  });

  test('hover range disappears when unit is selected', async ({ page }) => {
    // Hover Shigeru
    await page.hover('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    const hoverOverlay = page.locator('[data-testid="hover-range-overlay"]');
    await expect(hoverOverlay).toBeVisible();

    // Click to select — should switch to selection range, hover range clears
    await page.click('[data-testid="tile-10-10"]');
    await page.waitForTimeout(200);

    // Selection range should be visible instead
    const moveRange = page.locator('[data-testid="move-range-9-10"]');
    await expect(moveRange).toBeVisible();

    // Hover overlay should be gone
    await expect(hoverOverlay).not.toBeVisible();
  });
});
