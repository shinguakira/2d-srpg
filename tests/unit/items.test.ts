import { describe, it, expect } from 'vitest';
import { canUseItem, useItem } from '../../src/core/items';
import type { Unit, ConsumableItem, Weapon, WeaponType } from '../../src/core/types';

function makeWeapon(type: WeaponType): Weapon {
  return {
    id: type,
    name: `Test ${type}`,
    type,
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: 1,
  };
}

function makeUnit(id: string, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'test',
    faction: 'player',
    position: { x: 0, y: 0 },
    stats: { hp: 20, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: makeWeapon('sword'),
    inventory: [],
    items: [],
    hasActed: false,
    sprite: '',
    ...overrides,
  };
}

function makeVulnerary(uses = 3): ConsumableItem {
  return {
    id: 'vulnerary',
    name: 'Vulnerary',
    type: 'consumable',
    uses,
    maxUses: 3,
    effect: { kind: 'heal', amount: 10 },
  };
}

describe('canUseItem', () => {
  it('returns true when unit is damaged and item has uses', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary();
    expect(canUseItem(unit, item)).toBe(true);
  });

  it('returns false when unit is at full HP', () => {
    const unit = makeUnit('hero', { currentHp: 20 });
    const item = makeVulnerary();
    expect(canUseItem(unit, item)).toBe(false);
  });

  it('returns false when item has 0 uses', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary(0);
    expect(canUseItem(unit, item)).toBe(false);
  });

  it('returns true when unit is missing just 1 HP', () => {
    const unit = makeUnit('hero', { currentHp: 19 });
    const item = makeVulnerary();
    expect(canUseItem(unit, item)).toBe(true);
  });
});

describe('useItem', () => {
  it('heals the unit by the item heal amount', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary();
    const result = useItem(unit, item);

    expect(result.unit.currentHp).toBe(20); // 10 + 10 = 20
  });

  it('caps healing at max HP', () => {
    const unit = makeUnit('hero', { currentHp: 15 });
    const item = makeVulnerary();
    const result = useItem(unit, item);

    // 15 + 10 = 25, but max HP is 20
    expect(result.unit.currentHp).toBe(20);
  });

  it('decrements item uses', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary(3);
    const result = useItem(unit, item);

    expect(result.item).not.toBeNull();
    expect(result.item!.uses).toBe(2);
  });

  it('returns null item when last use is consumed', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary(1);
    const result = useItem(unit, item);

    expect(result.item).toBeNull();
  });

  it('heals correct amount when partially damaged', () => {
    const unit = makeUnit('hero', { currentHp: 17 });
    const item = makeVulnerary();
    const result = useItem(unit, item);

    // 17 + 10 = 27, capped at 20, so healed 3
    expect(result.unit.currentHp).toBe(20);
  });

  it('does not modify the original unit', () => {
    const unit = makeUnit('hero', { currentHp: 10 });
    const item = makeVulnerary();
    useItem(unit, item);

    // Original unit is unchanged (immutable pattern)
    expect(unit.currentHp).toBe(10);
  });

  it('successive uses deplete the item', () => {
    let unit = makeUnit('hero', { currentHp: 5, stats: { hp: 50, str: 8, mag: 0, def: 5, res: 0, spd: 7, skl: 5, lck: 3, mov: 5 } });
    let item: ConsumableItem | null = makeVulnerary(3);

    // Use 3 times
    for (let i = 0; i < 3; i++) {
      expect(item).not.toBeNull();
      const result = useItem(unit, item!);
      unit = result.unit;
      item = result.item;
    }

    expect(item).toBeNull(); // depleted after 3 uses
    expect(unit.currentHp).toBe(35); // 5 + 10 + 10 + 10 = 35
  });
});
