import { describe, it, expect } from 'vitest';
import {
  calculateVisibleTiles,
  updateFogMap,
  initializeFogMap,
  getVisionRange,
} from '../../src/core/fogOfWar';
import {
  getWeatherCombatModifiers,
  getWeatherMovPenalty,
  getWeatherTerrainCostMod,
  getWeatherVisionCap,
  getWeatherInfo,
} from '../../src/core/weather';
import {
  calcTerrainDamage,
  resolveBridgeCollapse,
  canAttackTerrain,
} from '../../src/core/destructibleTerrain';
import type {
  Unit,
  GameMap,
  Position,
  Tile,
  TerrainType,
  WeatherType,
} from '../../src/core/types';

// ===== Helpers =====

function makeUnit(id: string, pos: Position, overrides: Partial<Unit> = {}): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction: 'player',
    position: pos,
    stats: {
      hp: 20,
      str: 8,
      mag: 0,
      def: 5,
      res: 0,
      spd: 5,
      skl: 5,
      lck: 5,
      mov: 5,
      cha: 0,
      wil: 0,
    },
    currentHp: 20,
    level: 1,
    exp: 0,
    equippedWeapon: {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword',
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    },
    inventory: [
      {
        id: 'iron_sword',
        name: 'Iron Sword',
        type: 'sword',
        might: 5,
        hit: 90,
        crit: 0,
        weight: 5,
        minRange: 1,
        maxRange: 1,
      },
    ],
    items: [],
    hasActed: false,
    skills: [],
    learnedSkills: [],
    facing: 'down',
    sprite: '',
    metaStats: { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 },
    ...overrides,
  };
}

function makeMap(
  width: number,
  height: number,
  terrainFn?: (x: number, y: number) => TerrainType,
): GameMap {
  const tiles: Tile[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < width; x++) {
      row.push({
        position: { x, y },
        terrain: terrainFn ? terrainFn(x, y) : 'plain',
        occupantId: null,
      });
    }
    tiles.push(row);
  }
  return { width, height, tiles };
}

// ===== Fog of War Integration =====

describe('Fog of War Integration', () => {
  it('fog chapter: hidden enemies not visible, visible enemies shown', () => {
    // 8x8 map, player at (0,0) with vision 3, enemy at (1,1) and (7,7)
    const map = makeMap(8, 8);
    const player = makeUnit('ren', { x: 0, y: 0 });

    const { fogMap, visibleTiles } = initializeFogMap(map, [player]);

    // Near enemy should be visible (distance 2 < vision 3)
    expect(visibleTiles.has('1,1')).toBe(true);
    expect(fogMap.get('1,1')).toBe('visible');

    // Far enemy should be hidden (distance 14 > vision 3)
    expect(visibleTiles.has('7,7')).toBe(false);
    expect(fogMap.get('7,7')).toBe('hidden');
  });

  it('fog recalc: tiles transition from visible to revealed when player moves away', () => {
    const map = makeMap(10, 1); // 10-wide corridor
    const player = makeUnit('ren', { x: 0, y: 0 });

    // Initial fog
    const init = initializeFogMap(map, [player]);
    expect(init.visibleTiles.has('0,0')).toBe(true);
    expect(init.visibleTiles.has('3,0')).toBe(true); // vision 3
    expect(init.visibleTiles.has('4,0')).toBe(false); // too far

    // Player moves to x=5
    const movedPlayer = makeUnit('ren', { x: 5, y: 0 });
    const newVisible = calculateVisibleTiles([movedPlayer], map);
    const newFog = updateFogMap(init.fogMap, newVisible, map);

    // Old position should now be 'revealed' (was visible, now out of range)
    expect(newFog.get('0,0')).toBe('revealed');
    // New position should be 'visible'
    expect(newFog.get('5,0')).toBe('visible');
    // Tile at x=8 should be visible (distance 3 from x=5)
    expect(newVisible.has('8,0')).toBe(true);
  });

  it('torch extends vision by 5', () => {
    const map = makeMap(10, 1);
    const player = makeUnit('ren', { x: 0, y: 0 });

    // Without torch: vision 3
    const noTorch = calculateVisibleTiles([player], map);
    expect(noTorch.has('3,0')).toBe(true);
    expect(noTorch.has('4,0')).toBe(false);

    // With torch: vision 3 + 5 = 8
    const torchEffects = new Map<string, number>();
    torchEffects.set('ren', 3);
    const withTorch = calculateVisibleTiles([player], map, torchEffects);
    expect(withTorch.has('8,0')).toBe(true);
    expect(withTorch.has('9,0')).toBe(false); // 9 > 8
  });

  it('sandstorm caps vision at 2', () => {
    const map = makeMap(10, 1);
    const player = makeUnit('ren', { x: 0, y: 0 });

    // Normal vision: 3
    const normal = calculateVisibleTiles([player], map);
    expect(normal.has('3,0')).toBe(true);

    // Sandstorm caps at 2
    const sandstorm = calculateVisibleTiles([player], map, undefined, 'sandstorm');
    expect(sandstorm.has('2,0')).toBe(true);
    expect(sandstorm.has('3,0')).toBe(false);
  });

  it('thief has vision 5', () => {
    const map = makeMap(10, 1);
    const thief = makeUnit('coda', { x: 0, y: 0 }, { classId: 'thief' });

    expect(getVisionRange(thief)).toBe(5);
    const visible = calculateVisibleTiles([thief], map);
    expect(visible.has('5,0')).toBe(true);
    expect(visible.has('6,0')).toBe(false);
  });

  it('AWR 61+ gives +1 vision', () => {
    const player = makeUnit(
      'ren',
      { x: 0, y: 0 },
      { metaStats: { awr: 61, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 } },
    );
    expect(getVisionRange(player)).toBe(4); // 3 + 1
  });

  it('danger zone only includes visible enemies', () => {
    // This is a logic test: given fog, only visible enemies contribute to danger zone
    const map = makeMap(8, 8);
    const player = makeUnit('ren', { x: 0, y: 0 });
    const { visibleTiles } = initializeFogMap(map, [player]);

    // Simulate filtering enemies by visibility
    const enemies = [
      makeUnit('e1', { x: 1, y: 1 }, { faction: 'enemy' }), // visible
      makeUnit('e2', { x: 7, y: 7 }, { faction: 'enemy' }), // hidden
    ];

    const visibleEnemies = enemies.filter((e) =>
      visibleTiles.has(`${e.position.x},${e.position.y}`),
    );
    expect(visibleEnemies).toHaveLength(1);
    expect(visibleEnemies[0].id).toBe('e1');
  });
});

