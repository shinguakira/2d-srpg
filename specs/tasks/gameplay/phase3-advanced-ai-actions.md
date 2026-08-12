# Phase 3: Advanced AI Behaviors + New Player Actions

> **Prerequisites:** Phase 2 (skills framework for AI to use skills)
> **Unlocks:** Arc 2 Maps (ch6-10)
> **Critical files:** `src/core/ai.ts`, `src/stores/actions/enemyActions.ts`, `src/stores/actions/selectionActions.ts`
> **Spec refs:** `specs/gameplay/ai.md`, `specs/gameplay/battle-logic.md`

## Advanced AI Behaviors

> **Ref:** [`specs/gameplay/ai.md`](specs/gameplay/ai.md)

- [x] Survival AI: flee to nearest fort when HP ≤ 30%, use healing items, attack when healthy
- [x] Thief AI: pathfind to nearest chest/village tile, ignore combat, flee if blocked
- [x] Healer AI: stay behind frontline (2+ tiles from nearest enemy), heal lowest-HP ally in staff range
- [x] Escort AI: follow and stay adjacent to a specified unit ID, attack threats to escorted unit
- [x] Coordinated AI: all units with same group ID focus-fire the highest-score target
- [x] Ambush AI: hidden until enemy enters attack range, then attack with priority
- [x] AI item usage: use Vulnerary when HP ≤ 50% and no attack target available
- [x] Boss AI improvement: prioritize Lord target (+50 score), retreat threshold (optional per boss)
- [x] Guard AI improvement: configurable patrol path (not just radius)

## AI Target Scoring Improvements

> **Ref:** [`specs/gameplay/ai.md`](specs/gameplay/ai.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [x] Add weapon triangle awareness to score: +10 if advantage, -10 if disadvantage
- [x] Add kill potential bonus: +100 if attack would kill target
- [x] Add counter-death penalty: -50 if target's counter would kill attacker
- [x] Add wounded priority: +30 if target HP ≤ 50%
- [x] Add terrain awareness: prefer attacking targets on open terrain
- [x] Coordinated focus: all group members add +200 to the group's chosen target
- [x] Healer priority: +80 for healing allies ≤ 30% HP

## Dance Action (Viviane)

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/story/characters/viviane.md`](specs/story/characters/viviane.md)

- [x] Add `dance` to ActionType union
- [x] Dance action: select adjacent ally who has already acted
- [x] Dance effect: reset target's `hasActed` and `hasMoved` flags
- [x] Dance grants target a full new turn (move + action)
- [x] Dancer cannot dance self
- [x] Dancer's turn ends after dancing
- [x] Add Dance to action menu (show only for units with `dance` innate skill)
- [x] Dance animation: brief sparkle effect on target
- [x] Dance EXP: dancer gains 15 EXP per dance — ⚠️ implemented as 20 EXP

## Steal Action (Fenn/Thief)

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/story/characters/fenn.md`](specs/story/characters/fenn.md)

- [x] Add `steal` to ActionType union
- [x] Steal action: select adjacent enemy with stealable item
- [x] Steal condition: attacker SPD > defender SPD
- [x] Stealable items: consumables only (not equipped weapons)
- [x] Stolen item moves to stealer's inventory (must have space)
- [x] Steal does not end the unit's ability to move — returns to action menu after stealing
- [x] Add Steal to action menu (show only for thief class units)
- [x] Steal animation: floating "Stole [item]!" text visual
- [x] Steal EXP: thief gains 20 EXP per successful steal — ⚠️ implemented as 15 EXP

## Rescue/Drop Actions

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md)

- [x] Add `rescue` and `drop` to ActionType union
- [x] Rescue action: pick up adjacent ally (must have STR ≥ ally's weight)
- [x] Weight calculation: based on class (armored=heavy, mage=light)
- [x] Rescued unit stored in rescuer's state (not on map)
- [x] Rescuer stat penalty: STR halved, SPD halved, -2 MOV
- [x] Drop action: place rescued unit on adjacent empty tile
- [x] Dropped unit cannot act this turn
- [x] Rescue shows in action menu when adjacent ally and STR sufficient
- [x] Drop shows in action menu when carrying a unit
- [x] Rescued unit visual: small person icon badge on rescuer's sprite
- [x] Rescue/Drop animation: floating "Rescue!"/"Drop!" text + CSS effect

## Lockpick Action

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [x] Add `lockpick` to ActionType union
- [x] Lockpick: thief can open chest/door tiles without key item
- [x] Lockpick action on chest: receive chest contents
- [x] Lockpick action on door: door tile becomes open tile
- [x] Non-thief units use Door Key / Chest Key items instead
- [x] Add Lockpick to action menu (thief class on adjacent chest/door)

## Trade Action

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md)

- [x] Add `trade` to ActionType union
- [x] Trade: swap items between two adjacent player units
- [x] Trade UI: show both inventories side by side (TradeUI component)
- [x] Click items to transfer between inventories
- [x] Trade does not end the unit's turn (can act after trading)

## Validation

- [x] Unit tests: each AI behavior in isolation with mock map scenarios (31 tests)
- [x] Unit tests: dance refresh, steal SPD check, rescue weight check (6 + 6 tests)
- [x] Unit tests: trade item swap, lockpick chest contents (3 + 7 tests)
- [x] Integration: test dance + movement combo (danced unit gets full turn)
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — 282 tests pass
