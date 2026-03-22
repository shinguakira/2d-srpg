# Boss Phase HP Threshold Indicators

> **Severity:** medium
> **Category:** ui
> **Affected files:** `src/components/Combat/CombatPreview.tsx`, `src/components/UI/UnitDetailScreen.tsx`, `src/styles/ui/combat-forecast.css`
> **Spec refs:** `specs/ui/combat-forecast-enhancements.md`

## Description

Bosses change phases at HP thresholds — gaining immunity, swapping weapons, healing, changing AI. Players cannot see these thresholds before triggering them, making burst vs. chip damage strategy impossible to plan.

## Current Behavior

- `UnitSprite.tsx:12-25` changes boss glow color per phase (gold → red → purple) — visual only, no explanation
- `CombatPreview.tsx:33-42` shows weapon cycle hint for cycling bosses — but no phase threshold info
- `UnitDetailScreen.tsx` shows boss badge and stats, but no phase information
- `unit.bossPhases` array contains `hpThreshold`, `statChanges`, `weaponId`, `immunity`, `selfHeal`, `aiChange` — all hidden from player

## Expected Behavior

### Combat Forecast (targeting a boss)

- HP bar shows tick marks at each `hpThreshold` value, color-coded by phase
- Below enemy stats, show next phase transition text:
  - "Phase 2 at 50% HP: +Physical Immunity"
  - "Phase 3 at 25% HP: Self Heal 10/turn"
- Only show the NEXT upcoming phase (not all phases at once) to avoid clutter

### Unit Detail Screen (viewing a boss)

- "Boss Phases" section after Skills section
- Table listing all phases with threshold, stat changes, weapon swap, immunity, and special effects
- Current phase highlighted with gold border

## Steps to Fix

- [ ] In `CombatPreview.tsx`: check if enemy unit has `bossPhases` array
- [ ] Find the next upcoming phase (first phase where `unit.currentHp > hpThreshold`)
- [ ] Render phase info text below enemy stats: describe changes (immunity, weapon, heal, AI)
- [ ] Add tick marks to the HP bar visual at threshold HP values (CSS pseudo-elements or inline divs)
- [ ] In `UnitDetailScreen.tsx`: add "Boss Phases" section after skills when `unit.bossPhases` exists
- [ ] Render table with: Phase #, HP Threshold (%), Changes summary
- [ ] Highlight current phase row with gold background
- [ ] `data-testid="boss-phase-info"`, `data-testid="boss-phase-tick-{n}"`
- [ ] Test: target boss with 3 phases → next phase info shown in forecast
- [ ] Test: view boss via Unit Detail → all phases listed in table

## Spec Update

- [ ] Confirm `specs/ui/combat-forecast-enhancements.md` boss phase section matches
