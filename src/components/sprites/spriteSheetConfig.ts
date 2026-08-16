/**
 * Sprite sheet definitions.
 *
 * A sheet is one PNG holding a grid of frames. Frames are numbered row-major
 * from 0. An animation is a `Clip` — an explicit list of frame numbers plus a
 * playback rate — NOT "a whole row", because these sheets are AI-generated and
 * a row is not a self-contained loop: later frames in a row dissolve into
 * full-frame VFX with no character in them.
 *
 * Frame size is derived as sheetW/cols and sheetH/rows and is deliberately
 * fractional. Rounding it (e.g. 1536/7 -> 219 instead of 219.43) accumulates
 * into visible horizontal drift by the last column.
 *
 * `content` is the measured bounding box of the artwork inside an idle frame,
 * normalised 0..1. The AI sheets draw characters at wildly different sizes and
 * offsets within their frame, so this is what makes every unit stand on the
 * tile at a consistent size instead of floating or sinking. Re-measure with
 * the debug Sprites view if the art changes.
 */
import cavalierBattle from '../../assets/sprites/cavalier-battle.png';
import mageBattle from '../../assets/sprites/mage-battle.png';
import fighterBattle from '../../assets/sprites/fighter-battle.png';
import soldierBattle from '../../assets/sprites/soldier-battle.png';
import clericBattle from '../../assets/sprites/cleric-battle.png';
import genericBattle from '../../assets/sprites/generic-battle.png';
import pegasusBattle from '../../assets/sprites/pegasus-battle.png';
import garethBattle from '../../assets/sprites/gareth-battle.png';
import hagenBattle from '../../assets/sprites/hagen-battle.png';
import shigeruPx from '../../assets/sprites/shigeru_px-battle.png';
import { GENERATED_SHEETS } from './generatedSheets';

export type Clip = {
  /** Frame numbers, row-major from 0. */
  readonly frames: readonly number[];
  readonly fps: number;
  readonly loop: boolean;
};

/**
 * The Fire Emblem battle-animation set. `idle` and `attack` are mandatory
 * because every sheet has them; the rest are optional so the ten hand-measured
 * sheets keep working, and `getClip` resolves the gaps.
 */
export type ClipName = 'idle' | 'walk' | 'attack' | 'crit' | 'dodge' | 'hit' | 'die';

export const CLIP_NAMES: readonly ClipName[] = [
  'idle',
  'walk',
  'attack',
  'crit',
  'dodge',
  'hit',
  'die',
];

export type SpriteSheet = {
  readonly url: string;
  readonly cols: number;
  readonly rows: number;
  readonly sheetW: number;
  readonly sheetH: number;
  /**
   * True for low-resolution pixel art, which wants nearest-neighbour scaling.
   * The AI-painted sheets are high-resolution and get scaled *down*, where
   * nearest-neighbour just aliases — they want smooth interpolation.
   */
  readonly pixelArt: boolean;
  /** Artwork bounds inside one frame, normalised 0..1. Measured, not guessed. */
  readonly content: {
    /** Horizontal centre of the artwork. 0.5 means the art is frame-centred. */
    readonly cx: number;
    /** Bottom edge of the artwork — the character's feet. */
    readonly bottom: number;
    /** Artwork height as a fraction of frame height. Drives display scale. */
    readonly height: number;
  };
  readonly clips: { readonly idle: Clip; readonly attack: Clip } & Partial<
    Readonly<Record<ClipName, Clip>>
  >;
};

/** `count` consecutive frame numbers starting at `start`. */
function run(start: number, count: number): readonly number[] {
  return Array.from({ length: count }, (_, i) => start + i);
}

const IDLE_FPS = 6;
const ATTACK_FPS = 12;

const idle = (start: number, count: number): Clip => ({
  frames: run(start, count),
  fps: IDLE_FPS,
  loop: true,
});
const attack = (start: number, count: number): Clip => ({
  frames: run(start, count),
  fps: ATTACK_FPS,
  loop: false,
});

const GENERIC_SHEET: SpriteSheet = {
  url: genericBattle,
  cols: 10,
  rows: 4,
  sheetW: 800,
  sheetH: 321,
  pixelArt: true,
  content: { cx: 0.431, bottom: 0.984, height: 0.57 },
  clips: { idle: idle(0, 10), attack: attack(20, 10) },
};

