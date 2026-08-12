import type { Unit } from './types';
import { SKILLS } from '../data/skills';
import { ALL_CLASSES } from '../data/promotedClasses';

/**
 * Emberlight + Corruption cost of teaching a skill.
 */
export function getTeachingCost(skillId: string): { loop: number; crp: number } {
  const skill = SKILLS[skillId];
  if (!skill) return { loop: 0, crp: 0 };

  let loop: number;
  switch (skill.category) {
    case 'movement':
      loop = 5;
      break;
    case 'meta':
      loop = 15;
      break;
    default:
      loop = 10;
      break; // combat, support, passive
  }
  return { loop, crp: 2 };
}

/**
 * Check if Shigeru can teach a specific skill to a student.
 * Emberlight is a Phase 4 resource — if the unit lacks it, teaching stays gated.
 */
export function canTeach(
  lord: Unit,
  student: Unit,
  skillId: string,
): { eligible: boolean; reason?: string } {
  const skill = SKILLS[skillId];
  if (!skill) return { eligible: false, reason: 'Unknown skill' };

  // Shigeru must know the skill (either equipped or learned)
  const lordKnows = lord.skills.includes(skillId) || lord.learnedSkills.includes(skillId);
  if (!lordKnows) return { eligible: false, reason: 'Shigeru does not know this skill' };

  // Student must not already know it
  if (student.skills.includes(skillId) || student.learnedSkills.includes(skillId)) {
    return { eligible: false, reason: 'Already known' };
  }

  // Class innate skills cannot be taught
  const cls = ALL_CLASSES[student.classId];
  if (cls?.innateSkills?.includes(skillId)) {
    return { eligible: false, reason: 'Class innate skill' };
  }

  // Emberlight gate: spending an ember to pass on a technique costs Shigeru
  // something permanent. Gated until the resource exists on the unit.
  const hasLoop = 'loop' in lord && typeof (lord as Record<string, unknown>).loop === 'number';
  if (!hasLoop) {
    return {
      eligible: false,
      reason: 'Teaching requires Emberlight (available in later chapters)',
    };
  }

  return { eligible: true };
}

/**
 * Apply teaching: the student learns the skill, Shigeru spends Emberlight and takes Corruption.
 * Returns updated copies of both units.
 */
export function applyTeaching(
  lord: Unit,
  student: Unit,
  skillId: string,
  cost: { loop: number; crp: number },
): { lord: Unit; student: Unit } {
  const newStudent = {
    ...student,
    learnedSkills: [...student.learnedSkills, skillId],
  };

  // Spend Emberlight if the resource exists (Phase 4)
  let newLord = { ...lord };
  if ('loop' in newLord && typeof (newLord as Record<string, unknown>).loop === 'number') {
    (newLord as Record<string, unknown>).loop =
      ((newLord as Record<string, unknown>).loop as number) - cost.loop;
  }

  return { lord: newLord, student: newStudent };
}
