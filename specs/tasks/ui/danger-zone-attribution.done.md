# Danger Zone Per-Unit Attribution

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/stores/helpers/dangerZoneHelpers.ts`, `src/stores/gameStoreTypes.ts`, `src/components/Units/UnitStatsPanel.tsx`
> **Spec refs:** `specs/ui/hud.md`

## Description

The danger zone shows a flat red overlay of tiles enemies can attack, but gives no information about how many enemies threaten each tile or how much damage they'd deal. Knowing "3 enemies can hit this tile for combined 45 damage" is much more useful than just "this tile is dangerous."

## Current Behavior

- `dangerZoneHelpers.ts` computes `refreshDangerZone()` returning a `Set<string>` of tile keys
- Per-unit attribution is not tracked — only "is this tile in danger zone? yes/no"
- `UnitStatsPanel` shows no danger zone information when hovering a threatened tile
- Player can see which tiles are dangerous but not how dangerous

## Expected Behavior

### UnitStatsPanel

When hovering a tile in the active danger zone, show a "Threats" section:

```
Threats (3 enemies)
  Fighter — ~14 dmg
  Cavalier — ~11 dmg
  Archer — ~8 dmg
```

- Estimated damage based on unit's current stats vs a hypothetical player average
- Or simply list threatening enemy names + weapon types
- Only show when danger zone overlay is active and tile is in the danger set

### Danger Zone Computation

Modify `refreshDangerZone` to also build a `Map<string, string[]>` mapping tile keys to arrays of enemy unit IDs that can attack that tile.

## Steps to Fix

- [x] In `dangerZoneHelpers.ts`: modify `refreshDangerZone` to return both `dangerZone: Set<string>` and `dangerAttribution: Map<string, string[]>`
- [x] In `gameStoreTypes.ts`: add `dangerZoneAttribution: Map<string, string[]>` to GameState
- [x] Update all callers of `refreshDangerZone` to store attribution map
- [x] In `UnitStatsPanel.tsx`: when hovering a tile in danger zone, look up attribution map and show threatening enemies
- [x] Display enemy name + weapon type for each threat
- [ ] Consider performance: only compute attribution when danger zone is active
- [x] `data-testid="danger-threats"`, `data-testid="danger-threat-{unitId}"`
- [x] Test: enable danger zone → hover threatened tile → enemy names listed
- [x] Test: hover safe tile → no threats section shown
