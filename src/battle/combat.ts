import { classOf, isMagicClass } from '../data/classes';
import { MAP } from '../data/chapters';
import { terrainAt } from '../data/terrain';
import { rankAtLeast, rankFromWexp, triangle } from '../data/weapons';
import { rng } from '../core/rng';
import type { Pos, Rank, Stats, StatusKind, Unit, Weapon } from '../types';
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

/** サイレス中は魔法書も封じられる。剣や槍は振れる */
function usableInBattle(u: Unit, w: Weapon): boolean {
  if (w.type === 'staff' || w.uses <= 0 || !canUse(u, w)) return false;
  return !(silenced(u) && w.magical);
}

/** 攻撃可能な武器（杖以外） */
export function battleWeapon(u: Unit): Weapon | undefined {
  const eq = equippedWeapon(u);
  if (eq && usableInBattle(u, eq)) return eq;
  return u.items.find((w) => usableInBattle(u, w));
}

/** 攻撃に使える武器を全部。FE は「攻撃」のあとに武器を選ばせる */
export function battleWeapons(u: Unit): Weapon[] {
  return u.items.filter((w) => usableInBattle(u, w));
}

/**
 * 担いでいるあいだの能力。GBA FE は救出中に技と速さが半分になる。
 * 戦闘の計算は全部ここを通す。u.stats を直に読むと担ぎが効かない。
 */
function effStats(u: Unit): Stats {
  if (!u.rescuing) return u.stats;
  return { ...u.stats, skl: Math.floor(u.stats.skl / 2), spd: Math.floor(u.stats.spd / 2) };
}

/** 攻速: 速さ - max(0, 重さ - 体格) */
function attackSpeed(u: Unit, w?: Weapon): number {
  const weight = w ? w.weight : 0;
  const s = effStats(u);
  return s.spd - Math.max(0, weight - s.con);
}

/** サイレスは杖と魔法を封じる */
function silenced(u: Unit): boolean {
  return u.status?.kind === 'silence';
}

/** 眠っているあいだは反撃もできない */
function asleep(u: Unit): boolean {
  return u.status?.kind === 'sleep';
}

/** 毒で毎ターン減る HP。GBA の正確な値は資料が無いので固定の 3 にしてある */
const POISON_DAMAGE = 3;

/**
 * 杖の射程。リブローと状態異常の杖は魔力の半分まで届く。
 * 武器表の maxRange はその上限を切る役目しか持たない。
 */
export function staffRange(u: Unit, w: Weapon): number {
  if (!w.staffKind || w.staffKind === 'heal' || w.staffKind === 'restore') return w.maxRange;
  return Math.max(1, Math.min(w.maxRange, Math.floor(u.stats.mag / 2)));
}

/**
 * 状態異常の杖の命中。FE8 は命中と回避を別に出して引く。
 * 命中 = 30 + 魔力x5 + 技 / 回避 = 魔防x5 + 距離x2
 */
