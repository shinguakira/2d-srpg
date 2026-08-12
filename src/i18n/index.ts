/**
 * Bilingual text (English / Japanese).
 *
 * Two mechanisms on purpose, because the game has two kinds of text:
 *
 * 1. **Things with ids** — units, classes, weapons, items, terrain, skills,
 *    chapters. Their English name stays in `src/data/` as the canonical value
 *    and the Japanese lives in `ja.ts`, keyed by the same id. Nothing about
 *    those data types changes, so `withForgeLevel` can still build
 *    "Forged Iron Sword" by interpolation and the unit tests that compare
 *    names keep working.
 *
 * 2. **Dialogue**, which has no ids. Those carry their translation inline as
 *    `{ en, ja }`. `Localized` also accepts a bare string so a line that has
 *    not been translated yet still typechecks and still renders.
 *
 * Resolution is a pure function; the React side is in `useT.ts`.
 */

export type Lang = 'en' | 'ja';

export const LANGS: readonly Lang[] = ['en', 'ja'];

/** A string that may carry a translation. A bare string means "same in both". */
export type Localized = string | Readonly<Record<Lang, string>>;

export function resolveText(text: Localized | undefined, lang: Lang): string {
  if (text == null) return '';
  if (typeof text === 'string') return text;
  return text[lang] ?? text.en ?? '';
}

/** Look an id up in a catalogue, falling back to the canonical English. */
export function resolveEntry(
  table: Readonly<Record<string, string>>,
  id: string | undefined,
  fallback: string | undefined,
  lang: Lang,
): string {
  if (lang === 'en') return fallback ?? id ?? '';
  if (id != null && table[id] != null) return table[id];
  return fallback ?? id ?? '';
}
