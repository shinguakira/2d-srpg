# Phase 4: Meta-Stats + Corruption System

> **Prerequisites:** Phase 1 (event system for CRP triggers)
> **Unlocks:** Arc 3 Maps (ch11-15), Phase 5
> **Critical files:** `src/core/types.ts`, `src/stores/actions/turnActions.ts`, `src/components/Units/`
> **Spec refs:** `specs/gameplay/stats.md`, `specs/gameplay/terrain.md`

## Meta-Stat Types

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [x] Add meta-stats to Unit type: `awr`, `loop`, `sync`, `loy`, `crp`, `sta`
- [x] AWR (Awareness): 0-100, how much unit understands the meta-narrative
- [x] LOOP (Memory): Ren-only, starts at 347, spendable resource
- [x] SYNC (Stability): 0-100, stat consistency affected by glitch exposure
- [x] LOY (Loyalty): per-unit relationship with Ren, 0-100
- [x] CRP (Corruption): 0-100, gained from dark terrain/magic, 100 = turns enemy
- [x] STA (Stamina): 0-45 per chapter, accumulates on actions, resets between chapters
- [x] Initialize default meta-stats per unit in unit data
- [x] Persist meta-stats in save data

## Meta-Stat Display

> **Ref:** [`specs/ui/hud.md`](specs/ui/hud.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [x] Add meta-stat section to UnitStatsPanel (collapsible, below combat stats)
- [x] Show AWR as percentage bar (blue)
- [x] Show LOOP as number (Ren only, gold)
- [x] Show SYNC as percentage bar (green)
- [x] Show LOY as percentage bar (yellow)
- [x] Show CRP as percentage bar (purple/red, flashes at 60+)
- [x] Show STA as bar (orange, dims when high)
- [x] Floating numbers for meta-stat changes during gameplay

## Corruption (CRP) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] CRP gain: +2/turn on glitched terrain tiles
- [x] CRP gain: +3/turn on data void tiles
- [x] CRP gain: +1/turn on corrupted fort tiles
- [x] CRP gain: on hit by dark magic (amount = dark weapon CRP value)
- [x] CRP passive decay: -1/chapter if CRP < 15 for 3+ chapters
- [x] CRP threshold 30: unit sprite flickers occasionally (CSS animation)
- [x] CRP threshold 60: stat drain -1 to all stats, sprite flickers more
- [x] CRP threshold 80: warning overlay on unit, stat drain -2 all
- [x] CRP threshold 100: unit turns enemy (event trigger)
- [x] CRP 100 turn event: show dramatic dialogue, unit becomes enemy faction, permadeath
- [x] Purify effect: staff/light magic reduces CRP by amount
- [x] Light magic bonus: +50% damage vs units with CRP > 0
- [x] Add glitched terrain tile type (visual: flickering/static noise CSS)
- [x] Add data void terrain type (visual: black void, impassable to non-flying)
- [x] Add corrupted fort terrain (heals HP but gives CRP)
- [x] Add broken throne terrain (reduced bonuses, gives CRP)

## Stamina (STA) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [x] STA gain: +1 per tile moved
- [x] STA gain: +3 per attack made
- [x] STA gain: +5 per skill activation
- [x] STA gain: +2 per heal cast
- [x] STA recovery: -3/turn on fort tiles
- [x] STA recovery: -5/turn on throne tiles
- [x] STA reset to 0 at chapter start (in `initActions.ts`, during chapter initialization, before first player phase)
- [x] STA threshold 30: -1 SPD (visual: slight dim on unit)
- [x] STA threshold 45: -2 SPD, -1 SKL (visual: sweat drop icon)
- [x] STA overflow (>45): cannot act, only wait (exhaustion)
- [x] Rest action: skip turn, reduce STA by 10
- [x] Add Rest to action menu when STA > 20

## AWR (Awareness) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [x] AWR gain: +3-5 when witnessing glitch events
- [x] AWR gain: +2 when adjacent to glitched tile at turn end
- [x] AWR gain: +1 per chapter completed
- [x] AWR threshold 30: unit comments on anomalies (dialogue triggers)
- [ ] AWR threshold 61: +1 sight range in fog of war (blocked: needs fog of war system)
- [x] AWR threshold 80: can see enemy meta-stats
- [ ] AWR affects dialogue options (blocked: needs dialogue choice system)

## LOY (Loyalty) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/support-system.md`](specs/gameplay/support-system.md)

- [x] LOY gain: +2 when adjacent to Ren at turn end
- [ ] LOY gain: +3/+5/+8/+12 on support rank C/B/A/S reached (blocked: needs support system)
- [ ] LOY loss: -15 when support partner dies (blocked: needs support system)
- [x] LOY loss: -5 when Ren takes damage and adjacent ally can't help
- [x] LOY threshold 80+: unit gains +1 to all stats when within 3 tiles of Ren
- [x] LOY threshold 30-: unit has chance to disobey commands (5% per action)
- [x] LOY affects recruitment success for conditional recruits

## SYNC (Stability) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] SYNC decrease: -1/turn on glitched terrain
- [x] SYNC decrease: -3 on data void terrain
- [x] SYNC increase: +2/turn on fort tiles
- [x] SYNC increase: +5/turn on memory tiles
- [x] Low SYNC (< 30): stat variance ±2 on each combat (RNG)
- [x] High SYNC (> 80): stat consistency, +5 hit rate

## LOOP (Ren Only)

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md), [`specs/story/characters/ren.md`](specs/story/characters/ren.md)

> Teaching mechanic is defined in Phase 2 (`phase2-promotion-skills.md`).
> LOOP costs and calculations are defined in `campaign-flags.md`.

- [x] LOOP starts at 347 (initialized in unit data)
- [x] LOOP expenditure for terrain overwrite: story events deduct variable LOOP (per-event config)
- [x] LOOP regen: +10 at arc transitions (ch5, ch10, ch15, ch20)
- [x] LOOP affects Memory Blade weapon might: `1 + floor(LOOP / 30)`
- [x] LOOP display: prominent on Ren's stat panel (gold number)
- [x] Add Memory Blade to weapon data: Prf Ren, type sword, might = dynamic (LOOP-based), range 1

## Validation

> All meta-stat calculations defined in `specs/tasks/campaign-flags.md` — reference for expected values.

- [x] Unit tests: CRP accumulation per terrain type (glitched +2, void +3, corrupted fort +1)
- [x] Unit tests: STA accumulation per action type
- [x] Unit tests: STA threshold stat penalties
- [x] Unit tests: LOY gain/loss triggers
- [x] Integration: place unit on glitched tile, verify CRP rises per turn
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — all tests pass
