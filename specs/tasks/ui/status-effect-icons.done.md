# Status Effect Icons on Map Sprites

> **Severity:** low
> **Category:** ui
> **Affected files:** `src/components/Units/UnitSprite.tsx`, `src/styles/units.css`
> **Spec refs:** `specs/ui/hud.md`, `specs/gameplay/combat.md`

## Description

Units can have active status effects (Dazed, Poison, ATK Break, MOV Break, Panic, SPD Break, DEF Break) but there is no visual indicator on the map sprite. Players must click each unit to check status. Currently only CRP/STA/support/carry badges exist on sprites.

## Current Behavior

- `UnitSprite.tsx` renders: CRP warning (80+), CRP flicker (30+), STA dim (30+), STA sweat (45+), support heart, carry badge, boss crown, weapon cycle icon, corruption layers
- Status effects from `unit.statusEffects` array are not visualized on the map sprite
- Status effects are only visible in the UnitDetailScreen or by observing stat changes in the forecast

## Expected Behavior

Add small status icons positioned around the unit sprite (max 3 visible at once to avoid clutter):

| Status | Icon | Color |
|--------|------|-------|
| Poison | droplet | purple (#a855f7) |
| Dazed | spiral | yellow (#eab308) |
| ATK Break | broken sword | red (#ef4444) |
| DEF Break | broken shield | red (#ef4444) |
| SPD Break | snail | orange (#f97316) |
| MOV Break | chain | orange (#f97316) |
| Panic | exclamation | red (#ef4444) |

- Icons as small SVG (8x8px), positioned in a row below the HP bar
- Maximum 3 icons shown; if more than 3, show first 3 + "..." indicator
- Priority order: Panic > Poison > Dazed > Break effects

## Steps to Fix

- [x] In `UnitSprite.tsx`: check `unit.statusEffects` array (if it exists on the Unit type)
- [x] Define SVG icon components for each status type (small, 8x8 viewBox)
- [x] Render up to 3 icons in a flex row below the HP bar
- [x] Sort by priority (Panic first) and truncate at 3
- [x] CSS: position icons below HP bar, small enough to not overlap other badges
- [x] `data-testid="status-icon-{effectType}"`
- [x] Test: unit with Poison status → purple droplet icon visible on sprite
- [x] Test: unit with 4+ statuses → only 3 icons shown
