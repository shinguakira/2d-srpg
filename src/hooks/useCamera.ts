import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '../stores/uiStore';
import { useGameStore } from '../stores/gameStore';

const EDGE_ZONE = 40; // pixels from screen edge to trigger scroll
const PAN_SPEED = 6;  // pixels per frame

export function useCamera(viewportRef: React.RefObject<HTMLDivElement | null>) {
  const panCamera = useUIStore((s) => s.panCamera);
  const clampCamera = useUIStore((s) => s.clampCamera);
  const tileSize = useUIStore((s) => s.tileSize);
  const gameMap = useGameStore((s) => s.gameMap);

  const mousePos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number>(0);

  // Track mouse position
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || gameMap.width === 0) return;

    window.addEventListener('mousemove', handleMouseMove);

    function tick() {
      const vp = viewportRef.current;
      if (!vp) return;

      const vpRect = vp.getBoundingClientRect();
      let dx = 0;
      let dy = 0;

      // Edge-scroll: trigger when mouse is near viewport edges OR window edges
      const mx = mousePos.current.x;
      const my = mousePos.current.y;
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      // Check viewport-relative edges
      const inViewport = mx >= vpRect.left && mx <= vpRect.right && my >= vpRect.top && my <= vpRect.bottom;
      if (inViewport) {
        if (mx - vpRect.left < EDGE_ZONE) dx += PAN_SPEED;
        if (vpRect.right - mx < EDGE_ZONE) dx -= PAN_SPEED;
        if (my - vpRect.top < EDGE_ZONE) dy += PAN_SPEED;
        if (vpRect.bottom - my < EDGE_ZONE) dy -= PAN_SPEED;
      }

      // Also pan when mouse is at the very edge of the browser window
      if (mx <= 2) dx += PAN_SPEED;
      if (mx >= winW - 3) dx -= PAN_SPEED;
      if (my <= 2) dy += PAN_SPEED;
      if (my >= winH - 3) dy -= PAN_SPEED;

      // Auto-scroll when keyboard cursor is near viewport edge
      const cursor = useUIStore.getState().cursorPosition;
      const kbMode = useUIStore.getState().keyboardMode;
      if (cursor && kbMode) {
        const cursorPixelX = cursor.x * tileSize + tileSize / 2 + useUIStore.getState().cameraOffset.x;
        const cursorPixelY = cursor.y * tileSize + tileSize / 2 + useUIStore.getState().cameraOffset.y;

        if (cursorPixelX < EDGE_ZONE * 2) dx += PAN_SPEED;
        if (cursorPixelX > vpRect.width - EDGE_ZONE * 2) dx -= PAN_SPEED;
        if (cursorPixelY < EDGE_ZONE * 2) dy += PAN_SPEED;
        if (cursorPixelY > vpRect.height - EDGE_ZONE * 2) dy -= PAN_SPEED;
      }

      if (dx !== 0 || dy !== 0) {
        panCamera(dx, dy);
        clampCamera(gameMap.width, gameMap.height, vpRect.width, vpRect.height);
      }

      animFrameId.current = requestAnimationFrame(tick);
    }

    animFrameId.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewportRef, gameMap.width, gameMap.height, tileSize, panCamera, clampCamera, handleMouseMove]);
}
