# Right-Click or Context Menu to View Unit Detail Modal

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Game.tsx`, `src/stores/actions/selectionActions.ts`, `src/hooks/useKeyboard.ts`, `src/components/UI/UnitDetailScreen.tsx`, `src/stores/uiStore.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

The full unit detail modal (`UnitDetailScreen`) exists and shows stats, weapons, skills, and terrain bonuses — but it's only accessible via the "I" keyboard shortcut. There is no mouse-based way to open it. Right-click currently only cancels actions.

## Current Behavior

- `UnitDetailScreen.tsx` is a complete modal showing all unit info (stats, equipment, skills, terrain)
- Only way to open: press "I" key (`useKeyboard.ts` lines 132-153)
- Right-click in `Game.tsx` lines 76-81 calls `handleContextMenu` which only prevents default and cancels current action
- No "View Info" option in the ActionMenu after selecting a unit

## Expected Behavior

- **Right-click on any unit** (player or enemy) during idle phase opens `UnitDetailScreen` for that unit
- **Right-click during action/move** keeps existing cancel behavior
- **ActionMenu** includes a "View Info" option that opens the detail modal for the selected unit
- Modal shows full details: stats, all weapons with Mt/Hit/Crit/Rng, skills, terrain bonuses

## Steps to Fix

- [ ] In `Game.tsx` `handleContextMenu`, when `playerAction === 'idle'`, resolve tile position from mouse coordinates (using camera offset + tile size from `uiStore`)
- [ ] If a unit exists at that tile, call `uiStore.setDetailUnitId(unit.id)` to open the detail modal
- [ ] If no unit at tile or `playerAction !== 'idle'`, keep existing cancel behavior
- [ ] Add "View Info" option to `ActionMenu.tsx` that opens `UnitDetailScreen` for the selected unit
- [ ] Add `data-testid="action-view-info"` to the new menu option
- [ ] Add E2E test: right-click enemy unit → detail modal opens with correct unit data

## Spec Update

- [ ] Update `specs/ui/hud.md` — add "Right-Click Behavior" section: right-click on unit opens detail modal during idle, cancels action otherwise
- [ ] Update `specs/ui/hud.md` — add "View Info" to ActionMenu options list