// ===== Weather Integration =====

describe('Weather Integration', () => {
  it('rain reduces bow hit, mounted MOV, and fire might', () => {
    const bow = {
      id: 'iron_bow',
      name: 'Iron Bow',
      type: 'bow' as const,
      might: 6,
      hit: 85,
      crit: 0,
      weight: 5,
      minRange: 2,
      maxRange: 2,
    };
    const fire = {
      id: 'fire',
      name: 'Fire',
      type: 'fire' as const,
      might: 4,
      hit: 90,
      crit: 0,
      weight: 3,
      minRange: 1,
      maxRange: 2,
    };

    const bowMods = getWeatherCombatModifiers('rain', bow);
    expect(bowMods.hitMod).toBe(-15);

    const fireMods = getWeatherCombatModifiers('rain', fire);
    expect(fireMods.hitMod).toBe(-15);
    expect(fireMods.mightMod).toBe(-2);

    // Mounted MOV penalty
    expect(getWeatherMovPenalty('rain', { mounted: true })).toBe(-1);
    expect(getWeatherMovPenalty('rain', { flying: true })).toBe(0);
    expect(getWeatherMovPenalty('rain', {})).toBe(0);
  });

  it('snow adds terrain cost and SPD penalty', () => {
    const sword = {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword' as const,
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    };

    const mods = getWeatherCombatModifiers('snow', sword);
    expect(mods.spdMod).toBe(-2);

    // Ground units get +1 terrain cost
    expect(getWeatherTerrainCostMod('snow', {})).toBe(1);
    // Flying units exempt
    expect(getWeatherTerrainCostMod('snow', { flying: true })).toBe(0);
  });

  it('sandstorm reduces ranged hit and caps vision', () => {
    const bow = {
      id: 'iron_bow',
      name: 'Iron Bow',
      type: 'bow' as const,
      might: 6,
      hit: 85,
      crit: 0,
      weight: 5,
      minRange: 2,
      maxRange: 2,
    };
    const sword = {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword' as const,
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    };

    expect(getWeatherCombatModifiers('sandstorm', bow).hitMod).toBe(-20);
    expect(getWeatherCombatModifiers('sandstorm', sword).hitMod).toBe(0);
    expect(getWeatherVisionCap('sandstorm')).toBe(2);
  });

  it('clear weather has no modifiers', () => {
    const sword = {
      id: 'iron_sword',
      name: 'Iron Sword',
      type: 'sword' as const,
      might: 5,
      hit: 90,
      crit: 0,
      weight: 5,
      minRange: 1,
      maxRange: 1,
    };
    const mods = getWeatherCombatModifiers('clear', sword);
    expect(mods.hitMod).toBe(0);
    expect(mods.mightMod).toBe(0);
    expect(mods.spdMod).toBe(0);
    expect(getWeatherMovPenalty('clear', { mounted: true })).toBe(0);
    expect(getWeatherVisionCap('clear')).toBeNull();
  });

  it('weather info available for each type', () => {
    const types: WeatherType[] = ['clear', 'rain', 'fog', 'snow', 'sandstorm', 'corruption_storm'];
    for (const t of types) {
      const info = getWeatherInfo(t);
      expect(info.name).toBeTruthy();
      expect(info.effects.length).toBeGreaterThan(0);
    }
  });
});

