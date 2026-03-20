# Phase 4: Meta-Stats + Corruption System

> **Prerequisites:** Phase 1 (event system for CRP triggers)
> **Unlocks:** Arc 3 Maps (ch11-15), Phase 5
> **Critical files:** `src/core/types.ts`, `src/stores/actions/turnActions.ts`, `src/components/Units/`
> **Spec refs:** `specs/gameplay/stats.md`, `specs/gameplay/terrain.md`

## Meta-Stat Types

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [ ] Add meta-stats to Unit type: `awr`, `loop`, `sync`, `loy`, `crp`, `sta`
- [ ] AWR (Awareness): 0-100, how much unit understands the meta-narrative
- [ ] LOOP (Memory): Ren-only, starts at 347, spendable resource
- [ ] SYNC (Stability): 0-100, stat consistency affected by glitch exposure
- [ ] LOY (Loyalty): per-unit relationship with Ren, 0-100
- [ ] CRP (Corruption): 0-100, gained from dark terrain/magic, 100 = turns enemy
- [ ] STA (Stamina): 0-45 per chapter, accumulates on actions, resets between chapters
- [ ] Initialize default meta-stats per unit in unit data
- [ ] Persist meta-stats in save data

## Meta-Stat Display

> **Ref:** [`specs/ui/hud.md`](specs/ui/hud.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [ ] Add meta-stat section to UnitStatsPanel (collapsible, below combat stats)
- [ ] Show AWR as percentage bar (blue)
- [ ] Show LOOP as number (Ren only, gold)
- [ ] Show SYNC as percentage bar (green)
- [ ] Show LOY as percentage bar (yellow)
- [ ] Show CRP as percentage bar (purple/red, flashes at 60+)
- [ ] Show STA as bar (orange, dims when high)
- [ ] Floating numbers for meta-stat changes during gameplay

## Corruption (CRP) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [ ] CRP gain: +2/turn on glitched terrain tiles
- [ ] CRP gain: +3/turn on data void tiles
- [ ] CRP gain: +1/turn on corrupted fort tiles
- [ ] CRP gain: on hit by dark magic (amount = dark weapon CRP value)
- [ ] CRP passive decay: -1/chapter if CRP < 15 for 3+ chapters
- [ ] CRP threshold 30: unit sprite flickers occasionally (CSS animation)
- [ ] CRP threshold 60: stat drain -1 to all stats, sprite flickers more
- [ ] CRP threshold 80: warning overlay on unit, stat drain -2 all
- [ ] CRP threshold 100: unit turns enemy (event trigger)
- [ ] CRP 100 turn event: show dramatic dialogue, unit becomes enemy faction, permadeath
- [ ] Purify effect: staff/light magic reduces CRP by amount
- [ ] Light magic bonus: +50% damage vs units with CRP > 0
- [ ] Add glitched terrain tile type (visual: flickering/static noise CSS)
- [ ] Add data void terrain type (visual: black void, impassable to non-flying)
- [ ] Add corrupted fort terrain (heals HP but gives CRP)
- [ ] Add broken throne terrain (reduced bonuses, gives CRP)

## Stamina (STA) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [ ] STA gain: +1 per tile moved
- [ ] STA gain: +3 per attack made
- [ ] STA gain: +5 per skill activation
- [ ] STA gain: +2 per heal cast
- [ ] STA recovery: -3/turn on fort tiles
- [ ] STA recovery: -5/turn on throne tiles
- [ ] STA reset to 0 at chapter start (in `initActions.ts`, during chapter initialization, before first player phase)
- [ ] STA threshold 30: -1 SPD (visual: slight dim on unit)
- [ ] STA threshold 45: -2 SPD, -1 SKL (visual: sweat drop icon)
- [ ] STA overflow (>45): cannot act, only wait (exhaustion)
- [ ] Rest action: skip turn, reduce STA by 10
- [ ] Add Rest to action menu when STA > 20

## AWR (Awareness) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [ ] AWR gain: +3-5 when witnessing glitch events
- [ ] AWR gain: +2 when adjacent to glitched tile at turn end
- [ ] AWR gain: +1 per chapter completed
- [ ] AWR threshold 30: unit comments on anomalies (dialogue triggers)
- [ ] AWR threshold 61: +1 sight range in fog of war
- [ ] AWR threshold 80: can see enemy meta-stats
- [ ] AWR affects dialogue options (higher AWR = more aware dialogue)

## LOY (Loyalty) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/support-system.md`](specs/gameplay/support-system.md)

- [ ] LOY gain: +2 when adjacent to Ren at turn end
- [ ] LOY gain: +3/+5/+8/+12 on support rank C/B/A/S reached
- [ ] LOY loss: -15 when support partner dies
- [ ] LOY loss: -5 when Ren takes damage and adjacent ally can't help
- [ ] LOY threshold 80+: unit gains +1 to all stats when within 3 tiles of Ren
- [ ] LOY threshold 30-: unit has chance to disobey commands (5% per action)
- [ ] LOY affects recruitment success for conditional recruits

## SYNC (Stability) System

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [ ] SYNC decrease: -1/turn on glitched terrain
- [ ] SYNC decrease: -3 on data void terrain
- [ ] SYNC increase: +2/turn on fort tiles
- [ ] SYNC increase: +5/turn on memory tiles
- [ ] Low SYNC (< 30): stat variance ±2 on each combat (RNG)
- [ ] High SYNC (> 80): stat consistency, +5 hit rate

## LOOP (Ren Only)

> **Ref:** [`specs/gameplay/stats.md`](specs/gameplay/stats.md), [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md), [`specs/story/characters/ren.md`](specs/story/characters/ren.md)

> Teaching mechanic is defined in Phase 2 (`phase2-promotion-skills.md`).
> LOOP costs and calculations are defined in `campaign-flags.md`.

- [ ] LOOP starts at 347 (initialized in unit data)
- [ ] LOOP expenditure for terrain overwrite: story events deduct variable LOOP (per-event config)
- [ ] LOOP regen: +10 at arc transitions (ch5, ch10, ch15, ch20)
- [ ] LOOP affects Memory Blade weapon might: `1 + floor(LOOP / 30)`
- [ ] LOOP display: prominent on Ren's stat panel (gold number)
- [ ] Add Memory Blade to weapon data: Prf Ren, type sword, might = dynamic (LOOP-based), range 1

## Validation

> All meta-stat calculations defined in `specs/tasks/campaign-flags.md` — reference for expected values.

- [ ] Unit tests: CRP accumulation per terrain type (glitched +2, void +3, corrupted fort +1)
- [ ] Unit tests: STA accumulation per action type
- [ ] Unit tests: STA threshold stat penalties
- [ ] Unit tests: LOY gain/loss triggers
- [ ] Integration: place unit on glitched tile, verify CRP rises per turn
- [ ] `npm run build` — zero errors
- [ ] `npx vitest run` — all tests pass
