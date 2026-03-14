import { useEffect, useCallback } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { BattleSprite } from './Combat/BattleSprite';
import type { Faction } from '../core/types';

const FACTION_COLORS: Record<string, string> = {
  player: '#60a5fa',
  enemy: '#f87171',
};
const NARRATOR_COLOR = '#fbbf24';

/** Map character names to their class/faction for portrait display */
const SPEAKER_PORTRAITS: Record<string, { classId: string; faction: Faction }> = {
  Eirik: { classId: 'lord', faction: 'player' },
  Seth: { classId: 'cavalier', faction: 'player' },
  Lute: { classId: 'mage', faction: 'player' },
  Natasha: { classId: 'cleric', faction: 'player' },
  Bone: { classId: 'fighter', faction: 'enemy' },
  Zonta: { classId: 'soldier', faction: 'enemy' },
  Bazba: { classId: 'fighter', faction: 'enemy' },
  Naxos: { classId: 'soldier', faction: 'enemy' },
};

export function DialogueBox() {
  const scene = useCampaignStore((s) => s.dialogueScene);
  const lineIndex = useCampaignStore((s) => s.dialogueLineIndex);
  const advance = useCampaignStore((s) => s.advanceDialogue);

  const handleAdvance = useCallback(() => {
    advance();
  }, [advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAdvance]);

  if (!scene) return null;
  const line = scene.lines[lineIndex];
  if (!line) return null;

  const speakerColor = line.speakerFaction
    ? FACTION_COLORS[line.speakerFaction] ?? NARRATOR_COLOR
    : NARRATOR_COLOR;

  const portrait = SPEAKER_PORTRAITS[line.speaker];

  return (
    <div className="dialogue" data-testid="dialogue-box" onClick={handleAdvance}>
      {portrait && (
        <div className="dialogue__portrait" key={line.speaker}>
          <BattleSprite classId={portrait.classId} faction={portrait.faction} />
        </div>
      )}
      <div className="dialogue__panel">
        <div className="dialogue__speaker" style={{ color: speakerColor }}>
          {line.speaker}
        </div>
        <div className="dialogue__text">{line.text}</div>
        <div className="dialogue__hint">
          {lineIndex + 1} / {scene.lines.length} — Click or press Enter
        </div>
      </div>
    </div>
  );
}
