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
  onClick: () => void;
  onMouseEnter: () => void;
};

export const Tile = memo(function Tile({
  tile,
  unit,
  isSelected,
  tileSize,
  visited,
  onClick,
  onMouseEnter,
}: TileProps) {
  return (
    <div
      className={`tile ${isSelected ? 'tile--selected' : ''}`}
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
      {unit && <UnitSprite unit={unit} tileSize={tileSize} isSelected={isSelected} />}
    </div>
  );
});
