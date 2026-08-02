# Hovering Any Unit Should Show Movement + Attack Range

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/stores/actions/selectionActions.ts`, `src/components/Grid/RangeOverlay.tsx`, `src/stores/gameStoreTypes.ts`, `src/core/pathfinding.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

Hovering over any unit (player or enemy) during idle phase should preview their movement range (blue) and attack range (red), without requiring the unit to be selected first.

## Current Behavior

- `hoverTile` in `selectionActions.ts` during `playerAction === 'idle'` only sets `hoveredTile` (line 99) — no range computation
- `RangeOverlay.tsx` only renders ranges during `move_target`, `action_menu`, `attack_target`, or `confirm` phases
- Player must click-select a unit to see any range overlay
- No hover-based range preview exists

## Expected Behavior

- **Hovering a player unit** (idle phase): show blue overlay for movement range, red overlay for movement + attack range
- **Hovering an enemy unit** (idle phase): show red overlay for their movement + attack range (helps tactical planning)
- **Hovering empty tile**: no range overlay (clear any previous hover range)
- **Unit already selected**: hover ranges hidden, selection ranges take priority
- Hover ranges should be visually lighter/more transparent than selection ranges to differentiate

## Steps to Fix

- [x] Add `hoverMovementRange` and `hoverAttackRange` (as `Set<string>`) to `GameState` in `gameStoreTypes.ts`
- [x] In `hoverTile` when `playerAction === 'idle'` and a unit exists at hovered tile:
  - Compute movement range via `getMovementRange` from `pathfinding.ts`
  - Compute full attack range via `getFullAttackRange`
  - Set both hover range sets in state
- [x] Clear hover ranges when hovering empty tile or when a unit is selected
- [x] Only recompute when the hovered unit changes (not on every tile hover) for performance
- [x] In `RangeOverlay.tsx`, render hover ranges with reduced opacity (e.g. 0.15 vs 0.3) to distinguish from selection
- [x] Blue for player movement, red for player attack range and all enemy ranges
- [x] Add `data-testid="hover-range-overlay"` to the hover range elements
- [x] Add E2E test: hover player unit → blue + red range appears; hover away → range disappears

## Spec Update

- [x] Update `specs/ui/hud.md` — add "Hover Range Preview" section documenting idle-hover range display behavior, colors, and opacity distinction from selection ranges
