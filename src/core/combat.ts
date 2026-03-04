import type { Unit, Weapon, WeaponType, TerrainType, Faction } from './types';
import { getTerrainData } from './terrain';
import type { SeededRandom } from './rng';

// ===== Weapon Triangle =====

type TriangleResult = { hitMod: number; dmgMod: number };

const WEAPON_ADVANTAGE: Record<WeaponType, WeaponType> = {
  sword: 'axe',
  axe: 'lance',
  lance: 'sword',
  fire: 'wind',
  wind: 'thunder',
  thunder: 'fire',
};

export function getWeaponTriangle(attacker: WeaponType, defender: WeaponType): TriangleResult {
  if (WEAPON_ADVANTAGE[attacker] === defender) {
    return { hitMod: 15, dmgMod: 1 };   // advantage
  }
  if (WEAPON_ADVANTAGE[defender] === attacker) {
    return { hitMod: -15, dmgMod: -1 };  // disadvantage
  }
  return { hitMod: 0, dmgMod: 0 };       // neutral
}

// ===== Combat Forecast =====

export type CombatRound = {
  attackerIsInitiator: boolean;
  damage: number;
  hitChance: number;
  critChance: number;
};

export type CombatForecast = {
  attacker: { unitId: string; name: string; currentHp: number; maxHp: number; faction: Faction };
  defender: { unitId: string; name: string; currentHp: number; maxHp: number; faction: Faction };
  attackerDamage: number;
  attackerHit: number;
  attackerCrit: number;
  defenderDamage: number;
  defenderHit: number;
  defenderCrit: number;
  attackerCanDouble: boolean;
  defenderCanDouble: boolean;
  defenderCanCounter: boolean;
  rounds: CombatRound[];
};

function isMagicWeapon(weapon: Weapon): boolean {
  return weapon.type === 'fire' || weapon.type === 'thunder' || weapon.type === 'wind';
}

function calcDamage(attacker: Unit, defender: Unit, defenderTerrain: TerrainType): number {
  const weapon = attacker.equippedWeapon;
  const triangle = getWeaponTriangle(weapon.type, defender.equippedWeapon.type);
  const terrainDef = getTerrainData(defenderTerrain).defenseBonus;

  let dmg: number;
  if (isMagicWeapon(weapon)) {
    dmg = attacker.stats.mag + weapon.might - defender.stats.res - terrainDef;
  } else {
    dmg = attacker.stats.str + weapon.might - defender.stats.def - terrainDef;
  }
  dmg += triangle.dmgMod;
  return Math.max(0, dmg);
}

function calcHit(attacker: Unit, defender: Unit, defenderTerrain: TerrainType): number {
  const weapon = attacker.equippedWeapon;
  const triangle = getWeaponTriangle(weapon.type, defender.equippedWeapon.type);
  const terrainAvoid = getTerrainData(defenderTerrain).avoidBonus;

  const accuracy = attacker.stats.skl * 2 + attacker.stats.lck + weapon.hit;
  const evade = defender.stats.spd * 2 + defender.stats.lck + terrainAvoid;
  const hit = accuracy - evade + triangle.hitMod;
  return Math.max(1, Math.min(99, hit));
}

function calcCrit(attacker: Unit, defender: Unit): number {
  const weapon = attacker.equippedWeapon;
  const critRate = Math.floor(attacker.stats.skl / 2) + weapon.crit - defender.stats.lck;
  return Math.max(0, Math.min(100, critRate));
}

function canDouble(attacker: Unit, defender: Unit): boolean {
  return attacker.stats.spd - defender.stats.spd >= 5;
}

function canCounterattack(attacker: Unit, defender: Unit, distance: number): boolean {
  const defWeapon = defender.equippedWeapon;
  return distance >= defWeapon.minRange && distance <= defWeapon.maxRange;
}