export function staffHitRate(caster: Unit, target: Unit, distance: number): number {
  const hit = 30 + caster.stats.mag * 5 + effStats(caster).skl;
  const avo = target.stats.res * 5 + distance * 2;
  return clamp(hit - avo, 0, 100);
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

  // 眠っているあいだは反撃もできない
  const canAttack = !!w && w.type !== 'staff' && w.uses > 0 && distance >= w.minRange && distance <= w.maxRange && !asleep(me.unit);

  const magical = !!w?.magical;
  const s = effStats(me.unit);
  const power = magical ? s.mag : s.str;
  const effective = isEffective(me.unit, w, foe.unit);
  const mt = w ? (effective ? w.mt * EFFECTIVE_MULTIPLIER : w.mt) : 0;
  const atk = w ? power + mt + triMt + me.support.atk : 0;

  // S ランクの武器を振ると命中と必殺に +5。FE8 の「S ランクボーナス」
  const sRank = w && weaponRankOf(me.unit, w.type) === 'S' ? 5 : 0;
  const hit = w ? w.hit + s.skl * 2 + Math.floor(s.lck / 2) + triHit + sRank + me.support.hit : 0;
  const crit = w ? w.crit + Math.floor(s.skl / 2) + (classOf(me.unit.classId).critBonus ?? 0) + sRank + me.support.crit : 0;

  // 飛行は砦・門・玉座しか受けない。林や山の上でも回避と守備は乗らない。
  const raw = terrainAtPos(me.pos);
  const flier = classOf(me.unit.classId).moveType === 'flier';
  const keeps = raw.id === 'fort' || raw.id === 'gate' || raw.id === 'throne';
  const terrain = flier && !keeps ? { ...raw, avo: 0, def: 0, res: 0 } : raw;
  const as = attackSpeed(me.unit, w);
  const avo = as * 2 + s.lck + terrain.avo + me.support.avo;
  const ddg = s.lck + me.support.ddg;

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

  // 玉座は魔防を上げる。守備と違って地形の def ではなく能力側に乗る。
  const aRes = ra.terrain.res ?? 0;
  const dRes = rd.terrain.res ?? 0;
  const aDefStat = (rd.magical ? aUnit.stats.res + aRes : aUnit.stats.def) + a.support.def;
  const dDefStat = (ra.magical ? dUnit.stats.res + dRes : dUnit.stats.def) + d.support.def;

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
  /** 当たって付いた状態異常。演出が終わってから game が貼る */
  inflicted?: { on: Actor; kind: StatusKind; turns: number };
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
  // 使わないほうの力は伸びない。物理職の魔力と魔法職の腕力は据え置きで、
  // GBA FE の「力」が一枠しかないのと同じ扱いになる
  const dead: keyof Stats = isMagicClass(unit.classId) ? 'str' : 'mag';
  for (const k of GROWTH_KEYS) {
    if (k === dead) continue;
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

/**
 * 経験値。FE8 の式をそのまま使う。
 *
 * ダメージを与えた  [31 + (敵Lv + 敵クラス補正A) − (自Lv + 自クラス補正A)] / クラス係数
 * 倒した            上の値 + (敵Lv×敵係数 + 敵クラス補正B) − (自Lv×自係数 + 自クラス補正B) + 20 + ボス補正
 *
 * 上級職はクラス補正A が 20、係数が 3、クラス補正B が 60。上級職を倒すと旨く、
 * 上級職で下級職を倒しても伸びない、という GBA FE の手触りがここから出る。
 */
function classPower(u: Unit) {
  return classOf(u.classId).promoted ? 3 : 1;
}
function classBonusA(u: Unit) {
  return classOf(u.classId).promoted ? 20 : 0;
}
function classBonusB(u: Unit) {
  return classOf(u.classId).promoted ? 60 : 0;
}

function expForCombat(attacker: Unit, defender: Unit, killed: boolean, dealt: boolean): number {
  const hitExp = Math.max(
    1,
    Math.floor((31 + (defender.level + classBonusA(defender)) - (attacker.level + classBonusA(attacker))) / classPower(attacker)),
  );
  if (!killed) return dealt ? hitExp : 1;
  const defeat =
    defender.level * classPower(defender) + classBonusB(defender) - (attacker.level * classPower(attacker) + classBonusB(attacker));
  let exp = hitExp + Math.max(0, defeat) + 20;
  if (defender.isBoss) exp += 40;
  return Math.min(100, Math.max(1, exp));
}

/** 状態異常をかける。すでに何かかかっていれば上書きする（FE も重ならない） */
export function applyStatus(u: Unit, kind: StatusKind, turns: number) {
  u.status = { kind, turns };
}

/** 自軍・敵軍フェイズの頭で呼ぶ。毒が削り、残りターンが減る */
export function tickStatus(u: Unit): number {
  const st = u.status;
  if (!st) return 0;
  let damage = 0;
  if (st.kind === 'poison') {
    damage = Math.min(u.hp - 1, POISON_DAMAGE);
    if (damage > 0) u.hp -= damage;
  }
  st.turns -= 1;
  if (st.turns <= 0) u.status = undefined;
  return damage;
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
  let inflicted: BattleResult['inflicted'];

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

    // 毒の牙のように当たると状態異常になる武器。倒してしまったなら意味がない
    if (hit && targetHp > 0 && side.weapon?.inflicts) {
      inflicted = { on: by === 'attacker' ? 'defender' : 'attacker', kind: side.weapon.inflicts, turns: side.weapon.statusTurns ?? 5 };
    }

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
    inflicted,
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
  return staves(u)[0];
}

/** 持っている杖を全部。サイレス中は一本も振れない */
export function staves(u: Unit): Weapon[] {
  if (silenced(u)) return [];
  return u.items.filter((w) => w.type === 'staff' && w.uses > 0 && canUse(u, w));
}

export function maxHp(u: Unit): number {
  return u.stats.hp;
}
