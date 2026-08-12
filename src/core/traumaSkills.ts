import type { Unit, Position, UnitStats } from './types';
import { getManhattanDistance } from './pathfinding';

// Trauma skills assigned by cumulative ally death count
const TRAUMA_SKILL_BY_DEATH: Record<number, string> = {
  1: 'survivors_guilt',
  2: 'vengeance_trauma',
  3: 'numb',
  4: 'last_stand',
};

/**
 * Determine which trauma skill to assign and to whom when an ally dies.
 * Returns null if deathCount > 4 (no more trauma skills to assign).
 */
export function assignTraumaSkill(
  deathCount: number,
  _deadUnitId: string,
  allUnits: ReadonlyMap<string, Unit>,
  deadUnitPosition: Position,
): { targetUnitId: string; skillId: string } | null {
  const skillId = TRAUMA_SKILL_BY_DEATH[deathCount];
  if (!skillId) return null;

  // Get living player units
  const candidates: Unit[] = [];
  for (const u of allUnits.values()) {
    if (u.faction === 'player' && u.currentHp > 0 && !u.retreated && !u.isCarried) {
      candidates.push(u);
    }
  }
  if (candidates.length === 0) return null;

  if (deathCount === 1) {
    // Survivor's Guilt → closest living ally to the dead unit
    let closest: Unit | null = null;
    let minDist = Infinity;
    for (const u of candidates) {
      const dist = getManhattanDistance(u.position, deadUnitPosition);
      if (dist < minDist) {
        minDist = dist;
        closest = u;
      }
    }
    if (!closest) return null;
    return { targetUnitId: closest.id, skillId };
  }

  // Deaths 2-4: assign to first candidate without this skill
  for (const u of candidates) {
    if (!u.traumaSkills?.includes(skillId)) {
      return { targetUnitId: u.id, skillId };
    }
  }
  return { targetUnitId: candidates[0].id, skillId };
}

/**
 * Get stat modifications from a unit's active trauma skills.
 */
export function getTraumaStatMods(unit: Unit, livingPlayerCount?: number): Partial<UnitStats> {
  const mods: Partial<UnitStats> = {};
  const trauma = unit.traumaSkills ?? [];

  if (trauma.includes('survivors_guilt')) {
    mods.str = (mods.str ?? 0) - 2;
    mods.def = (mods.def ?? 0) + 2;
  }

  if (trauma.includes('numb')) {
    // -10 avoid is applied via combat hit calc, not stats directly
    // But we track it here for reference
  }

  if (trauma.includes('last_stand') && livingPlayerCount !== undefined && livingPlayerCount <= 1) {
    mods.hp = (mods.hp ?? 0) + 5;
    mods.str = (mods.str ?? 0) + 5;
    mods.mag = (mods.mag ?? 0) + 5;
    mods.def = (mods.def ?? 0) + 5;
    mods.res = (mods.res ?? 0) + 5;
    mods.spd = (mods.spd ?? 0) + 5;
    mods.skl = (mods.skl ?? 0) + 5;
    mods.lck = (mods.lck ?? 0) + 5;
  }

  if (trauma.includes('grief')) {
    mods.str = (mods.str ?? 0) - 3;
    mods.mag = (mods.mag ?? 0) - 3;
    mods.def = (mods.def ?? 0) - 3;
    mods.res = (mods.res ?? 0) - 3;
    mods.spd = (mods.spd ?? 0) - 3;
    mods.skl = (mods.skl ?? 0) - 3;
    mods.lck = (mods.lck ?? 0) - 3;
  }

  return mods;
}

/**
 * Apply grief to all units (Akira's death triggers -3 all stats).
 */
export function applyGrief(units: Map<string, Unit>): Map<string, Unit> {
  const updated = new Map(units);
  for (const [id, unit] of updated) {
    if (unit.faction === 'player' && unit.currentHp > 0) {
      const trauma = [...(unit.traumaSkills ?? [])];
      if (!trauma.includes('grief')) {
        trauma.push('grief');
      }
      updated.set(id, { ...unit, traumaSkills: trauma });
    }
  }
  return updated;
}