// ===== Bridge Collapse Integration =====

describe('Bridge Collapse Integration', () => {
  it('unit on bridge takes damage and is displaced when bridge destroyed', () => {
    // 5x1 map: plain, bridge, bridge, bridge, plain
    const map = makeMap(5, 1, (x) => (x >= 1 && x <= 3 ? 'bridge' : 'plain'));
    const units = new Map<string, Unit>();
    const victim = makeUnit('victim', { x: 2, y: 0 }, { currentHp: 20 });
    units.set('victim', victim);
    map.tiles[0][2].occupantId = 'victim';

    const results = resolveBridgeCollapse({ x: 2, y: 0 }, map, units, () => ({}));
    expect(results).toHaveLength(1);
    expect(results[0].unitId).toBe('victim');
    expect(results[0].damage).toBe(10);
    // Should be displaced to adjacent land tile
    expect(results[0].displacedTo).not.toBeNull();
  });

  it('flying unit on bridge is safe from collapse', () => {
    const map = makeMap(5, 1, (x) => (x >= 1 && x <= 3 ? 'bridge' : 'plain'));
    const units = new Map<string, Unit>();
    const flyer = makeUnit('pegasus', { x: 2, y: 0 });
    units.set('pegasus', flyer);
    map.tiles[0][2].occupantId = 'pegasus';

    const results = resolveBridgeCollapse({ x: 2, y: 0 }, map, units, () => ({ flying: true }));
    expect(results).toHaveLength(0);
  });

  it('all bridges destroyed: displaced to nearest land', () => {
    // 3x3 map with water everywhere except corners being plains
    const map = makeMap(3, 3, (x, y) => {
      if ((x === 0 && y === 0) || (x === 2 && y === 2)) return 'plain';
      if (x === 1 && y === 1) return 'bridge';
      return 'water';
    });

    const units = new Map<string, Unit>();
    const victim = makeUnit('victim', { x: 1, y: 1 });
    units.set('victim', victim);
    map.tiles[1][1].occupantId = 'victim';

    const results = resolveBridgeCollapse({ x: 1, y: 1 }, map, units, () => ({}));
    expect(results).toHaveLength(1);
    if (results[0].displacedTo) {
      // Should be displaced to one of the plain tiles
      const dp = results[0].displacedTo;
      expect((dp.x === 0 && dp.y === 0) || (dp.x === 2 && dp.y === 2)).toBe(true);
    }
  });

  it('axe gets +5 bonus damage to terrain', () => {
    // Same weapon might to isolate the axe bonus
    const axeUnit = makeUnit(
      'fighter',
      { x: 0, y: 0 },
      {
        stats: {
          hp: 20,
          str: 10,
          mag: 0,
          def: 5,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 5,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: {
          id: 'iron_axe',
          name: 'Iron Axe',
          type: 'axe',
          might: 5,
          hit: 75,
          crit: 0,
          weight: 8,
          minRange: 1,
          maxRange: 1,
        },
      },
    );
    const swordUnit = makeUnit(
      'swordie',
      { x: 0, y: 0 },
      {
        stats: {
          hp: 20,
          str: 10,
          mag: 0,
          def: 5,
          res: 0,
          spd: 5,
          skl: 5,
          lck: 5,
          mov: 5,
          cha: 0,
          wil: 0,
        },
        equippedWeapon: {
          id: 'iron_sword',
          name: 'Iron Sword',
          type: 'sword',
          might: 5,
          hit: 90,
          crit: 0,
          weight: 5,
          minRange: 1,
          maxRange: 1,
        },
      },
    );

    const axeDmg = calcTerrainDamage(axeUnit);
    const swordDmg = calcTerrainDamage(swordUnit);
    // Axe: STR(10) + might(5) + axeBonus(5) = 20
    // Sword: STR(10) + might(5) + 0 = 15
    expect(axeDmg).toBe(20);
    expect(swordDmg).toBe(15);
    expect(axeDmg - swordDmg).toBe(5); // axe bonus
  });

  it('fire magic can attack forest terrain', () => {
    const fireMage = makeUnit(
      'mage',
      { x: 0, y: 0 },
      {
        equippedWeapon: {
          id: 'fire',
          name: 'Fire',
          type: 'fire',
          might: 4,
          hit: 90,
          crit: 0,
          weight: 3,
          minRange: 1,
          maxRange: 2,
        },
      },
    );
    const swordUser = makeUnit('fighter', { x: 0, y: 0 });

    expect(canAttackTerrain(fireMage, 'forest')).toBe(true);
    expect(canAttackTerrain(swordUser, 'forest')).toBe(false);
    // Both can attack walls
    expect(canAttackTerrain(fireMage, 'wall')).toBe(true);
    expect(canAttackTerrain(swordUser, 'wall')).toBe(true);
  });
});
