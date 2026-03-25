# Minimap for Large Maps

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/components/UI/Minimap.tsx` (new), `src/components/Game.tsx`, `src/styles/ui/minimap.css` (new), `src/stores/uiStore.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

On larger maps (15x15+), camera panning makes it easy to lose track of the battlefield. A small overview minimap helps with strategic planning and locating units. Standard in any tactical game with scrolling maps.

## Current Behavior

- No minimap exists
- Camera panning via edge scroll or keyboard — player loses positional awareness on large maps
- Must scroll around to find remaining units
- Tab key cycles through units but doesn't show the big picture

## Expected Behavior

### Minimap Component

Small semi-transparent panel in bottom-left corner:

- Renders entire map at ~3px per tile (e.g. 15x15 map = 45x45px minimap)
- Player units as blue dots, enemies as red dots, allies as green dots, neutral as gray
- Current viewport shown as a white rectangle outline
- Boss unit shown as larger dot with gold border
- Click on minimap to center camera on that position

### Visibility

- Only visible for maps larger than 12x12 (small maps don't need it)
- Semi-transparent background (rgba(0,0,0,0.5))
- Collapsible with a small toggle button

## Steps to Fix

- [x] Create `src/components/UI/Minimap.tsx` component
- [x] Read map dimensions and unit positions from `gameStore`
- [x] Render CSS Grid or SVG with 3px tiles, colored by terrain type (simplified: green/brown/blue/gray)
- [x] Render unit dots with faction colors
- [x] Draw viewport rectangle using `cameraOffset` and viewport size from `uiStore`
- [x] Handle click: compute map position from minimap coordinates, update `cameraOffset`
- [x] Only render when `gameMap.width > 12 || gameMap.height > 12`
- [x] Create `src/styles/ui/minimap.css` with positioning and transparency
- [x] Add `Minimap` to `Game.tsx` render tree
- [x] `data-testid="minimap"`, `data-testid="minimap-viewport"`
- [x] Test: load large map → minimap visible in bottom-left
- [x] Test: click on minimap edge → camera pans to that area
- [x] Test: load small map (10x10) → minimap not rendered
