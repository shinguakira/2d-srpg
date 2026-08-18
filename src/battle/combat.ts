import { classOf } from '../data/classes';
import { MAP } from '../data/chapter1';
import { terrainAt } from '../data/terrain';
import { rankAtLeast, rankFromWexp, triangle } from '../data/weapons';
import { rng } from '../core/rng';
import type { Pos, Rank, Stats, Unit, Weapon } from '../types';
import { supportBonus, ZERO_BONUS, type SupportBonus } from './support';

const MAX_LEVEL = 20;
const STAT_CAP: Record<keyof Stats, number> = { hp: 60, str: 20, mag: 20, skl: 20, spd: 20, lck: 30, def: 20, res: 20, con: 25, mov: 15 };

/** 特効の倍率（GBA 系 FE は威力 3 倍） */
const EFFECTIVE_MULTIPLIER = 3;

export function weaponRankOf(u: Unit, type: Weapon['type']): Rank {
  return rankFromWexp(u.wexp[type] ?? 0);
}

/** そのユニットがその武器を装備できるか（クラスの武器種 + 武器レベル） */
export function canUse(u: Unit, w: Weapon): boolean {
  const limit = classOf(u.classId).ranks[w.type];
  if (!limit) return false;
  return rankAtLeast(weaponRankOf(u, w.type), w.rank);
}

export function equippedWeapon(u: Unit): Weapon | undefined {
  const w = u.items[u.equipped];
  return w && canUse(u, w) ? w : undefined;
}

/** 攻撃可能な武器（杖以外） */
export function battleWeapon(u: Unit): Weapon | undefined {
  const eq = equippedWeapon(u);
  if (eq && eq.type !== 'staff' && eq.uses > 0) return eq;
  return u.items.find((w) => w.type !== 'staff' && w.uses > 0 && canUse(u, w));
}

/** 攻速: 速さ - max(0, 重さ - 体格) */
function attackSpeed(u: Unit, w?: Weapon): number {
  const weight = w ? w.weight : 0;
  return u.stats.spd - Math.max(0, weight - u.stats.con);
}

export function terrainAtPos(p: Pos) {
  return terrainAt(MAP, p.x, p.y);
}

/** 特効が乗るか。武器の特効タグ + 司祭の「魔物特効」 */
function isEffective(attacker: Unit, w: Weapon | undefined, defender: Unit): boolean {
  if (!w) return false;
  const tags = classOf(defender.classId).tags ?? [];
  if (w.effective?.some((t) => tags.includes(t))) return true;
  if (classOf(attacker.classId).slayer && tags.includes('monster')) return true;
  return false;
}

interface SideView {
  unit: Unit;
  weapon?: Weapon;
  /** 攻撃が届くか（射程・武器の有無） */
  canAttack: boolean;
  atk: number;
  damage: number;
  hitRate: number;
  critRate: number;
  as: number;
  doubles: boolean;
  tri: -1 | 0 | 1;
  avo: number;
  defTerrain: number;
  avoTerrain: number;
  effective: boolean;
  support: SupportBonus;
}

