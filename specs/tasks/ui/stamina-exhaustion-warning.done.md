# Stamina Exhaustion Warning Display

> **Severity:** high
> **Category:** ui
> **Affected files:** `src/components/Units/UnitStatsPanel.tsx`, `src/components/Combat/CombatPreview.tsx`, `src/components/UI/ActionMenu.tsx`
> **Spec refs:** `specs/ui/hud.md`, `specs/gameplay/meta-stats.md`

## Description

STA >= 30 causes -1 SPD penalty (can cost a double attack), STA >= 45 locks unit to Wait/Rest only. The STA bar exists in `MetaStatsSection` and visual indicators (dim at 30+, sweat at 45+) are on the sprite, but the actual mechanical penalties are never explained to the player.

## Current Behavior

- `UnitStatsPanel.tsx:54` shows STA bar with max=45, no threshold text
- `UnitSprite.tsx:50` applies `unit-sprite--sta-dim` at STA 30-44 — visual only, no text
- `UnitSprite.tsx:147` shows sweat drop SVG at STA 45+ — visual only
- `ActionMenu.tsx:62` checks `isExhausted(selectedUnit)` and limits actions, but shows no explanation
- `CombatPreview.tsx` shows SPD-derived stats (doubling) but doesn't note STA penalty on SPD

## Expected Behavior

### UnitStatsPanel (MetaStatsSection)

Below the STA bar, show context-aware warning text:

| STA Range | Text | Color |
|-----------|------|-------|
| 25-29 | "Fatigue at 30" | yellow (#eab308) |
| 30-44 | "Fatigued: -1 SPD" | orange (#f97316) |
| 45+ | "Exhausted: Cannot act!" | red (#ef4444) |

### ActionMenu

When `exhausted === true`, show an explanation line at the top of the action list: "Exhausted — Wait or Rest only" in orange text, before the Wait/Rest/Cancel buttons.

### CombatPreview

When attacker or defender has STA >= 30, show a yellow modifier note: "STA 32: SPD -1" (or "SPD -2, SKL -1" at 45+). Integrates with the modifier breakdown section.

## Steps to Fix

- [x] Create helper `getStaWarningText(sta)` returning `{ text, color } | null` for the three thresholds
- [x] In `UnitStatsPanel.tsx` `MetaStatsSection`: after the STA bar (`<MetaStatBar ... stat="sta" />`), conditionally render warning text
- [x] Style: font-size 10px, matching the meta-stats label style, colored per table above
- [x] In `ActionMenu.tsx`: when `exhausted === true`, render explanation div above the action buttons
- [x] In `CombatPreview.tsx`: check both combatants' STA, add modifier note if >= 30
- [x] `data-testid="sta-warning"` on the warning element
- [x] Test: unit with STA 32 → "Fatigued: -1 SPD" visible in stats panel
- [x] Test: unit with STA 46 → action menu shows "Exhausted" explanation
- [x] Test: combat forecast against fatigued enemy shows SPD penalty note

## Spec Update

- [x] Confirm `specs/ui/hud.md` Stamina Warnings section matches implementation
