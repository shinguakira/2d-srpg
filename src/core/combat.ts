import type { Unit, Weapon, WeaponType, TerrainType, Faction, WeatherType } from './types';
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
import {
  getEffectiveStats,
  getMemoryBladeMight,
  getLightMagicBonus,
  applySyncHitBonus,
} from './metaStats';
import { getBossImmunity, applyBossImmunity } from './bossPhase';
import { getTraumaStatMods } from './traumaSkills';
import { getWeatherCombatModifiers } from './weather';
import { ALL_CLASSES } from '../data/promotedClasses';
import type { SupportCombatBonuses } from './support';

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
    return { hitMod: 15, dmgMod: 1 }; // advantage
  }
  if (WEAPON_ADVANTAGE[defender] === attacker) {
    return { hitMod: -15, dmgMod: -1 }; // disadvantage
  }
  return { hitMod: 0, dmgMod: 0 }; // neutral
}

// ===== Combat Forecast =====

type CombatRound = {
  attackerIsInitiator: boolean;
  damage: number;
  hitChance: number;
  critChance: number;
};

export type CombatForecast = {
  attacker: {
    unitId: string;
    name: string;
    currentHp: number;
    maxHp: number;
    faction: Faction;
    classId: string;
    weaponId: string;
    weaponName: string;
    weaponType: WeaponType;
    weaponDurability?: number | null;
    weaponMaxDurability?: number | null;
  };
  defender: {
    unitId: string;
    name: string;
    currentHp: number;
    maxHp: number;
    faction: Faction;
    classId: string;
    weaponId: string;
    weaponName: string;
    weaponType: WeaponType;
    weaponDurability?: number | null;
    weaponMaxDurability?: number | null;
  };
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
  attackerProficient: boolean;
  defenderProficient: boolean;
};

export function isMagicWeapon(weapon: Weapon): boolean {
  return (
    weapon.type === 'fire' ||
    weapon.type === 'thunder' ||
    weapon.type === 'wind' ||
    weapon.type === 'dark' ||
    weapon.type === 'light'
  );
}

/** Check if a unit's class is proficient with the given weapon type */
export function isWeaponProficient(unit: Unit, weapon: Weapon): boolean {
  const cls = ALL_CLASSES[unit.classId];
  if (!cls?.weaponTypes?.length) return false;
  return cls.weaponTypes.includes(weapon.type);
}

/** Check if a unit's class can use staves for healing */
export function canHealWithStaff(unit: Unit): boolean {
  const cls = ALL_CLASSES[unit.classId];
  return !!cls?.weaponTypes?.includes('staff');
}

/** Get effective weapon range — non-proficient magic/staff users are limited to range 1 (melee bonk) */
export function getEffectiveWeaponRange(
  unit: Unit,
  weapon: Weapon,
): { minRange: number; maxRange: number } {
  if ((isMagicWeapon(weapon) || weapon.type === 'staff') && !isWeaponProficient(unit, weapon)) {
    return { minRange: 1, maxRange: 1 };
  }
  return { minRange: weapon.minRange, maxRange: weapon.maxRange };
}

export function isEffectiveAgainst(weapon: Weapon, defender: Unit): boolean {
  if (!weapon.effectiveAgainst || weapon.effectiveAgainst.length === 0) return false;
  const cls = ALL_CLASSES[defender.classId];
  for (const tag of weapon.effectiveAgainst) {
    if (tag === 'armored' && cls?.armored) return true;
    if (tag === 'mounted' && cls?.mounted) return true;
    if (tag === 'flying' && cls?.flying) return true;
    if (defender.tags?.includes(tag)) return true;
  }
  return false;
}

