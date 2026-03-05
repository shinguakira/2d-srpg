import { useState } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import type { GameMode } from '../stores/campaignStore';
import { CAMPAIGN } from '../data/campaignConfig';

type SubMenu = 'none' | 'load' | 'chapter_select' | 'mode_select';

export function TitleScreen() {
  const [subMenu, setSubMenu] = useState<SubMenu>('none');
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const startNewGame = useCampaignStore((s) => s.startNewGame);
  const setGameMode = useCampaignStore((s) => s.setGameMode);
  const loadFromSlot = useCampaignStore((s) => s.loadFromSlot);
  const anySave = useCampaignStore((s) => s.hasAnySave);
  const getSlotSummary = useCampaignStore((s) => s.getSlotSummary);
  const completedChapters = useCampaignStore((s) => s.completedChapters);
  const startChapter = useCampaignStore((s) => s.startChapter);
  const goToDebug = useCampaignStore((s) => s.goToDebug);

  if (subMenu === 'mode_select') {
    return (
      <div className="title-screen" data-testid="title-screen">
        <h1 className="title-screen__title" style={{ color: '#fbbf24', fontSize: '24px' }}>
          Select Difficulty
        </h1>
        <div className="title-screen__menu" style={{ gap: '12px', maxWidth: '320px' }}>
          <button
            className="title-screen__btn"
            data-testid="mode-classic"
            onClick={() => setSelectedMode('classic')}
            style={{
              border: selectedMode === 'classic' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.12)',
              boxShadow: selectedMode === 'classic' ? '0 0 12px rgba(251,191,36,0.2)' : 'none',
              background: 'rgba(255,255,255,0.06)',
              textAlign: 'left',
              padding: '12px 16px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>CLASSIC</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Fallen units are lost forever.
            </div>
          </button>
          <button
            className="title-screen__btn"
            data-testid="mode-casual"
            onClick={() => setSelectedMode('casual')}
            style={{
              border: selectedMode === 'casual' ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.12)',
              boxShadow: selectedMode === 'casual' ? '0 0 12px rgba(251,191,36,0.2)' : 'none',
              background: 'rgba(255,255,255,0.06)',
              textAlign: 'left',
              padding: '12px 16px',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>CASUAL</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Fallen units return next chapter.
            </div>
          </button>
          <button
            className="title-screen__btn"
            data-testid="mode-confirm"
            onClick={() => {
              setGameMode(selectedMode);
              startNewGame();
              setSubMenu('none');
            }}
            style={{
              background: 'rgba(59,130,246,0.3)',
              borderColor: 'rgba(59,130,246,0.5)',
              marginTop: '8px',
            }}
          >
            Confirm
          </button>
          <button
            className="title-screen__btn"
            data-testid="mode-back"
            onClick={() => setSubMenu('none')}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

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
          onClick={() => setSubMenu('mode_select')}
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
          data-testid="debug-btn"
          onClick={goToDebug}
        >
          Debug
        </button>
      </div>
    </div>
  );
}
