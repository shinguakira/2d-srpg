import { useGameStore } from '../../stores/gameStore';
import { getTerrainData } from '../../core/terrain';

const TERRAIN_NAME_COLORS: Record<string, string> = {
  water: 'rgba(255,255,255,0.4)',
  wall: 'rgba(255,255,255,0.4)',
  fort: '#22c55e',
  throne: '#22c55e',
  forest: '#22c55e',
};

export function TerrainInfoPanel() {
  const hoveredTile = useGameStore((s) => s.hoveredTile);
  const getTileAt = useGameStore((s) => s.getTileAt);

  const tile = hoveredTile ? getTileAt(hoveredTile) : null;
  if (!tile) return null;

  const terrain = getTerrainData(tile.terrain);
  const nameColor = TERRAIN_NAME_COLORS[tile.terrain] ?? '#fff';

  return (
    <div
      className="terrain-info-panel"
      data-testid="terrain-info"
      style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 6,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        fontSize: 13,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.1)',
        minWidth: 100,
        zIndex: 10,
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 14, color: nameColor, marginBottom: terrain.defenseBonus > 0 || terrain.avoidBonus > 0 ? 4 : 0 }}>
        {terrain.name}
      </div>
      {terrain.defenseBonus > 0 && (
        <div style={{ fontSize: 12, color: '#3b82f6' }}>
          DEF +{terrain.defenseBonus}
        </div>
      )}
      {terrain.avoidBonus > 0 && (
        <div style={{ fontSize: 12, color: '#22c55e' }}>
          AVO +{terrain.avoidBonus}
        </div>
      )}
    </div>
  );
}
