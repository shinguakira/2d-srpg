import type { EndingType } from './types';

export type EndingFlags = {
  totalDeaths: number;
  tsubameRecruited: boolean;
  shrineKeeperSaved: boolean;
  takeshiSpared: boolean;
  takeshiReasoned: boolean;
  sealRelit: boolean;
  blackflameEnded: boolean;
};

/**
 * Evaluate which ending the player earns based on campaign flags.
 */
export function evaluateEnding(flags: EndingFlags): EndingType {
  // Tragic: 5+ deaths
  if (flags.totalDeaths >= 5) return 'tragic';

  // Perfect: seal relit, Blackflame ended, nobody lost, both optional lives saved,
  // and Takeshi talked down rather than cut down
  if (
    flags.sealRelit &&
    flags.blackflameEnded &&
    flags.totalDeaths === 0 &&
    flags.tsubameRecruited &&
    flags.shrineKeeperSaved &&
    flags.takeshiSpared
  ) {
    return 'perfect';
  }

  // True: the seal is relit and the Blackflame is ended
  if (flags.sealRelit && flags.blackflameEnded) {
    return 'true';
  }

  // Bittersweet: the Blackflame is ended, but the seal was never relit
  if (flags.blackflameEnded) {
    return 'bittersweet';
  }

  // Default to bittersweet if somehow none match
  return 'bittersweet';
}

export function getEndingText(ending: EndingType): { title: string; description: string } {
  switch (ending) {
    case 'perfect':
      return {
        title: 'The Fourth Flame',
        description:
          'Takeshi laid the Blackflame down rather than have it torn out of him, and Shigeru relit the northern shrine with the last ember of the Flamebrand. No one was left behind on the road. Amagi is rebuilt slowly, by people who remember exactly what it cost, and the three flames burn on with a fourth beside them.',
      };
    case 'true':
      return {
        title: 'The Seal Restored',
        description:
          'The Blackflame was driven back into the mountain and the northern shrine was lit again. The Flamebrand went dark on the shrine floor, its embers spent, and Shigeru left it there. The war ends. Some of those who began the march do not see it end.',
      };
    case 'bittersweet':
      return {
        title: 'Ash and Aftermath',
        description:
          'The Blackflame was beaten, but the seal was never relit — and a thing that has been let out once knows the way. Amagi has its throne back. Its scholars keep watch on the northern bearing, and they teach their students to keep watching.',
      };
    case 'tragic':
      return {
        title: 'What It Took',
        description:
          'Too many fell on the road north. The Blackflame is ended and there are not enough survivors left to be glad of it. The names are carved into the shrine wall, and the people who carved them do not agree that it was worth the price.',
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
