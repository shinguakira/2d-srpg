# AI Should Select Best Weapon by Expected Value (期待値)

> **Severity:** medium
> **Category:** gameplay
> **Affected files:** `src/core/ai.ts`, `src/stores/actions/enemyActions.ts`, `src/stores/actions/autoBattleActions.ts`, `src/stores/actions/allyActions.ts`
> **Spec refs:** `specs/gameplay/ai.md`

## Description

AI (enemy, ally, and auto-battle) always attacks with `unit.equippedWeapon` without evaluating other weapons in `unit.inventory`. Many units carry multiple weapons (sword + hand axe, lance + javelin, etc.) but the AI never considers which weapon would be most effective against the current target.

## Current Behavior

- `collectAttackOptions` in `ai.ts` only checks `unit.equippedWeapon` for range and forecast
- AI never iterates over `unit.inventory` to compare weapons
- A unit with a sword (range 1) and hand axe (range 1-2) will never use the hand axe at distance 2
- A unit with weapon triangle advantage available in inventory ignores it

## Expected Behavior

- AI evaluates all weapons in `unit.inventory` for each (position, target) pair
- Picks the weapon with the highest **expected value** = `damage × (hitRate / 100)`
- Staves are excluded from attack evaluation (handled by healer AI separately)
- The chosen weapon index is stored in `AIAction` and applied at execution time

## Steps to Fix

- [x] Add `weaponIndex?: number` to `AIAction` type
- [x] Update `collectAttackOptions` to iterate over all inventory weapons per target
- [x] For each weapon, compute forecast and expected value (damage × hit / 100)
- [x] Keep best-EV weapon per (position, target) pair
- [x] Skip staves in attack weapon evaluation
- [x] Apply weapon swap in `finalizeEnemyAction` before range check + forecast
- [x] Apply weapon swap in `finalizeAutoAction` before range check + forecast
- [x] Apply weapon swap in `finalizeAllyAction` before range check + forecast
- [x] Add unit tests: picks higher EV weapon, weapon triangle advantage, ranged fallback, staff skip
- [x] Update `specs/gameplay/ai.md` with weapon selection documentation

## Spec Update

- [x] Update `specs/gameplay/ai.md` — add note under combat scoring: "AI evaluates all weapons in inventory for each target and picks the one with highest expected value (damage × hit rate)"
