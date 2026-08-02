# Camera

Camera is a CSS transform offset applied to the map container. State lives in `uiStore`, logic in `useCamera` hook.

## State (uiStore)

Defined in `src/stores/uiStore.ts`:

- `cameraOffset: { x, y }` -- pixel offset of the map (negative values scroll right/down)
- `tileSize: number` -- pixels per tile, default 64
- `cursorPosition: { x, y } | null` -- keyboard cursor tile coordinate
- `keyboardMode: boolean` -- true when arrow keys are active, false on mouse move

## Panning

Hook: `useCamera` (`src/hooks/useCamera.ts`)

Runs a `requestAnimationFrame` loop that checks for edge-scroll triggers every frame.

### Edge Scroll (Mouse)

- Trigger zone: 40px from viewport edges (`EDGE_ZONE = 40`)
- Pan speed: 6px per frame (`PAN_SPEED = 6`)
- Also triggers at extreme window edges (within 2-3px of browser border)
- Only active when mouse is inside viewport bounds

### Keyboard Auto-Pan

- When `keyboardMode` is true and cursor is near viewport edge (within `EDGE_ZONE * 2` = 80px), camera pans to follow
- Keeps the keyboard cursor visible on screen during arrow key navigation

### Clamping

- `clampCamera()` prevents scrolling past map boundaries
- Camera offset is bounded: x in `[-(mapPixelWidth - viewportWidth), 0]`, y similarly
- Called after every pan operation

## Zoom (Zoom-to-Fit)

Function: `computeTileSize(mapWidth, mapHeight, viewportWidth, viewportHeight)`

- Called on chapter load to fit the entire map in the viewport
- Computes tile size as `min(viewportWidth / mapWidth, viewportHeight / mapHeight)`
- Enforces minimum tile size of 32px
- No manual zoom controls; tile size is fixed after initial computation

## Cursor

### Keyboard Movement

Hook: `useKeyboard` (`src/hooks/useKeyboard.ts`)

- **Arrow keys**: move cursor one tile in that direction
- Clamped to map bounds: `[0, mapWidth-1]` x `[0, mapHeight-1]`
- Each move triggers `hoverTile()` on the game store (updates terrain/unit info panels)
- If no cursor exists yet, defaults to (0, 0) on first arrow press
- Setting cursor automatically enables `keyboardMode`

### Keyboard/Mouse Mode Toggle

- Any arrow key press sets `keyboardMode = true`
- Any mouse movement sets `keyboardMode = false`
- Cursor highlight tile only renders when `keyboardMode` is true

### Keyboard Actions

| Key | Action | Condition |
|---|---|---|
| Arrow keys | Move cursor | Player phase, not in village visit |
| Enter / Space | Confirm (click tile or confirm attack) | Player phase |
| Escape | Cancel current action | Any non-idle player action |
| Tab | Cycle through available (un-acted) player units | Player phase |
| X | Toggle danger zone overlay | idle, unit_selected, or move_target |
| E | End player turn | idle only |
| I | Toggle unit detail panel for unit under cursor | Player phase |
