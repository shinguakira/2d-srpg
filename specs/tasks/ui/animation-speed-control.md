# Animation Speed Control

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/stores/uiStore.ts`, `src/components/Combat/CombatAnimation.tsx`, `src/hooks/useGameLoop.ts`, `src/components/UI/SystemMenu.tsx`
> **Spec refs:** `specs/ui/hud.md`

## Description

All combat animations and enemy turn actions run at fixed speed. Experienced players want to speed through or skip animations, especially on repeat playthroughs. This is a standard QoL feature in modern FE games (FE Engage has 1x/2x/Skip).

## Current Behavior

- `CombatAnimation.tsx` uses fixed `setTimeout` durations for each animation phase
- `useGameLoop.ts` uses a fixed delay between enemy actions
- No speed toggle exists in the UI
- Player can click to skip EXP bar / level-up popup, but not combat animations

## Expected Behavior

### Speed Toggle

Three speeds accessible via System Menu settings or a small button on the battle scene:

| Speed | Combat Timing | Enemy Turn Delay | Label |
|-------|--------------|------------------|-------|
| 1x | Current values | Current values | Normal |
| 2x | All durations halved | Half delay | Fast |
| Skip | Instant (0ms) | Minimal (50ms) | Skip |

### UI Store

Add `animationSpeed: '1x' | '2x' | 'skip'` to `uiStore`, default '1x'. Persisted to localStorage.

### Combat Animation

All `setTimeout` durations multiplied by speed factor:
- 1x: `duration * 1`
- 2x: `duration * 0.5`
- skip: `0` (or 16ms minimum for React render cycle)

### Battle Scene Toggle

Small button in top-right of `CombatAnimation` modal: cycles 1x → 2x → Skip → 1x.

### System Menu Settings

"Animation Speed" option with three choices. Persists across sessions via localStorage.

## Steps to Fix

- [ ] In `uiStore.ts`: add `animationSpeed` state with getter/setter, default '1x'
- [ ] Add `getSpeedMultiplier()` helper: returns 1, 0.5, or 0 based on speed
- [ ] In `CombatAnimation.tsx`: multiply all setTimeout durations by speed multiplier
- [ ] Add speed toggle button in top-right of battle scene modal
- [ ] In `useGameLoop.ts`: multiply enemy action delay by speed multiplier
- [ ] In System Menu settings: add animation speed selector
- [ ] Persist to localStorage alongside other settings
- [ ] `data-testid="speed-toggle"`, `data-testid="speed-{value}"`
- [ ] Test: set 2x → combat animations play at double speed
- [ ] Test: set Skip → combat resolves near-instantly
- [ ] Test: speed persists after page reload
