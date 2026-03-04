import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useUIStore } from '../stores/uiStore';

/**
 * Keyboard controls for the tactical game:
 * - Arrow keys: move cursor across tiles
 * - Enter/Space: confirm (select unit, confirm move, confirm attack)
 * - Escape: cancel / go back
 * - Tab: cycle through available player units
 */
export function useKeyboard() {
  const gameMap = useGameStore((s) => s.gameMap);
  const currentPhase = useGameStore((s) => s.currentPhase);
  const playerAction = useGameStore((s) => s.playerAction);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const units = useGameStore((s) => s.units);
  const clickTile = useGameStore((s) => s.clickTile);
  const cancelAction = useGameStore((s) => s.cancelAction);
  const confirmMove = useGameStore((s) => s.confirmMove);
  const confirmAttack = useGameStore((s) => s.confirmAttack);
  const hoverTile = useGameStore((s) => s.hoverTile);
  const selectUnit = useGameStore((s) => s.selectUnit);
  const endPlayerTurn = useGameStore((s) => s.endPlayerTurn);

  const moveCursor = useUIStore((s) => s.moveCursor);
  const setCursor = useUIStore((s) => s.setCursor);
  const setKeyboardMode = useUIStore((s) => s.setKeyboardMode);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (currentPhase !== 'player_phase') return;
      if (gameMap.width === 0) return;
      if (playerAction === 'village_visit') return;

      // Arrow keys: move cursor
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveCursor(0, -1, gameMap.width, gameMap.height);
        const pos = useUIStore.getState().cursorPosition;
        if (pos) hoverTile(pos);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveCursor(0, 1, gameMap.width, gameMap.height);
        const pos = useUIStore.getState().cursorPosition;
        if (pos) hoverTile(pos);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCursor(-1, 0, gameMap.width, gameMap.height);
        const pos = useUIStore.getState().cursorPosition;
        if (pos) hoverTile(pos);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCursor(1, 0, gameMap.width, gameMap.height);
        const pos = useUIStore.getState().cursorPosition;
        if (pos) hoverTile(pos);
        return;
      }

      // Enter / Space: confirm
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const cursor = useUIStore.getState().cursorPosition;
        if (!cursor) return;

        if (playerAction === 'confirm') {
          confirmAttack();
          return;
        }

        // In idle, move_target, or attack_target — click the tile under cursor
        clickTile(cursor);
        return;
      }

      // Escape: cancel
      if (e.key === 'Escape') {
        e.preventDefault();
        if (playerAction !== 'idle') {
          cancelAction();
        }
        return;
      }

      // Tab: cycle through available player units
      if (e.key === 'Tab') {
        e.preventDefault();
        const available: string[] = [];
        for (const unit of units.values()) {
          if (unit.faction === 'player' && !unit.hasActed) {
            available.push(unit.id);
          }
        }
        if (available.length === 0) return;

        // Find current index and go to next
        const currentIdx = selectedUnitId ? available.indexOf(selectedUnitId) : -1;
        const nextIdx = (currentIdx + 1) % available.length;
        const nextUnit = units.get(available[nextIdx]);
        if (nextUnit) {
          setCursor(nextUnit.position);
          setKeyboardMode(true);
          hoverTile(nextUnit.position);
          selectUnit(nextUnit.id);
        }
        return;
      }

      // E: end turn shortcut
      if (e.key === 'e' || e.key === 'E') {
        if (playerAction === 'idle') {
          endPlayerTurn();
        }
        return;
      }
    },
    [
      currentPhase,
      gameMap.width,
      gameMap.height,
      playerAction,
      selectedUnitId,
      units,
      moveCursor,
      setCursor,
      setKeyboardMode,
      hoverTile,
      clickTile,
      cancelAction,
      confirmMove,
      confirmAttack,
      selectUnit,
      endPlayerTurn,
    ]
  );

  // Disable keyboard mode on mouse movement
  const handleMouseMove = useCallback(() => {
    const { keyboardMode } = useUIStore.getState();
    if (keyboardMode) {
      setKeyboardMode(false);
    }
  }, [setKeyboardMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleKeyDown, handleMouseMove]);
}
