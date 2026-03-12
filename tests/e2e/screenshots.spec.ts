import { test, expect } from '@playwright/test';

const SEED = '12345';

// Helper: start battle, wait for phase banner to dismiss
async function startBattle(page: import('@playwright/test').Page) {
  await page.goto(`/?seed=${SEED}&skipWalkAnim=true`);
  await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
  // Wait for phase banner to appear and dismiss (2s animation + buffer)
  await page.waitForTimeout(2800);
}

// Helper: end player turn and wait for enemy phase to fully resolve
async function endTurnAndWait(page: import('@playwright/test').Page) {
  await page.keyboard.press('e');
  // Wait for enemy phase banner (2s) + AI actions + possible combats + player phase banner (2s)
  await page.waitForTimeout(3000);
  // Wait for any enemy combat animations to finish
  for (let i = 0; i < 10; i++) {
    const combat = page.locator('[data-testid="combat-animation"]');
    if (await combat.isVisible().catch(() => false)) {
      await page.waitForSelector('[data-testid="combat-animation"]', { state: 'hidden', timeout: 20000 });
      await page.waitForTimeout(500);
    } else {
      break;
    }
  }
  // Dismiss level-up popups
  for (let i = 0; i < 5; i++) {
    const lu = page.locator('[data-testid="level-up-popup"]');
    if (await lu.isVisible().catch(() => false)) {
      await lu.click();
      await page.waitForTimeout(500);
    } else {
      break;
    }
  }
  // Wait for player phase banner to dismiss
  await page.waitForTimeout(3000);
}

// Helper: click a tile
async function clickTile(page: import('@playwright/test').Page, x: number, y: number) {
  await page.click(`[data-testid="tile-${x}-${y}"]`);
  await page.waitForTimeout(300);
}

test.describe('Screenshot Report — Menus & Screens', () => {
  test('01 - Title Screen', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/e2e/01-title-screen.png' });
  });

  test('02 - Difficulty Selection', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="new-game"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/e2e/02-difficulty-select.png' });
  });

  test('03 - Prologue Dialogue', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="new-game"]');
    await page.waitForTimeout(300);
    // Select Classic and confirm
    await page.click('[data-testid="mode-confirm"]');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/e2e/03-prologue-dialogue.png' });
  });

  test('04 - Chapter Select', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="title-screen"]', { timeout: 10000 });
    await page.click('[data-testid="chapter-select"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/e2e/04-chapter-select.png' });
  });
});

test.describe('Screenshot Report — Phase Banners', () => {
  test('05 - Player Phase Banner', async ({ page }) => {
    await page.goto(`/?seed=${SEED}&skipWalkAnim=true`);
    await page.waitForSelector('[data-testid="tactical-grid"]', { timeout: 10000 });
    // Phase banner appears immediately for 2s — capture it early
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/e2e/05-player-phase-banner.png' });
  });

  test('06 - Enemy Phase Banner', async ({ page }) => {
    await startBattle(page);
    await page.keyboard.press('e');
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'screenshots/e2e/06-enemy-phase-banner.png' });
  });
});

test.describe('Screenshot Report — Battle Map & UI Panels', () => {
  test('07 - Battle Map Overview', async ({ page }) => {
    await startBattle(page);
    await page.screenshot({ path: 'screenshots/e2e/07-battle-map.png' });
  });

  test('08 - Unit Stats Panel (player)', async ({ page }) => {
    await startBattle(page);
    await page.hover('[data-testid="tile-6-10"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/e2e/08-unit-stats-player.png' });
  });

  test('09 - Terrain Info (forest)', async ({ page }) => {
    await startBattle(page);
    await page.hover('[data-testid="tile-4-4"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/e2e/09-terrain-forest.png' });
  });

  test('10 - Terrain Info (fort)', async ({ page }) => {
    await startBattle(page);
    await page.hover('[data-testid="tile-7-4"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/e2e/10-terrain-fort.png' });
  });

  test('11 - Unit Detail Screen (Eirik)', async ({ page }) => {
    await startBattle(page);
    await clickTile(page, 6, 10);
    await page.keyboard.press('i');
    await page.waitForSelector('[data-testid="unit-detail-screen"]', { timeout: 3000 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/e2e/11-unit-detail-eirik.png' });
  });

  test('12 - Unit Detail Screen (Boss)', async ({ page }) => {
    await startBattle(page);
    // Boss Bone at (7,1) on throne
    await page.hover('[data-testid="tile-7-1"]');
    await page.waitForTimeout(200);
    await clickTile(page, 7, 1);
    await page.keyboard.press('i');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/e2e/12-unit-detail-boss.png' });
  });

  test('13 - Danger Zone Overlay', async ({ page }) => {
    await startBattle(page);
    await page.keyboard.press('x');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'screenshots/e2e/13-danger-zone.png' });
  });
});

