import { useMemo } from 'react';
import { useUIStore } from '../stores/uiStore';
import { resolveText, resolveEntry, type Lang, type Localized } from './index';
import {
  JA_NAMES,
  JA_CLASSES,
  JA_WEAPONS,
  JA_ITEMS,
  JA_TERRAIN,
  JA_CHAPTERS,
  JA_UI,
  JA_ACTIONS,
  JA_OBJECTIVES,
} from './ja';

export type Translator = {
  lang: Lang;
  /** Resolve an inline `{ en, ja }` (or a bare string). Used for dialogue. */
  t: (text: Localized | undefined) => string;
  /** Character / boss / speaker name, keyed by its canonical English. */
  name: (en: string | undefined) => string;
  cls: (en: string | undefined) => string;
  weapon: (en: string | undefined) => string;
  item: (en: string | undefined) => string;
  terrain: (en: string | undefined) => string;
  /** Chapter title, keyed by chapter id, falling back to its English title. */
  chapter: (id: string | undefined, en: string | undefined) => string;
  /** Action-menu command label. */
  action: (en: string) => string;
  /** Chapter objective description. */
  objective: (en: string | undefined) => string;
  /** UI chrome, keyed by a dotted id. The key's English is passed as fallback. */
  ui: (key: string, en: string) => string;
};

export function useT(): Translator {
  const lang = useUIStore((s) => s.lang);
  return useMemo(
    () => ({
      lang,
      t: (text) => resolveText(text, lang),
      name: (en) => resolveEntry(JA_NAMES, en, en, lang),
      cls: (en) => resolveEntry(JA_CLASSES, en, en, lang),
      weapon: (en) => resolveEntry(JA_WEAPONS, en, en, lang),
      item: (en) => resolveEntry(JA_ITEMS, en, en, lang),
      terrain: (en) => resolveEntry(JA_TERRAIN, en, en, lang),
      chapter: (id, en) => resolveEntry(JA_CHAPTERS, id, en, lang),
      action: (en) => resolveEntry(JA_ACTIONS, en, en, lang),
      objective: (en) => resolveEntry(JA_OBJECTIVES, en, en, lang),
      ui: (key, en) => resolveEntry(JA_UI, key, en, lang),
    }),
    [lang],
  );
}
