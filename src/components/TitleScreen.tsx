import { useState } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { CAMPAIGN } from '../data/campaignConfig';

type SubMenu = 'none' | 'load' | 'chapter_select';

export function TitleScreen() {
  const [subMenu, setSubMenu] = useState<SubMenu>('none');
  const startNewGame = useCampaignStore((s) => s.startNewGame);
  const loadFromSlot = useCampaignStore((s) => s.loadFromSlot);
  const anySave = useCampaignStore((s) => s.hasAnySave);
  const getSlotSummary = useCampaignStore((s) => s.getSlotSummary);
  const completedChapters = useCampaignStore((s) => s.completedChapters);
  const startChapter = useCampaignStore((s) => s.startChapter);
  const goToDebug = useCampaignStore((s) => s.goToDebug);

  if (subMenu === 'load') {
    return (
      <div className="title-screen" data-testid="title-screen">
        <h1 className="title-screen__title">Load Game</h1>
        <div className="title-screen__menu">
          {[0, 1, 2].map((slot) => {
            const summary = getSlotSummary(slot);
            const meta = summary ? CAMPAIGN.find((c) => c.id === summary.chapterId) : null;
            return (
              <button
                key={slot}
                className={`title-screen__btn save-slot ${!summary ? 'save-slot--empty' : ''}`}
                data-testid={`save-slot-${slot}`}
                disabled={!summary}
                onClick={() => {
                  if (loadFromSlot(slot)) setSubMenu('none');
                }}
              >
                {summary
                  ? `Slot ${slot + 1}: ${meta?.name ?? summary.chapterId} — ${new Date(summary.timestamp).toLocaleDateString()}`
                  : `Slot ${slot + 1}: Empty`}
              </button>
            );
          })}
          <button
            className="title-screen__btn"
            data-testid="load-back"
            onClick={() => setSubMenu('none')}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (subMenu === 'chapter_select') {
    const available = CAMPAIGN.filter(
      (c) => c.implemented && (c.id === 'ch1' || completedChapters.includes(c.id))
    );
    return (
      <div className="title-screen" data-testid="title-screen">
        <h1 className="title-screen__title">Chapter Select</h1>
        <div className="title-screen__menu">
          {available.map((ch) => (
            <button
              key={ch.id}
              className="title-screen__btn"
              data-testid={`chapter-select-${ch.id}`}
              onClick={() => startChapter(ch.id)}
            >
              {ch.name}
            </button>
          ))}
          <button
            className="title-screen__btn"
            data-testid="chapter-select-back"
            onClick={() => setSubMenu('none')}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="title-screen" data-testid="title-screen">
      <h1 className="title-screen__title">Fire Emblem: Renais</h1>
      <p className="title-screen__subtitle">Tactical RPG</p>
      <div className="title-screen__menu">
        <button
          className="title-screen__btn"
          data-testid="new-game"
          onClick={startNewGame}
        >
          New Game
        </button>
        <button
          className="title-screen__btn"
          data-testid="continue-game"
          disabled={!anySave()}
          onClick={() => setSubMenu('load')}
        >
          Continue
        </button>
        <button
          className="title-screen__btn"
          data-testid="chapter-select"
          onClick={() => setSubMenu('chapter_select')}
        >
          Chapter Select
        </button>
        <button
          className="title-screen__btn"
          data-testid="debug-screen"
          onClick={goToDebug}
        >
          Debug
        </button>
      </div>
    </div>
  );
}
