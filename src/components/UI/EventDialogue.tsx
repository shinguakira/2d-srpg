import { useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { BattleSprite } from '../Combat/BattleSprite';
import type { Faction } from '../../core/types';

const FACTION_COLORS: Record<string, string> = {
  player: '#60a5fa',
  enemy: '#f87171',
  ally: '#4ade80',
};
const NARRATOR_COLOR = '#fbbf24';

const SPEAKER_PORTRAITS: Record<string, { classId: string; faction: Faction; unitId?: string }> = {
  Ren: { classId: 'lord', faction: 'player', unitId: 'ren' },
  Kael: { classId: 'cavalier', faction: 'player', unitId: 'kael' },
  Senna: { classId: 'mage', faction: 'player', unitId: 'senna' },
  Lira: { classId: 'cleric', faction: 'player', unitId: 'lira' },
  Bram: { classId: 'fighter', faction: 'player', unitId: 'bram' },
  Voss: { classId: 'soldier', faction: 'player', unitId: 'voss' },
  Nira: { classId: 'archer', faction: 'player', unitId: 'nira' },
  Coda: { classId: 'thief', faction: 'player', unitId: 'coda' },
  Yuel: { classId: 'pegasus_knight', faction: 'player', unitId: 'yuel' },
  Garrek: { classId: 'fighter', faction: 'enemy', unitId: 'garrek' },
  Thane: { classId: 'cavalier', faction: 'enemy' },
  Holtz: { classId: 'soldier', faction: 'enemy' },
  Marko: { classId: 'fighter', faction: 'enemy' },
  Aldric: { classId: 'general_knight', faction: 'enemy' },
};

export function EventDialogue() {
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
    ? FACTION_COLORS[line.speakerFaction] ?? NARRATOR_COLOR
    : NARRATOR_COLOR;

  const portrait = SPEAKER_PORTRAITS[line.speaker];

  return (
    <div className="event-dialogue" data-testid="event-dialogue" onClick={handleAdvance}>
      <div className="event-dialogue__backdrop" />
      <div className="event-dialogue__panel">
        {portrait && (
          <div className="event-dialogue__portrait">
            <BattleSprite classId={portrait.classId} faction={portrait.faction} unitId={portrait.unitId} static />
          </div>
        )}
        <div className="event-dialogue__content">
          <div className="event-dialogue__speaker" style={{ color: speakerColor }}>
            {line.speaker}
          </div>
          <div className="event-dialogue__text" data-testid="event-dialogue-text">
            {line.text}
          </div>
        </div>
      </div>
      <div className="event-dialogue__hint">Click or press Enter to continue</div>
    </div>
  );
}
