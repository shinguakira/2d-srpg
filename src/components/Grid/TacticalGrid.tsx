import { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { Tile } from './Tile';
import { RangeOverlay } from './RangeOverlay';
import { FloatingNumbers } from './FloatingNumber';
import { posKey } from '../../core/types';
import { getActiveSupports } from '../../core/support';

export function TacticalGrid() {
  const gameMap = useGameStore((s) => s.gameMap);
  const units = useGameStore((s) => s.units);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const clickTile = useGameStore((s) => s.clickTile);
  const hoverTile = useGameStore((s) => s.hoverTile);
  const visitedVillages = useGameStore((s) => s.visitedVillages);
  const spawningUnitIds = useGameStore((s) => s.spawningUnitIds);
  const removingUnitIds = useGameStore((s) => s.removingUnitIds);
  const refreshedUnitIds = useGameStore((s) => s.refreshedUnitIds);
  const terrainChangePositions = useGameStore((s) => s.terrainChangePositions);
  const terrainDestroyPositions = useGameStore((s) => s.terrainDestroyPositions);
  const terrainHpMap = useGameStore((s) => s.terrainHpMap);
  const fogOfWar = useGameStore((s) => s.fogOfWar);
  const fogMap = useGameStore((s) => s.fogMap);
  const visibleTiles = useGameStore((s) => s.visibleTiles);
  const fogRevealTiles = useGameStore((s) => s.fogRevealTiles);
  const supportPairs = useGameStore((s) => s.supportPairs);
  const tileSize = useUIStore((s) => s.tileSize);
  const cursorPosition = useUIStore((s) => s.cursorPosition);
  const keyboardMode = useUIStore((s) => s.keyboardMode);

  // Compute which player units have an active support partner within 3 tiles
  const unitsWithActiveSupport = useMemo(() => {
    const set = new Set<string>();
    for (const u of units.values()) {
      if (u.faction !== 'player') continue;
      const actives = getActiveSupports(u.id, u.position, units, supportPairs);
      if (actives.length > 0) set.add(u.id);
    }
    return set;
  }, [units, supportPairs]);

  if (gameMap.width === 0) return null;

  // Build lookup: posKey -> unit (skip hidden and carried units; in fog, hide non-visible enemies)
  const unitsByPos = new Map<string, (typeof units extends Map<string, infer U> ? U : never)>();
  for (const unit of units.values()) {
    if (unit.isHidden || unit.isCarried) continue;
    const key = posKey(unit.position);
    // In fog of war, hide enemy/neutral units not on visible tiles
    if (fogOfWar && unit.faction !== 'player' && unit.faction !== 'ally' && !visibleTiles.has(key)) continue;
    unitsByPos.set(key, unit);
  }

  return (
    <div
      className="tactical-grid"
      data-testid="tactical-grid"
      data-grid-width={gameMap.width}
      data-grid-height={gameMap.height}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gameMap.width}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${gameMap.height}, ${tileSize}px)`,
        position: 'relative',
      }}
    >
      {gameMap.tiles.flat().map((tile) => {
        const key = posKey(tile.position);
        const unit = unitsByPos.get(key);
        const isSelected = unit ? unit.id === selectedUnitId : false;
        const visited = tile.terrain === 'village' && visitedVillages.has(key);

        const fogState = fogOfWar ? fogMap.get(key) : undefined;

        return (
          <Tile
            key={key}
            tile={tile}
            unit={unit}
            isSelected={isSelected}
            tileSize={tileSize}
            visited={visited}
            isTerrainChanging={terrainChangePositions.has(key)}
            isTerrainDestroying={terrainDestroyPositions.has(key)}
            isFogRevealing={fogRevealTiles.has(key)}
            isUnitSpawning={unit ? spawningUnitIds.has(unit.id) : false}
            isUnitRemoving={unit ? removingUnitIds.has(unit.id) : false}
            isUnitRefreshed={unit ? refreshedUnitIds.has(unit.id) : false}
            hasActiveSupport={unit ? unitsWithActiveSupport.has(unit.id) : false}
            fogState={fogState}
            terrainHp={terrainHpMap.get(key)}
            onClick={() => clickTile(tile.position)}
            onMouseEnter={() => hoverTile(tile.position)}
          />
        );
      })}

      {/* Range overlay rendered on top of tiles */}
      <RangeOverlay />

      {/* Floating damage numbers */}
      <FloatingNumbers />

      {/* Keyboard cursor overlay */}
      {keyboardMode && cursorPosition && (
        <div
          className="keyboard-cursor"
          data-testid="keyboard-cursor"
          style={{
            position: 'absolute',
            left: cursorPosition.x * tileSize,
            top: cursorPosition.y * tileSize,
            width: tileSize,
            height: tileSize,
            border: '2px solid #fff',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.15)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 10,
            animation: 'cursor-pulse 1s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}