const BASE_SHEETS: Record<string, SpriteSheet> = {
  // Every lord-line class renders as Shigeru. The sheet that used to sit here
  // was a black-clad swordsman with a katana and falling cherry blossom — the
  // one thing `specs/story` rules out outright — and it was the only art for
  // the class.
  lord: GENERATED_SHEETS.shigeru,
  cavalier: {
    url: cavalierBattle,
    cols: 9,
    rows: 3,
    sheetW: 1980,
    sheetH: 794,
    pixelArt: false,
    content: { cx: 0.5, bottom: 1, height: 0.94 },
    clips: { idle: idle(0, 9), attack: attack(10, 7) },
  },
  mage: {
    url: mageBattle,
    cols: 8,
    rows: 4,
    sheetW: 1536,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.5, bottom: 1, height: 0.82 },
    clips: { idle: idle(0, 4), attack: attack(24, 4) },
  },
  fighter: {
    url: fighterBattle,
    cols: 8,
    rows: 4,
    sheetW: 1536,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.5, bottom: 0.824, height: 0.55 },
    // The real axe swing is at 24-27; row 1 is just a second idle stance.
    clips: { idle: idle(0, 8), attack: attack(24, 4) },
  },
  soldier: {
    url: soldierBattle,
    cols: 8,
    rows: 4,
    sheetW: 1536,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.628, bottom: 1, height: 0.92 },
    clips: { idle: idle(0, 8), attack: attack(16, 5) },
  },
  cleric: {
    url: clericBattle,
    cols: 10,
    rows: 4,
    sheetW: 800,
    sheetH: 321,
    pixelArt: true,
    content: { cx: 0.5, bottom: 0.984, height: 0.57 },
    clips: { idle: idle(0, 10), attack: attack(20, 10) },
  },
  pegasus: {
    url: pegasusBattle,
    cols: 8,
    rows: 4,
    sheetW: 1536,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.5, bottom: 1, height: 0.77 },
    clips: { idle: idle(0, 8), attack: attack(12, 4) },
  },
  generic: GENERIC_SHEET,
};

/** Per-unit overrides — take priority over the class lookup. */
const UNIT_SHEETS: Record<string, SpriteSheet> = {
  // The full FE clip set, posed in tools/sprites/poses.mjs and rendered through
  // PixelLab's skeleton animator; `tools/sprites/import.mjs` quantised it and
  // measured the anchor off the pixels. Three frames per clip is not a stylistic
  // choice — that endpoint is a three-frame window and refuses any other count.
  shigeru: {
    url: shigeruPx,
    cols: 21,
    rows: 1,
    sheetW: 2688,
    sheetH: 128,
    // 57px of art in a 128px frame. The frame is that big only to leave room
    // above his head for an overhead swing — the character is unchanged, so
    // this is still low-resolution art and still wants nearest.
    pixelArt: true,
    content: { cx: 0.5234, bottom: 0.8594, height: 0.4453 },
    clips: {
      idle: { frames: [0, 1, 2], fps: 4, loop: true },
      walk: { frames: [3, 4, 5], fps: 8, loop: true },
      attack: { frames: [6, 7, 8], fps: 12, loop: false },
      crit: { frames: [9, 10, 11], fps: 14, loop: false },
      dodge: { frames: [12, 13, 14], fps: 12, loop: false },
      hit: { frames: [15, 16, 17], fps: 12, loop: false },
      die: { frames: [18, 19, 20], fps: 8, loop: false },
    },
  },
  mirelle: BASE_SHEETS.pegasus,
  gareth: {
    url: garethBattle,
    cols: 8,
    rows: 4,
    sheetW: 1247,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.5, bottom: 1, height: 0.85 },
    clips: { idle: idle(0, 8), attack: attack(16, 7) },
  },
  hagen: {
    url: hagenBattle,
    cols: 7,
    rows: 3,
    sheetW: 1536,
    sheetH: 1024,
    pixelArt: false,
    content: { cx: 0.499, bottom: 0.999, height: 0.99 },
    clips: { idle: idle(0, 7), attack: attack(14, 5) },
  },
};

