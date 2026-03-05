import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { Tile } from './Tile';
import { RangeOverlay } from './RangeOverlay';
import { FloatingNumbers } from './FloatingNumber';
import { posKey } from '../../core/types';

export function TacticalGrid() {
  const gameMap = useGameStore((s) => s.gameMap);
  const units = useGameStore((s) => s.units);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const clickTile = useGameStore((s) => s.clickTile);
  const hoverTile = useGameStore((s) => s.hoverTile);
  const visitedVillages = useGameStore((s) => s.visitedVillages);
  const tileSize = useUIStore((s) => s.tileSize);
  const cursorPosition = useUIStore((s) => s.cursorPosition);
  const keyboardMode = useUIStore((s) => s.keyboardMode);

  if (gameMap.width === 0) return null;

  // Build lookup: posKey -> unit
  const unitsByPos = new Map<string, (typeof units extends Map<string, infer U> ? U : never)>();
  for (const unit of units.values()) {
    unitsByPos.set(posKey(unit.position), unit);
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

        return (
          <Tile
            key={key}
            tile={tile}
            unit={unit}
            isSelected={isSelected}
            tileSize={tileSize}
            visited={visited}
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
