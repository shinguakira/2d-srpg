# Terrain Meta-Stat Effects in Terrain Info

> **Severity:** high
> **Category:** ui
> **Affected files:** `src/components/Units/UnitStatsPanel.tsx`, `src/core/metaStats.ts`, `src/styles/ui/unit-stats-panel.css`
> **Spec refs:** `specs/ui/hud.md`, `specs/gameplay/meta-stats.md`

## Description

Special terrains apply per-turn meta-stat effects that are invisible to the player. Blighted terrain gives CRP+2/ATT-1, data_void gives CRP+3/ATT-3, forts give STA-3 recovery. CRP reaching 100 turns a player unit into an enemy — stepping onto glitched terrain unknowingly is a hidden trap.

## Current Behavior

- `UnitStatsPanel.tsx:114-120` terrain section shows only terrain name, DEF bonus, and AVO bonus
- `metaStats.ts` exports `getTerrainCrpGain()`, `getTerrainSyncChange()`, `getTerrainStaRecovery()` — these are used in turn-end processing but never displayed
- Players must memorize terrain effects or discover them by accident

## Expected Behavior

Below the DEF/AVO lines in terrain info, show non-zero meta-stat effects:

| Terrain | Effects Shown |
|---------|--------------|
| Blighted | CRP +2/turn, ATT -1/turn |
| Abyssal Rift | CRP +3/turn, ATT -3/turn |
| Fort | STA -3/turn |
| Defiled Fort | CRP +1/turn, STA -3/turn |
| Memory | ATT +5/turn |

### Color Coding

- CRP effects: magenta (#d946ef) — danger color matching corruption theme
- ATT effects: cyan (#22d3ee) — positive green if gaining, red if losing
- STA effects: blue (#60a5fa) — recovery/rest theme

### Format

```
Forest
DEF +1  AVO +20

Blighted Ground
DEF +0  AVO +0
CRP +2/turn  ATT -1/turn
```

## Steps to Fix

- [x] In `UnitStatsPanel.tsx`: after DEF/AVO lines, call `getTerrainCrpGain(terrain)`, `getTerrainSyncChange(terrain)`, `getTerrainStaRecovery(terrain)` from `src/core/metaStats.ts`
- [x] Conditionally render each non-zero effect with appropriate color
- [x] Import the three functions (they should already be exported)
- [x] CSS: add color classes for meta-stat terrain effects in `unit-stats-panel.css`
- [x] `data-testid="terrain-meta-effects"` on the container div
- [x] Test: hover glitched terrain → "CRP +2/turn" and "ATT -1/turn" appear below DEF/AVO
- [x] Test: hover normal terrain (grass/plain) → no meta-stat lines shown
- [x] Test: hover fort → "STA -3/turn" appears

## Spec Update

- [x] Confirm `specs/ui/hud.md` Terrain Info section matches implementation
