/** Shared sprite sheet configuration for battle + map sprites */

export type SheetConfig = {
  url: string;
  idleRow: number;
  attackRow: number;
  hasAlpha: boolean;  // true = RGBA PNG, false = RGB with black bg (needs blend mode)
  /** Per-sheet overrides — if omitted, uses the global defaults below */
  frameW?: number;
  cols?: number;
  sheetW?: number;
  sheetH?: number;
  /** Number of animation rows in the sheet (default 4) */
  rows?: number;
  /** Battle display scale multiplier (default 1). Does NOT affect map sprite. */
  displayScale?: number;
};

/* Default sheet layout: 800×321 px, 10 columns, 80×80 frames */
export const FRAME_W = 80;
export const COLS = 10;
export const SHEET_PX_W = 800;
export const SHEET_PX_H = 321;

/** Resolve per-sheet values with fallback to globals */
export function sheetFrameW(cfg: SheetConfig) { return cfg.frameW ?? FRAME_W; }
export function sheetCols(cfg: SheetConfig) { return cfg.cols ?? COLS; }
export function sheetPxW(cfg: SheetConfig) { return cfg.sheetW ?? SHEET_PX_W; }
export function sheetPxH(cfg: SheetConfig) { return cfg.sheetH ?? SHEET_PX_H; }
export function sheetRows(cfg: SheetConfig) { return cfg.rows ?? 4; }
export function sheetFrameH(cfg: SheetConfig) { return Math.floor(sheetPxH(cfg) / sheetRows(cfg)); }

const GENERIC_SHEET: SheetConfig = {
  url: '/sprites/generic-battle.png', idleRow: 0, attackRow: 2, hasAlpha: false,
};

const BASE_SHEETS: Record<string, SheetConfig> = {
  lord: {
    url: '/sprites/ren-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 192, cols: 8, sheetW: 1536, sheetH: 1024,
  },
  cavalier: {
    url: '/sprites/cavalier-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 220, cols: 9, sheetW: 1980, sheetH: 794, rows: 3,
  },
  mage: {
    url: '/sprites/mage-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 192, cols: 8, sheetW: 1536, sheetH: 1024,
  },
  fighter: {
    url: '/sprites/fighter-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 192, cols: 8, sheetW: 1536, sheetH: 1024,
  },
  soldier: {
    url: '/sprites/soldier-battle.png', idleRow: 0, attackRow: 2,
    hasAlpha: true,
    frameW: 192, cols: 8, sheetW: 1536, sheetH: 1024,
  },
  cleric: { url: '/sprites/cleric-battle.png', idleRow: 0, attackRow: 2, hasAlpha: false },
  generic: GENERIC_SHEET,
};

/** Map any classId (including promoted/master) to its base class */
function resolveBaseClass(classId: string): string {
  switch (classId) {
    case 'lord': case 'great_lord': case 'conqueror': case 'overlord':
      return 'lord';
    case 'cavalier': case 'paladin': case 'great_knight': case 'mage_knight':
    case 'nomad_trooper': case 'valkyrie_cleric': case 'valkyrie_troubadour':
    case 'maid': case 'great_knight_armor': case 'marshal':
      return 'cavalier';
    case 'mage': case 'sage': case 'dark_flier': case 'druid':
    case 'summoner': case 'archsage':
      return 'mage';
    case 'fighter': case 'warrior': case 'berserker': case 'hero':
    case 'war_monk': case 'reaver':
      return 'fighter';
    case 'soldier': case 'general_soldier': case 'halberdier':
    case 'general_knight':
      return 'soldier';
    case 'cleric': case 'bishop': case 'saint': case 'oracle':
      return 'cleric';
    default:
      return 'generic';
  }
}

/** Per-unit overrides — takes priority over class-based lookup */
const UNIT_SHEETS: Record<string, SheetConfig> = {
  lira: {
    url: '/sprites/lira-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 192, cols: 8, sheetW: 1536, sheetH: 1024,
  },
  bram: {
    url: '/sprites/bram-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 156, cols: 8, sheetW: 1247, sheetH: 1024,
  },
  garrek: {
    url: '/sprites/garrek-battle.png', idleRow: 0, attackRow: 1,
    hasAlpha: true,
    frameW: 219, cols: 7, sheetW: 1536, sheetH: 1024, rows: 3,
  },
};

export function getSheetConfig(classId: string, unitId?: string): SheetConfig {
  if (unitId && UNIT_SHEETS[unitId]) return UNIT_SHEETS[unitId];
  return BASE_SHEETS[resolveBaseClass(classId)] ?? GENERIC_SHEET;
}
