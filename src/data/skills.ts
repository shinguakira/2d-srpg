import type { UnitStats } from '../core/types';

// ===== Skill Definitions =====

export type SkillCategory = 'combat' | 'movement' | 'support' | 'meta' | 'passive';

type SkillActivation =
  | { readonly type: 'passive' } // always active
  | { readonly type: 'skl_pct' } // SKL% chance
  | { readonly type: 'spd_pct' } // SPD% chance
  | { readonly type: 'lck_pct' } // LCK% chance
  | { readonly type: 'skl_half_pct' } // SKL/2 % chance
  | { readonly type: 'skl_quarter_pct' } // SKL/4 % chance
  | { readonly type: 'hp_threshold'; readonly threshold: number }; // activates when HP ≤ threshold%

export type Skill = {
  readonly id: string;
  readonly name: string;
  readonly category: SkillCategory;
  readonly description: string;
  readonly activation: SkillActivation;
  readonly isInnate?: boolean; // class-granted, doesn't use a slot
};

// ===== 20 Phase 2 Skills =====

export const SKILLS: Record<string, Skill> = {
  // --- 15 Combat Skills ---
  vantage: {
    id: 'vantage',
    name: 'Vantage',
    category: 'combat',
    description: 'When HP ≤ 50%, strike first when attacked.',
    activation: { type: 'hp_threshold', threshold: 50 },
  },
  wrath: {
    id: 'wrath',
    name: 'Wrath',
    category: 'combat',
    description: 'When HP ≤ 50%, +20 Crit.',
    activation: { type: 'hp_threshold', threshold: 50 },
  },
  pursuit: {
    id: 'pursuit',
    name: 'Pursuit',
    category: 'combat',
    description: 'Reduces doubling threshold from 5 to 3 SPD.',
    activation: { type: 'passive' },
  },
  sol: {
    id: 'sol',
    name: 'Sol',
    category: 'combat',
    description: 'SKL% chance to heal HP equal to damage dealt.',
    activation: { type: 'skl_pct' },
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    category: 'combat',
    description: 'SKL% chance to halve enemy DEF/RES for this hit.',
    activation: { type: 'skl_pct' },
  },
  astra: {
    id: 'astra',
    name: 'Astra',
    category: 'combat',
    description: 'SKL/2% chance to strike 5 times at 50% damage.',
    activation: { type: 'skl_half_pct' },
  },
  counter: {
    id: 'counter',
    name: 'Counter',
    category: 'combat',
    description: 'When attacked at range >1, reflect 50% damage back.',
    activation: { type: 'passive' },
  },
  aegis: {
    id: 'aegis',
    name: 'Aegis',
    category: 'combat',
    description: 'SKL% chance to halve incoming magic damage.',
    activation: { type: 'skl_pct' },
  },
  pavise: {
    id: 'pavise',
    name: 'Pavise',
    category: 'combat',
    description: 'SKL% chance to halve incoming physical damage.',
    activation: { type: 'skl_pct' },
  },
  lethality: {
    id: 'lethality',
    name: 'Lethality',
    category: 'combat',
    description: 'SKL/4% chance to instantly defeat the target (fails vs bosses).',
    activation: { type: 'skl_quarter_pct' },
  },
  adept: {
    id: 'adept',
    name: 'Adept',
    category: 'combat',
    description: 'SPD% chance to strike an additional time.',
    activation: { type: 'spd_pct' },
  },
  miracle: {
    id: 'miracle',
    name: 'Miracle',
    category: 'combat',
    description: 'LCK% chance to survive a lethal hit with 1 HP.',
    activation: { type: 'lck_pct' },
  },
  renewal: {
    id: 'renewal',
    name: 'Renewal',
    category: 'combat',
    description: 'Recover 10% max HP at the start of each turn.',
    activation: { type: 'passive' },
  },
  quick_riposte: {
    id: 'quick_riposte',
    name: 'Quick Riposte',
    category: 'combat',
    description: 'When HP ≥ 70%, guaranteed double on counterattack.',
    activation: { type: 'hp_threshold', threshold: 70 },
  },
  nihil: {
    id: 'nihil',
    name: 'Nihil',
    category: 'combat',
    description: 'Disables all opponent skill activations during combat.',
    activation: { type: 'passive' },
  },

  // --- 5 Movement Skills ---
  canto: {
    id: 'canto',
    name: 'Canto',
    category: 'movement',
    description: 'After attacking, move remaining MOV.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  pass: {
    id: 'pass',
    name: 'Pass',
    category: 'movement',
    description: 'Move through enemy-occupied tiles.',
    activation: { type: 'passive' },
  },
  shove: {
    id: 'shove',
    name: 'Shove',
    category: 'movement',
    description: 'Push an adjacent ally 1 tile away.',
    activation: { type: 'passive' },
  },
  swap: {
    id: 'swap',
    name: 'Swap',
    category: 'movement',
    description: 'Swap positions with an adjacent ally.',
    activation: { type: 'passive' },
  },
  reposition: {
    id: 'reposition',
    name: 'Reposition',
    category: 'movement',
    description: 'Move an adjacent ally to the opposite side of this unit.',
    activation: { type: 'passive' },
  },

  // --- Support Skills ---
  dance: {
    id: 'dance',
    name: 'Dance',
    category: 'support',
    description: 'Refresh an adjacent ally so they can act again.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  steal: {
    id: 'steal',
    name: 'Steal',
    category: 'support',
    description: 'Take a non-equipped item from adjacent enemy.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  lockpick_skill: {
    id: 'lockpick_skill',
    name: 'Lockpick',
    category: 'support',
    description: 'Open chests and doors without a key.',
    activation: { type: 'passive' },
    isInnate: true,
  },

  // --- Master Class Innate Skills (8) ---

  cycle_authority: {
    id: 'cycle_authority',
    name: 'Cycle Authority',
    category: 'combat',
    description: 'Negate one lethal hit per chapter.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  tri_magic: {
    id: 'tri_magic',
    name: 'Tri-Magic',
    category: 'combat',
    description: 'All tomes deal ×1.5 damage.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  bloodlust: {
    id: 'bloodlust',
    name: 'Bloodlust',
    category: 'combat',
    description: 'SKL% chance: heal damage dealt + halve enemy DEF/RES (Sol+Luna).',
    activation: { type: 'skl_pct' },
    isInnate: true,
  },
  divine_wings: {
    id: 'divine_wings',
    name: 'Divine Wings',
    category: 'combat',
    description: 'After killing an enemy, gain an extra turn.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  ironwall: {
    id: 'ironwall',
    name: 'Ironwall',
    category: 'combat',
    description: 'Adjacent allies take -50% damage.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  vanish: {
    id: 'vanish',
    name: 'Vanish',
    category: 'combat',
    description: 'Once per chapter: guaranteed hit, 3× damage.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  balance: {
    id: 'balance',
    name: 'Balance',
    category: 'support',
    description: 'Heal all allies within 5 tiles for MAG amount.',
    activation: { type: 'passive' },
    isInnate: true,
  },
  terror_aura: {
    id: 'terror_aura',
    name: 'Terror Aura',
    category: 'combat',
    description: 'SKL/2% chance to instantly defeat the target.',
    activation: { type: 'skl_half_pct' },
    isInnate: true,
  },

  // --- Trauma Skills (5) ---

  survivors_guilt: {
    id: 'survivors_guilt',
    name: "Survivor's Guilt",
    category: 'passive',
    description: '-2 STR, +2 DEF.',
    activation: { type: 'passive' },
  },
  vengeance_trauma: {
    id: 'vengeance_trauma',
    name: 'Vengeance',
    category: 'combat',
    description: 'When HP ≤ 25%, +30% damage dealt.',
    activation: { type: 'hp_threshold', threshold: 25 },
  },
  numb: {
    id: 'numb',
    name: 'Numb',
    category: 'passive',
    description: 'Immune to stat debuffs, -10 avoid.',
    activation: { type: 'passive' },
  },
  last_stand: {
    id: 'last_stand',
    name: 'Last Stand',
    category: 'passive',
    description: '+5 all stats when only unit remaining.',
    activation: { type: 'passive' },
  },
  grief: {
    id: 'grief',
    name: 'Grief',
    category: 'passive',
    description: '-3 all stats for 2 chapters.',
    activation: { type: 'passive' },
  },
};

/** Get human-readable activation text for a skill given unit stats */
export function getSkillActivationText(skill: Skill, stats: UnitStats): string {
  switch (skill.activation.type) {
    case 'passive':
      return 'Passive';
    case 'skl_pct':
      return `SKL ${stats.skl}%`;
    case 'spd_pct':
      return `SPD ${stats.spd}%`;
    case 'lck_pct':
      return `LCK ${stats.lck}%`;
    case 'skl_half_pct':
      return `SKL/2 ${Math.floor(stats.skl / 2)}%`;
    case 'skl_quarter_pct':
      return `SKL/4 ${Math.floor(stats.skl / 4)}%`;
    case 'hp_threshold':
      return `Active below ${skill.activation.threshold}% HP`;
    default:
      return '';
  }
}
