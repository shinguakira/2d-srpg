import type { WeatherType, Weapon } from './types';
import type { ClassFlags } from './terrain';

// ===== Combat Modifiers =====

export type WeatherCombatMods = {
  hitMod: number;
  mightMod: number;
  spdMod: number;
};

/** Get combat stat modifiers caused by current weather for a given weapon. */
export function getWeatherCombatModifiers(weather: WeatherType, weapon: Weapon): WeatherCombatMods {
  switch (weather) {
    case 'rain':
      return {
        hitMod: weapon.type === 'bow' || weapon.type === 'fire' ? -15 : 0,
        mightMod: weapon.type === 'fire' ? -2 : 0,
        spdMod: 0,
      };
    case 'snow':
      return { hitMod: 0, mightMod: 0, spdMod: -2 };
    case 'sandstorm':
      return {
        hitMod: weapon.maxRange > 1 ? -20 : 0,
        mightMod: 0,
        spdMod: 0,
      };
    default:
      return { hitMod: 0, mightMod: 0, spdMod: 0 };
  }
}

// ===== Movement Modifiers =====

/**
 * Get the MOV penalty for a unit in current weather.
 * Returns a negative number to subtract from unit MOV before BFS.
 * Rain: -1 MOV for mounted. Snow: handled via terrain cost increase, not MOV.
 */
export function getWeatherMovPenalty(weather: WeatherType, classFlags: ClassFlags): number {
  if (weather === 'rain' && classFlags.mounted) return -1;
  return 0;
}

/**
 * Get extra terrain cost added by weather.
 * Snow: +1 to all ground tiles (non-flying).
 */
export function getWeatherTerrainCostMod(weather: WeatherType, classFlags: ClassFlags): number {
  if (weather === 'snow' && !classFlags.flying) return 1;
  return 0;
}

// ===== Vision Modifiers =====

/** Get vision cap imposed by weather. null = no override. */
export function getWeatherVisionCap(weather: WeatherType): number | null {
  if (weather === 'sandstorm') return 2;
  if (weather === 'fog') return 3;
  return null;
}

// ===== CRP from corruption storm =====

/** Get per-turn CRP gain from weather. */
export function getWeatherCrpGain(weather: WeatherType): number {
  if (weather === 'corruption_storm') return 1;
  return 0;
}

// ===== Display info =====

export type WeatherInfo = {
  name: string;
  icon: string;
  effects: string[];
};

export function getWeatherInfo(weather: WeatherType): WeatherInfo {
  switch (weather) {
    case 'clear':
      return { name: 'Clear', icon: '☀', effects: ['No weather effects'] };
    case 'rain':
      return {
        name: 'Rain',
        icon: '🌧',
        effects: ['-15 Hit (bows/fire)', 'Fire magic -2 Might', '-1 MOV (mounted)'],
      };
    case 'fog':
      return { name: 'Fog', icon: '🌫', effects: ['Vision capped at 3', 'Thief sight unaffected'] };
    case 'snow':
      return {
        name: 'Snow',
        icon: '❄',
        effects: ['+1 movement cost (ground)', '-2 SPD all units'],
      };
    case 'sandstorm':
      return { name: 'Sandstorm', icon: '🏜', effects: ['-20 Hit (ranged)', 'Vision capped at 2'] };
    case 'corruption_storm':
      return { name: 'Corruption Storm', icon: '💜', effects: ['+1 CRP/turn all units'] };
  }
}
