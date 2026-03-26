import { create } from 'zustand';

export type CameraOffset = {
  x: number;
  y: number;
};

export type CursorPosition = {
  x: number;
  y: number;
} | null;

export type AnimationSpeed = '1x' | '2x' | 'skip';

export type UIState = {
  cameraOffset: CameraOffset;
  tileSize: number;
  cursorPosition: CursorPosition;
  keyboardMode: boolean;
  detailUnitId: string | null;
  animationSpeed: AnimationSpeed;
};

export type UIActions = {
  panCamera: (dx: number, dy: number) => void;
  setCameraOffset: (offset: CameraOffset) => void;
  clampCamera: (mapWidth: number, mapHeight: number, viewportWidth: number, viewportHeight: number) => void;
  computeTileSize: (mapWidth: number, mapHeight: number, viewportWidth: number, viewportHeight: number) => void;
  setCursor: (pos: CursorPosition) => void;
  moveCursor: (dx: number, dy: number, mapWidth: number, mapHeight: number) => void;
  setKeyboardMode: (enabled: boolean) => void;
  setDetailUnitId: (id: string | null) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  cycleAnimationSpeed: () => void;
};

/** Get the duration multiplier for the current animation speed */
export function getSpeedMultiplier(speed: AnimationSpeed): number {
  switch (speed) {
    case '1x': return 1;
    case '2x': return 0.5;
    case 'skip': return 0;
  }
}

/** Get a scaled duration (minimum 16ms for skip to allow React render cycles) */
export function getScaledDuration(baseDuration: number, speed: AnimationSpeed): number {
  const mult = getSpeedMultiplier(speed);
  return mult === 0 ? 16 : Math.max(16, baseDuration * mult);
}

// Load persisted animation speed
const savedSpeed = (typeof localStorage !== 'undefined' && localStorage.getItem('animationSpeed') as AnimationSpeed) || '1x';

export const useUIStore = create<UIState & UIActions>((set, get) => ({
  cameraOffset: { x: 0, y: 0 },
  tileSize: 64,
  cursorPosition: null,
  keyboardMode: false,
  detailUnitId: null,
  animationSpeed: (['1x', '2x', 'skip'].includes(savedSpeed) ? savedSpeed : '1x') as AnimationSpeed,

  panCamera: (dx, dy) => {
    set((state) => ({
      cameraOffset: {
        x: state.cameraOffset.x + dx,
        y: state.cameraOffset.y + dy,
      },
    }));
  },

  setCameraOffset: (offset) => {
    set({ cameraOffset: offset });
  },

  clampCamera: (mapWidth, mapHeight, viewportWidth, viewportHeight) => {
    const { cameraOffset, tileSize } = get();
    const mapPixelWidth = mapWidth * tileSize;
    const mapPixelHeight = mapHeight * tileSize;

    // Camera offset is negative (we translate the map left/up)
    const minX = Math.min(0, -(mapPixelWidth - viewportWidth));
    const minY = Math.min(0, -(mapPixelHeight - viewportHeight));

    set({
      cameraOffset: {
        x: Math.max(minX, Math.min(0, cameraOffset.x)),
        y: Math.max(minY, Math.min(0, cameraOffset.y)),
      },
    });
  },

  computeTileSize: (mapWidth, mapHeight, viewportWidth, viewportHeight) => {
    // Fit entire map: no right gap AND full map visible (both dimensions fit)
    const tileW = viewportWidth / mapWidth;
    const tileH = viewportHeight / mapHeight;
    const size = Math.max(32, Math.min(tileW, tileH));
    set({ tileSize: size });
  },

  setCursor: (pos) => {
    set({ cursorPosition: pos });
  },

  moveCursor: (dx, dy, mapWidth, mapHeight) => {
    const { cursorPosition } = get();
    const current = cursorPosition ?? { x: 0, y: 0 };
    const nx = Math.max(0, Math.min(mapWidth - 1, current.x + dx));
    const ny = Math.max(0, Math.min(mapHeight - 1, current.y + dy));
    set({ cursorPosition: { x: nx, y: ny }, keyboardMode: true });
  },

  setKeyboardMode: (enabled) => {
    set({ keyboardMode: enabled });
  },

  setDetailUnitId: (id) => {
    set({ detailUnitId: id });
  },

  setAnimationSpeed: (speed) => {
    set({ animationSpeed: speed });
    localStorage.setItem('animationSpeed', speed);
  },

  cycleAnimationSpeed: () => {
    const current = get().animationSpeed;
    const next: AnimationSpeed = current === '1x' ? '2x' : current === '2x' ? 'skip' : '1x';
    set({ animationSpeed: next });
    localStorage.setItem('animationSpeed', next);
  },
}));