export interface Forecast {
  attacker: SideView;
  defender: SideView;
  distance: number;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

interface RawSide {
  unit: Unit;
  pos: Pos;
  weapon?: Weapon;
  support: SupportBonus;
}

function rawStats(me: RawSide, foe: RawSide, distance: number) {
  const w = me.weapon;
  const foeW = foe.weapon;
  const tri: -1 | 0 | 1 = w && foeW && foeW.type !== 'staff' ? triangle(w.type, foeW.type) : 0;
  const triMt = tri * 1;
  const triHit = tri * 15;

  const canAttack = !!w && w.type !== 'staff' && w.uses > 0 && distance >= w.minRange && distance <= w.maxRange;

  const magical = !!w?.magical;
  const power = magical ? me.unit.stats.mag : me.unit.stats.str;
  const effective = isEffective(me.unit, w, foe.unit);
  const mt = w ? (effective ? w.mt * EFFECTIVE_MULTIPLIER : w.mt) : 0;
  const atk = w ? power + mt + triMt + me.support.atk : 0;

  const hit = w ? w.hit + me.unit.stats.skl * 2 + Math.floor(me.unit.stats.lck / 2) + triHit + me.support.hit : 0;
  const crit = w ? w.crit + Math.floor(me.unit.stats.skl / 2) + (classOf(me.unit.classId).critBonus ?? 0) + me.support.crit : 0;

  const terrain = terrainAtPos(me.pos);
  const as = attackSpeed(me.unit, w);
  const avo = as * 2 + me.unit.stats.lck + terrain.avo + me.support.avo;
  const ddg = me.unit.stats.lck + me.support.ddg;

  return { w, canAttack, atk, hit, crit, avo, ddg, as, tri, magical, terrain, effective };
}

export function forecast(aUnit: Unit, aPos: Pos, dUnit: Unit, dPos: Pos, units: Unit[] = []): Forecast {
  const distance = Math.abs(aPos.x - dPos.x) + Math.abs(aPos.y - dPos.y);
  const a: RawSide = {
    unit: aUnit,
    pos: aPos,
    weapon: battleWeapon(aUnit),
    support: units.length ? supportBonus(aUnit, units, aPos) : ZERO_BONUS,
  };
  const d: RawSide = {
    unit: dUnit,
    pos: dPos,
    weapon: battleWeapon(dUnit),
    support: units.length ? supportBonus(dUnit, units, dPos) : ZERO_BONUS,
  };

  const ra = rawStats(a, d, distance);
  const rd = rawStats(d, a, distance);

  const aDefStat = (rd.magical ? aUnit.stats.res : aUnit.stats.def) + a.support.def;
  const dDefStat = (ra.magical ? dUnit.stats.res : dUnit.stats.def) + d.support.def;

  const aDamage = Math.max(0, ra.atk - (dDefStat + rd.terrain.def));
  const dDamage = Math.max(0, rd.atk - (aDefStat + ra.terrain.def));

  const aDoubles = ra.canAttack && ra.as - rd.as >= 4;
  const dDoubles = rd.canAttack && rd.as - ra.as >= 4;

  const attacker: SideView = {
    unit: aUnit,
    weapon: ra.w,
    canAttack: ra.canAttack,
    atk: ra.atk,
    damage: aDamage,
    hitRate: clamp(ra.hit - rd.avo, 0, 100),
    critRate: clamp(ra.crit - rd.ddg, 0, 100),
    as: ra.as,
    doubles: aDoubles,
    tri: ra.tri,
    avo: ra.avo,
    defTerrain: ra.terrain.def,
    avoTerrain: ra.terrain.avo,
    effective: ra.effective,
    support: a.support,
  };
  const defender: SideView = {
    unit: dUnit,
    weapon: rd.w,
    canAttack: rd.canAttack,
    atk: rd.atk,
    damage: dDamage,
    hitRate: clamp(rd.hit - ra.avo, 0, 100),
    critRate: clamp(rd.crit - ra.ddg, 0, 100),
    as: rd.as,
    doubles: dDoubles,
    tri: rd.tri,
    avo: rd.avo,
    defTerrain: rd.terrain.def,
    avoTerrain: rd.terrain.avo,
    effective: rd.effective,
    support: d.support,
  };

  return { attacker, defender, distance };
}

type Actor = 'attacker' | 'defender';

export interface BattleEvent {
  by: Actor;
  hit: boolean;
  crit: boolean;
  damage: number;
  effective: boolean;
  /** 攻撃を受けた側の残りHP */
  targetHp: number;
  killed: boolean;
}

export interface LevelUpResult {
  before: Stats;
  gains: Partial<Record<keyof Stats, number>>;
  newLevel: number;
}

export interface BattleResult {
  forecast: Forecast;
  events: BattleEvent[];
  aStartHp: number;
  dStartHp: number;
  aEndHp: number;
  dEndHp: number;
  /** 経験値を得るプレイヤー側ユニット（いれば） */
  expUnit?: Unit;
  expGain: number;
  levelUp?: LevelUpResult;
  /** 杖。攻撃ではないので、戦闘画面は殴り合いではなく回復として演じる */
  staffHeal?: { amount: number; staffName: string };
}

/**
 * 杖を戦闘画面に載せるための結果。FE は杖にも専用のアニメーションがあり、
 * 数字だけ動かして終わりにはしない。
 *
 * forecast は画面の骨組み（名前・HP・立ち位置）に要るので実物を作るが、
 * 命中や威力の枠は staffHeal があるときは描かない。
 */
export function healResult(healer: Unit, target: Unit, amount: number, staffName: string, units: Unit[]): BattleResult {
  const f = forecast(healer, { x: healer.x, y: healer.y }, target, { x: target.x, y: target.y }, units);
  const before = target.hp;
  const after = Math.min(maxHp(target), before + amount);
  return {
    forecast: f,
    events: [],
    aStartHp: healer.hp,
    dStartHp: before,
    aEndHp: healer.hp,
    dEndHp: after,
    expGain: 0,
    staffHeal: { amount: after - before, staffName },
  };
}

const GROWTH_KEYS: (keyof Stats)[] = ['hp', 'str', 'mag', 'skl', 'spd', 'lck', 'def', 'res'];

export function gainExp(unit: Unit, amount: number): LevelUpResult | undefined {
  if (unit.team !== 'player' || unit.level >= MAX_LEVEL) return undefined;
  unit.exp += amount;
  if (unit.exp < 100) return undefined;

  unit.exp -= 100;
  const before: Stats = { ...unit.stats };
  const gains: Partial<Record<keyof Stats, number>> = {};
  for (const k of GROWTH_KEYS) {
    const rate = unit.growth[k];
    if (rate <= 0) continue;
    if (unit.stats[k] >= STAT_CAP[k]) continue;
    if (rng.check(rate)) {
      unit.stats[k] += 1;
      gains[k] = 1;
    }
  }
  unit.level += 1;
  if (gains.hp) unit.hp += gains.hp;
  return { before, gains, newLevel: unit.level };
}

function expForCombat(attacker: Unit, defender: Unit, killed: boolean, dealt: boolean): number {
  const diff = defender.level - attacker.level;
  const hitExp = Math.max(1, Math.floor((31 + diff) / 3));
  if (!killed) return dealt ? hitExp : 1;
  let exp = hitExp + 20 + Math.max(0, diff) * 2;
  if (defender.isBoss) exp += 40;
  return Math.min(100, exp);
}

/** 武器を使うと熟練度が上がる */
function gainWexp(u: Unit, w: Weapon | undefined) {
  if (!w || u.team !== 'player') return;
  u.wexp[w.type] = (u.wexp[w.type] ?? 0) + 1;
}

/**
 * 戦闘を最後まで解決する。HP は即座には反映せず、結果として返す
 * （演出側がアニメーションしながら適用するため）。
 */
export function resolveBattle(aUnit: Unit, aPos: Pos, dUnit: Unit, dPos: Pos, units: Unit[] = []): BattleResult {
  const fc = forecast(aUnit, aPos, dUnit, dPos, units);
  const events: BattleEvent[] = [];
  let aHp = aUnit.hp;
  let dHp = dUnit.hp;
  const aStartHp = aHp;
  const dStartHp = dHp;
  let aDealt = false;

  const strike = (by: Actor): boolean => {
    const side = by === 'attacker' ? fc.attacker : fc.defender;
    if (!side.canAttack) return false;
    if (aHp <= 0 || dHp <= 0) return false;

    const hit = rng.hitCheck(side.hitRate);
    const crit = hit && rng.check(side.critRate);
    const dmg = hit ? (crit ? side.damage * 3 : side.damage) : 0;

    if (by === 'attacker') {
      dHp = Math.max(0, dHp - dmg);
      if (dmg > 0) aDealt = true;
    } else {
      aHp = Math.max(0, aHp - dmg);
    }
    const targetHp = by === 'attacker' ? dHp : aHp;
    events.push({ by, hit, crit, damage: dmg, effective: side.effective, targetHp, killed: targetHp <= 0 });

    if (side.weapon) side.weapon.uses = Math.max(0, side.weapon.uses - 1);
    gainWexp(side.unit, side.weapon);
    return true;
  };

  strike('attacker');
  strike('defender');
  if (fc.attacker.doubles) strike('attacker');
  if (fc.defender.doubles) strike('defender');

  const result: BattleResult = {
    forecast: fc,
    events,
    aStartHp,
    dStartHp,
    aEndHp: aHp,
    dEndHp: dHp,
    expGain: 0,
  };

  // 経験値は戦闘に参加したプレイヤー側ユニットへ
  if (aUnit.team === 'player' && aHp > 0) {
    result.expUnit = aUnit;
    result.expGain = expForCombat(aUnit, dUnit, dHp <= 0, aDealt);
  } else if (dUnit.team === 'player' && dHp > 0) {
    const dealt = events.some((e) => e.by === 'defender' && e.damage > 0);
    result.expUnit = dUnit;
    result.expGain = expForCombat(dUnit, aUnit, aHp <= 0, dealt);
  }

  return result;
}

/** 杖による回復量 */
export function healAmount(healer: Unit, staff: Weapon): number {
  const base = staff.id === 'mend' ? 20 : 10;
  return base + healer.stats.mag;
}

export function staffOf(u: Unit): Weapon | undefined {
  return u.items.find((w) => w.type === 'staff' && w.uses > 0 && canUse(u, w));
}

export function maxHp(u: Unit): number {
  return u.stats.hp;
}
