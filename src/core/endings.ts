import type { EndingType } from './types';

export type EndingFlags = {
  totalDeaths: number;
  zaelRecruited: boolean;
  ghaelRecruited: boolean;
  echoSaved: boolean;
  systemNegotiated: boolean;
  finalSaveCrystalUsed: boolean;
  systemDefeated: boolean;
};

/**
 * Evaluate which ending the player earns based on campaign flags.
 */
export function evaluateEnding(flags: EndingFlags): EndingType {
  // Tragic: 5+ deaths
  if (flags.totalDeaths >= 5) return 'tragic';

  // Perfect: crystal used + system defeated + 0 deaths + all recruited + echo saved
  if (
    flags.finalSaveCrystalUsed &&
    flags.systemDefeated &&
    flags.totalDeaths === 0 &&
    flags.zaelRecruited &&
    flags.ghaelRecruited &&
    flags.echoSaved
  ) {
    return 'perfect';
  }

  // True: crystal used + system defeated
  if (flags.finalSaveCrystalUsed && flags.systemDefeated) {
    return 'true';
  }

  // Bittersweet: system defeated without crystal
  if (flags.systemDefeated) {
    return 'bittersweet';
  }

  // Default to bittersweet if somehow none match
  return 'bittersweet';
}

export function getEndingText(ending: EndingType): { title: string; description: string } {
  switch (ending) {
    case 'perfect':
      return {
        title: 'The Perfect World',
        description:
          'Through unwavering compassion and sacrifice, the cycle was finally broken. Every soul was saved. The system yielded not to force, but to understanding. A new dawn rises — one without loops, without loss.',
      };
    case 'true':
      return {
        title: 'Breaking the Cycle',
        description:
          "The Final Save Crystal shattered the system's hold, and the loops came to an end. Though the road was long and the cost was real, hope endures. The world is free to write its own story.",
      };
    case 'bittersweet':
      return {
        title: 'A Pyrrhic Victory',
        description:
          'The system was defeated, but without the crystal, the loops may yet return. The scars of battle run deep, and not all who began this journey saw its end. Still, for now, there is peace.',
      };
    case 'tragic':
      return {
        title: 'Echoes of Loss',
        description:
          "Too many fell along the way. The system was broken, but at what cost? The survivors carry the weight of those they couldn't save, haunted by the knowledge that it could have been different.",
      };
  }
}

export function getCreditsRoster(
  roster: string[],
  deadUnitIds: string[],
): Array<{ id: string; alive: boolean }> {
  return roster.map((id) => ({
    id,
    alive: !deadUnitIds.includes(id),
  }));
}
