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
import { HealingAnimation } from './Combat/HealingAnimation';
import { ItemAnimation } from './Combat/ItemAnimation';
import { ReinforcementBanner } from './UI/ReinforcementBanner';
import { LevelUpPopup } from './Combat/LevelUpPopup';
import { ExpBar } from './Combat/ExpBar';
import { EventDialogue } from './UI/EventDialogue';
import { UnitDetailScreen } from './UI/UnitDetailScreen';
import { TradeUI } from './UI/TradeUI';
import { WeatherOverlay } from './UI/WeatherOverlay';
import { WeatherIndicator } from './UI/WeatherIndicator';
import { SupportRankPopup } from './UI/SupportRankPopup';
import { BossPhaseTransition } from './UI/BossPhaseTransition';
import { MapBossHPBar } from './UI/MapBossHPBar';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';
import { useCampaignStore } from '../stores/campaignStore';
import { useCamera } from '../hooks/useCamera';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { useMovementAnimation } from '../hooks/useMovementAnimation';
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
  const deployedUnitIds = useCampaignStore((s) => s.deployedUnitIds);
  const campaignSupportPairs = useCampaignStore((s) => s.supportPairs);

  useEffect(() => {
    if (!chapterData) return;
    const params = new URLSearchParams(window.location.search);
    const seed = Number(params.get('seed')) || Date.now();
    const progress = Object.keys(unitProgress).length > 0 ? unitProgress : undefined;
    const deployed = deployedUnitIds.length > 0 ? deployedUnitIds : undefined;
    initChapter(chapterData, seed, progress, deployed, campaignSupportPairs);
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
  useMovementAnimation();

  // Right-click: cancel action, or open unit detail during idle
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (playerAction !== 'idle') {
      cancelAction();
      return;
    }

    // Idle: resolve tile from mouse position and open unit detail
    const { tileSize, cameraOffset: camOff, setDetailUnitId } = useUIStore.getState();
    const gameRect = e.currentTarget.getBoundingClientRect();
    const tileX = Math.floor((e.clientX - gameRect.left - camOff.x) / tileSize);
    const tileY = Math.floor((e.clientY - gameRect.top - camOff.y) / tileSize);

    const unitAtTile = useGameStore.getState().getUnitAt({ x: tileX, y: tileY });
    if (unitAtTile) {
      setDetailUnitId(unitAtTile.id);
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

      <WeatherOverlay />

      <MapBossHPBar />

      <div className="game__ui">
        <TurnInfo />
        <WeatherIndicator />
        <ActionMenu />
        <EndTurnButton />
        <UnitStatsPanel />
        <CombatPreview />
      </div>

      {/* Full-screen overlays */}
      <CombatAnimation />
      <HealingAnimation />
      <ItemAnimation />
      <VillageDialogue />
      <HealNotification />
      <DeathQuoteOverlay />
      <EventDialogue />
      <ExpBar />
      <LevelUpPopup />
      <ReinforcementBanner />
      <UnitDetailScreen />
      <TradeUI />
      <SupportRankPopup />
      <BossPhaseTransition />
      <PhaseBanner />

      {/* Game Over overlay */}
      {currentPhase === 'game_over' && <GameOverOverlay />}
    </div>
  );
}

function GameOverOverlay() {
  const units = useGameStore((s) => s.units);
  const chapterData = useGameStore((s) => s.chapterData);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const onChapterVictory = useCampaignStore((s) => s.onChapterVictory);
  const goToTitle = useCampaignStore((s) => s.goToTitle);

  const supportPairs = useGameStore((s) => s.supportPairs);
  const escapedUnitIds = useGameStore((s) => s.escapedUnitIds);

  let hasPlayer = false;
  let hasEnemy = false;
  for (const u of units.values()) {
    if (u.faction === 'player') hasPlayer = true;
    if (u.faction === 'enemy') hasEnemy = true;
  }

  // Escape victory: Lord escaped (escape action triggers game_over only when Lord escapes)
  const escapeVictory = chapterData?.objective.type === 'escape' && escapedUnitIds.size > 0;

  // Check if all boss-AI enemies are defeated
  const bossDefeated = (() => {
    for (const u of units.values()) {
      if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') return false;
    }
    return true;
  })();

  // Victory: varies by objective type. Defeat: no player units remaining.
  const victory = escapeVictory || (hasPlayer && (
    !hasEnemy || // rout win or all enemies killed
    (chapterData?.objective.type === 'seize' && (() => {
      if (!chapterData.seizePosition) return false;
      for (const u of units.values()) {
        if (u.isLord && u.position.x === chapterData.seizePosition.x && u.position.y === chapterData.seizePosition.y) {
          return true;
        }
      }
      return false;
    })()) ||
    (chapterData?.objective.type === 'boss_kill' && bossDefeated) ||
    (chapterData?.objective.type === 'survive' && !!chapterData.objective.turns && currentTurn > chapterData.objective.turns) ||
    (chapterData?.objective.type === 'protect' && bossDefeated)
  ));

  const handleVictoryContinue = useCallback(() => {
    // Bridge battle event flags to campaign flags (e.g., kael_dead from ch8)
    const eventFlags = useGameStore.getState().eventFlags;
    if (eventFlags.get('kael_dead') === 'true') {
      useCampaignStore.setState((s) => ({ campaignFlags: { ...s.campaignFlags, kael_dead: true } }));
    }

    const progress: Record<string, UnitProgress> = {};
    for (const u of units.values()) {
      if (u.faction === 'player') {
        progress[u.id] = {
          level: u.level,
          exp: u.exp,
          stats: { ...u.stats },
          weaponIds: u.inventory.map((w) => w.id),
          itemIds: u.items.map((i) => i.id),
          classId: u.classId,
          skillIds: u.skills ?? [],
          learnedSkillIds: u.learnedSkills ?? [],
        };
      }
    }
    onChapterVictory(progress, currentTurn, supportPairs);
  }, [units, onChapterVictory, currentTurn, supportPairs]);

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
            ? (chapterData?.objective.type === 'seize' ? 'The throne has been seized!'
              : chapterData?.objective.type === 'escape' ? 'Your army has escaped safely!'
              : chapterData?.objective.type === 'boss_kill' ? 'The commander has been defeated!'
              : chapterData?.objective.type === 'survive' ? 'You survived the onslaught!'
              : chapterData?.objective.type === 'protect' ? 'The village is safe!'
              : 'All enemies have been defeated.')
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
