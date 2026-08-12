# Phase 1: Recruitment System + Mid-Battle Events

> **Prerequisites:** Phase 0 (expanded types, renamed units)
> **Unlocks:** Arc 1 Maps (ch5), Arc 1 Story (ch4-5), Phase 2, Phase 4
> **Critical files:** `src/core/types.ts`, `src/stores/actions/`, `src/components/`
> **Spec refs:** `specs/gameplay/battle-logic.md`, `specs/gameplay/campaign.md`

## Event System — Core Engine

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md)

- [x] Define `ChapterEvent` type in `types.ts`:
  - `id`, `trigger` (condition), `effect` (action), `once` (boolean), `fired` (boolean)
- [x] Define trigger types: `turn_start(n)`, `turn_end(n)`, `unit_at(unitId, row, col)`, `unit_hp_below(unitId, pct)`, `unit_killed(unitId)`, `tile_visited(row, col)`, `phase_start(faction)`
- [x] Define effect types: `spawn_units(units[])`, `change_terrain(pos, newType)`, `show_dialogue(scene)`, `change_ai(unitId, newBehavior)`, `remove_unit(unitId)`, `recruit_unit(unitId)`, `set_flag(key, value)`, `chain(effects[])`
- [x] Create `src/core/events.ts` — pure event evaluation logic
- [x] Add `chapterEvents: ChapterEvent[]` to GameState in `gameStoreTypes.ts`
- [x] Add `firedEventIds: Set<string>` to GameState for one-shot tracking
- [x] Create `src/stores/actions/eventActions.ts` — evaluate events on phase transitions
- [x] Hook event evaluation into `turnActions.ts` at phase start/end
- [x] Hook event evaluation into `movementActions.ts` after unit moves
- [x] Hook event evaluation into `combatActions.ts` after combat resolves
- [x] Unit tests: event trigger matching, effect application, once-only firing (19 tests)
- [x] `custom(fn)` trigger type — `CustomTriggerFn` in types.ts, handled in `matchesTrigger`

## Event System — Visual Effects

> **Ref:** [`specs/ui/animations.md`](specs/ui/animations.md)

- [x] Mid-battle dialogue overlay component (`EventDialogue.tsx`)
- [x] Terrain change animation (tile flicker + swap) — `tile--terrain-change` CSS class, `terrainChangePositions` state
- [x] Unit spawn animation (fade in on tile) — `unit-sprite--spawning` CSS class, `spawningUnitIds` state
- [x] Unit removal animation (fade out) — `unit-sprite--removing` CSS class, `removingUnitIds` state
- [x] Event queue processing — sequential via `pendingEffects`, wait for dialogue dismiss
- [x] Pause enemy AI execution during event dialogue (`useGameLoop.ts`)

## Recruitment System — Core

> **Ref:** [`specs/story/roster.md`](specs/story/roster.md), [`specs/story/characters.md`](specs/story/characters.md)

- [x] Add `faction` field expansion: `'player' | 'enemy' | 'ally' | 'neutral'`
- [x] Ally units render with green tint, neutral with purple
- [x] `isHostileFaction()` helper for faction-aware pathfinding/targeting
- [x] Add `recruitableBy` field to Unit type
- [x] Add `recruitCondition` field: `'talk' | 'visit_village' | 'event' | 'defection'`
- [x] Add `Talk` action to action menu (shows when adjacent to recruitable unit with `recruitCondition === 'talk'`)
- [x] Talk action resolution: change unit faction from enemy/ally → player
- [x] Recruited unit inherits current HP/stats (not reset)
- [x] Unit tests: faction swap, Talk action availability (5 tests)
- [x] Ally faction independent AI movement — `allyActions.ts`, ally_phase after enemy turn, aggressive AI targeting enemies
- [x] Enemy defection: Genzo defects turn 3 in ch2 via `recruit_unit` event effect
- [x] Village recruitment: village action fires `checkAndFireEvents` with `tile_visited` trigger
- [x] Conditional recruitment: Talk button only shows for `recruitCondition === 'talk'` (event/defection handled by event system)

## Roster & Deployment System

> **Ref:** [`specs/progression/preparation.md`](specs/progression/preparation.md), [`specs/progression/campaign.md`](specs/progression/campaign.md)

- [x] Add `roster: string[]` to campaign state (unit IDs across chapters)
- [x] Persist roster in save data (SaveData v2 with v1→v2 migration)
- [x] Add `deploymentSlots` per chapter config
- [x] Add `forceDeploy` per chapter config (units that must be deployed)
- [x] Preparation screen: show roster with deploy/bench toggle, counter, forced indicators
- [x] Grayed-out dead units (classic mode)
- [x] Deployment position mapping: deployed IDs → chapter spawn positions (capped to available slots)
- [x] Add roster carry-over between chapters (merge recruited units on victory)
- [x] Update chapter init to accept `deployedUnitIds` for roster-based deployment
- [x] Deployment slot limits per arc — ch1 (4 slots), ch2 (4 slots) with `deploymentSlots` + `forceDeploy` wired

## Chapter Configuration Expansion

> **Ref:** [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md), [`specs/gameplay/experience.md`](specs/gameplay/experience.md), [`specs/maps/overview.md`](specs/maps/overview.md)

- [x] Add `events` array to chapter config type
- [x] Add `deploymentSlots` to chapter config
- [x] Add `forceDeploy` to chapter config
- [x] Add `objectiveType` expansion: rout, seize, boss_kill, protect, escape, survive, capture, dual
- [x] Add `parTurns` to chapter config
- [x] Add bonus EXP calculation: `(parTurns - actualTurns) × 50`, max 300, capped at 99 per unit
- [x] Victory check for boss_kill (no boss AI enemy remains)
- [x] Victory check for protect (protected unit dies → defeat)
- [x] Survive objective: victory at start of player phase after N enemy phases
- [x] Lord death → defeat for non-rout objectives
- [x] Sample events wired into ch1 (turn 2 dialogue) and ch2 (turn 2 hint + Genzo defection turn 3)
- [x] `recruitableUnits` field on ChapterData — optional cross-reference for chapter-defined recruitable units
- [x] Escape objective action/resolution logic — Escape button in action menu, Lord escape triggers victory, remaining units auto-escape

## Validation

- [x] Unit tests for event system (19 tests — trigger evaluation incl. custom, effect application, once-only firing)
- [x] Unit tests for recruitment (5 tests — faction swap, Talk action)
- [x] Unit tests for save migration (v1→v2)
- [x] Integration test: test chapter with mid-battle events + recruitment (7 tests)
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — 134 tests pass (13 files)
