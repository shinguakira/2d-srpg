import { describe, it, expect } from 'vitest';
import { getForgeBonus, canForge, applyForge, getRequiredMaterial, previewForge, getForgeGoldCost } from '../../src/core/forging';
import type { Weapon } from '../../src/core/types';

function makeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: 'iron_sword',
    name: 'Iron Sword',
    type: 'sword',
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    range: [1],
    ...overrides,
  } as Weapon;
}

describe('Forging system', () => {
  describe('getForgeBonus', () => {
    it('returns 0 bonuses at level 0', () => {
      expect(getForgeBonus(0)).toEqual({ mightBonus: 0, hitBonus: 0 });
    });

    it('returns +2 might +5 hit per level', () => {
      expect(getForgeBonus(1)).toEqual({ mightBonus: 2, hitBonus: 5 });
      expect(getForgeBonus(2)).toEqual({ mightBonus: 4, hitBonus: 10 });
      expect(getForgeBonus(3)).toEqual({ mightBonus: 6, hitBonus: 15 });
    });

    it('clamps at max level 3', () => {
      expect(getForgeBonus(5)).toEqual({ mightBonus: 6, hitBonus: 15 });
    });
  });

  describe('canForge', () => {
    it('allows forging with adamant ore for levels 1-2', () => {
      const weapon = makeWeapon({ forgeLevel: 0 });
      expect(canForge(weapon, ['adamant_ore'])).toBe(true);
    });

    it('requires mithril for level 3', () => {
      const weapon = makeWeapon({ forgeLevel: 2 });
      expect(canForge(weapon, ['adamant_ore'])).toBe(false);
      expect(canForge(weapon, ['mithril'])).toBe(true);
    });

    it('cannot forge past level 3', () => {
      const weapon = makeWeapon({ forgeLevel: 3 });
      expect(canForge(weapon, ['adamant_ore', 'mithril'])).toBe(false);
    });

    it('cannot forge without materials', () => {
      const weapon = makeWeapon({ forgeLevel: 0 });
      expect(canForge(weapon, [])).toBe(false);
    });

    it('cannot forge without enough gold', () => {
      const weapon = makeWeapon({ forgeLevel: 0 });
      expect(canForge(weapon, ['adamant_ore'], 499)).toBe(false);
      expect(canForge(weapon, ['adamant_ore'], 500)).toBe(true);
    });

    it('level 2 forge requires 1000 gold', () => {
      const weapon = makeWeapon({ forgeLevel: 1 });
      expect(canForge(weapon, ['adamant_ore'], 999)).toBe(false);
      expect(canForge(weapon, ['adamant_ore'], 1000)).toBe(true);
    });

    it('level 3 forge requires 2000 gold', () => {
      const weapon = makeWeapon({ forgeLevel: 2 });
      expect(canForge(weapon, ['mithril'], 1999)).toBe(false);
      expect(canForge(weapon, ['mithril'], 2000)).toBe(true);
    });
  });

  describe('getForgeGoldCost', () => {
    it('returns 500 for level 0 -> 1', () => {
      expect(getForgeGoldCost(makeWeapon({ forgeLevel: 0 }))).toBe(500);
    });

    it('returns 1000 for level 1 -> 2', () => {
      expect(getForgeGoldCost(makeWeapon({ forgeLevel: 1 }))).toBe(1000);
    });

    it('returns 2000 for level 2 -> 3', () => {
      expect(getForgeGoldCost(makeWeapon({ forgeLevel: 2 }))).toBe(2000);
    });

    it('returns 0 at max level', () => {
      expect(getForgeGoldCost(makeWeapon({ forgeLevel: 3 }))).toBe(0);
    });
  });

  describe('getRequiredMaterial', () => {
    it('requires adamant for levels 1-2', () => {
      expect(getRequiredMaterial(makeWeapon({ forgeLevel: 0 }))).toBe('adamant_ore');
      expect(getRequiredMaterial(makeWeapon({ forgeLevel: 1 }))).toBe('adamant_ore');
    });

    it('requires mithril for level 3', () => {
      expect(getRequiredMaterial(makeWeapon({ forgeLevel: 2 }))).toBe('mithril');
    });

    it('returns null at max level', () => {
      expect(getRequiredMaterial(makeWeapon({ forgeLevel: 3 }))).toBeNull();
    });
  });

  describe('applyForge', () => {
    it('adds "Forged " prefix on first forge', () => {
      const weapon = makeWeapon({ forgeLevel: 0 });
      const forged = applyForge(weapon);
      expect(forged.name).toBe('Forged Iron Sword');
      expect(forged.forgeLevel).toBe(1);
    });

    it('does not double-prefix on subsequent forges', () => {
      const weapon = makeWeapon({ forgeLevel: 1, name: 'Forged Iron Sword', might: 7, hit: 95 });
      const forged = applyForge(weapon);
      expect(forged.name).toBe('Forged Iron Sword');
      expect(forged.forgeLevel).toBe(2);
    });

    it('adds +2 might and +5 hit per forge', () => {
      const weapon = makeWeapon({ forgeLevel: 0, might: 5, hit: 90 });
      const forged = applyForge(weapon);
      expect(forged.might).toBe(7);
      expect(forged.hit).toBe(95);
    });

    it('does not forge past max level', () => {
      const weapon = makeWeapon({ forgeLevel: 3, might: 11, hit: 105 });
      const forged = applyForge(weapon);
      expect(forged).toBe(weapon); // same object, no change
    });
  });

  describe('previewForge', () => {
    it('shows preview stats', () => {
      const weapon = makeWeapon({ forgeLevel: 0, might: 5, hit: 90 });
      const preview = previewForge(weapon);
      expect(preview).toEqual({
        name: 'Forged Iron Sword',
        might: 7,
        hit: 95,
        forgeLevel: 1,
      });
    });

    it('returns null at max level', () => {
      const weapon = makeWeapon({ forgeLevel: 3 });
      expect(previewForge(weapon)).toBeNull();
    });
  });
});
