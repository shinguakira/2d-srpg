import { useEffect, useCallback } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { Portrait } from './sprites/Portrait';
import { SPEAKERS } from './sprites/portraits';
import { useT } from '../i18n/useT';

const FACTION_COLORS: Record<string, string> = {
  player: '#60a5fa',
  enemy: '#f87171',
};
const NARRATOR_COLOR = '#fbbf24';

export function DialogueBox() {
  const T = useT();
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
    ? (FACTION_COLORS[line.speakerFaction] ?? NARRATOR_COLOR)
    : NARRATOR_COLOR;

  return (
    <div className="dialogue" data-testid="dialogue-box" onClick={handleAdvance}>
      {SPEAKERS[line.speaker] && (
        <div className="dialogue__portrait" key={line.speaker}>
          <Portrait speaker={line.speaker} />
        </div>
      )}
      <div className="dialogue__panel">
        <div className="dialogue__speaker" style={{ color: speakerColor }}>
          {T.name(line.speaker)}
        </div>
        <div className="dialogue__text">{T.t(line.text)}</div>
        <div className="dialogue__hint">
          {lineIndex + 1} / {scene.lines.length} — Click or press Enter
        </div>
      </div>
    </div>
  );
}
