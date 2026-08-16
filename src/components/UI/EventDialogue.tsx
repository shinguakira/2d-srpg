import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { Portrait } from '../sprites/Portrait';
import { SPEAKERS } from '../sprites/portraits';
import { useT } from '../../i18n/useT';

const FACTION_COLORS: Record<string, string> = {
  player: '#60a5fa',
  enemy: '#f87171',
  ally: '#4ade80',
};
const NARRATOR_COLOR = '#fbbf24';

export function EventDialogue() {
  const T = useT();
  const eventDialogue = useGameStore((s) => s.eventDialogue);
  const lineIndex = useGameStore((s) => s.eventDialogueLineIndex);
  const advance = useGameStore((s) => s.advanceEventDialogue);

  const handleAdvance = useCallback(() => {
    advance();
  }, [advance]);

  useEffect(() => {
    if (!eventDialogue) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [eventDialogue, handleAdvance]);

  if (!eventDialogue) return null;
  const line = eventDialogue.lines[lineIndex];
  if (!line) return null;

  const speakerColor = line.speakerFaction
    ? (FACTION_COLORS[line.speakerFaction] ?? NARRATOR_COLOR)
    : NARRATOR_COLOR;

  return (
    <div className="event-dialogue" data-testid="event-dialogue" onClick={handleAdvance}>
      <div className="event-dialogue__backdrop" />
      <div className="event-dialogue__panel">
        {SPEAKERS[line.speaker] && (
          <div className="event-dialogue__portrait">
            <Portrait speaker={line.speaker} />
          </div>
        )}
        <div className="event-dialogue__content">
          <div className="event-dialogue__speaker" style={{ color: speakerColor }}>
            {T.name(line.speaker)}
          </div>
          <div className="event-dialogue__text" data-testid="event-dialogue-text">
            {T.t(line.text)}
          </div>
        </div>
      </div>
      <div className="event-dialogue__hint">
        {T.lang === 'ja' ? 'クリック / Enter で進む' : 'Click or press Enter to continue'}
      </div>
    </div>
  );
}