test.describe('Screenshot Report — Movement & Actions', () => {
  test('14 - Movement Range (Eirik)', async ({ page }) => {
    await startBattle(page);
    await clickTile(page, 6, 10); // Select Eirik
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/e2e/14-movement-range.png' });
  });

  test('15 - Action Menu (Seth with weapons)', async ({ page }) => {
    await startBattle(page);
    // Select Seth at (8,10), move to (9,9)
    await clickTile(page, 8, 10);
    await clickTile(page, 9, 9);
    await page.waitForSelector('[data-testid="action-menu"]', { timeout: 5000 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/e2e/15-action-menu.png' });
  });

  test('16 - Action Menu (Eirik move up)', async ({ page }) => {
    await startBattle(page);
    // Select Eirik, move to (6,9)
    await clickTile(page, 6, 10);
    await clickTile(page, 5, 9);
    await page.waitForSelector('[data-testid="action-menu"]', { timeout: 5000 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/e2e/16-action-menu-eirik.png' });
  });
});

test.describe('Screenshot Report — Combat (enemy advances first)', () => {
  // Enemies start far away. End turn 1 so aggressive enemies advance south.
  // On turn 2, player units can reach and attack them.

  test('17 - Combat Forecast', async ({ page }) => {
    test.setTimeout(120000);
    await startBattle(page);

    // Turn 1: end turn to let enemies advance
    await endTurnAndWait(page);

    // Turn 2: Move Seth toward enemies. Aggressive fighters should have moved ~3 tiles south.
    // fighter_1 started at (5,2) → ~(5,5), fighter_2 at (9,2) → ~(9,5)
    // Seth is at (8,10), MOV 7. Try to reach adjacent to where enemies moved.
    await clickTile(page, 8, 10);
    await page.waitForTimeout(200);

    // Try clicking (10,4) — Seth should be able to reach this via east route
    await clickTile(page, 10, 4);
    await page.waitForTimeout(300);

    const actionMenu = page.locator('[data-testid="action-menu"]');
    if (await actionMenu.isVisible().catch(() => false)) {
      const attackBtn = page.locator('[data-testid="action-attack"]');
      if (await attackBtn.isVisible().catch(() => false)) {
        await attackBtn.click();
        await page.waitForTimeout(300);
        // Look for attack target overlays and hover them for forecast
        const targets = page.locator('[data-testid^="attack-target-"]');
        const count = await targets.count();
        if (count > 0) {
          // Get the first target's position from data-testid
          const firstTarget = targets.first();
          const testId = await firstTarget.getAttribute('data-testid');
          if (testId) {
            const match = testId.match(/attack-target-(\d+)-(\d+)/);
            if (match) {
              await page.hover(`[data-testid="tile-${match[1]}-${match[2]}"]`);
              await page.waitForTimeout(500);
            }
          }
        }
        await page.screenshot({ path: 'screenshots/e2e/17-combat-forecast.png' });
        return;
      }
      // No attack available from (10,4), cancel
      await page.click('[data-testid="action-cancel"]');
      await page.waitForTimeout(200);
    }

    // Fallback: try Eirik at (6,10) → move to (5,5) area
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await clickTile(page, 6, 10);
    await page.waitForTimeout(200);
    await clickTile(page, 5, 5);
    await page.waitForTimeout(300);

    const actionMenu2 = page.locator('[data-testid="action-menu"]');
    if (await actionMenu2.isVisible().catch(() => false)) {
      const attackBtn2 = page.locator('[data-testid="action-attack"]');
      if (await attackBtn2.isVisible().catch(() => false)) {
        await attackBtn2.click();
        await page.waitForTimeout(300);
        const targets = page.locator('[data-testid^="attack-target-"]');
        const count = await targets.count();
        if (count > 0) {
          const firstTarget = targets.first();
          const testId = await firstTarget.getAttribute('data-testid');
          if (testId) {
            const match = testId.match(/attack-target-(\d+)-(\d+)/);
            if (match) {
              await page.hover(`[data-testid="tile-${match[1]}-${match[2]}"]`);
              await page.waitForTimeout(500);
            }
          }
        }
      }
    }
    await page.screenshot({ path: 'screenshots/e2e/17-combat-forecast.png' });
  });

  test('18 - Combat Animation + Level Up', async ({ page }) => {
    test.setTimeout(120000);
    await startBattle(page);

    // Turn 1: end turn
    await endTurnAndWait(page);

    // Turn 2: find and attack an enemy
    // Try Seth first
    await clickTile(page, 8, 10);
    await page.waitForTimeout(200);
    await clickTile(page, 10, 4);
    await page.waitForTimeout(300);

    let attacked = false;
    const actionMenu = page.locator('[data-testid="action-menu"]');
    if (await actionMenu.isVisible().catch(() => false)) {
      const attackBtn = page.locator('[data-testid="action-attack"]');
      if (await attackBtn.isVisible().catch(() => false)) {
        await attackBtn.click();
        await page.waitForTimeout(200);
        // Click first available target
        const targets = page.locator('[data-testid^="attack-target-"]');
        const count = await targets.count();
        if (count > 0) {
          const firstTarget = targets.first();
          const testId = await firstTarget.getAttribute('data-testid');
          if (testId) {
            const match = testId.match(/attack-target-(\d+)-(\d+)/);
            if (match) {
              await page.click(`[data-testid="tile-${match[1]}-${match[2]}"]`);
              attacked = true;
            }
          }
        }
        if (!attacked) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      }
      if (!attacked) {
        await page.click('[data-testid="action-cancel"]');
        await page.waitForTimeout(200);
      }
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }

    if (!attacked) {
      // Try Eirik
      await clickTile(page, 6, 10);
      await page.waitForTimeout(200);
      await clickTile(page, 5, 5);
      await page.waitForTimeout(300);
      const am2 = page.locator('[data-testid="action-menu"]');
      if (await am2.isVisible().catch(() => false)) {
        const ab2 = page.locator('[data-testid="action-attack"]');
        if (await ab2.isVisible().catch(() => false)) {
          await ab2.click();
          await page.waitForTimeout(200);
          const targets = page.locator('[data-testid^="attack-target-"]');
          const count = await targets.count();
          if (count > 0) {
            const firstTarget = targets.first();
            const testId = await firstTarget.getAttribute('data-testid');
            if (testId) {
              const match = testId.match(/attack-target-(\d+)-(\d+)/);
              if (match) {
                await page.click(`[data-testid="tile-${match[1]}-${match[2]}"]`);
                attacked = true;
              }
            }
          }
        }
      }
    }

    if (attacked) {
      await page.waitForSelector('[data-testid="combat-animation"]', { timeout: 5000 });
      await page.waitForTimeout(700);
      await page.screenshot({ path: 'screenshots/e2e/18a-combat-animation.png' });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'screenshots/e2e/18b-combat-mid.png' });
      await page.waitForSelector('[data-testid="combat-animation"]', { state: 'hidden', timeout: 15000 });
      await page.waitForTimeout(300);

      const levelUp = page.locator('[data-testid="level-up-popup"]');
      if (await levelUp.isVisible().catch(() => false)) {
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'screenshots/e2e/18c-level-up.png' });
        await levelUp.click();
        await page.waitForTimeout(300);
      }
      await page.screenshot({ path: 'screenshots/e2e/18d-post-combat.png' });
    } else {
      await page.screenshot({ path: 'screenshots/e2e/18-no-combat-found.png' });
    }
  });

  test('19 - Enemy Attacks Player', async ({ page }) => {
    test.setTimeout(120000);
    await startBattle(page);

    // Move player units north to bait enemies into attacking on their turn
    // Move Eirik from (6,10) to (6,6)
    await clickTile(page, 6, 10);
    await clickTile(page, 6, 6);
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-wait"]');
    await page.waitForTimeout(200);

    // Move Seth from (8,10) to (9,5)
    await clickTile(page, 8, 10);
    await clickTile(page, 9, 5);
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-wait"]');
    await page.waitForTimeout(200);

    // End turn — enemies will move south and attack
    await page.keyboard.press('e');
    await page.waitForTimeout(2500);

    // Try to catch enemy combat animation
    const combat = page.locator('[data-testid="combat-animation"]');
    if (await combat.isVisible().catch(() => false)) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: 'screenshots/e2e/19a-enemy-combat-anim.png' });
      await page.waitForSelector('[data-testid="combat-animation"]', { state: 'hidden', timeout: 15000 });
      await page.waitForTimeout(200);
    }

    // Dismiss level-ups
    for (let i = 0; i < 3; i++) {
      const lu = page.locator('[data-testid="level-up-popup"]');
      if (await lu.isVisible().catch(() => false)) {
        await lu.click();
        await page.waitForTimeout(400);
      } else break;
    }

    // Wait for more combat animations
    for (let i = 0; i < 5; i++) {
      if (await combat.isVisible().catch(() => false)) {
        await page.waitForSelector('[data-testid="combat-animation"]', { state: 'hidden', timeout: 15000 });
        await page.waitForTimeout(200);
        const lu = page.locator('[data-testid="level-up-popup"]');
        if (await lu.isVisible().catch(() => false)) {
          await lu.click();
          await page.waitForTimeout(300);
        }
      } else break;
    }

    // Wait for player phase return
    await page.waitForTimeout(3500);
    await page.screenshot({ path: 'screenshots/e2e/19b-after-enemy-turn.png' });

    // Hover a unit that likely took damage
    await page.hover('[data-testid="tile-6-6"]');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/e2e/19c-damaged-unit.png' });
  });

  test('20 - Healing + Item Use', async ({ page }) => {
    test.setTimeout(120000);
    await startBattle(page);

    // Move units north to bait enemies
    await clickTile(page, 6, 10);
    await clickTile(page, 6, 6);
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-wait"]');
    await page.waitForTimeout(200);

    // Move Natasha close (9,11 → 9,7)
    await clickTile(page, 9, 11);
    await clickTile(page, 9, 7);
    await page.waitForTimeout(200);
    await page.click('[data-testid="action-wait"]');
    await page.waitForTimeout(200);

    // End turn — enemies attack
    await endTurnAndWait(page);

    // Turn 2: Try to heal with Natasha
    await clickTile(page, 9, 7);
    await page.waitForTimeout(200);
    // Move Natasha adjacent to where Eirik might be
    await clickTile(page, 7, 6);
    await page.waitForTimeout(300);

    const healBtn = page.locator('[data-testid="action-heal"]');
    if (await healBtn.isVisible().catch(() => false)) {
      await page.screenshot({ path: 'screenshots/e2e/20a-heal-in-menu.png' });
      await healBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'screenshots/e2e/20b-heal-targets.png' });
      // Click first heal target
      const healTarget = page.locator('[data-testid^="heal-target-"]').first();
      if (await healTarget.isVisible().catch(() => false)) {
        const testId = await healTarget.getAttribute('data-testid');
        if (testId) {
          const match = testId.match(/heal-target-(\d+)-(\d+)/);
          if (match) {
            await page.click(`[data-testid="tile-${match[1]}-${match[2]}"]`);
            await page.waitForTimeout(1500);
            await page.screenshot({ path: 'screenshots/e2e/20c-heal-result.png' });
          }
        }
      }
    } else {
      // No heal — cancel if action menu is open, then try item use
      const cancelBtn = page.locator('[data-testid="action-cancel"]');
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        await page.waitForTimeout(200);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }

      // Try using Vulnerary on a damaged unit
      await clickTile(page, 6, 6);
      await page.waitForTimeout(200);
      await clickTile(page, 6, 5);
      await page.waitForTimeout(300);

      const am = page.locator('[data-testid="action-menu"]');
      if (await am.isVisible().catch(() => false)) {
        const itemBtn = page.locator('[data-testid="action-item"]');
        if (await itemBtn.isVisible().catch(() => false)) {
          await page.screenshot({ path: 'screenshots/e2e/20a-item-in-menu.png' });
          await itemBtn.click();
          await page.waitForTimeout(300);
          await page.screenshot({ path: 'screenshots/e2e/20b-item-submenu.png' });
          const vuln = page.locator('[data-testid="item-vulnerary"]');
          if (await vuln.isVisible().catch(() => false)) {
            await vuln.click();
            await page.waitForTimeout(500);
            await page.screenshot({ path: 'screenshots/e2e/20c-after-item-use.png' });
          }
        } else {
          await page.screenshot({ path: 'screenshots/e2e/20-no-item-available.png' });
        }
      } else {
        await page.screenshot({ path: 'screenshots/e2e/20-no-heal-or-item.png' });
      }
    }
  });
});
