import type { Unit, Weapon, WeaponType, TerrainType, Faction } from './types';
import { getTerrainData } from './terrain';
import type { SeededRandom } from './rng';
import {
  shouldVantage,
  hasQuickRiposte,
  getEffectiveDoublingThreshold,
  getModifiedCrit,
  unitHasNihil,
  resolvePerHitSkills,
  resolveDefenseSkills,
  hasSkill,
} from './skills';
import { getEffectiveStats, getMemoryBladeMight, getLightMagicBonus, applySyncHitBonus } from './metaStats';

// ===== Weapon Triangle =====

type TriangleResult = { hitMod: number; dmgMod: number };

const WEAPON_ADVANTAGE: Partial<Record<WeaponType, WeaponType>> = {
  sword: 'axe',
  axe: 'lance',
  lance: 'sword',
  fire: 'wind',
  wind: 'thunder',
  thunder: 'fire',
  light: 'dark',
  dark: 'light',
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
  attacker: { unitId: string; name: string; currentHp: number; maxHp: number; faction: Faction; classId: string; weaponName: string; weaponType: WeaponType };
  defender: { unitId: string; name: string; currentHp: number; maxHp: number; faction: Faction; classId: string; weaponName: string; weaponType: WeaponType };
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
  attackerSkills: string[];
  defenderSkills: string[];
  vantageActive: boolean;
  distance: number;
};

function isMagicWeapon(weapon: Weapon): boolean {
  return weapon.type === 'fire' || weapon.type === 'thunder' || weapon.type === 'wind'
    || weapon.type === 'dark' || weapon.type === 'light';
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
  const baseCrit = Math.floor(attacker.stats.skl / 2) + weapon.crit - defender.stats.lck;
  return getModifiedCrit(attacker, Math.max(0, baseCrit));
}

function canDouble(attacker: Unit, defender: Unit): boolean {
  const threshold = getEffectiveDoublingThreshold(attacker);
  return attacker.stats.spd - defender.stats.spd >= threshold;
}

function canCounterattack(_attacker: Unit, defender: Unit, distance: number): boolean {
  const defWeapon = defender.equippedWeapon;
  return distance >= defWeapon.minRange && distance <= defWeapon.maxRange;
}

