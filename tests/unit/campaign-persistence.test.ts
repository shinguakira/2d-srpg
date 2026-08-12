import { describe, it, expect, beforeEach } from 'vitest';
import type { Unit, GameMap, Tile, UnitProgress } from '../../src/core/types';
import type { CombatResult } from '../../src/core/combat';
import { applyCombatResult } from '../../src/stores/helpers/combatResolution';
import { useCampaignStore } from '../../src/stores/campaignStore';
import { withForgeLevel } from '../../src/core/forging';
import { WEAPONS } from '../../src/data/weapons';

function makeTile(x: number, y: number): Tile {
  return { terrain: 'plain', x, y, occupantId: null } as Tile;
}

function makeMap(width: number, height: number): GameMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) row.push(makeTile(x, y));
    tiles.push(row);
  }
  return { width, height, tiles };
}

function makeUnit(id: string, pos: { x: number; y: number }, opts?: Partial<Unit>): Unit {
  return {
    id,
    name: id,
    classId: 'fighter',
    faction: 'player',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 4,
      def: 5,
      res: 3,
      spd: 7,
      skl: 6,
      lck: 4,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 3,
    exp: 40,
    equippedWeapon: { ...WEAPONS.iron_sword },
    inventory: [{ ...WEAPONS.iron_sword }],
    items: [],
    hasActed: false,
    facing: 'down',
    sprite: '',
    skills: [],
    learnedSkills: [],
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...opts,
  } as Unit;
}

/** Combat where the defender dies and the attacker survives. */
function defenderDies(): CombatResult {
  return {
    attackerHpAfter: 20,
    defenderHpAfter: 0,
    attackerDied: false,
    defenderDied: true,
    hits: [],
  } as unknown as CombatResult;
}

function resolve(attacker: Unit, defender: Unit, difficulty: 'classic' | 'casual') {
  const units = new Map<string, Unit>([
    [attacker.id, attacker],
    [defender.id, defender],
  ]);
  const map = makeMap(4, 4);
  map.tiles[attacker.position.y][attacker.position.x].occupantId = attacker.id;
  map.tiles[defender.position.y][defender.position.x].occupantId = defender.id;
  return applyCombatResult(units, map, attacker.id, defender.id, defenderDies(), null, difficulty);
}

beforeEach(() => {
  useCampaignStore.setState({ deadUnitIds: [], unitProgress: {} });
});

describe('permadeath is recorded in the campaign', () => {
  it('adds a fallen player unit to deadUnitIds', () => {
    const attacker = makeUnit('enemy1', { x: 0, y: 0 }, { faction: 'enemy' });
    const victim = makeUnit('gareth', { x: 1, y: 0 });

    const res = resolve(attacker, victim, 'classic');

    expect(res.newUnits.has('gareth')).toBe(false);
    expect(useCampaignStore.getState().deadUnitIds).toContain('gareth');
  });

  it('does not record enemies as dead campaign units', () => {
    const attacker = makeUnit('shigeru', { x: 0, y: 0 });
    const victim = makeUnit('enemy1', { x: 1, y: 0 }, { faction: 'enemy' });

    resolve(attacker, victim, 'classic');

    expect(useCampaignStore.getState().deadUnitIds).toEqual([]);
  });
});

describe('casual retreat leaves the battle', () => {
  it('removes the unit from the battle rather than leaving it standing', () => {
    const attacker = makeUnit('enemy1', { x: 0, y: 0 }, { faction: 'enemy' });
    const victim = makeUnit('gareth', { x: 1, y: 0 });

    const res = resolve(attacker, victim, 'casual');

    expect(res.newUnits.has('gareth')).toBe(false);
    expect(res.newTiles[0][1].occupantId).toBeNull();
  });

  it('records the retreat and the unit progress for the next chapter', () => {
    const attacker = makeUnit('enemy1', { x: 0, y: 0 }, { faction: 'enemy' });
    const victim = makeUnit('gareth', { x: 1, y: 0 }, { level: 7, exp: 55 });

    resolve(attacker, victim, 'casual');

    const p = useCampaignStore.getState().unitProgress.gareth;
    expect(p.retreated).toBe(true);
    expect(p.currentHp).toBe(1);
    expect(p.level).toBe(7);
    expect(p.exp).toBe(55);
  });

  it('does not mark a retreated unit as permanently dead', () => {
    const attacker = makeUnit('enemy1', { x: 0, y: 0 }, { faction: 'enemy' });
    const victim = makeUnit('gareth', { x: 1, y: 0 });

    resolve(attacker, victim, 'casual');

    expect(useCampaignStore.getState().deadUnitIds).not.toContain('gareth');
  });

  it('still permakills the lord, who ends the run either way', () => {
    const attacker = makeUnit('enemy1', { x: 0, y: 0 }, { faction: 'enemy' });
    const lord = makeUnit('shigeru', { x: 1, y: 0 }, { isLord: true });

    const res = resolve(attacker, lord, 'casual');

    expect(res.lordDied).toBe(true);
    expect(res.newUnits.has('shigeru')).toBe(false);
  });
});

describe('forge levels survive being rebuilt from the weapon table', () => {
  it('re-applies the stored bonus instead of returning the base weapon', () => {
    const base = WEAPONS.iron_sword;
    const forged = withForgeLevel(base, 2);

    expect(forged.forgeLevel).toBe(2);
    expect(forged.might).toBe(base.might + 4);
    expect(forged.hit).toBe(base.hit + 10);
  });

  it('leaves an unforged weapon untouched', () => {
    const base = WEAPONS.iron_sword;
    const rebuilt = withForgeLevel(base, 0);

    expect(rebuilt.might).toBe(base.might);
    expect(rebuilt.hit).toBe(base.hit);
    expect(rebuilt.name).toBe(base.name);
  });

  it('clamps beyond the maximum forge level', () => {
    const base = WEAPONS.iron_sword;
    expect(withForgeLevel(base, 99).might).toBe(withForgeLevel(base, 3).might);
  });
});

describe('UnitProgress merging', () => {
  it('keeps campaign-only fields when a battle result is written over it', () => {
    const prior: UnitProgress = {
      level: 3,
      exp: 0,
      stats: makeUnit('x', { x: 0, y: 0 }).stats,
      weaponIds: ['iron_sword'],
      itemIds: [],
      crpLowChapters: 4,
      supportPartners: ['shigeru', 'akira'],
    };

    // What Game.tsx / PreparationScreen now do: spread the stored entry first.
    const merged: UnitProgress = { ...prior, level: 5, exp: 20 };

    expect(merged.crpLowChapters).toBe(4);
    expect(merged.supportPartners).toEqual(['shigeru', 'akira']);
    expect(merged.level).toBe(5);
  });
});
