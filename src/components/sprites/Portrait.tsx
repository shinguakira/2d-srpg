import { BattleSprite } from '../Combat/BattleSprite';
import { SPEAKERS, portraitArt } from './portraits';

/**
 * A speaker's picture. Renders nothing for the narrator and for the walk-on
 * villagers, who have no art and are not meant to.
 *
 * Size and any scaling come from the container, which sets `--portrait-height`
 * and `--portrait-sprite-scale`: the two callers want very different things
 * from the sprite fallback — the full-screen prologue blows it up 2.5x, the
 * in-battle box does not.
 */
export function Portrait({ speaker }: { speaker: string }) {
  const who = SPEAKERS[speaker];
  if (!who) return null;

  const art = portraitArt(speaker);
  if (art) {
    return (
      <img
        className="portrait portrait--art"
        src={art.url}
        alt=""
        data-testid={`portrait-${art.slug}`}
      />
    );
  }

  return (
    <div
      className="portrait portrait--sprite"
      data-testid={`portrait-sprite-${who.unitId ?? who.classId}`}
    >
      <BattleSprite classId={who.classId} faction={who.faction} unitId={who.unitId} static />
    </div>
  );
}
