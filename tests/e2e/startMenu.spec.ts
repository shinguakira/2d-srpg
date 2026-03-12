import { test, expect } from '@playwright/test';

test.describe('Start Menu & Dialogue', () => {
  test('title screen renders with buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="new-game"]')).toBeVisible();
    await expect(page.locator('[data-testid="continue-game"]')).toBeVisible();
    await expect(page.locator('[data-testid="chapter-select"]')).toBeVisible();
  });

  test('continue button is disabled when no saves', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });

    await expect(page.locator('[data-testid="continue-game"]')).toBeDisabled();
  });

  test('new game starts prologue dialogue', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });

    await page.click('[data-testid="new-game"]');
    await page.waitForTimeout(200);

    // Mode selection screen appears — confirm with default (Classic)
    await page.click('[data-testid="mode-confirm"]');
    await page.waitForTimeout(300);

    // Dialogue box should appear
    await expect(page.locator('[data-testid="dialogue-box"]')).toBeVisible();

    // First line should be the narrator
    await expect(page.locator('.dialogue__speaker')).toContainText('Narrator');
  });

  test('clicking through all dialogue lines reaches battle', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });

    await page.click('[data-testid="new-game"]');
    await page.waitForTimeout(200);

    // Mode selection screen — confirm with default (Classic)
    await page.click('[data-testid="mode-confirm"]');
    await page.waitForTimeout(300);

    // Ch1 prologue has 7 lines — click through all of them
    for (let i = 0; i < 7; i++) {
      await page.click('[data-testid="dialogue-box"]');
      await page.waitForTimeout(150);
    }

    // After all dialogue lines, should be in battle
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="tactical-grid"]')).toBeVisible();
  });

  test('seed param bypasses title and goes straight to battle', async ({ page }) => {
    await page.goto('/?seed=12345&skipWalkAnim=true');
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });

    // Should be directly in battle, no title screen
    await expect(page.locator('[data-testid="tactical-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="title-screen"]')).not.toBeVisible();
  });

  test('chapter select shows ch1', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });

    await page.click('[data-testid="chapter-select"]');
    await page.waitForTimeout(200);

    await expect(page.locator('[data-testid="chapter-select-ch1"]')).toBeVisible();
  });
});
