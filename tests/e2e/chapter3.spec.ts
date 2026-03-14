import { test, expect } from '@playwright/test';

test.describe('Chapter 3 — The Bandits of Borgo', () => {
  test('map loads with correct dimensions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    const grid = page.locator('[data-testid="tactical-grid"]');
    await expect(grid).toHaveAttribute('data-grid-width', '14');
    await expect(grid).toHaveAttribute('data-grid-height', '12');
  });

  test('player units are at correct positions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    await expect(page.locator('[data-testid="tile-5-10"] [data-testid="unit-eirik"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-7-10"] [data-testid="unit-seth"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-6-11"] [data-testid="unit-lute"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-8-11"] [data-testid="unit-natasha"]')).toBeVisible();
  });

  test('enemy units are present and at correct positions', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // 8 enemies total
    await expect(page.locator('[data-testid="tile-5-5"] [data-testid="unit-ch3_fighter_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-8-6"] [data-testid="unit-ch3_fighter_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-3-3"] [data-testid="unit-ch3_fighter_3"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-9-3"] [data-testid="unit-ch3_soldier_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-4-4"] [data-testid="unit-ch3_soldier_2"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-7-2"] [data-testid="unit-ch3_mage_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-6-3"] [data-testid="unit-ch3_guard_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="tile-6-5"] [data-testid="unit-ch3_boss"]')).toBeVisible();
  });

  test('terrain features are correct', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Mountains at corners
    await expect(page.locator('[data-testid="tile-0-0"]')).toHaveAttribute('data-terrain', 'mountain');
    await expect(page.locator('[data-testid="tile-13-0"]')).toHaveAttribute('data-terrain', 'mountain');

    // Villages
    await expect(page.locator('[data-testid="tile-3-2"]')).toHaveAttribute('data-terrain', 'village');
    await expect(page.locator('[data-testid="tile-10-2"]')).toHaveAttribute('data-terrain', 'village');

    // Forts
    await expect(page.locator('[data-testid="tile-6-3"]')).toHaveAttribute('data-terrain', 'fort');
    await expect(page.locator('[data-testid="tile-6-5"]')).toHaveAttribute('data-terrain', 'fort');

    // Water (pond)
    await expect(page.locator('[data-testid="tile-1-4"]')).toHaveAttribute('data-terrain', 'water');
    await expect(page.locator('[data-testid="tile-1-5"]')).toHaveAttribute('data-terrain', 'water');
  });

  test('objective displays as rout', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Rout objective shows as "Rout: 0/N defeated"
    await expect(page.locator('[data-testid="objective-text"]')).toContainText('Rout:');
    await expect(page.locator('[data-testid="objective-text"]')).toContainText('defeated');
  });

  test('first enemy mage has magic weapon', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Click mage to see stats
    await page.click('[data-testid="tile-7-2"]');
    await page.waitForTimeout(300);

    // Should show unit stats with Fire weapon
    await expect(page.locator('text=Shaman')).toBeVisible();
    await expect(page.locator('text=Fire')).toBeVisible();
  });

  test('turn system works — enemy phase cycles correctly', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true&chapter=ch3');
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
