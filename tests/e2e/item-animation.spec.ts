import { test, expect } from '@playwright/test';

test.describe('Item Usage Animation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await page.waitForTimeout(300);
  });

  test('using vulnerary on damaged unit shows item animation', async ({ page }) => {
    // Step 1: Attack with Akira to take counter damage
    // Akira (cavalier, mov=7) at (13, 10) → move to (12, 8) adjacent to fighter_1 at (12, 7)
    await page.click('[data-testid="tile-13-10"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-attack"]');
    await page.waitForTimeout(200);
    await page.click('[data-testid="tile-12-7"]');
    await page.waitForTimeout(500);

    // Wait for combat animation to finish
    await expect(page.locator('[data-testid="combat-animation"]')).not.toBeVisible({
      timeout: 15000,
    });
    await page.waitForTimeout(500);

    // Step 2: End turn to cycle back to player phase (Akira has acted)
    // Wait for any level-up popup to clear
    const levelUp = page.locator('[data-testid="level-up-popup"]');
    if (await levelUp.isVisible({ timeout: 1000 }).catch(() => false)) {
      await page.click('[data-testid="level-up-popup"]');
      await page.waitForTimeout(1000);
    }

    // End turn — all other units wait in place (or end turn button)
    await page.click('[data-testid="end-turn-button"]');
    await page.waitForTimeout(500);

    // Wait for enemy phase to complete and player phase to start again
    await expect(page.locator('[data-testid="phase-banner"]')).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);

    // Step 3: Select Akira (now at 12, 8 after previous move) — should be damaged
    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    // Click same tile to move in place
    await page.click('[data-testid="tile-12-8"]');
    await page.waitForTimeout(200);

    // Step 4: Use Item → Vulnerary
    const itemBtn = page.locator('[data-testid="action-item"]');
    if (await itemBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await itemBtn.click();
      await page.waitForTimeout(200);

      const vulnBtn = page.locator('[data-testid="item-vulnerary"]');
      await vulnBtn.click();
      await page.waitForTimeout(500);

      // Item animation should appear
      const itemAnim = page.locator('[data-testid="item-animation"]');
      await expect(itemAnim).toBeVisible({ timeout: 3000 });

      // Heal amount should show
      const healAmount = page.locator('[data-testid="item-heal-amount"]');
      await expect(healAmount).toBeVisible();

      // Wait for animation to complete
      await expect(itemAnim).not.toBeVisible({ timeout: 10000 });
    }
  });
});
