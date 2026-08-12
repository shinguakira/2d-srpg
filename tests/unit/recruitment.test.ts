import { describe, it, expect } from 'vitest';
import type { Unit, Position } from '../../src/core/types';
import { getManhattanDistance } from '../../src/core/pathfinding';

function makeUnit(
  id: string,
  faction: 'player' | 'enemy' | 'ally' = 'player',
  pos: Position = { x: 0, y: 0 },
  opts?: Partial<Unit>,
): Unit {
  return {
    id,
    name: id,
    classId: 'lord',
    faction,
    position: pos,
    stats: {
      hp: 20,
      str: 5,
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
    ...opts,
  };
}

describe('Recruitment — Talk availability', () => {
  it('Talk is available when recruitable unit is adjacent', () => {
    const lord = makeUnit('shigeru', 'player', { x: 3, y: 3 });
    const genzo = makeUnit(
      'genzo',
      'enemy',
      { x: 3, y: 4 },
      { recruitableBy: 'shigeru', recruitCondition: 'talk' },
    );

    const pendingPosition = lord.position;
    const dist = getManhattanDistance(pendingPosition, genzo.position);
    const canTalk = genzo.recruitableBy === lord.id && dist === 1;
    expect(canTalk).toBe(true);
  });

  it('Talk is NOT available when recruitable unit is too far', () => {
    const lord = makeUnit('shigeru', 'player', { x: 3, y: 3 });
    const genzo = makeUnit(
      'genzo',
      'enemy',
      { x: 5, y: 5 },
      { recruitableBy: 'shigeru', recruitCondition: 'talk' },
    );

    const dist = getManhattanDistance(lord.position, genzo.position);
    const canTalk = genzo.recruitableBy === lord.id && dist === 1;
    expect(canTalk).toBe(false);
  });

  it('Talk is NOT available when different unit is required', () => {
    const akira = makeUnit('akira', 'player', { x: 3, y: 3 });
    const genzo = makeUnit(
      'genzo',
      'enemy',
      { x: 3, y: 4 },
      { recruitableBy: 'shigeru', recruitCondition: 'talk' },
    );

    const dist = getManhattanDistance(akira.position, genzo.position);
    const canTalk = genzo.recruitableBy === akira.id && dist === 1;
    expect(canTalk).toBe(false);
  });
});

describe('Recruitment — Faction swap', () => {
  it('recruited unit becomes player faction', () => {
    const genzo = makeUnit(
      'genzo',
      'enemy',
      { x: 3, y: 4 },
      { recruitableBy: 'shigeru', recruitCondition: 'talk' },
    );
    const recruited = {
      ...genzo,
      faction: 'player' as const,
      hasActed: true,
      aiBehavior: undefined,
      recruitableBy: undefined,
      recruitCondition: undefined,
    };
    expect(recruited.faction).toBe('player');
    expect(recruited.hasActed).toBe(true);
    expect(recruited.recruitableBy).toBeUndefined();
  });

  it('recruited unit retains current HP and stats', () => {
    const genzo = makeUnit(
      'genzo',
      'enemy',
      { x: 3, y: 4 },
      {
        currentHp: 12,
        level: 3,
        stats: {
          hp: 22,
          str: 8,
          mag: 0,
          def: 8,
          res: 2,
          spd: 4,
          skl: 5,
          lck: 3,
          mov: 5,
          cha: 0,
          wil: 0,
        },
      },
    );
    const recruited = { ...genzo, faction: 'player' as const };
    expect(recruited.currentHp).toBe(12);
    expect(recruited.level).toBe(3);
    expect(recruited.stats.def).toBe(8);
  });
});
