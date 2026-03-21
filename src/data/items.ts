import type { ConsumableItem } from '../core/types';

export const ITEMS: Record<string, ConsumableItem> = {
  vulnerary: {
    id: 'vulnerary',
    name: 'Vulnerary',
    type: 'consumable',
    uses: 3,
    maxUses: 3,
    effect: { kind: 'heal', amount: 10 },
  },

  // ===== Promotion Items =====

  hero_crest: {
    id: 'hero_crest',
    name: 'Hero Crest',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: ['lord', 'mercenary', 'fighter'] },
  },
  knight_crest: {
    id: 'knight_crest',
    name: 'Knight Crest',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: ['cavalier', 'soldier', 'knight'] },
  },
  guiding_ring: {
    id: 'guiding_ring',
    name: 'Guiding Ring',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: ['mage', 'cleric', 'shaman', 'monk', 'troubadour'] },
  },
  elysian_whip: {
    id: 'elysian_whip',
    name: 'Elysian Whip',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: ['pegasus_knight', 'wyvern_rider'] },
  },
  lockpick_plus: {
    id: 'lockpick_plus',
    name: 'Lockpick+',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: ['thief'] },
  },
  master_seal: {
    id: 'master_seal',
    name: 'Master Seal',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: [] }, // universal base → promoted
  },
  master_crown: {
    id: 'master_crown',
    name: 'Master Crown',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'promote', eligibleClasses: [] }, // universal promoted → master
  },

  // ===== Keys =====

  door_key: {
    id: 'door_key',
    name: 'Door Key',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'unlock', targetTerrain: 'door' },
  },
  chest_key: {
    id: 'chest_key',
    name: 'Chest Key',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'unlock', targetTerrain: 'chest' },
  },

  // ===== Fog of War =====

  torch: {
    id: 'torch',
    name: 'Torch',
    type: 'consumable',
    uses: 1,
    maxUses: 1,
    effect: { kind: 'torch' },
  },
};
