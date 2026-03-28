import { memo } from 'react';
import type { TerrainType } from '../../core/types';

type TerrainSpriteProps = {
  terrain: TerrainType;
  size: number;
  visited?: boolean;
};

/**
 * SVG terrain tile sprites — rich, atmospheric style to match character art.
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
      <defs>
        {/* Shared gradients */}
        <linearGradient id="t-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a9e3a" />
          <stop offset="60%" stopColor="#4a8830" />
          <stop offset="100%" stopColor="#3d7528" />
        </linearGradient>
        <linearGradient id="t-grass-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6aae48" />
          <stop offset="100%" stopColor="#4a8830" />
        </linearGradient>
        <linearGradient id="t-forest-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a4e1a" />
          <stop offset="100%" stopColor="#1e3a12" />
        </linearGradient>
        <linearGradient id="t-mountain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a7a5a" />
          <stop offset="100%" stopColor="#4a5a3a" />
        </linearGradient>
        <linearGradient id="t-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a5ab0" />
          <stop offset="50%" stopColor="#2068c0" />
          <stop offset="100%" stopColor="#1a4a90" />
        </linearGradient>
        <linearGradient id="t-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a5a60" />
          <stop offset="100%" stopColor="#3a3a42" />
        </linearGradient>
        <linearGradient id="t-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c4033" />
          <stop offset="100%" stopColor="#3a2820" />
        </linearGradient>
        <linearGradient id="t-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a03535" />
          <stop offset="100%" stopColor="#6a2020" />
        </linearGradient>
        <radialGradient id="t-torch" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffaa33" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#ff8800" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="t-peak-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a0a098" />
          <stop offset="100%" stopColor="#707068" />
        </linearGradient>
        <linearGradient id="t-peak-dark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#707068" />
          <stop offset="100%" stopColor="#585850" />
        </linearGradient>
      </defs>
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
    case 'plain': return <PlainTerrain />;
    case 'forest': return <ForestTerrain />;
    case 'mountain': return <MountainTerrain />;
    case 'water': return <WaterTerrain />;
    case 'wall': return <WallTerrain />;
    case 'fort': return <FortTerrain />;
    case 'village': return <VillageTerrain />;
    case 'throne': return <ThroneTerrain />;
    case 'glitched': return <GlitchedTerrain />;
    case 'data_void': return <DataVoidTerrain />;
    case 'corrupted_fort': return <CorruptedFortTerrain />;
    case 'broken_throne': return <BrokenThroneTerrain />;
    case 'memory': return <MemoryTerrain />;
    default: return <rect width="48" height="48" fill="url(#t-grass)" />;
  }
}

/* ================================================================
   TERRAIN SPRITES — rich atmospheric style
   ================================================================ */

function PlainTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-grass)" />
      {/* Grass texture patches */}
      <ellipse cx="12" cy="36" rx="10" ry="5" fill="#4a8830" opacity="0.5" />
      <ellipse cx="36" cy="10" rx="8" ry="4" fill="#5a9e3a" opacity="0.4" />
      <ellipse cx="28" cy="28" rx="6" ry="3" fill="#3d7528" opacity="0.3" />
      {/* Dense grass clusters — bottom left */}
      <line x1="6" y1="40" x2="9" y2="34" stroke="#3a7025" strokeWidth="1.5" />
      <line x1="8" y1="40" x2="12" y2="33" stroke="#3a7025" strokeWidth="1.5" />
      <line x1="10" y1="41" x2="13" y2="36" stroke="#4a8530" strokeWidth="1.2" />
      <line x1="7" y1="39" x2="10" y2="35" stroke="#4a8530" strokeWidth="1" />
      {/* Grass cluster — mid right */}
      <line x1="32" y1="20" x2="35" y2="14" stroke="#3a7025" strokeWidth="1.5" />
      <line x1="34" y1="20" x2="37" y2="13" stroke="#3a7025" strokeWidth="1.3" />
      <line x1="36" y1="21" x2="38" y2="16" stroke="#4a8530" strokeWidth="1" />
      {/* Grass — center */}
      <line x1="20" y1="28" x2="22" y2="24" stroke="#4a8530" strokeWidth="1" />
      <line x1="22" y1="29" x2="24" y2="25" stroke="#4a8530" strokeWidth="1" />
      {/* Small wildflowers */}
      <circle cx="16" cy="30" r="1.2" fill="#d4c44d" opacity="0.7" />
      <circle cx="38" cy="38" r="1" fill="#e0d8c0" opacity="0.6" />
      <circle cx="8" cy="14" r="1" fill="#8a7aca" opacity="0.5" />
      {/* Pebbles / earth details */}
      <circle cx="30" cy="32" r="1" fill="#7a7a60" opacity="0.25" />
      <circle cx="42" cy="42" r="0.7" fill="#6a6a50" opacity="0.2" />
      {/* Subtle edge shadow for tile depth */}
      <rect x="0" y="46" width="48" height="2" fill="rgba(0,0,0,0.12)" />
      <rect x="46" y="0" width="2" height="48" fill="rgba(0,0,0,0.06)" />
    </>
  );
}

function ForestTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-forest-floor)" />
      {/* Ground details — moss & leaf litter */}
      <ellipse cx="12" cy="44" rx="8" ry="2.5" fill="#2a4e1a" opacity="0.6" />
      <ellipse cx="36" cy="43" rx="6" ry="2" fill="#1e3a12" opacity="0.5" />
      <circle cx="20" cy="44" r="1" fill="#6a5020" opacity="0.4" />
      <circle cx="40" cy="42" r="0.8" fill="#7a6030" opacity="0.3" />
      {/* Tree trunks — bark detail */}
      <rect x="10" y="26" width="6" height="16" rx="1" fill="#3a2415" />
      <line x1="12" y1="28" x2="12" y2="40" stroke="#2a1a0e" strokeWidth="0.7" opacity="0.6" />
      <line x1="14" y1="29" x2="14" y2="39" stroke="#4a3020" strokeWidth="0.5" opacity="0.4" />
      <rect x="32" y="28" width="5" height="14" rx="1" fill="#2e1c10" />
      <line x1="34" y1="30" x2="34" y2="41" stroke="#1e120a" strokeWidth="0.6" opacity="0.5" />
      {/* Back canopy — dark base layer */}
      <ellipse cx="24" cy="12" rx="24" ry="11" fill="#14380a" />
      {/* Mid canopy layers */}
      <ellipse cx="12" cy="16" rx="14" ry="11" fill="#1e4e10" />
      <ellipse cx="38" cy="18" rx="12" ry="10" fill="#1a4a0e" />
      {/* Front canopy — light catching */}
      <ellipse cx="14" cy="12" rx="12" ry="9" fill="#286820" />
      <ellipse cx="36" cy="14" rx="10" ry="8" fill="#2a7222" />
      {/* Highlight edges — sunlight */}
      <ellipse cx="10" cy="8" rx="6" ry="4" fill="#3a8a2a" opacity="0.5" />
      <ellipse cx="38" cy="10" rx="5" ry="3" fill="#3a8a2a" opacity="0.4" />
      {/* Filtered light spots */}
      <circle cx="22" cy="22" r="2.5" fill="#5a9a3a" opacity="0.2" />
      <circle cx="40" cy="14" r="1.5" fill="#5a9a3a" opacity="0.15" />
      <circle cx="6" cy="10" r="1.2" fill="#6aaa48" opacity="0.12" />
      {/* Deep shadows under trees */}
      <ellipse cx="13" cy="42" rx="10" ry="3" fill="rgba(0,0,0,0.25)" />
      <ellipse cx="34" cy="42" rx="8" ry="2.5" fill="rgba(0,0,0,0.2)" />
      {/* Edge depth */}
      <rect x="0" y="46" width="48" height="2" fill="rgba(0,0,0,0.15)" />
    </>
  );
}

function MountainTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-mountain)" />
      {/* Main peak — lit side */}
      <polygon points="24,2 4,40 24,40" fill="url(#t-peak-light)" />
      {/* Main peak — shadow side */}
      <polygon points="24,2 24,40 44,40" fill="url(#t-peak-dark)" />
      {/* Rock texture lines */}
      <line x1="12" y1="24" x2="36" y2="24" stroke="#5a5a52" strokeWidth="0.6" opacity="0.4" />
      <line x1="9" y1="30" x2="39" y2="30" stroke="#5a5a52" strokeWidth="0.5" opacity="0.3" />
      <line x1="16" y1="18" x2="32" y2="18" stroke="#7a7a72" strokeWidth="0.4" opacity="0.3" />
      {/* Snow cap with shadow */}
      <polygon points="24,2 17,16 31,16" fill="#dcdcd4" />
      <polygon points="24,2 24,16 31,16" fill="#c0c0b8" />
      {/* Snow highlights */}
      <polygon points="22,6 20,12 24,12" fill="#f0f0ea" opacity="0.6" />
      {/* Small peak */}
      <polygon points="8,24 0,44 16,44" fill="#7a7a6e" />
      <polygon points="8,24 8,44 16,44" fill="#5a5a54" />
      {/* Boulders */}
      <ellipse cx="36" cy="44" rx="6" ry="3" fill="#6a6a60" />
      <ellipse cx="36" cy="43" rx="5" ry="2" fill="#7a7a70" opacity="0.6" />
      <ellipse cx="44" cy="45" rx="3.5" ry="2" fill="#5a5a54" />
      <ellipse cx="28" cy="46" rx="4" ry="2" fill="#585850" />
      {/* Scrub vegetation */}
      <ellipse cx="40" cy="38" rx="4" ry="2.5" fill="#3a5a28" />
      <ellipse cx="4" cy="42" rx="3" ry="2" fill="#2e4e20" />
      {/* Atmosphere — base haze */}
      <rect x="0" y="38" width="48" height="10" fill="rgba(140,160,140,0.1)" />
      {/* Edge depth */}
      <rect x="0" y="46" width="48" height="2" fill="rgba(0,0,0,0.12)" />
    </>
  );
}

function WaterTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-water)" />
      {/* Depth layering */}
      <rect x="3" y="3" width="42" height="42" fill="#2468b8" rx="4" opacity="0.5" />
      {/* Wave patterns — layered */}
      <path d="M0,10 Q8,6 16,10 Q24,14 32,10 Q40,6 48,10" fill="none" stroke="#4a8ad0" strokeWidth="1.5" opacity="0.7" />
      <path d="M0,18 Q10,14 20,18 Q30,22 40,18 Q48,14 48,18" fill="none" stroke="#4a8ad0" strokeWidth="1.8" opacity="0.6" />
      <path d="M0,26 Q8,22 16,26 Q24,30 32,26 Q40,22 48,26" fill="none" stroke="#5098d8" strokeWidth="2" opacity="0.5" />
      <path d="M0,34 Q10,30 20,34 Q30,38 40,34 Q48,30 48,34" fill="none" stroke="#4a8ad0" strokeWidth="1.5" opacity="0.4" />
      <path d="M0,42 Q8,39 16,42 Q24,45 32,42 Q40,39 48,42" fill="none" stroke="#5898d0" strokeWidth="1.2" opacity="0.3" />
      {/* Foam highlights */}
      <circle cx="10" cy="20" r="1.2" fill="rgba(255,255,255,0.3)" />
      <circle cx="38" cy="12" r="0.9" fill="rgba(255,255,255,0.25)" />
      <circle cx="24" cy="36" r="0.8" fill="rgba(255,255,255,0.2)" />
      <circle cx="30" cy="24" r="0.6" fill="rgba(255,255,255,0.2)" />
      {/* Reflection streaks */}
      <ellipse cx="14" cy="8" rx="5" ry="1.5" fill="rgba(255,255,255,0.15)" />
      <ellipse cx="36" cy="30" rx="3" ry="1" fill="rgba(255,255,255,0.1)" />
      {/* Deep shadow at bottom */}
      <rect x="0" y="44" width="48" height="4" fill="rgba(0,0,20,0.15)" />
    </>
  );
}

function WallTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-wall)" />
      {/* Brick rows */}
      <rect x="0" y="0" width="24" height="12" fill="#5a3828" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="24" y="0" width="24" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="12" y="12" width="24" height="12" fill="#5a3828" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="0" y="12" width="12" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="36" y="12" width="12" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="0" y="24" width="24" height="12" fill="#5a3828" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="24" y="24" width="24" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="12" y="36" width="24" height="12" fill="#5a3828" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="0" y="36" width="12" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      <rect x="36" y="36" width="12" height="12" fill="#4e3020" stroke="#2a1810" strokeWidth="0.8" />
      {/* Brick texture variation */}
      <rect x="2" y="2" width="20" height="8" fill="rgba(255,255,255,0.04)" rx="1" />
      <rect x="14" y="14" width="20" height="8" fill="rgba(255,255,255,0.03)" rx="1" />
      {/* Moss and weathering */}
      <rect x="0" y="38" width="14" height="8" fill="#2a4a1e" opacity="0.3" rx="2" />
      <rect x="34" y="40" width="12" height="6" fill="#2a4a1e" opacity="0.2" rx="2" />
      {/* Crack detail */}
      <path d="M28,6 L30,10 L28,14" fill="none" stroke="#1a100a" strokeWidth="0.5" opacity="0.4" />
      <path d="M8,26 L10,30 L8,34" fill="none" stroke="#1a100a" strokeWidth="0.5" opacity="0.3" />
      {/* Edge shadow */}
      <rect x="0" y="46" width="48" height="2" fill="rgba(0,0,0,0.2)" />
    </>
  );
}

function FortTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-grass)" />
      {/* Fort base — stone with gradient */}
      <rect x="6" y="20" width="36" height="24" fill="url(#t-stone)" stroke="#2a2a30" strokeWidth="1" />
      {/* Stone texture */}
      <line x1="6" y1="30" x2="42" y2="30" stroke="#4a4a52" strokeWidth="0.5" opacity="0.4" />
      <line x1="6" y1="36" x2="42" y2="36" stroke="#4a4a52" strokeWidth="0.5" opacity="0.3" />
      {/* Battlements */}
      <rect x="6" y="16" width="9" height="6" fill="#5a5a60" stroke="#2a2a30" strokeWidth="0.8" />
      <rect x="19" y="16" width="10" height="6" fill="#4e4e56" stroke="#2a2a30" strokeWidth="0.8" />
      <rect x="33" y="16" width="9" height="6" fill="#5a5a60" stroke="#2a2a30" strokeWidth="0.8" />
      {/* Arrow slits */}
      <rect x="10" y="25" width="1.5" height="4" fill="#1a1a20" rx="0.3" />
      <rect x="36" y="25" width="1.5" height="4" fill="#1a1a20" rx="0.3" />
      {/* Arched door */}
      <rect x="18" y="32" width="12" height="12" fill="#3a2a1e" rx="6" />
      <rect x="20" y="34" width="8" height="10" fill="#2a1a10" rx="4" />
      {/* Torch glow — warm */}
      <circle cx="16" cy="28" r="4" fill="url(#t-torch)" />
      <circle cx="32" cy="28" r="4" fill="url(#t-torch)" />
      <circle cx="16" cy="28" r="1" fill="#ffcc44" opacity="0.6" />
      <circle cx="32" cy="28" r="1" fill="#ffcc44" opacity="0.6" />
      {/* Flag pole + banner */}
      <line x1="24" y1="2" x2="24" y2="16" stroke="#4a4a50" strokeWidth="1.5" />
      <polygon points="24,3 34,6 32,8 36,11 24,14" fill="#a03030" />
      <polygon points="32,8 36,11 34,10" fill="#7a2020" />
      {/* Fort shadow on ground */}
      <ellipse cx="24" cy="46" rx="18" ry="2" fill="rgba(0,0,0,0.15)" />
    </>
  );
}

function VillageTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="url(#t-grass)" />
      {/* House shadow */}
      <ellipse cx="26" cy="44" rx="16" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* House body — warm wood */}
      <rect x="10" y="24" width="28" height="18" fill="#c89a68" stroke="#8a6a40" strokeWidth="1" />
      {/* Wood grain detail */}
      <line x1="10" y1="30" x2="38" y2="30" stroke="#b08a58" strokeWidth="0.5" opacity="0.3" />
      <line x1="10" y1="36" x2="38" y2="36" stroke="#b08a58" strokeWidth="0.5" opacity="0.3" />
      {/* Roof */}
      <polygon points="7,24 24,8 41,24" fill="url(#t-roof)" />
      <polygon points="24,8 41,24 24,24" fill="#5a1818" />
      {/* Chimney */}
      <rect x="32" y="6" width="4" height="10" fill="#6a4a30" stroke="#4a3020" strokeWidth="0.5" />
      <path d="M34,6 Q33,2 35,0" stroke="#999" strokeWidth="0.8" fill="none" opacity="0.25" />
      <path d="M34,4 Q35,1 33,-1" stroke="#aaa" strokeWidth="0.5" fill="none" opacity="0.15" />
      {/* Door */}
      <rect x="20" y="32" width="8" height="10" fill="#4a2a14" rx="1" />
      <circle cx="26" cy="37" r="0.7" fill="#c89a68" />
      {/* Window — left */}
      <rect x="13" y="28" width="5" height="5" fill="#6abadd" stroke="#8a6a40" strokeWidth="0.5" />
      <line x1="15.5" y1="28" x2="15.5" y2="33" stroke="#8a6a40" strokeWidth="0.4" />
      <line x1="13" y1="30.5" x2="18" y2="30.5" stroke="#8a6a40" strokeWidth="0.4" />
      {/* Window glow */}
      <rect x="13.5" y="28.5" width="2" height="2" fill="#aaddff" opacity="0.3" />
      {/* Flower box */}
      <rect x="13" y="33" width="5" height="1.5" fill="#4a2a14" rx="0.3" />
      <circle cx="14.5" cy="32.5" r="1" fill="#d04040" />
      <circle cx="16.5" cy="32.5" r="1" fill="#d0c040" />
      {/* Window — right */}
      <rect x="30" y="28" width="5" height="5" fill="#6abadd" stroke="#8a6a40" strokeWidth="0.5" />
      <line x1="32.5" y1="28" x2="32.5" y2="33" stroke="#8a6a40" strokeWidth="0.4" />
      <line x1="30" y1="30.5" x2="35" y2="30.5" stroke="#8a6a40" strokeWidth="0.4" />
      {/* Stone path */}
      <ellipse cx="24" cy="44" rx="4" ry="2" fill="#a08a60" opacity="0.5" />
      <ellipse cx="24" cy="46" rx="3" ry="1.5" fill="#9a8458" opacity="0.4" />
      {/* Small fence */}
      <line x1="3" y1="38" x2="10" y2="38" stroke="#8a6a40" strokeWidth="1" />
      <line x1="4" y1="36" x2="4" y2="40" stroke="#8a6a40" strokeWidth="0.8" />
      <line x1="8" y1="36" x2="8" y2="40" stroke="#8a6a40" strokeWidth="0.8" />
    </>
  );
}

