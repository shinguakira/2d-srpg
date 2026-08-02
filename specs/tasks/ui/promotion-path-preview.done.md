# Promotion Path Preview in Unit Detail Screen

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/components/UI/UnitDetailScreen.tsx`, `src/data/promotedClasses.ts`
> **Spec refs:** `specs/ui/hud.md`, `specs/gameplay/classes.md`

## Description

Players planning long-term builds want to see what classes a unit can promote to and what weapons/skills they would gain. Promotion paths exist as `cls.promotesTo` arrays in class data but are only used in the preparation screen's promotion flow — invisible during battle.

## Current Behavior

- `UnitDetailScreen.tsx` shows current class name and tier badge, but no promotion information
- `ALL_CLASSES[classId].promotesTo` contains arrays of target class IDs — not displayed
- Promoted classes have `promotesFrom` back-references — not displayed
- Player must leave battle to check promotion options in preparation screen

## Expected Behavior

Add "Class Path" section in `UnitDetailScreen` below equipment:

```
Class Path
  Lord → Great Lord (adds Lance) | Conqueror (adds Axe)
```

- Show branching promotion options with key differences (new weapons, new skills)
- For promoted units, show master class path if `promotesTo` exists on promoted class
- For master class units, show "Max tier reached"
- Simple text list with weapon type color coding

## Steps to Fix

- [x] In `UnitDetailScreen.tsx`: after equipment section, check `cls.promotesTo` array
- [x] For each promotion target, look up class from `ALL_CLASSES` and display: name, new weapon types, innate skills
- [x] Format as branching tree text: "→ ClassName (adds WeaponType)" separated by " | "
- [x] Color weapon types using existing `WEAPON_TYPE_COLORS` map
- [x] Handle edge cases: no promotions (Dancer), already max tier, null promotesTo
- [x] `data-testid="class-path"`, `data-testid="promotion-option-{classId}"`
- [x] Test: view base class unit → shows two promotion options with weapon differences
- [x] Test: view master class unit → shows "Master tier" with no further promotions
