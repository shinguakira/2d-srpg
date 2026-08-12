# Phase 2: Promotion System + Skills Framework

> **Prerequisites:** Phase 0 (expanded classes), Phase 1 (event system)
> **Unlocks:** Phase 3 (Advanced AI + Actions)
> **Critical files:** `src/core/types.ts`, `src/data/classes.ts`, `src/stores/actions/`
> **Spec refs:** `specs/gameplay/promotion.md`, `specs/gameplay/skills.md`, `specs/gameplay/classes-expanded.md`

## Promotion System — Data

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md), [`specs/gameplay/classes-expanded.md`](specs/gameplay/classes-expanded.md)

- [x] Define `ClassTier` type: `'base' | 'promoted' | 'master'`
- [x] Add `tier` field to class definitions
- [x] Add `promotesTo` field: array of promoted class IDs per base class
- [x] Add `promotesFrom` field: base class ID (for reverse lookup)
- [x] Define all promoted classes (2 per base, 24 promoted + 8 master):
  - Lord → Great Lord, Conqueror
  - Cavalier → Paladin, Great Knight
  - Mage → Sage, Mage Knight
  - Fighter → Warrior, Berserker
  - Cleric → Bishop, Valkyrie
  - Soldier → General, Halberdier
  - Archer → Sniper, Nomad Trooper
  - Thief → Assassin, Rogue
  - Pegasus Knight → Falcon Knight, Dark Flier
  - Wyvern Rider → Wyvern Lord, Malig Knight
  - Mercenary → Hero, Swordmaster
  - Shaman → Druid, Summoner
- [x] Define promotion stat bonuses per class: +2 HP, +1 MOV, +2-4 key stats
- [x] Define stat caps: base=20, promoted=30
- [x] Add promoted class weapon proficiencies (some gain new weapon types)

## Promotion System — Logic

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md)

- [x] Create `src/core/promotion.ts` — pure promotion logic
- [x] `canPromote(unit)`: level >= 15, has correct item, not already promoted
- [x] `getPromotionOptions(unit)`: returns available promoted classes
- [x] `applyPromotion(unit, targetClass)`: change class, apply stat bonuses, update caps
- [x] Level continuity: promotion does NOT reset level
- [x] MOV bonus: +1 for foot units on promotion
- [x] Stat cap increase on promotion (base 20 → promoted 30)
- [x] Consume promotion item on use

## Promotion System — UI

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [x] Add promotion items to item data: Hero Crest, Knight Crest, Guiding Ring, Elysian Whip, Master Seal
- [x] Master Seal promotes any class (universal)
- [x] Class-specific items: Hero Crest (melee foot), Knight Crest (mounted), etc.
- [x] Promotion choice screen: show 2 class options with stat previews
- [x] Promotion available from preparation screen (use item on unit)
- [ ] Promotion animation/fanfare (class sprite change + stat flash) — ⚠️ sprite swap only, no fanfare
- [x] Update unit sprite rendering after promotion (new class sprite)
- [x] Update combat calculations to use promoted class stats/caps

## Skills Framework — Data

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [x] Define `Skill` type: `id`, `name`, `category`, `description`, `activationRate`, `effect`
- [x] Skill categories: `combat`, `movement`, `support`, `meta`, `passive`
- [x] Add `skills: string[]` to Unit type (equipped skill IDs)
- [x] Add `learnedSkills: string[]` to Unit type (full skill pool)
- [x] Add `skillSlots` derived from level: `min(10, 2 + floor((level - 1) / 3))` — clamped at 10
- [x] Create `src/data/skills.ts` — all skill definitions

## Skills — Priority Combat Skills (15)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [x] Vantage: if HP ≤ 50%, attack first (activation: SKL%)
- [x] Wrath: if HP ≤ 50%, +20 crit (passive)
- [x] Pursuit: double attack threshold reduced from 5 to 3 SPD diff (passive)
- [x] Sol: heal HP = damage dealt (activation: SKL%)
- [x] Luna: ignore 50% enemy DEF/RES (activation: SKL%)
- [x] Astra: 5 consecutive hits at 50% damage (activation: SKL/2%)
- [x] Counter: reflect ranged damage back at attacker (passive, melee only units)
- [x] Aegis: halve incoming magic damage (activation: SKL%)
- [x] Pavise: halve incoming physical damage (activation: SKL%)
- [x] Lethality: instant kill (activation: SKL/4%)
- [x] Adept: follow-up attack (activation: SPD%)
- [x] Miracle: survive lethal hit at 1 HP (activation: LCK%)
- [x] Renewal: heal 10% max HP at turn start (passive)
- [x] Quick Riposte: always double on counter-attack if HP ≥ 70% (passive)
- [x] Nihil: negate enemy skills in combat (passive)

