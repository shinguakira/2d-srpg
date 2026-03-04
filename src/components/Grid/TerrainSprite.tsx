import { memo } from 'react';
import type { TerrainType } from '../../core/types';

type TerrainSpriteProps = {
  terrain: TerrainType;
  size: number;
  visited?: boolean;
};

/**
 * SVG-based terrain tile sprites.
 * Each terrain type gets a distinct, recognizable visual pattern.
 */
export const TerrainSprite = memo(function TerrainSprite({ terrain, size, visited }: TerrainSpriteProps) {
  return (
    <svg
      className="terrain-sprite"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ position: 'absolute', top: 0, left: 0 }}
      aria-hidden
    >
      {renderTerrain(terrain)}
      {visited && terrain === 'village' && (
        <>
          <rect width="48" height="48" fill="rgba(0,0,0,0.35)" />
          <line x1="12" y1="12" x2="36" y2="36" stroke="#888" strokeWidth="3" />
          <line x1="36" y1="12" x2="12" y2="36" stroke="#888" strokeWidth="3" />
        </>
      )}
    </svg>
  );
});

function renderTerrain(terrain: TerrainType) {
  switch (terrain) {
    case 'plain':
      return <PlainTerrain />;
    case 'forest':
      return <ForestTerrain />;
    case 'mountain':
      return <MountainTerrain />;
    case 'water':
      return <WaterTerrain />;
    case 'wall':
      return <WallTerrain />;
    case 'fort':
      return <FortTerrain />;
    case 'village':
      return <VillageTerrain />;
  }
}

function PlainTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#7ec850" />
      {/* Grass tufts */}
      <line x1="8" y1="38" x2="12" y2="34" stroke="#5da83a" strokeWidth="1.5" />
      <line x1="10" y1="38" x2="14" y2="33" stroke="#5da83a" strokeWidth="1.5" />
      <line x1="30" y1="18" x2="34" y2="14" stroke="#5da83a" strokeWidth="1.5" />
      <line x1="32" y1="18" x2="36" y2="13" stroke="#5da83a" strokeWidth="1.5" />
      <line x1="20" y1="42" x2="22" y2="38" stroke="#6bba45" strokeWidth="1" />
      <line x1="38" y1="30" x2="40" y2="26" stroke="#6bba45" strokeWidth="1" />
      {/* Small flowers */}
      <circle cx="18" cy="28" r="1.2" fill="#e8d44d" />
      <circle cx="36" cy="40" r="1.2" fill="#e8d44d" />
    </>
  );
}

function ForestTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#3a7d28" />
      {/* Tree 1 - left */}
      <polygon points="14,10 6,30 22,30" fill="#2d6b1e" />
      <polygon points="14,6 8,22 20,22" fill="#348725" />
      <rect x="12" y="30" width="4" height="6" fill="#5c3a1e" />
      {/* Tree 2 - right */}
      <polygon points="34,14 26,32 42,32" fill="#2d6b1e" />
      <polygon points="34,10 28,26 40,26" fill="#348725" />
      <rect x="32" y="32" width="4" height="6" fill="#5c3a1e" />
      {/* Ground shadow */}
      <ellipse cx="14" cy="37" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />
      <ellipse cx="34" cy="39" rx="8" ry="2" fill="rgba(0,0,0,0.15)" />
    </>
  );
}

function MountainTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#8b9a6b" />
      {/* Main peak */}
      <polygon points="24,4 6,38 42,38" fill="#9a9a8a" />
      <polygon points="24,4 24,38 42,38" fill="#7a7a6e" />
      {/* Snow cap */}
      <polygon points="24,4 18,16 30,16" fill="#e8e8e0" />
      <polygon points="24,4 24,16 30,16" fill="#d0d0c8" />
      {/* Small peak */}
      <polygon points="10,22 2,42 18,42" fill="#8a8a7e" />
      <polygon points="10,22 10,42 18,42" fill="#727268" />
      {/* Rocks at base */}
      <ellipse cx="34" cy="43" rx="6" ry="3" fill="#7a7a6e" />
    </>
  );
}

function WaterTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#3a7dd4" />
      {/* Wave patterns */}
      <path d="M0,16 Q8,12 16,16 Q24,20 32,16 Q40,12 48,16" fill="none" stroke="#5a9de8" strokeWidth="2" />
      <path d="M0,28 Q8,24 16,28 Q24,32 32,28 Q40,24 48,28" fill="none" stroke="#5a9de8" strokeWidth="2" />
      <path d="M0,40 Q8,36 16,40 Q24,44 32,40 Q40,36 48,40" fill="none" stroke="#5a9de8" strokeWidth="2" />
      {/* Light reflection */}
      <ellipse cx="14" cy="10" rx="4" ry="1.5" fill="rgba(255,255,255,0.2)" />
      <ellipse cx="36" cy="34" rx="3" ry="1" fill="rgba(255,255,255,0.15)" />
    </>
  );
}

function WallTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#5c4033" />
      {/* Brick pattern */}
      <rect x="0" y="0" width="24" height="12" fill="#6b4d3a" stroke="#4a3228" strokeWidth="1" />
      <rect x="24" y="0" width="24" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
      <rect x="12" y="12" width="24" height="12" fill="#6b4d3a" stroke="#4a3228" strokeWidth="1" />
      <rect x="0" y="12" width="12" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
      <rect x="36" y="12" width="12" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
      <rect x="0" y="24" width="24" height="12" fill="#6b4d3a" stroke="#4a3228" strokeWidth="1" />
      <rect x="24" y="24" width="24" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
      <rect x="12" y="36" width="24" height="12" fill="#6b4d3a" stroke="#4a3228" strokeWidth="1" />
      <rect x="0" y="36" width="12" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
      <rect x="36" y="36" width="12" height="12" fill="#5c4033" stroke="#4a3228" strokeWidth="1" />
    </>
  );
}

function FortTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#7ec850" />
      {/* Fort base */}
      <rect x="8" y="20" width="32" height="22" fill="#a0a0a0" stroke="#707070" strokeWidth="1" />
      {/* Battlements */}
      <rect x="8" y="16" width="8" height="6" fill="#a0a0a0" stroke="#707070" strokeWidth="1" />
      <rect x="20" y="16" width="8" height="6" fill="#a0a0a0" stroke="#707070" strokeWidth="1" />
      <rect x="32" y="16" width="8" height="6" fill="#a0a0a0" stroke="#707070" strokeWidth="1" />
      {/* Door */}
      <rect x="19" y="30" width="10" height="12" fill="#5c4033" rx="5" />
      {/* Flag */}
      <line x1="24" y1="6" x2="24" y2="16" stroke="#707070" strokeWidth="1.5" />
      <polygon points="24,6 36,10 24,14" fill="#d44040" />
    </>
  );
}

function VillageTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#7ec850" />
      {/* House body */}
      <rect x="10" y="24" width="28" height="18" fill="#d4a574" stroke="#a07850" strokeWidth="1" />
      {/* Roof */}
      <polygon points="8,24 24,10 40,24" fill="#b04040" />
      <polygon points="24,10 40,24 24,24" fill="#903030" />
      {/* Door */}
      <rect x="20" y="32" width="8" height="10" fill="#5c3a1e" />
      {/* Window */}
      <rect x="14" y="28" width="5" height="5" fill="#8fd4f0" stroke="#a07850" strokeWidth="0.5" />
      <line x1="16.5" y1="28" x2="16.5" y2="33" stroke="#a07850" strokeWidth="0.5" />
      <line x1="14" y1="30.5" x2="19" y2="30.5" stroke="#a07850" strokeWidth="0.5" />
      {/* Window 2 */}
      <rect x="30" y="28" width="5" height="5" fill="#8fd4f0" stroke="#a07850" strokeWidth="0.5" />
      <line x1="32.5" y1="28" x2="32.5" y2="33" stroke="#a07850" strokeWidth="0.5" />
      <line x1="30" y1="30.5" x2="35" y2="30.5" stroke="#a07850" strokeWidth="0.5" />
    </>
  );
}
