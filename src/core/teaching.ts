import type { Unit } from './types';
import { SKILLS } from '../data/skills';
import { ALL_CLASSES } from '../data/promotedClasses';

/**
 * Get the LOOP + CRP cost for teaching a skill.
 */
export function getTeachingCost(skillId: string): { loop: number; crp: number } {
  const skill = SKILLS[skillId];
  if (!skill) return { loop: 0, crp: 0 };

  let loop: number;
  switch (skill.category) {
    case 'movement': loop = 5; break;
    case 'meta': loop = 15; break;
    default: loop = 10; break; // combat, support, passive
  }
  return { loop, crp: 2 };
}

/**
 * Check if Ren can teach a specific skill to a student.
 * LOOP is a Phase 4 resource — if the unit doesn't have it, teaching is gated.
 */
export function canTeach(
  ren: Unit,
  student: Unit,
  skillId: string,
): { eligible: boolean; reason?: string } {
  const skill = SKILLS[skillId];
  if (!skill) return { eligible: false, reason: 'Unknown skill' };

  // Ren must know the skill (either equipped or learned)
  const renKnows = ren.skills.includes(skillId) || ren.learnedSkills.includes(skillId);
  if (!renKnows) return { eligible: false, reason: 'Ren does not know this skill' };

  // Student must not already know it
  if (student.skills.includes(skillId) || student.learnedSkills.includes(skillId)) {
    return { eligible: false, reason: 'Already known' };
  }

  // Class innate skills cannot be taught
  const cls = ALL_CLASSES[student.classId];
  if (cls?.innateSkills?.includes(skillId)) {
    return { eligible: false, reason: 'Class innate skill' };
  }

  // LOOP gate: in Phase 4 this will check a LOOP resource on Ren.
  // For now, teaching is gated — always returns ineligible until LOOP is available.
  const hasLoop = 'loop' in ren && typeof (ren as Record<string, unknown>).loop === 'number';
  if (!hasLoop) {
    return { eligible: false, reason: 'Teaching requires LOOP (available in later chapters)' };
  }

  return { eligible: true };
}

/**
 * Apply teaching: student learns the skill, deduct LOOP from Ren, add CRP.
 * Returns updated copies of both units.
 */
export function applyTeaching(
  ren: Unit,
  student: Unit,
  skillId: string,
  cost: { loop: number; crp: number },
): { ren: Unit; student: Unit } {
  const newStudent = {
    ...student,
    learnedSkills: [...student.learnedSkills, skillId],
  };

  // Deduct LOOP if available (Phase 4)
  let newRen = { ...ren };
  if ('loop' in newRen && typeof (newRen as Record<string, unknown>).loop === 'number') {
    (newRen as Record<string, unknown>).loop = ((newRen as Record<string, unknown>).loop as number) - cost.loop;
  }

  return { ren: newRen, student: newStudent };
}
