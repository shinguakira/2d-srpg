# Phase 3: Advanced AI Behaviors + New Player Actions

> **Prerequisites:** Phase 2 (skills framework for AI to use skills)
> **Unlocks:** Arc 2 Maps (ch6-10)
> **Critical files:** `src/core/ai.ts`, `src/stores/actions/enemyActions.ts`, `src/stores/actions/selectionActions.ts`
> **Spec refs:** `specs/gameplay/ai.md`, `specs/gameplay/battle-logic.md`

## Advanced AI Behaviors

> **Ref:** [`specs/gameplay/ai.md`](specs/gameplay/ai.md)

- [ ] Survival AI: flee to nearest fort when HP ≤ 30%, use healing items, attack when healthy
- [ ] Thief AI: pathfind to nearest chest/village tile, ignore combat, flee if blocked
- [ ] Healer AI: stay behind frontline (2+ tiles from nearest enemy), heal lowest-HP ally in staff range
- [ ] Escort AI: follow and stay adjacent to a specified unit ID, attack threats to escorted unit
- [ ] Coordinated AI: all units with same group ID focus-fire the highest-score target
- [ ] Ambush AI: hidden until enemy enters attack range, then attack with priority
- [ ] AI item usage: use Vulnerary when HP ≤ 50% and no attack target available
- [ ] Boss AI improvement: prioritize Lord target (+50 score), retreat threshold (optional per boss)
- [ ] Guard AI improvement: configurable patrol path (not just radius)

## AI Target Scoring Improvements

> **Ref:** [`specs/gameplay/ai.md`](specs/gameplay/ai.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [ ] Add weapon triangle awareness to score: +10 if advantage, -10 if disadvantage
- [ ] Add kill potential bonus: +100 if attack would kill target
- [ ] Add counter-death penalty: -50 if target's counter would kill attacker
- [ ] Add wounded priority: +30 if target HP ≤ 50%
- [ ] Add terrain awareness: prefer attacking targets on open terrain
- [ ] Coordinated focus: all group members add +200 to the group's chosen target
- [ ] Healer priority: +80 for healing allies ≤ 30% HP

## Dance Action (Orin)

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/story/characters/orin.md`](specs/story/characters/orin.md)

- [ ] Add `dance` to ActionType union
- [ ] Dance action: select adjacent ally who has already acted
- [ ] Dance effect: reset target's `hasActed` and `hasMoved` flags
- [ ] Dance grants target a full new turn (move + action)
- [ ] Dancer cannot dance self
- [ ] Dancer's turn ends after dancing
- [ ] Add Dance to action menu (show only for units with `dance` innate skill)
- [ ] Dance animation: brief sparkle effect on target
- [ ] Dance EXP: dancer gains 15 EXP per dance

## Steal Action (Coda/Thief)

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/story/characters/coda.md`](specs/story/characters/coda.md)

- [ ] Add `steal` to ActionType union
- [ ] Steal action: select adjacent enemy with stealable item
- [ ] Steal condition: attacker SPD > defender SPD
- [ ] Stealable items: consumables only (not equipped weapons)
- [ ] Stolen item moves to stealer's inventory (must have space)
- [ ] Steal does not end the unit's ability to move (if hasn't moved yet)
- [ ] Add Steal to action menu (show only for thief class units)
- [ ] Steal animation: quick hand grab visual
- [ ] Steal EXP: thief gains 20 EXP per successful steal

## Rescue/Drop Actions

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md)

- [ ] Add `rescue` and `drop` to ActionType union
- [ ] Rescue action: pick up adjacent ally (must have STR ≥ ally's weight)
- [ ] Weight calculation: based on class (armored=heavy, mage=light)
- [ ] Rescued unit stored in rescuer's state (not on map)
- [ ] Rescuer stat penalty: STR halved, SPD halved, -2 MOV
- [ ] Drop action: place rescued unit on adjacent empty tile
- [ ] Dropped unit cannot act this turn
- [ ] Rescue shows in action menu when adjacent ally and STR sufficient
- [ ] Drop shows in action menu when carrying a unit
- [ ] Rescued unit visual: small icon on rescuer's sprite
- [ ] Rescue/Drop animation: brief pickup/putdown

## Lockpick Action

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [ ] Add `lockpick` to ActionType union
- [ ] Lockpick: thief can open chest/door tiles without key item
- [ ] Lockpick action on chest: receive chest contents
- [ ] Lockpick action on door: door tile becomes open tile
- [ ] Non-thief units use Door Key / Chest Key items instead
- [ ] Add Lockpick to action menu (thief class on adjacent chest/door)

## Trade Action

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md)

- [ ] Add `trade` to ActionType union
- [ ] Trade: swap items between two adjacent player units
- [ ] Trade UI: show both inventories side by side
- [ ] Drag or click items to swap slots
- [ ] Trade does not end the unit's turn (can act after trading)

## Validation

- [ ] Unit tests: each AI behavior in isolation with mock map scenarios
- [ ] Unit tests: dance refresh, steal SPD check, rescue weight check
- [ ] Unit tests: trade item swap, lockpick chest contents
- [ ] Integration: test dance + movement combo (danced unit gets full turn)
- [ ] `npm run build` — zero errors
- [ ] `npx vitest run` — all tests pass
