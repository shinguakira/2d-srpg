import { describe, it, expect } from 'vitest';
import {
  getWeatherCombatModifiers,
  getWeatherMovPenalty,
  getWeatherTerrainCostMod,
  getWeatherVisionCap,
  getWeatherCrpGain,
  getWeatherInfo,
} from '../../src/core/weather';
import type { Weapon, WeatherType } from '../../src/core/types';

function makeWeapon(type: Weapon['type'], range: number = 1): Weapon {
  return {
    id: 'w',
    name: 'W',
    type,
    might: 5,
    hit: 90,
    crit: 0,
    weight: 5,
    minRange: 1,
    maxRange: range,
  };
}

describe('getWeatherCombatModifiers', () => {
  describe('rain', () => {
    it('bows get -15 hit', () => {
      const mods = getWeatherCombatModifiers('rain', makeWeapon('bow', 2));
      expect(mods.hitMod).toBe(-15);
    });

    it('fire magic gets -15 hit and -2 might', () => {
      const mods = getWeatherCombatModifiers('rain', makeWeapon('fire', 2));
      expect(mods.hitMod).toBe(-15);
      expect(mods.mightMod).toBe(-2);
    });

    it('thunder magic unaffected by rain', () => {
      const mods = getWeatherCombatModifiers('rain', makeWeapon('thunder', 2));
      expect(mods.hitMod).toBe(0);
      expect(mods.mightMod).toBe(0);
    });

    it('swords unaffected', () => {
      const mods = getWeatherCombatModifiers('rain', makeWeapon('sword'));
      expect(mods.hitMod).toBe(0);
      expect(mods.mightMod).toBe(0);
    });
  });

  describe('snow', () => {
    it('-2 SPD for all weapons', () => {
      const mods = getWeatherCombatModifiers('snow', makeWeapon('sword'));
      expect(mods.spdMod).toBe(-2);
    });

    it('fire magic unaffected in snow', () => {
      const mods = getWeatherCombatModifiers('snow', makeWeapon('fire', 2));
      expect(mods.mightMod).toBe(0);
    });
  });

  describe('sandstorm', () => {
    it('-20 hit for ranged weapons', () => {
      const mods = getWeatherCombatModifiers('sandstorm', makeWeapon('bow', 2));
      expect(mods.hitMod).toBe(-20);
    });

    it('melee unaffected', () => {
      const mods = getWeatherCombatModifiers('sandstorm', makeWeapon('sword'));
      expect(mods.hitMod).toBe(0);
    });
  });

  describe('clear', () => {
    it('no modifiers', () => {
      const mods = getWeatherCombatModifiers('clear', makeWeapon('bow', 2));
      expect(mods.hitMod).toBe(0);
      expect(mods.mightMod).toBe(0);
      expect(mods.spdMod).toBe(0);
    });
  });

  describe('corruption_storm', () => {
    it('no combat modifiers', () => {
      const mods = getWeatherCombatModifiers('corruption_storm', makeWeapon('sword'));
      expect(mods.hitMod).toBe(0);
    });
  });
});

describe('getWeatherMovPenalty', () => {
  it('rain: -1 MOV for mounted', () => {
    expect(getWeatherMovPenalty('rain', { mounted: true })).toBe(-1);
  });

  it('rain: no penalty for flying', () => {
    expect(getWeatherMovPenalty('rain', { flying: true })).toBe(0);
  });

  it('rain: no penalty for infantry', () => {
    expect(getWeatherMovPenalty('rain', {})).toBe(0);
  });

  it('snow: no MOV penalty for flying', () => {
    expect(getWeatherMovPenalty('snow', { flying: true })).toBe(0);
  });

  it('snow: no MOV penalty for ground', () => {
    expect(getWeatherMovPenalty('snow', {})).toBe(0);
  });

  it('clear: no penalty', () => {
    expect(getWeatherMovPenalty('clear', { mounted: true })).toBe(0);
  });
});

describe('getWeatherTerrainCostMod', () => {
  it('snow: +1 cost for ground units', () => {
    expect(getWeatherTerrainCostMod('snow', {})).toBe(1);
  });

  it('snow: no extra cost for flying', () => {
    expect(getWeatherTerrainCostMod('snow', { flying: true })).toBe(0);
  });

  it('rain: no extra terrain cost', () => {
    expect(getWeatherTerrainCostMod('rain', {})).toBe(0);
  });
});

describe('getWeatherVisionCap', () => {
  it('sandstorm caps vision at 2', () => {
    expect(getWeatherVisionCap('sandstorm')).toBe(2);
  });

  it('fog caps vision at 3', () => {
    expect(getWeatherVisionCap('fog')).toBe(3);
  });

  it('clear has no cap', () => {
    expect(getWeatherVisionCap('clear')).toBeNull();
  });

  it('rain has no cap', () => {
    expect(getWeatherVisionCap('rain')).toBeNull();
  });
});

describe('getWeatherCrpGain', () => {
  it('corruption_storm: +1 CRP/turn', () => {
    expect(getWeatherCrpGain('corruption_storm')).toBe(1);
  });

  it('clear: 0', () => {
    expect(getWeatherCrpGain('clear')).toBe(0);
  });

  it('rain: 0', () => {
    expect(getWeatherCrpGain('rain')).toBe(0);
  });
});

describe('getWeatherInfo', () => {
  it('returns info for each weather type', () => {
    const types: WeatherType[] = ['clear', 'rain', 'fog', 'snow', 'sandstorm', 'corruption_storm'];
    for (const t of types) {
      const info = getWeatherInfo(t);
      expect(info.name).toBeTruthy();
      expect(info.effects.length).toBeGreaterThan(0);
    }
  });
});
