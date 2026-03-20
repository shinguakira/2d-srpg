# Phase 2: Promotion System + Skills Framework

> **Prerequisites:** Phase 0 (expanded classes), Phase 1 (event system)
> **Unlocks:** Phase 3 (Advanced AI + Actions)
> **Critical files:** `src/core/types.ts`, `src/data/classes.ts`, `src/stores/actions/`
> **Spec refs:** `specs/gameplay/promotion.md`, `specs/gameplay/skills.md`, `specs/gameplay/classes-expanded.md`

## Promotion System — Data

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md), [`specs/gameplay/classes-expanded.md`](specs/gameplay/classes-expanded.md)

- [ ] Define `ClassTier` type: `'base' | 'promoted' | 'master'`
- [ ] Add `tier` field to class definitions
- [ ] Add `promotesTo` field: array of promoted class IDs per base class
- [ ] Add `promotesFrom` field: base class ID (for reverse lookup)
- [ ] Define all promoted classes (2 per base, ~12 total):
  - Lord → Vanguard, Strategist
  - Cavalier → Paladin, Great Knight
  - Mage → Sage, Mage Knight
  - Fighter → Warrior, Berserker
  - Cleric → Bishop, Valkyrie
  - Soldier → Halberdier, General
  - Archer → Sniper, Bow Knight
  - Thief → Assassin, Trickster
  - Pegasus Knight → Falcon Knight, Dark Flier
  - Wyvern Rider → Wyvern Lord, Malig Knight
  - Mercenary → Hero, Swordmaster
  - Shaman → Druid, Dark Knight
- [ ] Define promotion stat bonuses per class: +2 HP, +1 MOV, +2-4 key stats
- [ ] Define stat caps: base=20, promoted=30
- [ ] Add promoted class weapon proficiencies (some gain new weapon types)

## Promotion System — Logic

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md)

- [ ] Create `src/core/promotion.ts` — pure promotion logic
- [ ] `canPromote(unit)`: level >= 15, has correct item, not already promoted
- [ ] `getPromotionOptions(unit)`: returns available promoted classes
- [ ] `applyPromotion(unit, targetClass)`: change class, apply stat bonuses, update caps
- [ ] Level continuity: promotion does NOT reset level
- [ ] MOV bonus: +1 for foot units on promotion
- [ ] Stat cap increase on promotion (base 20 → promoted 30)
- [ ] Consume promotion item on use

## Promotion System — UI