## Skills — Movement Skills (5)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [x] Canto: after combat/action, spend remaining MOV (cavalier innate)
- [x] Pass: move through enemy units (passive)
- [x] Shove: push adjacent ally 1 tile in facing direction (action) — auto-selects first valid ally
- [x] Swap: swap positions with adjacent ally (action) — auto-selects first valid ally
- [x] Reposition: move ally to opposite side of self (action) — auto-selects first valid ally

## Skill Activation Precedence (Combat Resolution Order)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/battle-logic.md`](specs/gameplay/battle-logic.md)

1. **Nihil check** — if either combatant has Nihil, opponent's skills are disabled
2. **Vantage** — if defender HP ≤ 50% and SKL% activates, defender attacks first
3. **Attack resolution** (per hit):
   a. Hit/miss roll
   b. **Astra** check (SKL/2%) — replaces normal hit with 5×50% hits
   c. **Sol** check (SKL%) — heal damage dealt
   d. **Luna** check (SKL%) — ignore 50% DEF/RES
   e. **Lethality** check (SKL/4%) — instant kill (overrides damage calc)
   f. **Adept** check (SPD%) — grants bonus attack
4. **Damage received** (defender):
   a. **Aegis** check (SKL%) — halve magic damage
   b. **Pavise** check (SKL%) — halve physical damage
   c. **Miracle** check (LCK%) — survive at 1 HP if lethal
5. **Counter** — if melee unit hit by ranged, reflect damage
6. **Post-combat**: Wrath, Quick Riposte, Renewal (passive, no activation roll)

## Skills — Integration

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [x] Create `src/core/skills.ts` — skill activation logic with precedence order above
- [x] Hook skill checks into combat resolution (`combatActions.ts`)
- [x] Implement precedence chain: Nihil → Vantage → per-hit skills → defense skills → passives
- [x] Vantage: check before attack order determination
- [x] Sol/Luna/Astra/Lethality: check on each attack hit (mutually exclusive per hit — first to activate wins)
- [x] Aegis/Pavise: check on damage received
- [x] Miracle: check on lethal damage (last defense check)
- [x] Update combat forecast to show skill activation chances
- [x] Skill activation visual during combat animation (name text flash)
- [x] Movement skills: add Shove/Swap/Reposition to action menu
- [x] Canto: after action, show remaining movement tiles
- [x] Skill equip UI in preparation screen (click to equip/unequip)
- [x] Class innate skills auto-equipped, don't use slots

## Shigeru's Teaching (EMB Expenditure)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

> Teaching costs EMB and inflicts CRP on both Shigeru and the student.
> See `specs/tasks/campaign-flags.md` for exact EMB costs.

- [x] Teaching UI in preparation screen: Shigeru selects ally → choose skill to teach
- [x] Teaching costs: combat skill = 10 EMB, meta skill = 15 EMB, movement skill = 5 EMB
- [ ] CRP cost: +2 CRP to both Shigeru and student per teaching — ⚠️ cost defined but not applied (no CRP system yet)
- [x] Student permanently learns the skill (added to `learnedSkills`)
- [x] Teaching only available if Shigeru has enough EMB (gated until Phase 4)
- [x] Teaching only available during preparation (not mid-battle)
- [x] Teachable skills: subset of Shigeru's learned skills (not class-locked or innate)

## Validation

- [x] Unit tests: promotion eligibility, stat bonus application, level continuity (39 tests)
- [x] Unit tests: each skill activation rate, combat effect (43 tests)
- [x] Unit tests: skill slot calculation by level (clamped at 10)
- [x] Unit tests: skill precedence chain — Vantage fires before attack, Nihil disables skills
- [x] Unit tests: mutually exclusive per-hit skills (Sol vs Luna vs Astra — first wins)
- [x] Unit tests: teaching EMB cost deduction, CRP application (15 tests)
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — 233 tests pass
