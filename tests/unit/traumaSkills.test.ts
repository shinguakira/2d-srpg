import { describe, it, expect } from 'vitest';
import { assignTraumaSkill, getTraumaStatMods, applyGrief } from '../../src/core/traumaSkills';
import type { Unit } from '../../src/core/types';

function makeUnit(id: string, pos: { x: number; y: number }, overrides: Partial<Unit> = {}): Unit {
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
    inventory: [],
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

describe('Trauma skill assignment', () => {
  it('1st death: survivors_guilt to closest ally', () => {
    const units = new Map<string, Unit>();
    units.set('ally_near', makeUnit('ally_near', { x: 1, y: 0 }));
    units.set('ally_far', makeUnit('ally_far', { x: 5, y: 5 }));

    const result = assignTraumaSkill(1, 'dead_unit', units, { x: 0, y: 0 });
    expect(result).not.toBeNull();
    expect(result!.skillId).toBe('survivors_guilt');
    expect(result!.targetUnitId).toBe('ally_near');
  });

  it('2nd death: vengeance_trauma', () => {
    const units = new Map<string, Unit>();
    units.set('ally', makeUnit('ally', { x: 0, y: 0 }));

    const result = assignTraumaSkill(2, 'dead2', units, { x: 3, y: 3 });
    expect(result).not.toBeNull();
    expect(result!.skillId).toBe('vengeance_trauma');
  });

  it('3rd death: numb', () => {
    const units = new Map<string, Unit>();
    units.set('ally', makeUnit('ally', { x: 0, y: 0 }));

    const result = assignTraumaSkill(3, 'dead3', units, { x: 0, y: 0 });
    expect(result).not.toBeNull();
    expect(result!.skillId).toBe('numb');
  });

  it('4th death: last_stand', () => {
    const units = new Map<string, Unit>();
    units.set('ally', makeUnit('ally', { x: 0, y: 0 }));

    const result = assignTraumaSkill(4, 'dead4', units, { x: 0, y: 0 });
    expect(result).not.toBeNull();
    expect(result!.skillId).toBe('last_stand');
  });

  it('5th+ death: no more trauma skills', () => {
    const units = new Map<string, Unit>();
    units.set('ally', makeUnit('ally', { x: 0, y: 0 }));

    expect(assignTraumaSkill(5, 'dead5', units, { x: 0, y: 0 })).toBeNull();
  });

  it('returns null when no living player units', () => {
    const units = new Map<string, Unit>();
    units.set('enemy', makeUnit('enemy', { x: 0, y: 0 }, { faction: 'enemy' }));

    expect(assignTraumaSkill(1, 'dead', units, { x: 0, y: 0 })).toBeNull();
  });
});

describe('getTraumaStatMods', () => {
  it('survivors_guilt: -2 STR, +2 DEF', () => {
    const unit = makeUnit('u', { x: 0, y: 0 }, { traumaSkills: ['survivors_guilt'] });
    const mods = getTraumaStatMods(unit);
    expect(mods.str).toBe(-2);
    expect(mods.def).toBe(2);
  });

  it('last_stand: +5 all stats when only unit remaining', () => {
    const unit = makeUnit('u', { x: 0, y: 0 }, { traumaSkills: ['last_stand'] });
    const mods = getTraumaStatMods(unit, 1);
    expect(mods.str).toBe(5);
    expect(mods.def).toBe(5);
    expect(mods.spd).toBe(5);
  });

  it('last_stand: no bonus when multiple units remain', () => {
    const unit = makeUnit('u', { x: 0, y: 0 }, { traumaSkills: ['last_stand'] });
    const mods = getTraumaStatMods(unit, 3);
    expect(mods.str).toBeUndefined();
  });

  it('grief: -3 all stats', () => {
    const unit = makeUnit('u', { x: 0, y: 0 }, { traumaSkills: ['grief'] });
    const mods = getTraumaStatMods(unit);
    expect(mods.str).toBe(-3);
    expect(mods.mag).toBe(-3);
    expect(mods.def).toBe(-3);
    expect(mods.spd).toBe(-3);
  });
});

describe('applyGrief', () => {
  it('adds grief to all living player units', () => {
    const units = new Map<string, Unit>();
    units.set('ren', makeUnit('ren', { x: 0, y: 0 }));
    units.set('senna', makeUnit('senna', { x: 1, y: 0 }));
    units.set('enemy', makeUnit('enemy', { x: 5, y: 5 }, { faction: 'enemy' }));

    const result = applyGrief(units);
    expect(result.get('ren')!.traumaSkills).toContain('grief');
    expect(result.get('senna')!.traumaSkills).toContain('grief');
    expect(result.get('enemy')!.traumaSkills).toBeUndefined(); // enemy not affected
  });
});
