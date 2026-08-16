// Who each speaker in the script is, and what art they have.
//
// Fire Emblem draws a character twice at two sizes: a small sprite that walks
// around the map and fights, and a portrait that only ever appears when someone
// is talking. They are not the same picture scaled — at 32px a face is three
// pixels of skin, so everything that identifies a person has to live in the
// portrait instead.
//
// Until a portrait exists for a character the battle sprite stands in, blown up.
// Adding one is a matter of dropping `<slug>.png` into src/assets/portraits/:
// the glob below picks it up, no code change.

import type { Faction } from '../../core/types';

/** `Elder Ilse` -> `elder-ilse`, which is the filename a portrait must use. */
function portraitSlug(speaker: string): string {
  return speaker.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

const PORTRAIT_FILES = import.meta.glob('../../assets/portraits/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const PORTRAITS: Record<string, string> = Object.fromEntries(
  Object.entries(PORTRAIT_FILES).map(([file, url]) => [
    file.slice(file.lastIndexOf('/') + 1, -'.png'.length),
    url,
  ]),
);

/**
 * This used to live in two components with two different casts, and the copy in
 * DialogueBox still listed characters that had been renamed out of the story —
 * so the prologue drew no portrait at all for the chapter 1 boss. One map now.
 *
 * Bosses are keyed by the unit id the chapter data actually uses (`ch3_boss`),
 * not by their name; that is what `getSheet` looks up.
 */
export const SPEAKERS: Record<string, { classId: string; faction: Faction; unitId?: string }> = {
  Shigeru: { classId: 'lord', faction: 'player', unitId: 'shigeru' },
  Akira: { classId: 'cavalier', faction: 'player', unitId: 'akira' },
  Lisette: { classId: 'mage', faction: 'player', unitId: 'lisette' },
  Mirelle: { classId: 'cleric', faction: 'player', unitId: 'mirelle' },
  Gareth: { classId: 'fighter', faction: 'player', unitId: 'gareth' },
  Halvar: { classId: 'soldier', faction: 'player', unitId: 'halvar' },
  Bryn: { classId: 'archer', faction: 'player', unitId: 'bryn' },
  Fenn: { classId: 'thief', faction: 'player', unitId: 'fenn' },
  Elin: { classId: 'pegasus_knight', faction: 'player', unitId: 'elin' },
  Corwin: { classId: 'mercenary', faction: 'player', unitId: 'corwin' },
  Nadine: { classId: 'troubadour', faction: 'player', unitId: 'nadine' },
  Viviane: { classId: 'dancer', faction: 'player', unitId: 'viviane' },
  'Elder Ilse': { classId: 'cleric', faction: 'ally', unitId: 'elder_ilse' },
  Hagen: { classId: 'fighter', faction: 'enemy', unitId: 'hagen' },
  Vidar: { classId: 'cavalier', faction: 'enemy', unitId: 'vidar' },
  Olrik: { classId: 'soldier', faction: 'enemy', unitId: 'ch3_boss' },
  Brask: { classId: 'fighter', faction: 'enemy', unitId: 'ch4_boss' },
  Roderic: { classId: 'general_knight', faction: 'enemy', unitId: 'ch5_boss' },
  Aeryn: { classId: 'pegasus_knight', faction: 'enemy', unitId: 'ch6_boss' },
  Varro: { classId: 'general_soldier', faction: 'enemy', unitId: 'ch7_boss' },
  Wulfram: { classId: 'halberdier', faction: 'enemy', unitId: 'ch8_boss' },
  Ezrin: { classId: 'sage', faction: 'enemy', unitId: 'ch10_boss' },
  Takeshi: { classId: 'conqueror', faction: 'enemy', unitId: 'takeshi' },
};

/** The speaker's drawn portrait, or undefined if they only have a sprite. */
export function portraitArt(speaker: string): { url: string; slug: string } | undefined {
  const slug = portraitSlug(speaker);
  const url = PORTRAITS[slug];
  return url ? { url, slug } : undefined;
}