/** Map any classId (including promoted/master) to its base class. */
function resolveBaseClass(classId: string): string {
  switch (classId) {
    case 'lord':
    case 'great_lord':
    case 'conqueror':
    case 'overlord':
      return 'lord';
    case 'cavalier':
    case 'paladin':
    case 'great_knight':
    case 'mage_knight':
    case 'nomad_trooper':
    case 'valkyrie_cleric':
    case 'valkyrie_troubadour':
    case 'troubadour':
    case 'maid':
    case 'great_knight_armor':
    case 'marshal':
      return 'cavalier';
    case 'mage':
    case 'sage':
    case 'dark_flier':
    case 'druid':
    case 'shaman':
    case 'summoner':
    case 'archsage':
      return 'mage';
    case 'fighter':
    case 'warrior':
    case 'berserker':
    case 'hero':
    case 'mercenary':
    case 'war_monk':
    case 'reaver':
      return 'fighter';
    case 'soldier':
    case 'knight':
    case 'general_soldier':
    case 'halberdier':
    case 'general_knight':
      return 'soldier';
    case 'cleric':
    case 'monk':
    case 'bishop':
    case 'saint':
    case 'oracle':
      return 'cleric';
    case 'pegasus_knight':
    case 'falcon_knight':
      return 'pegasus';
    default:
      return 'generic';
  }
}

export function getSheet(classId: string, unitId?: string): SpriteSheet {
  // Hand-placed overrides win over the generated rig art, so a character can be
  // swapped to imported art without deleting its generator entry.
  if (unitId && UNIT_SHEETS[unitId]) return UNIT_SHEETS[unitId];
  if (unitId && GENERATED_SHEETS[unitId]) return GENERATED_SHEETS[unitId];
  return BASE_SHEETS[resolveBaseClass(classId)] ?? GENERIC_SHEET;
}

/** A one-frame clip, used when a sheet has no art for a state. */
function still(frame: number): Clip {
  return { frames: [frame], fps: 1, loop: false };
}

/**
 * The clip to play for `name`, falling back for sheets that do not have it.
 *
 * The ten AI-generated sheets only ever had idle and attack, so asking any of
 * them for a flinch has to resolve to something — a held idle frame reads as
 * "no reaction", which is what those sheets can honestly do.
 */
export function getClip(sheet: SpriteSheet, name: ClipName): Clip {
  const own = sheet.clips[name];
  if (own) return own;
  switch (name) {
    case 'crit':
      return sheet.clips.attack;
    case 'hit':
    case 'die':
      return still(sheet.clips.idle.frames[0]);
    default:
      return sheet.clips.idle;
  }
}

/** True when the sheet actually draws this state rather than falling back. */
export function hasClip(sheet: SpriteSheet, name: ClipName): boolean {
  return sheet.clips[name] != null;
}

/**
 * Every sheet, for the debug viewer. Generated ones first.
 *
 * The same name can appear in more than one registry — `shigeru` is both a rig
 * render and a per-unit override, and which one the game uses is decided by
 * `getSheet`'s priority order. The id carries the registry so the two are
 * distinguishable on screen and so React does not get two children under one
 * key, which it silently resolves by dropping one of them.
 */
export const ALL_SHEETS: ReadonlyArray<{ id: string; sheet: SpriteSheet }> = [
  ...Object.entries(GENERATED_SHEETS).map(([id, sheet]) => ({ id: `${id} (rig)`, sheet })),
  ...Object.entries(BASE_SHEETS).map(([id, sheet]) => ({ id, sheet })),
  ...Object.entries(UNIT_SHEETS).map(([id, sheet]) => ({ id: `${id} (unit)`, sheet })),
];

export type SpriteBox = {
  /** Size of the frame window in CSS px. */
  readonly w: number;
  readonly h: number;
  /** `background-size` for the whole sheet at this scale. */
  readonly bgW: number;
  readonly bgH: number;
  /** Anchor offset inside the frame window — the character's feet, centred. */
  readonly anchorX: number;
  readonly anchorY: number;
};

/**
 * Size a sheet so the *artwork* (not the frame) is `contentPx` tall. Sizing by
 * frame height instead would render a 55%-content sheet far smaller than a
 * 99%-content one.
 */
export function spriteBox(sheet: SpriteSheet, contentPx: number): SpriteBox {
  const frameW = sheet.sheetW / sheet.cols;
  const frameH = sheet.sheetH / sheet.rows;
  const h = contentPx / sheet.content.height;
  const w = h * (frameW / frameH);
  return {
    w,
    h,
    bgW: w * sheet.cols,
    bgH: h * sheet.rows,
    anchorX: sheet.content.cx * w,
    anchorY: sheet.content.bottom * h,
  };
}

/** `background-position` for one frame at the scale described by `box`. */
export function framePosition(sheet: SpriteSheet, box: SpriteBox, frame: number) {
  const col = frame % sheet.cols;
  const row = Math.floor(frame / sheet.cols);
  return { x: -col * box.w, y: -row * box.h };
}
