import { test, expect } from '@playwright/test';

test.describe('Chapter 4 — Ancient Horrors', () => {
  test('map loads with correct dimensions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    const grid = page.locator('[data-testid="tactical-grid"]');
    await expect(grid).toHaveAttribute('data-grid-width', '18');
    await expect(grid).toHaveAttribute('data-grid-height', '10');
  });

  test('player units are at correct positions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    await expect(page.locator('[data-testid="tile-7-9"] [data-testid="unit-eirik"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-10-9"] [data-testid="unit-seth"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-6-9"] [data-testid="unit-lute"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-11-9"] [data-testid="unit-natasha"]')).toBeVisible();
  });

  test('enemy units are present and at correct positions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // 11 enemies total
    await expect(page.locator('[data-testid="tile-4-7"] [data-testid="unit-ch4_soldier_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-13-7"] [data-testid="unit-ch4_soldier_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-15-5"] [data-testid="unit-ch4_soldier_3"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-8-5"] [data-testid="unit-ch4_fighter_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-3-5"] [data-testid="unit-ch4_fighter_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-13-3"] [data-testid="unit-ch4_fighter_3"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-11-3"] [data-testid="unit-ch4_mage_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-5-3"] [data-testid="unit-ch4_mage_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-7-4"] [data-testid="unit-ch4_guard_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-4-1"] [data-testid="unit-ch4_guard_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-8-0"] [data-testid="unit-ch4_boss"]')).toBeVisible();
  });

  test('dungeon terrain — walls and corridors', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Walls surrounding the dungeon
    await expect(page.locator('[data-testid="tile-0-0"]')).toHaveAttribute('data-terrain', 'wall');
    await expect(page.locator('[data-testid="tile-17-0"]')).toHaveAttribute('data-terrain', 'wall');
    await expect(page.locator('[data-testid="tile-0-5"]')).toHaveAttribute('data-terrain', 'wall');

    // Throne at (8,0)
    await expect(page.locator('[data-testid="tile-8-0"]')).toHaveAttribute('data-terrain', 'throne');

    // Forts inside corridors
    await expect(page.locator('[data-testid="tile-7-4"]')).toHaveAttribute('data-terrain', 'fort');
    await expect(page.locator('[data-testid="tile-7-7"]')).toHaveAttribute('data-terrain', 'fort');

    // Village in side alcove
    await expect(page.locator('[data-testid="tile-14-6"]')).toHaveAttribute('data-terrain', 'village');

    // Corridor passable tiles (row 5 main east-west corridor)
    await expect(page.locator('[data-testid="tile-1-5"]')).toHaveAttribute('data-terrain', 'plain');
    await expect(page.locator('[data-testid="tile-8-5"]')).toHaveAttribute('data-terrain', 'plain');
    await expect(page.locator('[data-testid="tile-14-5"]')).toHaveAttribute('data-terrain', 'plain');
  });

  test('objective displays as seize', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    await expect(page.locator('text=Seize the throne')).toBeVisible();
  });

  test('boss is on the throne tile', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Boss Naxos should be on the throne tile
    const throneTile = page.locator('[data-testid="tile-8-0"]');
    await expect(throneTile).toHaveAttribute('data-terrain', 'throne');
    await expect(throneTile.locator('[data-testid="unit-ch4_boss"]')).toBeVisible();
  });

  test('turn system works — enemy phase cycles correctly', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch4');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(500);

    await expect(page.locator('text=Turn 1')).toBeVisible();

    // End turn
    const endTurnBtn = page.locator('[data-testid="end-turn-button"]');
    await endTurnBtn.click();

    // Wait for enemy phase to complete
    await page.waitForTimeout(20000);

    // Should be back to player phase
    await expect(page.locator('[data-testid="end-turn-button"]')).toBeVisible({ timeout: 15000 });
  });
});