export function calculateCombatForecast(
  attacker: Unit,
  defender: Unit,
  attackerTerrain: TerrainType,
  defenderTerrain: TerrainType,
  distance: number,
  options?: { attackerNearRen?: boolean; defenderNearRen?: boolean },
): CombatForecast {
  const atkNearRen = options?.attackerNearRen ?? false;
  const defNearRen = options?.defenderNearRen ?? false;

  // Apply meta-stat effective stats (STA penalties, CRP drain, LOY bonus, SYNC)
  const atkEffStats = getEffectiveStats(attacker, atkNearRen);
  const defEffStats = getEffectiveStats(defender, defNearRen);
  const atkEff = { ...attacker, stats: atkEffStats };
  const defEff = { ...defender, stats: defEffStats };

  // Memory Blade: dynamic might based on LOOP
  if (attacker.equippedWeapon.id === 'memory_blade') {
    const dynamicMight = getMemoryBladeMight(attacker.metaStats.loop);
    atkEff.equippedWeapon = { ...attacker.equippedWeapon, might: dynamicMight };
  }
  if (defender.equippedWeapon.id === 'memory_blade') {
    const dynamicMight = getMemoryBladeMight(defender.metaStats.loop);
    defEff.equippedWeapon = { ...defender.equippedWeapon, might: dynamicMight };
  }

  let atkDmg = calcDamage(atkEff, defEff, defenderTerrain);
  const atkHit = calcHit(atkEff, defEff, defenderTerrain) + applySyncHitBonus(attacker.metaStats.sync);
  const atkCrit = calcCrit(atkEff, defEff);
  const atkDouble = canDouble(atkEff, defEff);

  // Light magic +50% damage vs corrupted units
  if ((attacker.equippedWeapon.type === 'light') && defender.metaStats.crp > 0) {
    atkDmg = Math.floor(atkDmg * getLightMagicBonus(defender.metaStats.crp));
  }

  const canCounter = canCounterattack(atkEff, defEff, distance);
  let defDmg = canCounter ? calcDamage(defEff, atkEff, attackerTerrain) : 0;
  const defHit = canCounter ? calcHit(defEff, atkEff, attackerTerrain) + applySyncHitBonus(defender.metaStats.sync) : 0;
  const defCrit = canCounter ? calcCrit(defEff, atkEff) : 0;
  const defDouble = canCounter && canDouble(defEff, atkEff);

  // Light magic +50% for defender counter too
  if (canCounter && defender.equippedWeapon.type === 'light' && attacker.metaStats.crp > 0) {
    defDmg = Math.floor(defDmg * getLightMagicBonus(attacker.metaStats.crp));
  }

  // Vantage: defender strikes first when HP ≤ 50%
  const dummyRng = { roll: () => true }; // forecast checks condition only, no RNG
  const vantageActive = canCounter && shouldVantage(defEff, dummyRng);

  // Quick Riposte: defender guaranteed double on counter at HP ≥ 70%
  const quickRiposteActive = canCounter && hasQuickRiposte(defEff);
  const effectiveDefDouble = defDouble || quickRiposteActive;

  // Build round sequence
  const rounds: CombatRound[] = [];
  const atkRound: CombatRound = { attackerIsInitiator: true, damage: atkDmg, hitChance: atkHit, critChance: atkCrit };
  const defRound: CombatRound = { attackerIsInitiator: false, damage: defDmg, hitChance: defHit, critChance: defCrit };

  if (vantageActive) {
    // Defender strikes first
    rounds.push(defRound);
    rounds.push(atkRound);
  } else {
    rounds.push(atkRound);
    if (canCounter) rounds.push(defRound);
  }

  if (atkDouble) {
    rounds.push({ attackerIsInitiator: true, damage: atkDmg, hitChance: atkHit, critChance: atkCrit });
  }
  if (effectiveDefDouble && canCounter) {
    rounds.push({ attackerIsInitiator: false, damage: defDmg, hitChance: defHit, critChance: defCrit });
  }

  return {
    attacker: { unitId: attacker.id, name: attacker.name, currentHp: attacker.currentHp, maxHp: attacker.stats.hp, faction: attacker.faction, classId: attacker.classId, weaponName: attacker.equippedWeapon.name, weaponType: attacker.equippedWeapon.type },
    defender: { unitId: defender.id, name: defender.name, currentHp: defender.currentHp, maxHp: defender.stats.hp, faction: defender.faction, classId: defender.classId, weaponName: defender.equippedWeapon.name, weaponType: defender.equippedWeapon.type },
    attackerDamage: atkDmg,
    attackerHit: atkHit,
    attackerCrit: atkCrit,
    defenderDamage: defDmg,
    defenderHit: defHit,
    defenderCrit: defCrit,
    attackerCanDouble: atkDouble,
    defenderCanDouble: effectiveDefDouble,
    defenderCanCounter: canCounter,
    rounds,
    attackerSkills: attacker.skills ?? [],
    defenderSkills: defender.skills ?? [],
    vantageActive,
    distance,
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
  activatedSkill: string | null;
  healedAmount: number;
  miracleSaved: boolean;
};

export type CombatResult = {
  hits: CombatHit[];
  attackerHpAfter: number;
  defenderHpAfter: number;
  attackerDied: boolean;
  defenderDied: boolean;
};

export function resolveCombat(
  forecast: CombatForecast,
  rng: SeededRandom,
  attackerUnit?: Unit,
  defenderUnit?: Unit,
): CombatResult {
  let atkHp = forecast.attacker.currentHp;
  let defHp = forecast.defender.currentHp;
  const hits: CombatHit[] = [];

  // Nihil check: if either unit has Nihil, opponent skills are disabled
  const atkNihil = attackerUnit ? unitHasNihil(attackerUnit) : false;
  const defNihil = defenderUnit ? unitHasNihil(defenderUnit) : false;

  // Determine if attacker/defender are bosses (for Lethality)
  const defIsBoss = defenderUnit?.aiBehavior?.type === 'boss';
  const atkIsBoss = attackerUnit?.aiBehavior?.type === 'boss';

  for (const round of forecast.rounds) {
    if (atkHp <= 0 || defHp <= 0) break;

    // SYNC <30 variance: ±2 to damage and ±5 to hit chance per round
    let roundHitChance = round.hitChance;
    let roundDamage = round.damage;
    const actingUnit = round.attackerIsInitiator ? attackerUnit : defenderUnit;
    if (actingUnit && actingUnit.metaStats.sync < 30) {
      const dmgVariance = rng.nextInt(0, 4) - 2; // -2 to +2
      const hitVariance = (rng.nextInt(0, 4) - 2) * 2; // -4 to +4 (from ±2 SKL)
      roundDamage = Math.max(0, roundDamage + dmgVariance);
      roundHitChance = Math.max(0, Math.min(100, roundHitChance + hitVariance));
    }

    const didHit = rng.roll(roundHitChance);
    const didCrit = didHit && rng.roll(round.critChance);
    let baseDamage = didHit ? (didCrit ? roundDamage * 3 : roundDamage) : 0;

    let activatedSkill: string | null = null;
    let healedAmount = 0;
    let miracleSaved = false;

    if (round.attackerIsInitiator) {
      // Attacker per-hit skills (disabled if defender has Nihil)
      if (didHit && baseDamage > 0 && attackerUnit && !defNihil) {
        const skillResult = resolvePerHitSkills(
          attackerUnit, defenderUnit ?? attackerUnit, baseDamage, rng, defIsBoss
        );
        if (skillResult.skillId) {
          activatedSkill = skillResult.skillId;
          baseDamage = skillResult.modifiedDamage;
          healedAmount = skillResult.healAmount;

          if (skillResult.instantKill) {
            baseDamage = defHp; // kill
          }

          // Extra hits from Astra/Adept — each goes through defense skills
          if (skillResult.bonusHits > 0) {
            const isMagic = isMagicWeapon(attackerUnit.equippedWeapon);
            for (let i = 0; i < skillResult.bonusHits; i++) {
              if (defHp <= 0) break;
              let bonusDmg = baseDamage;
              let bonusMiracled = false;

              // Defense skills on each bonus hit
              if (defenderUnit && !atkNihil) {
                const bonusDefResult = resolveDefenseSkills(
                  { ...defenderUnit, currentHp: defHp } as Unit,
                  bonusDmg, isMagic, rng,
                );
                if (bonusDefResult.skillId) {
                  bonusDmg = bonusDefResult.reducedDamage;
                  bonusMiracled = bonusDefResult.miracleSaved;
                }
              }

              defHp = Math.max(0, defHp - bonusDmg);
              hits.push({
                attackerIsInitiator: true, hit: true, crit: false,
                damage: bonusDmg, targetHpAfter: defHp,
                targetKilled: defHp <= 0,
                activatedSkill: skillResult.skillId,
                healedAmount: 0, miracleSaved: bonusMiracled,
              });
            }
          }
        }
      }

      // Defense skills on main hit (disabled if attacker has Nihil)
      if (didHit && baseDamage > 0 && defenderUnit && !atkNihil) {
        const defResult = resolveDefenseSkills(
          { ...defenderUnit, currentHp: defHp } as Unit,
          baseDamage,
          isMagicWeapon(attackerUnit?.equippedWeapon ?? { type: 'sword' } as Weapon),
          rng,
        );
        if (defResult.skillId) {
          activatedSkill = activatedSkill ?? defResult.skillId;
          baseDamage = defResult.reducedDamage;
          miracleSaved = defResult.miracleSaved;
        }
      }

      // Sol heals based on post-defense-skill damage (not pre-reduction)
      if (healedAmount > 0) {
        healedAmount = baseDamage;
      }

      defHp = Math.max(0, defHp - baseDamage);

      // Sol healing
      if (healedAmount > 0 && attackerUnit) {
        atkHp = Math.min(forecast.attacker.maxHp, atkHp + healedAmount);
      }

      hits.push({
        attackerIsInitiator: true,
        hit: didHit,
        crit: didCrit,
        damage: baseDamage,
        targetHpAfter: defHp,
        targetKilled: defHp <= 0,
        activatedSkill,
        healedAmount,
        miracleSaved,
      });
    } else {
      // Defender per-hit skills (disabled if attacker has Nihil)
      if (didHit && baseDamage > 0 && defenderUnit && !atkNihil) {
        const skillResult = resolvePerHitSkills(
          defenderUnit, attackerUnit ?? defenderUnit, baseDamage, rng, atkIsBoss
        );
        if (skillResult.skillId) {
          activatedSkill = skillResult.skillId;
          baseDamage = skillResult.modifiedDamage;
          healedAmount = skillResult.healAmount;

          if (skillResult.instantKill) {
            baseDamage = atkHp;
          }

          // Extra hits from Astra/Adept — each goes through defense skills
          if (skillResult.bonusHits > 0) {
            const isMagic = isMagicWeapon(defenderUnit.equippedWeapon);
            for (let i = 0; i < skillResult.bonusHits; i++) {
              if (atkHp <= 0) break;
              let bonusDmg = baseDamage;
              let bonusMiracled = false;

              // Defense skills on each bonus hit
              if (attackerUnit && !defNihil) {
                const bonusDefResult = resolveDefenseSkills(
                  { ...attackerUnit, currentHp: atkHp } as Unit,
                  bonusDmg, isMagic, rng,
                );
                if (bonusDefResult.skillId) {
                  bonusDmg = bonusDefResult.reducedDamage;
                  bonusMiracled = bonusDefResult.miracleSaved;
                }
              }

              atkHp = Math.max(0, atkHp - bonusDmg);
              hits.push({
                attackerIsInitiator: false, hit: true, crit: false,
                damage: bonusDmg, targetHpAfter: atkHp,
                targetKilled: atkHp <= 0,
                activatedSkill: skillResult.skillId,
                healedAmount: 0, miracleSaved: bonusMiracled,
              });
            }
          }
        }
      }

      // Defense skills on main hit (disabled if defender has Nihil)
      if (didHit && baseDamage > 0 && attackerUnit && !defNihil) {
        const defResult = resolveDefenseSkills(
          { ...attackerUnit, currentHp: atkHp } as Unit,
          baseDamage,
          isMagicWeapon(defenderUnit?.equippedWeapon ?? { type: 'sword' } as Weapon),
          rng,
        );
        if (defResult.skillId) {
          activatedSkill = activatedSkill ?? defResult.skillId;
          baseDamage = defResult.reducedDamage;
          miracleSaved = defResult.miracleSaved;
        }
      }

      // Sol heals based on post-defense-skill damage (not pre-reduction)
      if (healedAmount > 0) {
        healedAmount = baseDamage;
      }

      atkHp = Math.max(0, atkHp - baseDamage);

      if (healedAmount > 0 && defenderUnit) {
        defHp = Math.min(forecast.defender.maxHp, defHp + healedAmount);
      }

      hits.push({
        attackerIsInitiator: false,
        hit: didHit,
        crit: didCrit,
        damage: baseDamage,
        targetHpAfter: atkHp,
        targetKilled: atkHp <= 0,
        activatedSkill,
        healedAmount,
        miracleSaved,
      });
    }
  }

  // Counter skill: when defender has Counter, was hit at range > 1, and is still alive,
  // reflect 50% of total damage dealt to defender back onto attacker
  if (defenderUnit && attackerUnit && defHp > 0 && atkHp > 0 && forecast.distance > 1 && hasSkill(defenderUnit, 'counter') && !atkNihil) {
    // Sum all damage dealt to defender
    let totalDmgToDefender = 0;
    for (const h of hits) {
      if (h.attackerIsInitiator && h.hit) totalDmgToDefender += h.damage;
    }
    if (totalDmgToDefender > 0) {
      const counterDmg = Math.max(1, Math.floor(totalDmgToDefender / 2));
      atkHp = Math.max(0, atkHp - counterDmg);
      hits.push({
        attackerIsInitiator: false,
        hit: true,
        crit: false,
        damage: counterDmg,
        targetHpAfter: atkHp,
        targetKilled: atkHp <= 0,
        activatedSkill: 'counter',
        healedAmount: 0,
        miracleSaved: false,
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

// ===== Healing =====

export type HealResult = {
  healAmount: number;
  targetHpBefore: number;
  targetHpAfter: number;
};

/** Resolve a staff heal. Always succeeds. Heal = mag + weapon.might, capped at target maxHP. */
export function resolveHealing(healer: Unit, target: Unit): HealResult {
  const healPower = healer.stats.mag + healer.equippedWeapon.might;
  const hpBefore = target.currentHp;
  const hpAfter = Math.min(target.stats.hp, hpBefore + healPower);
  return {
    healAmount: hpAfter - hpBefore,
    targetHpBefore: hpBefore,
    targetHpAfter: hpAfter,
  };
}
