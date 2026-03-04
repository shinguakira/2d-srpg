import type { Unit } from '../../core/types';
import { CLASSES } from '../../data/classes';
import { getTerrainData } from '../../core/terrain';
import { useGameStore } from '../../stores/gameStore';

export function UnitStatsPanel() {
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const hoveredTile = useGameStore((s) => s.hoveredTile);
  const units = useGameStore((s) => s.units);
  const getUnitAt = useGameStore((s) => s.getUnitAt);
  const getTileAt = useGameStore((s) => s.getTileAt);

  // Show selected unit, or hovered unit
  let unit: Unit | undefined;
  if (selectedUnitId) {
    unit = units.get(selectedUnitId);
  } else if (hoveredTile) {
    unit = getUnitAt(hoveredTile);
  }

  // Show terrain info for hovered tile
  const tile = hoveredTile ? getTileAt(hoveredTile) : null;
  const terrainInfo = tile ? getTerrainData(tile.terrain) : null;

  return (
    <div className="unit-stats-panel" data-testid="unit-stats-panel">
      {unit && (
        <div className="unit-stats-panel__unit" data-testid="unit-info">
          <div className="unit-stats-panel__name">{unit.name}</div>
          <div className="unit-stats-panel__class">
            {CLASSES[unit.classId]?.name ?? unit.classId} Lv.{unit.level}
          </div>
          <div className="unit-stats-panel__hp">
            HP: {unit.currentHp}/{unit.stats.hp}
          </div>
          <div className="unit-stats-panel__stats">
            <span>STR {unit.stats.str}</span>
            <span>MAG {unit.stats.mag}</span>
            <span>DEF {unit.stats.def}</span>
            <span>RES {unit.stats.res}</span>
            <span>SPD {unit.stats.spd}</span>
            <span>SKL {unit.stats.skl}</span>
            <span>LCK {unit.stats.lck}</span>
            <span>MOV {unit.stats.mov}</span>
          </div>
          <div className="unit-stats-panel__weapon">
            {unit.equippedWeapon.name} (Mt {unit.equippedWeapon.might})
          </div>
        </div>
      )}

      {terrainInfo && (
        <div className="unit-stats-panel__terrain" data-testid="terrain-info">
          <div className="unit-stats-panel__terrain-name">{terrainInfo.name}</div>
          <div>DEF +{terrainInfo.defenseBonus}</div>
          <div>AVO +{terrainInfo.avoidBonus}</div>
        </div>
      )}

      {!unit && !terrainInfo && (
        <div className="unit-stats-panel__empty">
          Hover a tile or select a unit
        </div>
      )}
    </div>
  );
}
