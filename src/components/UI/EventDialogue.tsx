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
  Shigeru: { classId: 'lord', faction: 'player', unitId: 'shigeru' },
  Akira: { classId: 'cavalier', faction: 'player', unitId: 'akira' },
  Lisette: { classId: 'mage', faction: 'player', unitId: 'lisette' },
  Mirelle: { classId: 'cleric', faction: 'player', unitId: 'mirelle' },
  Gareth: { classId: 'fighter', faction: 'player', unitId: 'gareth' },
  Halvar: { classId: 'soldier', faction: 'player', unitId: 'halvar' },
  Bryn: { classId: 'archer', faction: 'player', unitId: 'bryn' },
  Fenn: { classId: 'thief', faction: 'player', unitId: 'fenn' },
  Elin: { classId: 'pegasus_knight', faction: 'player', unitId: 'elin' },
  Hagen: { classId: 'fighter', faction: 'enemy', unitId: 'hagen' },
  Vidar: { classId: 'cavalier', faction: 'enemy' },
  Olrik: { classId: 'soldier', faction: 'enemy' },
  Brask: { classId: 'fighter', faction: 'enemy' },
  Roderic: { classId: 'general_knight', faction: 'enemy' },
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
    ? (FACTION_COLORS[line.speakerFaction] ?? NARRATOR_COLOR)
    : NARRATOR_COLOR;

  const portrait = SPEAKER_PORTRAITS[line.speaker];

  return (
    <div className="event-dialogue" data-testid="event-dialogue" onClick={handleAdvance}>
      <div className="event-dialogue__backdrop" />
      <div className="event-dialogue__panel">
        {portrait && (
          <div className="event-dialogue__portrait">
            <BattleSprite
              classId={portrait.classId}
              faction={portrait.faction}
              unitId={portrait.unitId}
              static
            />
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
