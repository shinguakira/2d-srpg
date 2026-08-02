# Growth Rates Display in Unit Detail Screen

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/components/UI/UnitDetailScreen.tsx`
> **Spec refs:** `specs/ui/hud.md`, `specs/gameplay/classes.md`

## Description

Growth rates (percentage chance to gain +1 in each stat per level-up) are the defining characteristic of each unit's long-term potential. Hardcore FE players care deeply about this data. Showing it helps players make informed deployment and EXP investment decisions (e.g. "this unit has 55% SPD growth, worth investing EXP").

## Current Behavior

- `UnitDetailScreen.tsx` shows current stats with bars, but no growth information
- `ALL_CLASSES[classId].growthRates` contains per-stat growth percentages — never displayed
- Players have no way to evaluate a unit's long-term potential from the UI

## Expected Behavior

Add a "Growth Rates" collapsible section in `UnitDetailScreen` below the Stats section:

- Show each stat's growth rate as a percentage with color-coded bar
- Color coding: green (#22c55e) for 60%+, yellow (#eab308) for 30-59%, red (#ef4444) for <30%
- Format: "STR 45%" with a thin bar filling to that percentage
- Show stat caps from `cls.statCaps` if defined, as max value labels
- Collapsed by default (header: "+ Growth Rates")

## Steps to Fix

- [x] In `UnitDetailScreen.tsx`: after Stats section, add collapsible "Growth Rates" section
- [x] Read `ALL_CLASSES[unit.classId].growthRates` for each stat
- [x] Render growth rate per stat with percentage bar, color-coded by tier
- [x] Optionally show stat cap from `cls.statCaps` as "Cap: {value}" next to bar
- [x] Add collapse toggle state (default collapsed)
- [x] `data-testid="growth-rates"`, `data-testid="growth-{stat}"`
- [x] Test: view unit → expand growth rates → percentages match class definition
