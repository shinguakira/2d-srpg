import { memo } from 'react';
import type { Tile as TileType, Unit, FogState } from '../../core/types';
import { TerrainSprite } from './TerrainSprite';
import { UnitSprite } from '../Units/UnitSprite';

type TileProps = {
  tile: TileType;
  unit: Unit | undefined;
  isSelected: boolean;
  tileSize: number;
  visited?: boolean;
  isTerrainChanging?: boolean;
  isTerrainDestroying?: boolean;
  isFogRevealing?: boolean;
  isUnitSpawning?: boolean;
  isUnitRemoving?: boolean;
  isUnitRefreshed?: boolean;
  hasActiveSupport?: boolean;
  fogState?: FogState;
  terrainHp?: { hp: number; maxHp: number };
  onClick: () => void;
  onMouseEnter: () => void;
};

export const Tile = memo(function Tile({
  tile,
  unit,
  isSelected,
  tileSize,
  visited,
  isTerrainChanging,
  isTerrainDestroying,
  isFogRevealing,
  isUnitSpawning,
  isUnitRemoving,
  isUnitRefreshed,
  hasActiveSupport,
  fogState,
  terrainHp,
  onClick,
  onMouseEnter,
}: TileProps) {
  const fogClass = fogState === 'hidden' ? ' tile--fog-hidden' : fogState === 'revealed' ? ' tile--fog-revealed' : '';
  const terrainAnimClass = isTerrainDestroying ? ' tile--terrain-destroy' : isTerrainChanging ? ' tile--terrain-change' : '';
  const fogRevealClass = isFogRevealing ? ' tile--fog-reveal' : '';
  const tileClasses = `tile ${isSelected ? 'tile--selected' : ''}${terrainAnimClass}${fogClass}${fogRevealClass}`;
  return (
    <div
      className={tileClasses}
      data-testid={`tile-${tile.position.x}-${tile.position.y}`}
      data-terrain={tile.terrain}
      data-occupied={tile.occupantId ?? undefined}
      data-fog={fogState ?? undefined}
      style={{
        width: tileSize,
        height: tileSize,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <TerrainSprite terrain={tile.terrain} size={tileSize} visited={visited} />
      {unit && fogState !== 'hidden' && (
        <UnitSprite unit={unit} tileSize={tileSize} isSelected={isSelected} isSpawning={isUnitSpawning} isRemoving={isUnitRemoving} isRefreshed={isUnitRefreshed} hasActiveSupport={hasActiveSupport} />
      )}
      {terrainHp && terrainHp.hp < terrainHp.maxHp && fogState !== 'hidden' && (
        <div className="tile__terrain-hp" data-testid="terrain-hp-bar">
          <div
            className="tile__terrain-hp-fill"
            style={{ width: `${(terrainHp.hp / terrainHp.maxHp) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
});
