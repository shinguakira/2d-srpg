import { battleWeapon, forecast } from '../battle/combat';
import { computeMoveRange, key, manhattan, unkeyX, unkeyY } from '../core/grid';
import { MAP } from '../data/chapters';
import { terrainAt } from '../data/terrain';
import type { Pos, Unit } from '../types';

export type EnemyAction = { kind: 'attack'; dest: Pos; target: Unit } | { kind: 'move'; dest: Pos } | { kind: 'wait' };

interface Candidate {
  dest: Pos;
  target: Unit;
  score: number;
}

function evaluate(unit: Unit, dest: Pos, target: Unit, units: Unit[]): Candidate | undefined {
  const fc = forecast(unit, dest, target, { x: target.x, y: target.y }, units);
  if (!fc.attacker.canAttack) return undefined;

  const a = fc.attacker;
  const d = fc.defender;
  const hits = a.doubles ? 2 : 1;
  const expected = a.damage * hits * (a.hitRate / 100);

  let score = expected * 4;
  if (a.damage * hits >= target.hp && a.hitRate >= 50) score += 220; // 撃破圏
  if (target.isLord) score += 40;

  const counterHits = d.doubles ? 2 : 1;
  const counter = d.canAttack ? d.damage * counterHits * (d.hitRate / 100) : 0;
  score -= counter * 1.6;
  if (counter >= unit.hp) score -= 120;

  const t = terrainAt(MAP, dest.x, dest.y);
  score += t.def * 3 + t.avo * 0.15;
  score -= target.hp * 0.08;

  return { dest, target, score };
}

export function decideAction(unit: Unit, units: Unit[]): EnemyAction {
  const foes = units.filter((u) => !u.dead && u.team !== unit.team);
  if (!foes.length) return { kind: 'wait' };

  const w = battleWeapon(unit);
  const cands: Candidate[] = [];

  if (unit.ai === 'boss') {
    // 玉座から動かない
    if (w) {
      for (const f of foes) {
        const c = evaluate(unit, { x: unit.x, y: unit.y }, f, units);
        if (c) cands.push(c);
      }
    }
    cands.sort((a, b) => b.score - a.score);
    return cands.length ? { kind: 'attack', dest: { x: unit.x, y: unit.y }, target: cands[0].target } : { kind: 'wait' };
  }

  const range = computeMoveRange(unit, units);

  if (w) {
    for (const k of range.stand) {
      const dest = { x: unkeyX(k), y: unkeyY(k) };
      for (const f of foes) {
        const dist = manhattan(dest, f);
        if (dist < w.minRange || dist > w.maxRange) continue;
        const c = evaluate(unit, dest, f, units);
        if (c) cands.push(c);
      }
    }
  }

  if (cands.length) {
    cands.sort((a, b) => b.score - a.score);
    const best = cands[0];
    return { kind: 'attack', dest: best.dest, target: best.target };
  }

  // 攻撃できない場合
  if (unit.ai === 'guard') return { kind: 'wait' };

  // 一番近い敵へ寄る
  let nearest = foes[0];
  let bestD = Infinity;
  for (const f of foes) {
    const d = manhattan(unit, f);
    if (d < bestD) {
      bestD = d;
      nearest = f;
    }
  }

  let bestTile = { x: unit.x, y: unit.y };
  let bestScore = Infinity;
  for (const k of range.stand) {
    const p = { x: unkeyX(k), y: unkeyY(k) };
    const d = manhattan(p, nearest);
    const cost = range.cost.get(k) ?? 0;
    const t = terrainAt(MAP, p.x, p.y);
    const score = d * 10 + cost * 0.5 - t.avo * 0.05;
    if (score < bestScore) {
      bestScore = score;
      bestTile = p;
    }
  }
  if (bestTile.x === unit.x && bestTile.y === unit.y) return { kind: 'wait' };
  return { kind: 'move', dest: bestTile };
}

export function threatTiles(units: Unit[]): Set<number> {
  const out = new Set<number>();
  for (const u of units) {
    if (u.dead || u.team !== 'enemy') continue;
    const w = battleWeapon(u);
    if (!w) continue;
    const stand = u.ai === 'boss' ? [key(u.x, u.y)] : [...computeMoveRange(u, units).stand];
    for (const k of stand) {
      const bx = unkeyX(k);
      const by = unkeyY(k);
      for (let dy = -w.maxRange; dy <= w.maxRange; dy++) {
        for (let dx = -w.maxRange; dx <= w.maxRange; dx++) {
          const d = Math.abs(dx) + Math.abs(dy);
          if (d < w.minRange || d > w.maxRange) continue;
          const nx = bx + dx;
          const ny = by + dy;
          if (terrainAt(MAP, nx, ny).id === 'wall') continue;
          out.add(key(nx, ny));
        }
      }
      out.add(k);
    }
  }
  return out;
}
