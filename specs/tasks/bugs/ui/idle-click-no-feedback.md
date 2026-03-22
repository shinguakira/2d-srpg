# Show Menu on Clicking Empty Tile or Unavailable Unit

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/stores/actions/selectionActions.ts`, `src/components/UI/ActionMenu.tsx`
> **Spec refs:** `specs/ui/hud.md`

## Description

Clicking an empty tile or a non-available unit (already acted, enemy, carried) during idle phase produces no feedback. The game silently ignores the click.

## Current Behavior

In `selectionActions.ts` lines 105-113, when `playerAction === 'idle'` and the player clicks a tile with no selectable player unit, the `clickTile` function returns early with no visual or UI response.

## Expected Behavior

- Clicking an **enemy unit** during idle should open the `UnitDetailScreen` modal for that enemy (view stats, weapons, etc.)
- Clicking an **already-acted player unit** should show their info panel or detail screen
- Clicking an **empty tile** can remain silent (acceptable) or show terrain info popup

## Steps to Fix

- [ ] In `clickTile` idle branch, check if tile has an enemy unit → open `UnitDetailScreen` via `uiStore.setDetailUnitId`
- [ ] Check if tile has an already-acted player unit → open `UnitDetailScreen`
- [ ] Add `data-testid` for any new interactive elements
- [ ] Add E2E test: click enemy unit during idle → detail modal opens

## Spec Update

- [ ] Update `specs/ui/hud.md` — add "Idle Click Behavior" section documenting what happens when clicking non-selectable tiles/units
