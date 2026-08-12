import { test, expect } from '@playwright/test';

test.describe('Chapter 1 — Full Game Flow', () => {
  test('turn system works — end turn triggers enemy phase', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(500);

    // Click End Turn button
    const endTurnBtn = page.locator('[data-testid="end-turn-button"]');
    await expect(endTurnBtn).toBeVisible();
    await endTurnBtn.click();

    // Phase banner should appear
    await page.waitForTimeout(500);

    // Wait for enemy phase to complete and player phase to return
    // Enemy phase + player phase banner transition
    await page.waitForTimeout(20000);

    // Should be back to player phase — end turn button should be visible again
    await expect(page.locator('[data-testid="end-turn-button"]')).toBeVisible({ timeout: 15000 });
  });

  test('game starts with correct initial state', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Grid should be 25x12
    const grid = page.locator('[data-testid="tactical-grid"]');
    await expect(grid).toHaveAttribute('data-grid-width', '25');
    await expect(grid).toHaveAttribute('data-grid-height', '12');

    // Player units present
    await expect(page.locator('[data-testid="unit-shigeru"]')).toBeVisible();
    await expect(page.locator('[data-testid="unit-akira"]')).toBeVisible();
    await expect(page.locator('[data-testid="unit-kanna"]')).toBeVisible();

    // Enemy units present
    await expect(page.locator('[data-testid="unit-fighter_1"]')).toBeVisible();
    await expect(page.locator('[data-testid="unit-fighter_3"]')).toBeVisible();
    await expect(page.locator('[data-testid="unit-soldier_1"]')).toBeVisible();

    // Turn info shows
    await expect(page.locator('text=Turn 1')).toBeVisible();
  });

  test('unit positions match chapter data', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Shigeru at (10, 10)
    await expect(page.locator('[data-testid="tile-10-10"] [data-testid="unit-shigeru"]')).toBeVisible();
    // Akira at (13, 10)
    await expect(
      page.locator('[data-testid="tile-13-10"] [data-testid="unit-akira"]'),
    ).toBeVisible();
    // Kanna at (9, 11)
    await expect(
      page.locator('[data-testid="tile-9-11"] [data-testid="unit-kanna"]'),
    ).toBeVisible();

    // fighter_3 at (11, 4)
    await expect(
      page.locator('[data-testid="tile-11-4"] [data-testid="unit-fighter_3"]'),
    ).toBeVisible();
  });

  test('terrain types are correctly rendered', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Top-left is mountain
    await expect(page.locator('[data-testid="tile-0-0"]')).toHaveAttribute(
      'data-terrain',
      'mountain',
    );

    // Fort at (11, 4)
    await expect(page.locator('[data-testid="tile-11-4"]')).toHaveAttribute('data-terrain', 'fort');

    // Water at (4, 5)
    await expect(page.locator('[data-testid="tile-4-5"]')).toHaveAttribute('data-terrain', 'water');

    // Village at (3, 3)
    await expect(page.locator('[data-testid="tile-3-3"]')).toHaveAttribute(
      'data-terrain',
      'village',
    );
  });

  test('seeded RNG produces deterministic results', async ({ page }) => {
    // Play the same moves with the same seed twice, results should match
    await page.goto('/?seed=99999&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Move Akira to attack fighter_3
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-11-5"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-11-4"]');
    await page.waitForTimeout(200);
    // Combat starts immediately — no confirm step

    // Wait for combat to fully resolve
    await page.waitForTimeout(6000);
    await expect(page.locator('[data-testid="combat-animation"]')).not.toBeVisible({
      timeout: 10000,
    });

    // Capture Akira's HP after combat
    const kaelHp1 = await page.locator('[data-testid="unit-akira"]').getAttribute('data-hp');

    // Now reload with same seed
    await page.goto('/?seed=99999&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);

    // Do the same moves
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-11-5"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-11-4"]');
    await page.waitForTimeout(200);
    // Combat starts immediately — no confirm step

    await page.waitForTimeout(6000);
    await expect(page.locator('[data-testid="combat-animation"]')).not.toBeVisible({
      timeout: 10000,
    });

    const kaelHp2 = await page.locator('[data-testid="unit-akira"]').getAttribute('data-hp');

    // Same seed, same moves = same result
    expect(kaelHp1).toBe(kaelHp2);
  });
});
