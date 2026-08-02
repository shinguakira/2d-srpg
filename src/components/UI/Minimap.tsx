import { useState, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';

const TILE_PX = 3;

const TERRAIN_COLORS: Record<string, string> = {
  plain: '#4a7c4a',
  grass: '#4a7c4a',
  forest: '#2d5a2d',
  mountain: '#8b7355',
  wall: '#555',
  water: '#3b82f6',
  fort: '#666',
  throne: '#8b6914',
  village: '#c47d2b',
  sand: '#d4a84b',
  chest: '#b8860b',
  door: '#8b4513',
  bridge: '#8b7355',
  floor: '#777',
  gate: '#888',
  glitched: '#d946ef',
  data_void: '#1a0033',
  memory: '#22d3ee',
  corrupted_fort: '#a020f0',
  broken_throne: '#5c3a00',
};

const FACTION_DOT_COLORS: Record<string, string> = {
  player: '#3b82f6',
  enemy: '#ef4444',
  ally: '#22c55e',
  neutral: '#9ca3af',
};

export function Minimap() {
  const gameMap = useGameStore((s) => s.gameMap);
  const units = useGameStore((s) => s.units);
  const cameraOffset = useUIStore((s) => s.cameraOffset);
  const tileSize = useUIStore((s) => s.tileSize);
  const setCameraOffset = useUIStore((s) => s.setCameraOffset);
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / TILE_PX;
      const y = (e.clientY - rect.top) / TILE_PX;
      // Center camera on clicked position
      const viewW = window.innerWidth;
      const viewH = window.innerHeight;
      const newX = Math.min(
        0,
        Math.max(-(gameMap.width * tileSize - viewW), -(x * tileSize - viewW / 2)),
      );
      const newY = Math.min(
        0,
        Math.max(-(gameMap.height * tileSize - viewH), -(y * tileSize - viewH / 2)),
      );
      setCameraOffset({ x: newX, y: newY });
    },
    [gameMap.width, gameMap.height, tileSize, setCameraOffset],
  );

  // Only show for maps > 12x12
  if (gameMap.width <= 12 && gameMap.height <= 12) return null;

  const mapW = gameMap.width * TILE_PX;
  const mapH = gameMap.height * TILE_PX;

  // Viewport rectangle
  const viewW = window.innerWidth;
  const viewH = window.innerHeight;
  const vpX = Math.max(0, (-cameraOffset.x / tileSize) * TILE_PX);
  const vpY = Math.max(0, (-cameraOffset.y / tileSize) * TILE_PX);
  const vpW = Math.min(mapW - vpX, (viewW / tileSize) * TILE_PX);
  const vpH = Math.min(mapH - vpY, (viewH / tileSize) * TILE_PX);

  return (
    <div className="minimap" data-testid="minimap">
      <div className="minimap__toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '◻' : '▤'}
      </div>
      {!collapsed && (
        <svg
          width={mapW}
          height={mapH}
          style={{ display: 'block', cursor: 'pointer' }}
          onClick={handleClick}
        >
          {/* Terrain tiles */}
          {gameMap.tiles.map((row, y) =>
            row.map((tile, x) => (
              <rect
                key={`${x},${y}`}
                x={x * TILE_PX}
                y={y * TILE_PX}
                width={TILE_PX}
                height={TILE_PX}
                fill={TERRAIN_COLORS[tile.terrain] ?? '#4a7c4a'}
              />
            )),
          )}
          {/* Unit dots */}
          {Array.from(units.values()).map((unit) => {
            if (unit.currentHp <= 0 || unit.isCarried) return null;
            const isBoss = unit.aiBehavior?.type === 'boss';
            const r = isBoss ? 2 : 1.2;
            return (
              <circle
                key={unit.id}
                cx={unit.position.x * TILE_PX + TILE_PX / 2}
                cy={unit.position.y * TILE_PX + TILE_PX / 2}
                r={r}
                fill={FACTION_DOT_COLORS[unit.faction] ?? '#fff'}
                stroke={isBoss ? '#fbbf24' : 'none'}
                strokeWidth={isBoss ? 0.5 : 0}
              />
            );
          })}
          {/* Viewport rectangle */}
          <rect
            data-testid="minimap-viewport"
            x={vpX}
            y={vpY}
            width={vpW}
            height={vpH}
            fill="none"
            stroke="#fff"
            strokeWidth={0.8}
            opacity={0.7}
          />
        </svg>
      )}
    </div>
  );
}
