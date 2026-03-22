# Class-Aware Movement Cost in Terrain Info

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Units/UnitStatsPanel.tsx`, `src/core/terrain.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

Forests cost 2 for infantry but 3 for cavalry, mountains are impassable for armored units, flying units pay 1 for everything. The player sees the blue movement range overlay but never understands why a mounted unit can't reach a tile that an infantry unit could.

## Current Behavior

- `UnitStatsPanel.tsx:114-120` terrain section shows: terrain name, DEF +N, AVO +N
- No movement cost is displayed anywhere in the terrain info
- `terrain.ts` exports `getClassMovementCost(terrain, classFlags)` — returns the actual cost for a class type — but this is never called from UI components
- Players must rely on trial and error to learn class-specific movement costs

## Expected Behavior

Add a "Move" line to terrain info, context-aware based on selected unit:

### When a unit is selected

Show class-specific movement cost with class type label:
- "Move: 3 (Mounted)" for cavalry in forest
- "Move: 1 (Flying)" for pegasus on mountain
- "Move: ---" for impassable terrain for that class
- Standard white text, red for impassable

### When no unit is selected

Show base movement cost: "Move: 2" (the default infantry cost)

### Format

```
Forest
DEF +1  AVO +20  Move: 3 (Mounted)
```

## Steps to Fix

- [ ] In `UnitStatsPanel.tsx`: after DEF/AVO lines, compute movement cost
- [ ] If a unit is selected (`selectedUnitId`), look up class flags from `ALL_CLASSES[unit.classId]` and call `getClassMovementCost(terrain, classFlags)`
- [ ] If no unit selected, use base cost from `getTerrainData(terrain).movementCost`
- [ ] Display "Move: {cost}" line — or "Move: ---" in red if cost >= 99 (impassable)
- [ ] Show class type label in parentheses when unit-specific: "(Mounted)", "(Flying)", "(Armored)", "(Infantry)"
- [ ] Import `getClassMovementCost` from `src/core/terrain.ts` (already exported)
- [ ] Import `ALL_CLASSES` from `src/data/promotedClasses.ts` for class flag lookup
- [ ] `data-testid="terrain-move-cost"` on the movement cost element
- [ ] Test: select cavalier → hover forest → "Move: 3 (Mounted)"
- [ ] Test: select pegasus → hover mountain → "Move: 1 (Flying)"
- [ ] Test: select knight → hover mountain → "Move: --- (Armored)" in red
- [ ] Test: no unit selected → hover forest → "Move: 2"

## Spec Update

- [ ] Confirm `specs/ui/hud.md` Terrain Info section mentions movement cost
