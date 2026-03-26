# Weapon Effectiveness Warning in Combat Forecast

> **Severity:** high
> **Category:** ui
> **Affected files:** `src/core/combat.ts`, `src/components/Combat/CombatPreview.tsx`, `src/components/UI/ActionMenu.tsx`, `src/styles/ui/combat-forecast.css`
> **Spec refs:** `specs/ui/combat-forecast-enhancements.md`, `specs/ui/hud.md`

## Description

Effective weapons deal 3x weapon might (e.g. Rapier vs cavaliers, bows vs fliers). This is the single biggest damage modifier in FE combat. The player currently has zero indication that effectiveness applies — the number just jumps with no explanation.

## Current Behavior

- `combat.ts` internally checks `weapon.effectiveAgainst` array against defender's class flags (armored, mounted, flying, system_construct) at line ~102-112
- If effective, adds `weapon.might * 2` to damage (total 3x might)
- The result is folded into the final DMG number shown in `CombatPreview`
- No text, badge, or visual indicates effectiveness is in play
- Weapon selector in ActionMenu shows weapon names only — no effectiveness hint

## Expected Behavior

### Combat Forecast

- When attacker's weapon is effective against defender: show green pulsing "EFFECTIVE!" text below attacker's DMG stat
- When defender's weapon is effective against attacker: show red "Weak!" text below attacker's predicted HP
- `data-testid="forecast-effective"`

### Weapon Selector (ActionMenu)

- When unit has multiple weapons and an enemy is in range: show a small green "Eff!" badge next to weapons that would be effective against any enemy in attack range
- Helps player choose the right weapon before committing to attack

## Steps to Fix

- [x] Export `isEffectiveAgainst(weapon, defenderUnit)` helper from `src/core/combat.ts` — extract from existing internal effectiveness logic
- [x] In `CombatPreview.tsx`: read full attacker/defender units from store, call `isEffectiveAgainst` for both sides
- [x] Add "EFFECTIVE!" row below DMG when attacker is effective against defender (green pulsing text)
- [x] Add "Weak!" indicator when defender is effective against attacker (red text)
- [x] In `ActionMenu.tsx` weapon selector: for each weapon, check `isEffectiveAgainst` against enemies in `pendingAttackTiles`, show "Eff!" badge
- [x] CSS: `.combat-forecast__effective` — green (#22c55e), font-weight bold, pulse animation (1.5s ease-in-out infinite)
- [x] Add `data-testid="forecast-effective"` to effectiveness indicator
- [x] Test: select unit with Rapier → attack cavalier → "EFFECTIVE!" appears in forecast
- [x] Test: weapon selector shows "Eff!" badge next to Rapier when cavalier is in range

## Spec Update

- [x] Update `specs/ui/combat-forecast-enhancements.md` — confirm weapon effectiveness section matches implementation
