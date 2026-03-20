import { memo } from 'react';
import type { Tile as TileType, Unit } from '../../core/types';
import { TerrainSprite } from './TerrainSprite';
import { UnitSprite } from '../Units/UnitSprite';

type TileProps = {
  tile: TileType;
  unit: Unit | undefined;
  isSelected: boolean;
  tileSize: number;
  visited?: boolean;
  isTerrainChanging?: boolean;
  isUnitSpawning?: boolean;
  isUnitRemoving?: boolean;
  isUnitRefreshed?: boolean;
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
  isUnitSpawning,
  isUnitRemoving,
  isUnitRefreshed,
  onClick,
  onMouseEnter,
}: TileProps) {
  const tileClasses = `tile ${isSelected ? 'tile--selected' : ''} ${isTerrainChanging ? 'tile--terrain-change' : ''}`;
  return (
    <div
      className={tileClasses}
      data-testid={`tile-${tile.position.x}-${tile.position.y}`}
      data-terrain={tile.terrain}
      data-occupied={tile.occupantId ?? undefined}
      style={{
        width: tileSize,
        height: tileSize,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <TerrainSprite terrain={tile.terrain} size={tileSize} visited={visited} />
      {unit && <UnitSprite unit={unit} tileSize={tileSize} isSelected={isSelected} isSpawning={isUnitSpawning} isRemoving={isUnitRemoving} isRefreshed={isUnitRefreshed} />}
    </div>
  );
});
