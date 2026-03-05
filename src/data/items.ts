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
};