export function calculateCombatForecast(
  attacker: Unit,
  defender: Unit,
  attackerTerrain: TerrainType,
  defenderTerrain: TerrainType,
  distance: number,
): CombatForecast {
  const atkDmg = calcDamage(attacker, defender, defenderTerrain);
  const atkHit = calcHit(attacker, defender, defenderTerrain);
  const atkCrit = calcCrit(attacker, defender);
  const atkDouble = canDouble(attacker, defender);

  const canCounter = canCounterattack(attacker, defender, distance);
  const defDmg = canCounter ? calcDamage(defender, attacker, attackerTerrain) : 0;
  const defHit = canCounter ? calcHit(defender, attacker, attackerTerrain) : 0;
  const defCrit = canCounter ? calcCrit(defender, attacker) : 0;
  const defDouble = canCounter && canDouble(defender, attacker);

  // Build round sequence: attacker → defender → (double attacker or double defender)
  const rounds: CombatRound[] = [];
  rounds.push({ attackerIsInitiator: true, damage: atkDmg, hitChance: atkHit, critChance: atkCrit });

  if (canCounter) {
    rounds.push({ attackerIsInitiator: false, damage: defDmg, hitChance: defHit, critChance: defCrit });
  }

  if (atkDouble) {
    rounds.push({ attackerIsInitiator: true, damage: atkDmg, hitChance: atkHit, critChance: atkCrit });
  } else if (defDouble) {
    rounds.push({ attackerIsInitiator: false, damage: defDmg, hitChance: defHit, critChance: defCrit });
  }

  return {
    attacker: { unitId: attacker.id, name: attacker.name, currentHp: attacker.currentHp, maxHp: attacker.stats.hp, faction: attacker.faction },
    defender: { unitId: defender.id, name: defender.name, currentHp: defender.currentHp, maxHp: defender.stats.hp, faction: defender.faction },
    attackerDamage: atkDmg,
    attackerHit: atkHit,
    attackerCrit: atkCrit,
    defenderDamage: defDmg,
    defenderHit: defHit,
    defenderCrit: defCrit,
    attackerCanDouble: atkDouble,
    defenderCanDouble: defDouble,
    defenderCanCounter: canCounter,
    rounds,
  };
}

// ===== Combat Resolution =====

export type CombatHit = {
  attackerIsInitiator: boolean;
  hit: boolean;
  crit: boolean;
  damage: number;
  targetHpAfter: number;
  targetKilled: boolean;
};

export type CombatResult = {
  hits: CombatHit[];
  attackerHpAfter: number;
  defenderHpAfter: number;
  attackerDied: boolean;
  defenderDied: boolean;
};

export function resolveCombat(forecast: CombatForecast, rng: SeededRandom): CombatResult {
  let atkHp = forecast.attacker.currentHp;
  let defHp = forecast.defender.currentHp;
  const hits: CombatHit[] = [];

  for (const round of forecast.rounds) {
    // Stop if either unit is dead
    if (atkHp <= 0 || defHp <= 0) break;

    const didHit = rng.roll(round.hitChance);
    const didCrit = didHit && rng.roll(round.critChance);
    const finalDamage = didHit ? (didCrit ? round.damage * 3 : round.damage) : 0;

    if (round.attackerIsInitiator) {
      defHp = Math.max(0, defHp - finalDamage);
      hits.push({
        attackerIsInitiator: true,
        hit: didHit,
        crit: didCrit,
        damage: finalDamage,
        targetHpAfter: defHp,
        targetKilled: defHp <= 0,
      });
    } else {
      atkHp = Math.max(0, atkHp - finalDamage);
      hits.push({
        attackerIsInitiator: false,
        hit: didHit,
        crit: didCrit,
        damage: finalDamage,
        targetHpAfter: atkHp,
        targetKilled: atkHp <= 0,
      });
    }
  }

  return {
    hits,
    attackerHpAfter: atkHp,
    defenderHpAfter: defHp,
    attackerDied: atkHp <= 0,
    defenderDied: defHp <= 0,
  };
}
