# End Turn Should Not Trigger During Auto-Play

> **Severity:** high
> **Category:** ui
> **Affected files:** `src/components/UI/EndTurnButton.tsx`, `src/hooks/useGameLoop.ts`, `src/hooks/useKeyboard.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

The End Turn button and keyboard shortcut ("E") remain active during auto-battle, allowing the player to prematurely end the turn and break the auto-play sequence.

## Current Behavior

- `EndTurnButton` hides during enemy phase (`currentPhase !== 'player_phase'`) but remains visible and clickable during auto-battle (`isAutoBattle === true`)
- The "E" keyboard shortcut in `useKeyboard.ts` triggers `endPlayerTurn` without checking `isAutoBattle` state
- Clicking End Turn during auto-battle interrupts the auto-play loop mid-execution

## Expected Behavior

- End Turn button should be **disabled** (greyed out, not clickable) when `isAutoBattle === true`
- "E" keyboard shortcut should be ignored during auto-battle
- Auto-battle should only end naturally when all player units have acted

## Steps to Fix

- [ ] In `EndTurnButton.tsx`, add `disabled` prop when `isAutoBattle` is true (grey out styling + prevent click)
- [ ] In `useKeyboard.ts`, add `isAutoBattle` guard before the "E" shortcut handler
- [ ] Add visual indicator that End Turn is disabled (e.g. reduced opacity, cursor: not-allowed)
- [ ] Add E2E test: during auto-battle, verify End Turn button is disabled and "E" key has no effect

## Spec Update

- [ ] Update `specs/ui/hud.md` — add note under End Turn Button section: "Disabled during auto-battle phase"
