# Support Bonus Visibility

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Units/UnitStatsPanel.tsx`, `src/components/Combat/CombatPreview.tsx`, `src/core/support.ts`
> **Spec refs:** `specs/ui/hud.md`

## Description

A pink heart icon appears on unit sprites when a ranked support partner is within 3 tiles, but the player cannot see the actual combat bonuses (Hit, Avo, Crit, Dmg). Players cannot evaluate whether positioning near a support partner is worth the movement cost vs. better terrain.

## Current Behavior

- `UnitSprite.tsx:153-162` renders heart SVG when `hasActiveSupport && unit.faction === 'player'`
- `combat.ts` factors support bonuses into forecast calculation via `SupportCombatBonuses` parameter — bonuses affect HIT/AVO/CRIT/DMG
- `support.ts` exports `getActiveSupports()` and `getTotalSupportBonuses()` — these return concrete bonus values but they are never shown in UI
- Heart icon is the only visual — no tooltip, no breakdown

## Expected Behavior

### UnitStatsPanel

When a player unit has active supports, show a "Support" section below meta-stats:

```
Support
  Marcus (B): +10 Hit, +10 Avo, +5 Crit
  Lyn (C): +5 Hit, +5 Avo
```

- Only show for player units with at least one active support partner in range
- Color: pink (#f472b6) for partner names, white for bonus values

### Combat Forecast (Modifier Breakdown)

Include a support modifier line when support bonuses are active:
- "Support (Marcus B): HIT +10, AVO +10, CRIT +5"
- Integrates with the combat modifier breakdown section

## Steps to Fix

- [ ] In `UnitStatsPanel.tsx`: import `getActiveSupports` or equivalent from `src/core/support.ts`
- [ ] After meta-stats section, check if unit has active supports (faction === 'player', nearby partners with rank)
- [ ] Render support section listing each partner: name, rank, and bonus breakdown
- [ ] In `CombatPreview.tsx`: when combat has support bonuses, include line in modifier breakdown
- [ ] Style: section header "Support" in gold, partner names in pink, bonuses in white
- [ ] `data-testid="support-bonuses"`, `data-testid="support-partner-{unitId}"`
- [ ] Test: place two units with B-rank support adjacent → stats panel shows bonus values
- [ ] Test: move them apart → support section disappears
- [ ] Test: combat forecast modifier section includes support line when active

## Spec Update

- [ ] Confirm `specs/ui/hud.md` Support Bonuses section matches implementation