function ThroneTerrain() {
  return (
    <>
      {/* Dark stone floor */}
      <rect width="48" height="48" fill="#3a3a44" />
      {/* Floor tile pattern */}
      <rect x="0" y="0" width="24" height="24" fill="#343440" stroke="#2a2a34" strokeWidth="0.5" />
      <rect x="24" y="24" width="24" height="24" fill="#343440" stroke="#2a2a34" strokeWidth="0.5" />
      <rect x="24" y="0" width="24" height="24" fill="#303038" stroke="#2a2a34" strokeWidth="0.5" />
      <rect x="0" y="24" width="24" height="24" fill="#303038" stroke="#2a2a34" strokeWidth="0.5" />
      {/* Red carpet */}
      <rect x="10" y="34" width="28" height="14" fill="#5a1414" rx="1" />
      <rect x="12" y="35" width="24" height="13" fill="#7a1c1c" rx="0.5" />
      {/* Carpet pattern border */}
      <rect x="12" y="35" width="24" height="1" fill="#9a2c2c" opacity="0.5" />
      {/* Steps */}
      <rect x="12" y="38" width="24" height="3" fill="#3a3a44" stroke="#2a2a34" strokeWidth="0.3" />
      <rect x="14" y="34" width="20" height="3" fill="#343440" stroke="#2a2a34" strokeWidth="0.3" />
      {/* Banner behind throne */}
      <rect x="19" y="1" width="10" height="6" fill="#7a1818" rx="1" />
      <rect x="20" y="2" width="8" height="4" fill="#8a2020" rx="0.5" />
      <line x1="24" y1="2" x2="24" y2="6" stroke="#fbbf24" strokeWidth="0.4" opacity="0.5" />
      {/* Throne — golden frame */}
      <rect x="17" y="14" width="14" height="20" fill="#a07a22" rx="2" stroke="#7a5a18" strokeWidth="0.8" />
      {/* Throne back */}
      <rect x="18" y="6" width="12" height="12" fill="#b8922e" rx="2" />
      <rect x="20" y="4" width="8" height="4" fill="#c4a035" rx="2" />
      {/* Throne emblem */}
      <circle cx="24" cy="10" r="2.5" fill="#d4a537" stroke="#8a6a18" strokeWidth="0.4" />
      <circle cx="24" cy="10" r="1.2" fill="#fbbf24" opacity="0.6" />
      {/* Crown ornament */}
      <polygon points="22,3 24,-1 26,3" fill="#fbbf24" stroke="#d4a030" strokeWidth="0.3" />
      {/* Cushion */}
      <rect x="19" y="24" width="10" height="6" fill="#8a1818" rx="1" />
      <rect x="19" y="24" width="10" height="3" fill="#a82020" rx="1" />
      {/* Armrests */}
      <rect x="15" y="18" width="3" height="12" fill="#a07a22" rx="1" />
      <rect x="30" y="18" width="3" height="12" fill="#a07a22" rx="1" />
      {/* Torch glow */}
      <circle cx="5" cy="16" r="4" fill="url(#t-torch)" />
      <circle cx="43" cy="16" r="4" fill="url(#t-torch)" />
      <circle cx="5" cy="16" r="1" fill="#ffcc44" opacity="0.5" />
      <circle cx="43" cy="16" r="1" fill="#ffcc44" opacity="0.5" />
    </>
  );
}

/* ================================================================
   SPECIAL / LATE-GAME TERRAINS
   ================================================================ */

function GlitchedTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#0e0e1e" />
      <rect x="0" y="8" width="48" height="2" fill="#a855f7" opacity="0.4" />
      <rect x="0" y="20" width="48" height="1" fill="#ef4444" opacity="0.3" />
      <rect x="0" y="32" width="48" height="2" fill="#22c55e" opacity="0.3" />
      <rect x="0" y="42" width="48" height="1" fill="#3b82f6" opacity="0.4" />
      <rect x="5" y="12" width="10" height="4" fill="#a855f7" opacity="0.5" />
      <rect x="28" y="24" width="14" height="3" fill="#ef4444" opacity="0.4" />
      <rect x="12" y="36" width="8" height="3" fill="#22c55e" opacity="0.4" />
      <rect x="0" y="0" width="48" height="48" fill="url(#glitch-scan)" opacity="0.15" />
      <defs>
        <pattern id="glitch-scan" width="48" height="4" patternUnits="userSpaceOnUse">
          <rect width="48" height="2" fill="#fff" />
        </pattern>
      </defs>
    </>
  );
}

function DataVoidTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#06060c" />
      <rect x="2" y="2" width="44" height="44" fill="#030308" rx="2" />
      <text x="6" y="16" fontSize="6" fill="#a855f7" opacity="0.2" fontFamily="monospace">01</text>
      <text x="28" y="28" fontSize="6" fill="#a855f7" opacity="0.15" fontFamily="monospace">10</text>
      <text x="14" y="40" fontSize="6" fill="#a855f7" opacity="0.1" fontFamily="monospace">00</text>
      <circle cx="24" cy="24" r="10" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.2" />
      <circle cx="24" cy="24" r="5" fill="none" stroke="#a855f7" strokeWidth="0.5" opacity="0.3" />
      <circle cx="24" cy="24" r="2" fill="#a855f7" opacity="0.08" />
    </>
  );
}

function CorruptedFortTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#1e1438" />
      <rect x="6" y="20" width="36" height="24" fill="#4a3a6a" stroke="#2a1a4a" strokeWidth="1" />
      <rect x="6" y="16" width="9" height="6" fill="#4a3a6a" stroke="#2a1a4a" strokeWidth="0.8" />
      <rect x="19" y="16" width="10" height="6" fill="#4a3a6a" stroke="#2a1a4a" strokeWidth="0.8" />
      <rect x="33" y="16" width="9" height="6" fill="#4a3a6a" stroke="#2a1a4a" strokeWidth="0.8" />
      <rect x="18" y="32" width="12" height="12" fill="#0e0a1e" rx="6" />
      {/* Corruption veins */}
      <line x1="8" y1="22" x2="18" y2="30" stroke="#a855f7" strokeWidth="1.2" opacity="0.6" />
      <line x1="30" y1="18" x2="38" y2="32" stroke="#a855f7" strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="16" x2="26" y2="28" stroke="#a855f7" strokeWidth="0.8" opacity="0.4" />
      <line x1="14" y1="34" x2="20" y2="40" stroke="#a855f7" strokeWidth="0.6" opacity="0.3" />
      {/* Purple glow */}
      <circle cx="24" cy="30" r="8" fill="#a855f7" opacity="0.06" />
    </>
  );
}

function BrokenThroneTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#2e2840" />
      <rect x="0" y="0" width="24" height="24" fill="#282238" stroke="#1e1830" strokeWidth="0.5" />
      <rect x="24" y="24" width="24" height="24" fill="#282238" stroke="#1e1830" strokeWidth="0.5" />
      <rect x="12" y="38" width="24" height="4" fill="#1e1830" />
      {/* Broken throne */}
      <rect x="17" y="18" width="14" height="16" fill="#6a5a22" rx="2" />
      <rect x="18" y="10" width="12" height="10" fill="#6a5a22" rx="2" />
      {/* Cracks */}
      <path d="M20,12 L23,18 L22,24" fill="none" stroke="#0e0e18" strokeWidth="1.5" />
      <path d="M28,14 L25,22 L26,30" fill="none" stroke="#0e0e18" strokeWidth="1" />
      <path d="M18,20 L22,22" fill="none" stroke="#0e0e18" strokeWidth="0.8" />
      {/* Purple corruption glow */}
      <circle cx="24" cy="20" r="14" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.25" />
      <circle cx="24" cy="20" r="7" fill="#a855f7" opacity="0.08" />
    </>
  );
}

function MemoryTerrain() {
  return (
    <>
      <rect width="48" height="48" fill="#1e1a16" />
      {/* Warm golden glow */}
      <circle cx="24" cy="24" r="22" fill="#fbbf24" opacity="0.06" />
      <circle cx="24" cy="24" r="14" fill="#fbbf24" opacity="0.08" />
      <circle cx="24" cy="24" r="6" fill="#fbbf24" opacity="0.1" />
      {/* Memory fragment lines */}
      <line x1="6" y1="14" x2="18" y2="14" stroke="#fbbf24" strokeWidth="1" opacity="0.25" />
      <line x1="28" y1="22" x2="42" y2="22" stroke="#fbbf24" strokeWidth="1" opacity="0.2" />
      <line x1="10" y1="34" x2="24" y2="34" stroke="#fbbf24" strokeWidth="1" opacity="0.25" />
      <line x1="32" y1="40" x2="40" y2="40" stroke="#fbbf24" strokeWidth="0.8" opacity="0.15" />
      {/* Floating particles */}
      <circle cx="14" cy="20" r="1.5" fill="#fbbf24" opacity="0.35" />
      <circle cx="36" cy="30" r="1.2" fill="#fbbf24" opacity="0.3" />
      <circle cx="24" cy="10" r="1" fill="#fbbf24" opacity="0.3" />
      <circle cx="40" cy="42" r="0.8" fill="#fbbf24" opacity="0.2" />
      <circle cx="8" cy="38" r="0.7" fill="#fbbf24" opacity="0.2" />
    </>
  );
}