function calcDamage(attacker: Unit, defender: Unit, defenderTerrain: TerrainType): number {
  const weapon = attacker.equippedWeapon;
  const proficient = isWeaponProficient(attacker, weapon);
  // Non-proficient: no weapon triangle bonus or penalty
  const triangle = proficient
    ? getWeaponTriangle(weapon.type, defender.equippedWeapon.type)
    : { hitMod: 0, dmgMod: 0 };
  const terrainDef = getTerrainData(defenderTerrain).defenseBonus;

  let dmg: number;
  if (isMagicWeapon(weapon)) {
    if (proficient) {
      // Magic: MAG + might vs RES
      dmg = attacker.stats.mag + weapon.might - defender.stats.res - terrainDef;
    } else {
      // Non-proficient magic: STR + might vs DEF (physical bonk)
      dmg = attacker.stats.str + weapon.might - defender.stats.def - terrainDef;
    }
  } else if (weapon.type === 'staff') {
    if (proficient) {
      // Proficient staff attack: MAG + might vs RES
      dmg = attacker.stats.mag + weapon.might - defender.stats.res - terrainDef;
    } else {
      // Non-proficient staff: STR + might vs DEF (physical bonk)
      dmg = attacker.stats.str + weapon.might - defender.stats.def - terrainDef;
    }
  } else {
    // Physical weapons (sword, axe, lance, bow, knife)
    dmg = attacker.stats.str + weapon.might - defender.stats.def - terrainDef;
    // Non-proficient physical: -2 damage penalty
    if (!proficient) dmg -= 2;
  }
  dmg += triangle.dmgMod;

  // Effective damage: 3x weapon might bonus
  if (isEffectiveAgainst(weapon, defender)) {
    dmg += weapon.might * 2; // effectively 3x weapon might total
  }

  return Math.max(0, dmg);
}

function calcHit(attacker: Unit, defender: Unit, defenderTerrain: TerrainType): number {
  const weapon = attacker.equippedWeapon;
  const proficient = isWeaponProficient(attacker, weapon);
  // Non-proficient: no weapon triangle hit mod
  const triangle = proficient
    ? getWeaponTriangle(weapon.type, defender.equippedWeapon.type)
    : { hitMod: 0, dmgMod: 0 };
  const terrainAvoid = getTerrainData(defenderTerrain).avoidBonus;

  const accuracy = attacker.stats.skl * 2 + attacker.stats.lck + weapon.hit;
  const evade = defender.stats.spd * 2 + defender.stats.lck + terrainAvoid;
  let hit = accuracy - evade + triangle.hitMod;
  // Non-proficient: -20 hit penalty
  if (!proficient) hit -= 20;
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
  const { minRange, maxRange } = getEffectiveWeaponRange(defender, defWeapon);
  return distance >= minRange && distance <= maxRange;
}

