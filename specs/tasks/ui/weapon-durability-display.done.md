# Weapon Durability Display

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Units/UnitStatsPanel.tsx`, `src/components/UI/ActionMenu.tsx`, `src/components/UI/UnitDetailScreen.tsx`, `src/components/Combat/CombatPreview.tsx`
> **Spec refs:** `specs/ui/hud.md`, `specs/ui/combat-forecast-enhancements.md`

## Description

Weapons have a `durability` field tracking remaining uses, but this is never shown during battle. Players cannot plan weapon usage across a chapter — they might waste a Killing Edge on a weak enemy when it only had 2 uses left.

## Current Behavior

- `UnitStatsPanel.tsx:103-105` shows weapon name and Mt only: "Iron Sword (Mt 5)"
- `ActionMenu.tsx:328-338` weapon selector shows weapon name only
- `UnitDetailScreen.tsx:146-165` shows Mt/Hit/Crit/Range but no durability
- `CombatPreview.tsx` shows weapon name only
- Only the item submenu shows uses for consumables (items, not weapons)
- `weapon.durability` field exists on the Weapon type — `null` means infinite (e.g. Garrison Lance)

## Expected Behavior

### UnitStatsPanel

Weapon line format: "Iron Sword (Mt 5) 23/40" — or just "Garrison Lance (Mt 8)" for infinite durability.

### ActionMenu Weapon Selector

Each weapon button: "Iron Sword 23/40" — warn in red when <= 5 uses.

### UnitDetailScreen Equipment

Add durability column after Range: "Mt 5 Hit 90 Crit 0 Rng 1 Uses 23/40"

### CombatPreview

Show uses next to weapon name: "Iron Sword (23/40)" or no count for infinite.

## Steps to Fix

- [x] In `UnitStatsPanel.tsx:103-105`: append durability display after Mt — skip if `durability === null`
- [x] In `ActionMenu.tsx` weapon selector buttons: add uses count, red color when <= 5
- [x] In `UnitDetailScreen.tsx` equipment section: add "Uses X/Y" to the stat line
- [x] In `CombatPreview.tsx` weapon name lines: append "(X/Y)" when durability is finite
- [x] Handle null durability (infinite) — show nothing or infinity symbol
- [x] Warn color: red (#ef4444) text when durability <= 5, yellow (#eab308) when <= 10
- [x] `data-testid="weapon-durability"` on durability elements
- [x] Test: unit with Iron Sword (durability 40) shows "40/40"
- [x] Test: Garrison Lance (durability null) shows no uses count
- [x] Test: weapon with 3 uses remaining shows red warning

## Spec Update

- [x] Confirm `specs/ui/hud.md` weapon selector section mentions durability
- [x] Confirm `specs/ui/combat-forecast-enhancements.md` mentions durability in forecast