> **Ref:** [`specs/gameplay/promotion.md`](specs/gameplay/promotion.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [ ] Add promotion items to item data: Hero Crest, Knight Crest, Guiding Ring, Elysian Whip, Master Seal
- [ ] Master Seal promotes any class (universal)
- [ ] Class-specific items: Hero Crest (melee foot), Knight Crest (mounted), etc.
- [ ] Promotion choice screen: show 2 class options with stat previews
- [ ] Promotion available from preparation screen (use item on unit)
- [ ] Promotion animation/fanfare (class sprite change + stat flash)
- [ ] Update unit sprite rendering after promotion (new class sprite)
- [ ] Update combat calculations to use promoted class stats/caps

## Skills Framework — Data

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [ ] Define `Skill` type: `id`, `name`, `category`, `description`, `activationRate`, `effect`
- [ ] Skill categories: `combat`, `movement`, `support`, `meta`, `passive`
- [ ] Add `skills: string[]` to Unit type (equipped skill IDs)
- [ ] Add `learnedSkills: string[]` to Unit type (full skill pool)
- [ ] Add `skillSlots` derived from level: `min(10, 2 + floor((level - 1) / 3))` — clamped at 10
- [ ] Create `src/data/skills.ts` — all skill definitions

## Skills — Priority Combat Skills (15)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/combat.md`](specs/gameplay/combat.md)

- [ ] Vantage: if HP ≤ 50%, attack first (activation: SKL%) — **priority 1** (resolves before all other skills)
- [ ] Wrath: if HP ≤ 50%, +20 crit (passive) — stacks with Vantage (both trigger at ≤50% but Vantage is order, Wrath is stat)
- [ ] Pursuit: double attack threshold reduced from 5 to 3 SPD diff (passive)
- [ ] Sol: heal HP = damage dealt (activation: SKL%)
- [ ] Luna: ignore 50% enemy DEF/RES (activation: SKL%)
- [ ] Astra: 5 consecutive hits at 50% damage (activation: SKL/2%)
- [ ] Counter: reflect ranged damage back at attacker (passive, melee only units)
- [ ] Aegis: halve incoming magic damage (activation: SKL%)
- [ ] Pavise: halve incoming physical damage (activation: SKL%)
- [ ] Lethality: instant kill (activation: SKL/4%)
- [ ] Adept: follow-up attack (activation: SPD%)
- [ ] Miracle: survive lethal hit at 1 HP (activation: LCK%)
- [ ] Renewal: heal 10% max HP at turn start (passive)
- [ ] Quick Riposte: always double on counter-attack if HP ≥ 70% (passive)
- [ ] Nihil: negate enemy skills in combat (passive)

## Skills — Movement Skills (5)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md)

- [ ] Canto: after combat/action, spend remaining MOV (cavalier innate)
- [ ] Pass: move through enemy units (passive)
- [ ] Shove: push adjacent ally 1 tile in facing direction (action)
- [ ] Swap: swap positions with adjacent ally (action)
- [ ] Reposition: move ally to opposite side of self (action)

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

- [ ] Create `src/core/skills.ts` — skill activation logic with precedence order above
- [ ] Hook skill checks into combat resolution (`combatActions.ts`)
- [ ] Implement precedence chain: Nihil → Vantage → per-hit skills → defense skills → passives
- [ ] Vantage: check before attack order determination
- [ ] Sol/Luna/Astra/Lethality: check on each attack hit (mutually exclusive per hit — first to activate wins)
- [ ] Aegis/Pavise: check on damage received
- [ ] Miracle: check on lethal damage (last defense check)
- [ ] Update combat forecast to show skill activation chances
- [ ] Skill activation visual during combat animation (name text flash)
- [ ] Movement skills: add Shove/Swap/Reposition to action menu
- [ ] Canto: after action, show remaining movement tiles
- [ ] Skill equip UI in preparation screen (drag skills to/from slots)
- [ ] Class innate skills auto-equipped, don't use slots

## Ren's Teaching (LOOP Expenditure)

> **Ref:** [`specs/gameplay/skills.md`](specs/gameplay/skills.md), [`specs/gameplay/stats.md`](specs/gameplay/stats.md)

> Teaching costs LOOP and inflicts CRP on both Ren and the student.
> See `specs/tasks/campaign-flags.md` for exact LOOP costs.

- [ ] Teaching UI in preparation screen: Ren selects ally → choose skill to teach
- [ ] Teaching costs: combat skill = 10 LOOP, meta skill = 15 LOOP, movement skill = 5 LOOP
- [ ] CRP cost: +2 CRP to both Ren and student per teaching
- [ ] Student permanently learns the skill (added to `learnedSkills`)
- [ ] Teaching only available if Ren has enough LOOP
- [ ] Teaching only available during preparation (not mid-battle)
- [ ] Teachable skills: subset of Ren's learned skills (not class-locked or innate)

## Validation

- [ ] Unit tests: promotion eligibility, stat bonus application, level continuity
- [ ] Unit tests: each skill activation rate, combat effect
- [ ] Unit tests: skill slot calculation by level (clamped at 10)
- [ ] Unit tests: skill precedence chain — Vantage fires before attack, Nihil disables skills
- [ ] Unit tests: mutually exclusive per-hit skills (Sol vs Luna vs Astra — first wins)
- [ ] Unit tests: teaching LOOP cost deduction, CRP application
- [ ] `npm run build` — zero errors
- [ ] `npx vitest run` — all tests pass