export function calculateCombatForecast(
  attacker: Unit,
  defender: Unit,
  attackerTerrain: TerrainType,
  defenderTerrain: TerrainType,
  distance: number,
  options?: {
    attackerNearRen?: boolean;
    defenderNearRen?: boolean;
    weather?: WeatherType;
    attackerSupport?: SupportCombatBonuses;
    defenderSupport?: SupportCombatBonuses;
    attackerHasIronwallAlly?: boolean;
    defenderHasIronwallAlly?: boolean;
  },
): CombatForecast {
  const atkNearRen = options?.attackerNearRen ?? false;
  const defNearRen = options?.defenderNearRen ?? false;
  const weather = options?.weather ?? 'clear';
  const atkSupport = options?.attackerSupport ?? { hit: 0, avoid: 0, crit: 0, dmg: 0 };
  const defSupport = options?.defenderSupport ?? { hit: 0, avoid: 0, crit: 0, dmg: 0 };

  // Apply meta-stat effective stats (STA penalties, CRP drain, LOY bonus, SYNC)
  const atkEffStats = getEffectiveStats(attacker, atkNearRen);
  const defEffStats = getEffectiveStats(defender, defNearRen);

  // Apply trauma stat mods
  const atkTrauma = getTraumaStatMods(attacker);
  const defTrauma = getTraumaStatMods(defender);
  for (const [key, val] of Object.entries(atkTrauma)) {
    if (val && key in atkEffStats)
      (atkEffStats as Record<string, number>)[key] = Math.max(
        0,
        (atkEffStats as Record<string, number>)[key] + val,
      );
  }
  for (const [key, val] of Object.entries(defTrauma)) {
    if (val && key in defEffStats)
      (defEffStats as Record<string, number>)[key] = Math.max(
        0,
        (defEffStats as Record<string, number>)[key] + val,
      );
  }

  const atkEff = { ...attacker, stats: atkEffStats };
  const defEff = { ...defender, stats: defEffStats };

  // Weather: apply SPD modifier
  const atkWeatherMods = getWeatherCombatModifiers(weather, attacker.equippedWeapon);
  const defWeatherMods = getWeatherCombatModifiers(weather, defender.equippedWeapon);
  if (atkWeatherMods.spdMod)
    atkEff.stats = { ...atkEff.stats, spd: Math.max(0, atkEff.stats.spd + atkWeatherMods.spdMod) };
  if (defWeatherMods.spdMod)
    defEff.stats = { ...defEff.stats, spd: Math.max(0, defEff.stats.spd + defWeatherMods.spdMod) };

  // Memory Blade: dynamic might based on LOOP
  if (attacker.equippedWeapon.id === 'memory_blade') {
    const dynamicMight = getMemoryBladeMight(attacker.metaStats.loop);
    atkEff.equippedWeapon = { ...attacker.equippedWeapon, might: dynamicMight };
  }
  if (defender.equippedWeapon.id === 'memory_blade') {
    const dynamicMight = getMemoryBladeMight(defender.metaStats.loop);
    defEff.equippedWeapon = { ...defender.equippedWeapon, might: dynamicMight };
  }

  // Echo's Interface: dynamic might = target's CRP value
  if (attacker.equippedWeapon.id === 'echos_interface') {
    atkEff.equippedWeapon = {
      ...attacker.equippedWeapon,
      might: Math.max(1, defender.metaStats.crp),
    };
  }
  if (defender.equippedWeapon.id === 'echos_interface') {
    defEff.equippedWeapon = {
      ...defender.equippedWeapon,
      might: Math.max(1, attacker.metaStats.crp),
    };
  }

  let atkDmg =
    calcDamage(atkEff, defEff, defenderTerrain) + atkWeatherMods.mightMod + atkSupport.dmg;
  // Tri-Magic: ×1.5 tome damage
  if (isMagicWeapon(atkEff.equippedWeapon) && hasSkill(attacker, 'tri_magic')) {
    atkDmg = Math.floor(atkDmg * 1.5);
  }
  // Vengeance trauma: +30% damage when HP ≤ 25%
  if (
    hasSkill(attacker, 'vengeance_trauma') &&
    (attacker.currentHp / attacker.stats.hp) * 100 <= 25
  ) {
    atkDmg = Math.floor(atkDmg * 1.3);
  }
  // Ironwall: if defender has adjacent ally with Ironwall, -50% damage
  if (options?.defenderHasIronwallAlly) {
    atkDmg = Math.max(1, Math.floor(atkDmg / 2));
  }
  // Boss immunity: zero out damage if defender is immune to this damage type
  const defImmunity = getBossImmunity(defEff);
  atkDmg = applyBossImmunity(atkDmg, atkEff.equippedWeapon.type, defImmunity);
  atkDmg = Math.max(0, atkDmg);
  // Numb trauma: -10 avoid
  let defNumbPenalty = 0;
  if (hasSkill(defender, 'numb')) defNumbPenalty = -10;
  let atkNumbPenalty = 0;
  if (hasSkill(attacker, 'numb')) atkNumbPenalty = -10;
  const atkHit = Math.max(
    0,
    Math.min(
      100,
      calcHit(atkEff, defEff, defenderTerrain) +
        applySyncHitBonus(attacker.metaStats.sync) +
        atkWeatherMods.hitMod +
        atkSupport.hit -
        defSupport.avoid -
        defNumbPenalty,
    ),
  );
  const atkCrit = Math.max(0, calcCrit(atkEff, defEff) + atkSupport.crit);
  const atkDouble = canDouble(atkEff, defEff);

  // Light magic +50% damage vs corrupted units
  if (attacker.equippedWeapon.type === 'light' && defender.metaStats.crp > 0) {
    atkDmg = Math.floor(atkDmg * getLightMagicBonus(defender.metaStats.crp));
  }

  const canCounter = canCounterattack(atkEff, defEff, distance);
  let defDmg = canCounter
    ? calcDamage(defEff, atkEff, attackerTerrain) + defWeatherMods.mightMod + defSupport.dmg
    : 0;
  // Tri-Magic: ×1.5 tome damage for defender counter
  if (canCounter && isMagicWeapon(defEff.equippedWeapon) && hasSkill(defender, 'tri_magic')) {
    defDmg = Math.floor(defDmg * 1.5);
  }
  // Ironwall: if attacker has adjacent ally with Ironwall, -50% counter damage
  if (canCounter && options?.attackerHasIronwallAlly) {
    defDmg = Math.max(1, Math.floor(defDmg / 2));
  }
  // Boss immunity: zero out counter damage if attacker is immune
  const atkImmunity = getBossImmunity(atkEff);
  if (canCounter) defDmg = applyBossImmunity(defDmg, defEff.equippedWeapon.type, atkImmunity);
  defDmg = Math.max(0, defDmg);
  const defHit = canCounter
    ? Math.max(
        0,
        Math.min(
          100,
          calcHit(defEff, atkEff, attackerTerrain) +
            applySyncHitBonus(defender.metaStats.sync) +
            defWeatherMods.hitMod +
            defSupport.hit -
            atkSupport.avoid -
            atkNumbPenalty,
        ),
      )
    : 0;
  const defCrit = canCounter ? Math.max(0, calcCrit(defEff, atkEff) + defSupport.crit) : 0;
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
  const atkRound: CombatRound = {
    attackerIsInitiator: true,
    damage: atkDmg,
    hitChance: atkHit,
    critChance: atkCrit,
  };
  const defRound: CombatRound = {
    attackerIsInitiator: false,
    damage: defDmg,
    hitChance: defHit,
    critChance: defCrit,
  };

  if (vantageActive) {
    // Defender strikes first
    rounds.push(defRound);
    rounds.push(atkRound);
  } else {
    rounds.push(atkRound);
    if (canCounter) rounds.push(defRound);
  }

  if (atkDouble) {
    rounds.push({
      attackerIsInitiator: true,
      damage: atkDmg,
      hitChance: atkHit,
      critChance: atkCrit,
    });
  }
  if (effectiveDefDouble && canCounter) {
    rounds.push({
      attackerIsInitiator: false,
      damage: defDmg,
      hitChance: defHit,
      critChance: defCrit,
    });
  }

  return {
    attacker: {
      unitId: attacker.id,
      name: attacker.name,
      currentHp: attacker.currentHp,
      maxHp: attacker.stats.hp,
      faction: attacker.faction,
      classId: attacker.classId,
      weaponId: attacker.equippedWeapon.id,
      weaponName: attacker.equippedWeapon.name,
      weaponType: attacker.equippedWeapon.type,
      weaponDurability: attacker.equippedWeapon.durability,
      weaponMaxDurability: attacker.equippedWeapon.maxDurability,
    },
    defender: {
      unitId: defender.id,
      name: defender.name,
      currentHp: defender.currentHp,
      maxHp: defender.stats.hp,
      faction: defender.faction,
      classId: defender.classId,
      weaponId: defender.equippedWeapon.id,
      weaponName: defender.equippedWeapon.name,
      weaponType: defender.equippedWeapon.type,
      weaponDurability: defender.equippedWeapon.durability,
      weaponMaxDurability: defender.equippedWeapon.maxDurability,
    },
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
    attackerProficient: isWeaponProficient(attacker, attacker.equippedWeapon),
    defenderProficient: isWeaponProficient(defender, defender.equippedWeapon),
  };
}

