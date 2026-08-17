import { MAP, MAP_H, MAP_W } from '../data/chapter1';
import { classOf, MOVE_INDEX } from '../data/classes';
import { terrainAt } from '../data/terrain';
import type { Pos, Unit } from '../types';

export const key = (x: number, y: number) => y * 256 + x;
export const unkeyX = (k: number) => k % 256;
export const unkeyY = (k: number) => Math.floor(k / 256);

export const manhattan = (a: Pos, b: Pos) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function inBounds(x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < MAP_W && y < MAP_H;
}

function moveCost(unit: Unit, x: number, y: number): number {
  const t = terrainAt(MAP, x, y);
  return t.cost[MOVE_INDEX[classOf(unit.classId).moveType]];
}

const DIRS: Pos[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export interface MoveRange {
  /** tileKey -> 残り移動力を消費したコスト */
  cost: Map<number, number>;
  /** tileKey -> 一つ前のタイル（経路復元用） */
  prev: Map<number, number>;
  /** 実際に停止できるタイル */
  stand: Set<number>;
}

/**
 * ダイクストラで移動範囲を求める。
 * ・敵ユニットのいるマスは通過不可
 * ・味方のいるマスは通過できるが停止できない
 */
export function computeMoveRange(unit: Unit, units: Unit[]): MoveRange {
  const occupied = new Map<number, Unit>();
  for (const u of units) {
    if (!u.dead) occupied.set(key(u.x, u.y), u);
  }

  const cost = new Map<number, number>();
  const prev = new Map<number, number>();
  const start = key(unit.x, unit.y);
  cost.set(start, 0);

  // 移動力が小さいので単純な優先度付き探索で十分
  const queue: number[] = [start];
  while (queue.length) {
    queue.sort((a, b) => (cost.get(a) ?? 0) - (cost.get(b) ?? 0));
    const cur = queue.shift()!;
    const cx = unkeyX(cur);
    const cy = unkeyY(cur);
    const cc = cost.get(cur)!;

    for (const d of DIRS) {
      const nx = cx + d.x;
      const ny = cy + d.y;
      if (!inBounds(nx, ny)) continue;
      const other = occupied.get(key(nx, ny));
      if (other && other.team !== unit.team) continue;
      const step = moveCost(unit, nx, ny);
      if (step >= 99) continue;
      const nc = cc + step;
      if (nc > unit.stats.mov) continue;
      const nk = key(nx, ny);
      if (cost.has(nk) && cost.get(nk)! <= nc) continue;
      cost.set(nk, nc);
      prev.set(nk, cur);
      queue.push(nk);
    }
  }

  const stand = new Set<number>();
  for (const k of cost.keys()) {
    const occ = occupied.get(k);
    if (occ && occ !== unit) continue;
    stand.add(k);
  }
  return { cost, prev, stand };
}

export function pathTo(range: MoveRange, x: number, y: number): Pos[] {
  const path: Pos[] = [];
  let cur: number | undefined = key(x, y);
  if (!range.cost.has(cur)) return path;
  while (cur !== undefined) {
    path.push({ x: unkeyX(cur), y: unkeyY(cur) });
    cur = range.prev.get(cur);
  }
  return path.reverse();
}

export function unitAt(units: Unit[], x: number, y: number): Unit | undefined {
  return units.find((u) => !u.dead && u.x === x && u.y === y);
}
