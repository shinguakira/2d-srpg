# Phase 1: Recruitment System + Mid-Battle Events

> **Prerequisites:** Phase 0 (expanded types, renamed units)
> **Unlocks:** Arc 1 Maps (ch5), Arc 1 Story (ch4-5), Phase 2, Phase 4
> **Critical files:** `src/core/types.ts`, `src/stores/actions/`, `src/components/`
> **Spec refs:** `specs/gameplay/battle-logic.md`, `specs/gameplay/campaign.md`

## Event System — Core Engine

> **Ref:** [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md), [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md)

- [ ] Define `ChapterEvent` type in `types.ts`:
  - `id`, `trigger` (condition), `effect` (action), `once` (boolean), `fired` (boolean)
- [ ] Define trigger types: `turn_start(n)`, `turn_end(n)`, `unit_at(unitId, row, col)`, `unit_hp_below(unitId, pct)`, `unit_killed(unitId)`, `tile_visited(row, col)`, `phase_start(faction)`, `custom(fn)`
- [ ] Define effect types: `spawn_units(units[])`, `change_terrain(pos, newType)`, `show_dialogue(scene)`, `change_ai(unitId, newBehavior)`, `remove_unit(unitId)`, `recruit_unit(unitId)`, `set_flag(key, value)`, `chain(effects[])`
- [ ] Create `src/core/events.ts` — pure event evaluation logic
- [ ] Add `chapterEvents: ChapterEvent[]` to GameState in `gameStoreTypes.ts`
- [ ] Add `firedEventIds: Set<string>` to GameState for one-shot tracking
- [ ] Create `src/stores/actions/eventActions.ts` — evaluate events on phase transitions
- [ ] Hook event evaluation into `turnActions.ts` at phase start/end
- [ ] Hook event evaluation into `movementActions.ts` after unit moves
- [ ] Hook event evaluation into `combatActions.ts` after combat resolves
- [ ] Unit tests: event trigger matching, effect application, once-only firing

## Event System — Visual Effects

> **Ref:** [`specs/ui/animations.md`](specs/ui/animations.md)

- [ ] Mid-battle dialogue overlay component (reuse DialogueBox with battle still visible)
- [ ] Terrain change animation (tile flicker + swap)
- [ ] Unit spawn animation (fade in on tile)
- [ ] Unit removal animation (fade out)
- [ ] Event queue processing — sequential, wait for dialogue dismiss before next
- [ ] Pause enemy AI execution during event dialogue

## Recruitment System — Core

> **Ref:** [`specs/story/roster.md`](specs/story/roster.md), [`specs/story/characters.md`](specs/story/characters.md)

- [ ] Add `faction` field expansion: `'player' | 'enemy' | 'ally' | 'neutral'`
- [ ] Add ally faction AI: moves independently, does not block player tiles
- [ ] Ally units render with green tint (distinct from blue player, red enemy)
- [ ] Add `recruitableBy` field to Unit type (which unit ID can recruit via Talk)
- [ ] Add `recruitCondition` field: `'talk' | 'visit_village' | 'event' | 'defection'`
- [ ] Add `Talk` action to action menu (shows when adjacent to recruitable unit)
- [ ] Talk action resolution: change unit faction from enemy/ally → player
- [ ] Enemy defection: event-triggered faction swap (Voss-style, ch2)
- [ ] Village recruitment: visit village tile triggers unit join (Nira-style, ch3)
- [ ] Conditional recruitment: unit joins only if specific conditions met (Coda-style, ch4)
- [ ] Recruited unit inherits current HP/stats (not reset)
- [ ] Unit tests: faction swap, Talk action availability, recruitment conditions

## Roster & Deployment System

> **Ref:** [`specs/progression/preparation.md`](specs/progression/preparation.md), [`specs/progression/campaign.md`](specs/progression/campaign.md)

- [ ] Add `roster: Unit[]` to campaign state (all recruited units across chapters)
- [ ] Persist roster in save data (campaignStore)
- [ ] Add `deploymentSlots` per chapter config (max units deployable)
- [ ] Add `forceDeploy` per chapter config (units that must be deployed, e.g., Ren)
- [ ] Preparation screen: show roster, allow drag/select to deploy up to slot limit
- [ ] Grayed-out units not selected for deployment
- [ ] Unit order in deployment maps to spawn tile order (row-by-row)
- [ ] Deployment slot limits per arc: Arc1=3→6, Arc2=6→8, Arc3=8→10, Arc4=10→12, Arc5=12
- [ ] Add roster carry-over between chapters (persist level, stats, inventory)
- [ ] Update chapter init to use roster + deployment selection instead of hardcoded units

## Chapter Configuration Expansion

> **Ref:** [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md), [`specs/gameplay/experience.md`](specs/gameplay/experience.md), [`specs/maps/overview.md`](specs/maps/overview.md)

- [ ] Add `events` array to chapter config type
- [ ] Add `recruitableUnits` to chapter config
- [ ] Add `deploymentSlots` to chapter config
- [ ] Add `forceDeploy` to chapter config
- [ ] Add `objectiveType` to chapter config (beyond just rout/seize)
- [ ] Add `parTurns` to chapter config (for bonus EXP calculation)
- [ ] Add `bonusEXP` calculation: `(parTurns - actualTurns) × 50`, max 300
- [ ] Update chapter victory check to support boss_kill, protect, escape, survive objectives
- [ ] Add survive objective: victory after N turns if Ren alive
- [ ] Add boss_kill objective: victory when specific unit defeated

## Validation

- [ ] Unit tests for event system (trigger evaluation, effect application)
- [ ] Unit tests for recruitment (faction swap, Talk action, conditions)
- [ ] Integration: create test chapter with mid-battle event + recruitment
- [ ] `npm run build` — zero errors
- [ ] `npx vitest run` — all tests pass
