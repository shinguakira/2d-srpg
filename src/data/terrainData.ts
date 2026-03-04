import type { TerrainType } from '../core/types';

/** CSS colors for terrain tiles (used as fallback when no sprites loaded) */
export const TERRAIN_COLORS: Record<TerrainType, string> = {
  plain:    '#7ec850',
  forest:   '#3a7d28',
  mountain: '#8b8b8b',
  water:    '#4a90d9',
  wall:     '#5c4033',
  fort:     '#a0a0a0',
  village:  '#d4a574',
};

/** Display label for terrain info panel */
export const TERRAIN_LABELS: Record<TerrainType, string> = {
  plain:    'Plain',
  forest:   'Forest',
  mountain: 'Mountain',
  water:    'Water',
  wall:     'Wall',
  fort:     'Fort',
  village:  'Village',
};
