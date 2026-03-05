import { useEffect, useRef, useCallback } from 'react';
import { TacticalGrid } from './Grid/TacticalGrid';
import { UnitStatsPanel } from './Units/UnitStatsPanel';
import { TurnInfo } from './UI/TurnInfo';
import { ActionMenu } from './UI/ActionMenu';
import { EndTurnButton } from './UI/EndTurnButton';
import { PhaseBanner } from './UI/PhaseBanner';
import { CombatAnimation } from './Combat/CombatAnimation';
import { CombatPreview } from './Combat/CombatPreview';
import { VillageDialogue } from './UI/VillageDialogue';
import { DeathQuoteOverlay } from './UI/DeathQuoteOverlay';
import { HealNotification } from './UI/HealNotification';
import { ReinforcementBanner } from './UI/ReinforcementBanner';
import { LevelUpPopup } from './Combat/LevelUpPopup';
import { TerrainInfoPanel } from './UI/TerrainInfoPanel';
import { UnitDetailScreen } from './UI/UnitDetailScreen';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useCamera } from '../hooks/useCamera';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import type { UnitProgress } from '../core/types';

export function Game() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const initChapter = useGameStore((s) => s.initChapter);
  const gameMap = useGameStore((s) => s.gameMap);
  const cameraOffset = useUIStore((s) => s.cameraOffset);
  const hoverTile = useGameStore((s) => s.hoverTile);
  const cancelAction = useGameStore((s) => s.cancelAction);
  const playerAction = useGameStore((s) => s.playerAction);
  const currentPhase = useGameStore((s) => s.currentPhase);
  const computeTileSize = useUIStore((s) => s.computeTileSize);

  const chapterData = useCampaignStore((s) => s.currentChapterData);
  const unitProgress = useCampaignStore((s) => s.unitProgress);

  useEffect(() => {
    if (!chapterData) return;
    const params = new URLSearchParams(window.location.search);
    const seed = Number(params.get('seed')) || Date.now();
    initChapter(chapterData, seed, Object.keys(unitProgress).length > 0 ? unitProgress : undefined);
  }, [chapterData, initChapter]);

  // Compute tile size to fill viewport
  useEffect(() => {
    if (gameMap.width === 0) return;
    const updateSize = () => {
      computeTileSize(gameMap.width, gameMap.height, window.innerWidth, window.innerHeight);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [gameMap.width, gameMap.height, computeTileSize]);

  useCamera(viewportRef);
  useGameLoop();
  useKeyboard();

  // Right-click to cancel
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (playerAction !== 'idle') {
      cancelAction();
    }
  }, [playerAction, cancelAction]);

  return (
    <div
      className="game"
      data-testid="game"
      onMouseLeave={() => hoverTile(null)}
      onContextMenu={handleContextMenu}
    >
      <div
        className="game__viewport"
        data-testid="viewport"
        ref={viewportRef}
      >
        <div
          className="game__camera"
          style={{
            transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
          }}
        >
          <TacticalGrid />
        </div>
      </div>

      <div className="game__ui">
        <TurnInfo />
        <ActionMenu />
        <EndTurnButton />
        <UnitStatsPanel />
        <TerrainInfoPanel />
        <CombatPreview />
      </div>

      {/* Full-screen overlays */}
      <CombatAnimation />
      <VillageDialogue />
      <HealNotification />
      <DeathQuoteOverlay />
      <LevelUpPopup />
      <ReinforcementBanner />
      <UnitDetailScreen />
      <PhaseBanner />

      {/* Game Over overlay */}
      {currentPhase === 'game_over' && <GameOverOverlay />}
    </div>
  );
}

function GameOverOverlay() {
  const units = useGameStore((s) => s.units);
  const chapterData = useGameStore((s) => s.chapterData);
  const onChapterVictory = useCampaignStore((s) => s.onChapterVictory);
  const goToTitle = useCampaignStore((s) => s.goToTitle);

  let hasPlayer = false;
  let hasEnemy = false;
  for (const u of units.values()) {
    if (u.faction === 'player') hasPlayer = true;
    if (u.faction === 'enemy') hasEnemy = true;
  }

  // Victory: for rout, all enemies dead. For seize, Lord on throne (boss dead, enemies may remain).
  // Defeat: no player units remaining.
  const victory = hasPlayer && (
    !hasEnemy || // rout win or all enemies killed
    (chapterData?.objective.type === 'seize' && (() => {
      // Check if Lord is on seize position (meaning seize action was used)
      if (!chapterData.seizePosition) return false;
      for (const u of units.values()) {
        if (u.isLord && u.position.x === chapterData.seizePosition.x && u.position.y === chapterData.seizePosition.y) {
          return true;
        }
      }
      return false;
    })())
  );

  const handleVictoryContinue = useCallback(() => {
    const progress: Record<string, UnitProgress> = {};
    for (const u of units.values()) {
      if (u.faction === 'player') {
        progress[u.id] = {
          level: u.level,
          exp: u.exp,
          stats: { ...u.stats },
        };
      }
    }
    onChapterVictory(progress);
  }, [units, onChapterVictory]);

  return (
    <div
      className={`game-over ${victory ? 'game-over--victory' : 'game-over--defeat'}`}
      data-testid={victory ? 'victory-screen' : 'defeat-screen'}
    >
      <div className="game-over__panel">
        <div className="game-over__title">
          {victory ? 'Victory!' : 'Defeat'}
        </div>
        <div className="game-over__subtitle">
          {victory
            ? (chapterData?.objective.type === 'seize' ? 'The throne has been seized!' : 'All enemies have been defeated.')
            : 'Your army has fallen.'}
        </div>
        <div className="game-over__actions">
          {victory ? (
            <button className="game-over__btn" data-testid="victory-continue" onClick={handleVictoryContinue}>
              Continue
            </button>
          ) : (
            <button className="game-over__btn" data-testid="defeat-title" onClick={goToTitle}>
              Return to Title
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
