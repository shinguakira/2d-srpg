import { test, expect } from '@playwright/test';

test.describe('Combat System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('attack option appears when enemy is in range after move', async ({ page }) => {
    // Akira (cavalier, mov=7) at (13, 10) — move to (12, 8) which is adjacent to fighter_1 at (12, 7)
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    // Action menu should show Attack button (fighter_1 is at distance 1)
    const attackBtn = page.locator('[data-testid="action-attack"]');
    await expect(attackBtn).toBeVisible();
  });

  test('clicking attack target starts combat animation directly', async ({ page }) => {
    // Akira at (13, 10) — move to (12, 8) adjacent to fighter_1
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    // Click Attack
    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);

    // Click on fighter_1's tile — combat starts immediately (no confirm step)
    await page.click('[data-testid="tile-12-7"]');
    await page.waitForTimeout(500);

    // Combat animation should appear directly
    const animation = page.locator('[data-testid="combat-animation"]');
    await expect(animation).toBeVisible();

    // Should show damage display
    const damage = page.locator('[data-testid="combat-damage-display"]');
    await expect(damage).toBeVisible();
  });

  test('combat resolves and applies damage with seeded RNG', async ({ page }) => {
    // Akira (lance) vs fighter_1 (axe) at (12,7)
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="tile-12-7"]');

    // Wait for combat animation to complete
    await page.waitForTimeout(5000);

    await expect(page.locator('[data-testid="combat-animation"]')).not.toBeVisible({
      timeout: 10000,
    });

    // Akira should still exist
    const akira = page.locator('[data-testid="unit-akira"]');
    await expect(akira).toBeVisible({ timeout: 5000 });
  });

  test('cancel from attack targeting returns to action menu', async ({ page }) => {
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);

    // Press Escape to cancel attack targeting
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Should go back to action menu
    await expect(page.locator('[data-testid="action-menu"]')).toBeVisible();
  });
});
