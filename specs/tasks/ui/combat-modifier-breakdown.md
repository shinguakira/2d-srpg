# Combat Modifier Breakdown in Forecast

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Combat/CombatPreview.tsx`, `src/styles/ui/combat-forecast.css`
> **Spec refs:** `specs/ui/combat-forecast-enhancements.md`

## Description

The combat forecast shows final DMG/HIT/CRIT numbers but never explains what modifiers contribute to them. When hit rate is unexpectedly low, the player cannot tell if it's from weather, weapon triangle, terrain avoid, low SYNC, or enemy skills. This prevents learning the combat system and making informed positioning decisions.

## Current Behavior

- `CombatPreview.tsx` shows flat DMG/HIT/CRIT values computed by `calculateCombatForecast` in `combat.ts`
- Weapon triangle text shown separately at bottom — the only modifier surfaced
- Weather, support, SYNC, STA, terrain, proficiency, and effectiveness modifiers are invisible
- Player must mentally reconstruct why numbers differ from expectations

## Expected Behavior

Collapsible "Modifiers" section below the main forecast stats. Collapsed by default, toggled with a small "v" arrow. Shows only active (non-zero) modifiers.

### Modifier Lines

| Source | Format | Data Source |
|--------|--------|-------------|
| Weapon triangle | "Triangle: HIT +15, DMG +1" | `getWeaponTriangle()` in `combat.ts` |
| Terrain | "Terrain (Forest): AVO +20, DEF +1" | `getTerrainData()` in `terrain.ts` |
| Weather | "Rain: HIT -15 (bow)" | `getWeatherCombatModifiers()` in `weather.ts` |
| Support | "Support (Marcus B): HIT +10, AVO +10" | `getTotalSupportBonuses()` in `support.ts` |
| SYNC | "SYNC 85: HIT +5" | `applySyncHitBonus()` in `metaStats.ts` |
| STA | "STA 32: SPD -1" | threshold check in `metaStats.ts` |
| Effectiveness | "Effective: Mt x3" | `isEffectiveAgainst()` in `combat.ts` |
| Non-proficient | "Not proficient: HIT -20" | proficiency check in `combat.ts` |

### Style

- Font: 11px, color rgba(255,255,255,0.5)
- Left-aligned under main stats section
- Collapse toggle: small "Modifiers v" header, 10px, clickable
- `data-testid="forecast-modifiers"`

## Steps to Fix

- [ ] Add `showModifiers` boolean state (useState) to `CombatPreview`, default false
- [ ] Compute modifier values from available data sources (weapon triangle already computed, terrain from tile, etc.)
- [ ] Render collapsible section with toggle header "Modifiers" + arrow icon
- [ ] List each non-zero modifier as a compact text line
- [ ] Group by attacker-relevant and defender-relevant modifiers
- [ ] CSS: `.combat-forecast__modifiers` section with collapse animation
- [ ] `data-testid="forecast-modifiers"`, `data-testid="forecast-modifier-toggle"`
- [ ] Test: attack in rain with bow → "Rain: HIT -15" visible in modifiers
- [ ] Test: attack from forest → "Terrain (Forest): AVO +20" visible
- [ ] Test: modifiers section toggles open/closed on click

## Spec Update

- [ ] Update `specs/ui/combat-forecast-enhancements.md` — confirm modifier breakdown section