// ===== Combat Resolution =====

type CombatHit = {
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
  galeforceTriggered?: boolean;
  activatedSkillKeys?: string[]; // 'unitId:skillId' for once-per-chapter tracking
};

export function resolveCombat(
  forecast: CombatForecast,
  rng: SeededRandom,
  attackerUnit?: Unit,
  defenderUnit?: Unit,
  usedSkills?: Set<string>,
): CombatResult {
  let atkHp = forecast.attacker.currentHp;
  let defHp = forecast.defender.currentHp;
  const hits: CombatHit[] = [];
  const newActivatedSkillKeys: string[] = [];

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

    // Vanish (Deadeye): guaranteed hit — check before hit roll
    const vanishGuarantee =
      actingUnit != null &&
      hasSkill(actingUnit, 'vanish') &&
      !usedSkills?.has(actingUnit.id + ':vanish') &&
      !newActivatedSkillKeys.includes(actingUnit.id + ':vanish'); // not already used this combat
    const didHit = vanishGuarantee || rng.roll(roundHitChance);
    const didCrit = didHit && rng.roll(round.critChance);
    let baseDamage = didHit ? (didCrit ? roundDamage * 3 : roundDamage) : 0;

    let activatedSkill: string | null = null;
    let healedAmount = 0;
    let miracleSaved = false;

    if (round.attackerIsInitiator) {
      // Attacker per-hit skills (disabled if defender has Nihil)
      if (didHit && baseDamage > 0 && attackerUnit && !defNihil) {
        const skillResult = resolvePerHitSkills(
          attackerUnit,
          defenderUnit ?? attackerUnit,
          baseDamage,
          rng,
          defIsBoss,
          usedSkills,
        );
        if (skillResult.skillId) {
          activatedSkill = skillResult.skillId;
          baseDamage = skillResult.modifiedDamage;
          healedAmount = skillResult.healAmount;
          if (skillResult.skillId === 'vanish')
            newActivatedSkillKeys.push(attackerUnit.id + ':vanish');

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
                  bonusDmg,
                  isMagic,
                  rng,
                  usedSkills,
                );
                if (bonusDefResult.skillId) {
                  bonusDmg = bonusDefResult.reducedDamage;
                  bonusMiracled = bonusDefResult.miracleSaved;
                  if (bonusDefResult.skillId === 'cycle_authority')
                    newActivatedSkillKeys.push(defenderUnit.id + ':cycle_authority');
                }
              }

              defHp = Math.max(0, defHp - bonusDmg);
              hits.push({
                attackerIsInitiator: true,
                hit: true,
                crit: false,
                damage: bonusDmg,
                targetHpAfter: defHp,
                targetKilled: defHp <= 0,
                activatedSkill: skillResult.skillId,
                healedAmount: 0,
                miracleSaved: bonusMiracled,
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
          isMagicWeapon(attackerUnit?.equippedWeapon ?? ({ type: 'sword' } as Weapon)),
          rng,
          usedSkills,
        );
        if (defResult.skillId) {
          activatedSkill = activatedSkill ?? defResult.skillId;
          baseDamage = defResult.reducedDamage;
          miracleSaved = defResult.miracleSaved;
          if (defResult.skillId === 'cycle_authority')
            newActivatedSkillKeys.push(defenderUnit.id + ':cycle_authority');
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
          defenderUnit,
          attackerUnit ?? defenderUnit,
          baseDamage,
          rng,
          atkIsBoss,
          usedSkills,
        );
        if (skillResult.skillId) {
          activatedSkill = skillResult.skillId;
          baseDamage = skillResult.modifiedDamage;
          healedAmount = skillResult.healAmount;
          if (skillResult.skillId === 'vanish')
            newActivatedSkillKeys.push(defenderUnit.id + ':vanish');

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
                  bonusDmg,
                  isMagic,
                  rng,
                  usedSkills,
                );
                if (bonusDefResult.skillId) {
                  bonusDmg = bonusDefResult.reducedDamage;
                  bonusMiracled = bonusDefResult.miracleSaved;
                  if (bonusDefResult.skillId === 'cycle_authority')
                    newActivatedSkillKeys.push(attackerUnit.id + ':cycle_authority');
                }
              }

              atkHp = Math.max(0, atkHp - bonusDmg);
              hits.push({
                attackerIsInitiator: false,
                hit: true,
                crit: false,
                damage: bonusDmg,
                targetHpAfter: atkHp,
                targetKilled: atkHp <= 0,
                activatedSkill: skillResult.skillId,
                healedAmount: 0,
                miracleSaved: bonusMiracled,
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
          isMagicWeapon(defenderUnit?.equippedWeapon ?? ({ type: 'sword' } as Weapon)),
          rng,
          usedSkills,
        );
        if (defResult.skillId) {
          activatedSkill = activatedSkill ?? defResult.skillId;
          baseDamage = defResult.reducedDamage;
          miracleSaved = defResult.miracleSaved;
          if (defResult.skillId === 'cycle_authority')
            newActivatedSkillKeys.push(attackerUnit.id + ':cycle_authority');
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
  if (
    defenderUnit &&
    attackerUnit &&
    defHp > 0 &&
    atkHp > 0 &&
    forecast.distance > 1 &&
    hasSkill(defenderUnit, 'counter') &&
    !atkNihil
  ) {
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

  // Divine Wings (Galeforce): extra turn if attacker killed defender
  const galeforceTriggered =
    defHp <= 0 && atkHp > 0 && attackerUnit != null && hasSkill(attackerUnit, 'divine_wings');

  return {
    hits,
    attackerHpAfter: atkHp,
    defenderHpAfter: defHp,
    attackerDied: atkHp <= 0,
    defenderDied: defHp <= 0,
    galeforceTriggered: galeforceTriggered || undefined,
    activatedSkillKeys: newActivatedSkillKeys.length > 0 ? newActivatedSkillKeys : undefined,
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
