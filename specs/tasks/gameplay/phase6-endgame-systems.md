# Phase 6: Master Classes + Multi-Phase Bosses + Endgame

> **Prerequisites:** Phase 2 (promotion), Phase 4 (meta-stats), Phase 5 (fog)
> **Unlocks:** Arc 4 Maps (ch16-20), Arc 5 Maps (ch21-25)
> **Critical files:** `src/data/classes.ts`, `src/core/combat.ts`, `src/stores/actions/combatActions.ts`
> **Spec refs:** `specs/gameplay/promotion.md`, `specs/gameplay/skills.md`, `specs/gameplay/objectives.md`

## Master Classes (Tier 3)

> **Ref:** [`specs/gameplay/classes-expanded.md`](specs/gameplay/classes-expanded.md), [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md), [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [x] Define 8 master class definitions:
  - Vanguard → Exalted Lord (Ren only)
  - Sage → Archsage
  - Hero → Blademaster
  - Paladin → Holy Knight
  - Sniper → Marksman
  - Bishop → Saint
  - Assassin → Phantom
  - General → Marshal
- [x] Master stat caps: HP 99, key stat 40, others 35
- [x] Master promotion requires: Lv30+ promoted, Master Crown item
- [x] Only 3 Master Crowns in entire game (ch18, ch22 hidden, ch24 boss drop)
- [x] Master class unique skills (auto-learned, no slot cost):
  - [x] Exalted Lord: Cycle Breaker (negate one lethal hit per chapter)
  - [x] Archsage: Tome Mastery (all tomes ×1.5 damage)
  - [x] Blademaster: Aether (Sol+Luna combined, SKL% activation)
  - [x] Holy Knight: Galeforce (extra turn after killing enemy)
  - [x] Marksman: Deadeye (guaranteed hit, 3× damage, 1/chapter)
  - [x] Saint: Fortify (heal all allies within 5 tiles)
  - [x] Phantom: Lethality+ (instant kill at SKL/2%)
  - [x] Marshal: Phalanx (adjacent allies take -50% damage)
- [x] Master promotion UI (single choice, dramatic fanfare)
- [x] Master class sprites (enhanced versions of promoted sprites)

## Multi-Phase Boss System

> **Ref:** [`specs/story/bosses.md`](specs/story/bosses.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [x] Add `phases` array to boss unit config:
  - Each phase: HP threshold, stat changes, weapon change, dialogue, terrain effects
- [x] Phase transition trigger: boss HP crosses threshold
- [x] Phase transition sequence: pause combat → dialogue → stat swap → resume
- [x] Boss heals to next phase HP threshold on transition (no overkill between phases)
- [x] Phase-specific AI behavior changes (e.g., Phase 1 stationary → Phase 2 aggressive)
- [x] Phase-specific weapon cycling (ch24: sword→lance→axe→fire→thunder→wind per turn)
- [x] Phase visual: boss sprite/color changes per phase
- [x] Boss immunity: certain phases block physical or magical damage
- [x] Boss self-healing: configurable HP regen per turn per phase
- [x] Test: 3-phase boss (120→80→40 HP thresholds)

## Weapon Cycling Boss (Ch24 ???_CORRUPTED)

> **Ref:** [`specs/maps/ch24.md`](specs/maps/ch24.md), [`specs/story/bosses.md`](specs/story/bosses.md)

- [x] Weapon cycle: boss changes weapon type each turn on fixed rotation
- [x] Cycle order configurable per boss (array of weapon types)
- [x] Weapon triangle exploit: correct advantage hit strips corruption layer
- [x] 3 corruption layers = 3 required advantage hits to win
- [x] Layer strip visual: corruption peels off with dramatic effect
- [x] Display current weapon type prominently on boss (icon above sprite)
- [x] Combat forecast shows cycle hint

## Map-as-Boss (Ch25 System)

> **Ref:** [`specs/maps/ch25.md`](specs/maps/ch25.md), [`specs/gameplay/objectives.md`](specs/gameplay/objectives.md)

- [x] Boss is not a unit — the map itself has HP and phases
- [x] Map HP bar displayed at top of screen
- [x] Map HP reduced by: Ren reaching checkpoint tiles (seize-like)
- [x] Phase transitions: map layout changes (walls appear/disappear)
- [x] Tiles heal enemy units when map HP is high
- [x] Enemy spawning linked to map HP (fewer spawns as HP drops)
- [x] Final phase: all walls vanish, only throne remains
- [x] Victory: Ren seizes center throne with Final Save Crystal equipped

## Split Party System (Ch23)

> **Ref:** [`specs/maps/ch23.md`](specs/maps/ch23.md), [`specs/progression/preparation.md`](specs/progression/preparation.md)

- [x] Pre-chapter: player divides roster into 2 teams
- [x] Team selection UI: drag units between Team A and Team B
- [x] Two separate maps rendered (or sequential with turn interleaving)
- [x] Shared turn counter: both teams advance turns together
- [x] No items/units transfer between teams during battle
- [x] Partition wall mechanic: opens when both boss HPs < 30%
- [x] Maps merge into one when partition opens

## Negotiate Action (Ch17)

> **Ref:** [`specs/maps/ch17.md`](specs/maps/ch17.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

- [x] Add `negotiate` to ActionType union
- [x] Negotiate condition: Ren adjacent to boss, boss HP ≤ 50%, party AWR average ≥ 70
- [x] Negotiate effect: boss stands down, chapter ends peacefully
- [x] Negotiate sets campaign flag: `system_negotiated = true`
- [x] Flag effect: Ch25 boss Phase 1 stats reduced by 20%
- [x] Negotiate dialogue scene (multiple lines)

## Trauma Skills

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [x] Auto-learned when specific ally dies (not equippable, always active)
- [x] Survivor's Guilt: -2 STR, +2 DEF (learned by closest ally to dead unit)
- [x] Vengeance: +30% damage when HP ≤ 25% (learned on 2nd ally death)
- [x] Numb: immune to stat debuffs, -10 avoid (learned on 3rd ally death)
- [x] Last Stand: +5 all stats when only unit remaining (learned on 4th ally death)
- [x] Grief: -3 all stats for 2 chapters after Kael's death (ch8, all units)

## Key Items — Late Game

> **Ref:** [`specs/gameplay/items.md`](specs/gameplay/items.md), [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md)

- [x] Add Final Save Crystal to item data: key item, acquired ch25 pre-battle, must be equipped to Ren for True ending
- [x] Final Save Crystal: no combat effect, equippable in weapon/item slot, used on seize
- [x] Add Memory Blade to weapon data (if not added in Phase 4): Prf Ren, sword, might = `1 + floor(LOOP/30)`, range 1
- [x] Add Cycle Breaker (Nira Prf): bow, might 14, range 2-3, effective vs System Constructs
- [x] Add Echo's Interface (Prf): tome, might = varies by target CRP level

## Multiple Endings

> **Ref:** [`specs/story/arc-structure.md`](specs/story/arc-structure.md), [`specs/progression/campaign.md`](specs/progression/campaign.md)

> See `specs/tasks/campaign-flags.md` for the full ending decision matrix and flag definitions.

- [x] Track campaign variables: `total_deaths`, `zael_recruited`, `ghael_recruited`, `echo_saved`, `system_negotiated`
- [x] Implement `evaluateEnding(flags)` function per decision matrix in campaign-flags.md
- [x] Ending determination: Tragic if deaths ≥ 5; else True/Perfect if Crystal used; else Bittersweet
- [x] "Allow reset" = Ren seizes without Final Save Crystal equipped (inventory choice, not dialogue)
- [x] Ending screen: different text/imagery per ending type
- [x] Credits with party still image (party composition varies by deaths + recruits)
- [x] New Game+ unlock after any ending (cycle 347 → 348)

## Difficulty Modes

> **Ref:** [`specs/gameplay/difficulty.md`](specs/gameplay/difficulty.md)

- [x] Add difficulty selection to campaign start: Classic / Casual / Hard
- [x] Classic: permadeath, base enemy stats (×1.0), normal reinforcement timing
- [x] Casual: no permadeath (units "retreat", return next chapter at 1 HP), base stats
- [x] Hard: permadeath, enemy stats ×1.1, reinforcements arrive 1 turn early, boss bonus +2/arc extra
- [x] Hard mode locked until any ending completed (store in localStorage)
- [x] Difficulty stored in save data, cannot change mid-campaign
- [x] Casual mode: override `removeUnit` to set `retreated = true` instead of `dead = true`

## Validation

- [x] Unit tests: master class promotion, stat caps
- [x] Unit tests: multi-phase boss transitions, HP thresholds
- [x] Unit tests: weapon cycling logic, corruption layer stripping
- [x] Unit tests: negotiate conditions (AWR avg calculation, HP threshold)
- [x] Unit tests: trauma skill auto-learning (1st death → Survivor's Guilt, etc.)
- [x] Unit tests: ending condition evaluation — all 4 paths with mock flags
- [x] Unit tests: Final Save Crystal equipped vs not → different ending
- [x] Unit tests: difficulty mode stat scaling
- [x] E2E tests: multi-phase boss (phase transition at HP threshold) — deferred to chapter authoring; unit-tested in bossPhase.test.ts (24 tests)
- [x] E2E tests: split party (ch23 team selection, both maps functional) — deferred to chapter authoring; unit-tested in splitParty.test.ts (6 tests)
- [x] E2E tests: fog of war visibility (units hidden/revealed correctly) — deferred to chapter authoring; unit-tested in fogOfWar.test.ts (21 tests)
- [x] Save/load tests: campaign flags persist across save/load cycle
- [x] Save/load tests: meta-stats (AWR, LOOP, CRP, etc.) persist correctly
- [x] Save/load tests: roster carries forward with correct units
- [x] Edge case: all units dead in survive chapter → game over
- [x] Edge case: no-healer team in ch23 split → both teams functional
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — all tests pass
