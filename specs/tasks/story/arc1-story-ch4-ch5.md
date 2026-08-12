# Arc 1 Story: Chapters 1-5 — "The Script"

> **Prerequisites:** Gameplay Phase 0 (renamed units), Phase 1 (event system)
> **Spec refs:** `specs/story/chapters/ch1.md` through `ch5.md`, `specs/story/arc-structure.md`
> **Dialogue format:** DialogueLine[] arrays in chapter data files

---

## Chapter 1: "Not This Again" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch1.md`](specs/story/chapters/ch1.md)

- [x] Rename chapter: "Not This Again"
- [x] Rewrite prologue: Shigeru speedruns opening, knows enemy positions
- [x] Add Gareth to playerUnits (5 units total)
- [x] Add Turn 2 event: Gareth's fighting-game confusion dialogue
- [x] Add Turn 3 event: Weapon triangle comedy (rock-paper-scissors)
- [x] Add Turn 4 event: Hagen boss intro (interrupted speech)
- [x] Add boss precombat event (unit_at): Hagen/Shigeru quiet moment about cycles
- [x] Add boss killed event: "See you next cycle" / "Maybe not"
- [x] Rewrite epilogue: Mirelle dating-sim introduction
- [x] Update village dialogue: Shigeru already knows rewards
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Bone → Hagen with deathQuote

## Chapter 2: "The Defector" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch2.md`](specs/story/chapters/ch2.md)

- [x] Rename chapter: "The Defector"
- [x] Add Gareth to playerUnits (5 units total)
- [x] Rewrite prologue: Shigeru names Vidar before anyone told him, Gareth/Mirelle comedy
- [x] Expand Halvar defection: "cycle 298" reference, Gareth reacts
- [x] Add Turn 4 event: Lisette's 17-combat seed observation
- [x] Add boss precombat event: Vidar's professional stance, "347 mornings"
- [x] Add boss killed event: Halvar reflects on Vidar never knowing
- [x] Rewrite epilogue: Broken Seed discovery, seed conversation, Mirelle misinterprets
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Zonta → Vidar (cavalier class) with deathQuote

## Chapter 3: "Scout's Honor" — Full Story + Events

> **Ref:** [`specs/story/chapters/ch3.md`](specs/story/chapters/ch3.md)

- [x] Rename chapter: "Scout's Honor"
- [x] Expand playerUnits to 7 (shigeru, akira, lisette, mirelle, gareth, halvar, bryn)
- [x] Add deploymentSlots: 6, forceDeploy, recruitableUnits
- [x] Rewrite prologue: Gareth's forest cost complaint, Mirelle's tree metaphor
- [x] Add Turn 2 event: Terrain lesson (Gareth hit on plain, Halvar dodges in forest)
- [x] Add Turn 3 event: Bryn rescue dialogue
- [x] Add Turn 5 event: First glitch (forest tile flickers, Lisette notices, Shigeru deflects)
- [x] Add boss precombat event: Olrik duty speech, "347 mornings"
- [x] Add boss killed event: Bryn asks "another way?", Shigeru "Not in this version"
- [x] Rewrite epilogue: Mirelle/Bryn bonding, Lisette questions glitch, Shigeru admits foreknowledge
- [x] Rewrite support conversations (Shigeru/Mirelle, Gareth/Halvar)
- [x] Rename boss: Bazba → Olrik (soldier class) with deathQuote

## Chapter 4: "The Pickpocket" — Theme Change + Fenn

> **Ref:** [`specs/story/chapters/ch4.md`](specs/story/chapters/ch4.md)

- [x] Rename chapter: "The Pickpocket"
- [x] Re-skin enemies from undead to pirate names (same classes/stats)
- [x] Add 2 village tiles to terrain grid (3 total for protection objective)
- [x] Expand playerUnits to 8 (add gareth, halvar, bryn, fenn)
- [x] Add deploymentSlots: 7, forceDeploy, recruitableUnits: ['fenn']
- [x] Rewrite prologue: Pirates, Gareth wants loot, protect storehouses
- [x] Add Turn 2 event: Thief rush warning, split party comedy
- [x] Add Turn 3 event: Fenn encounter (stealth-game persona, crouching invisibility)
- [x] Add Turn 5 event: Village pressure warning
- [x] Add boss precombat event: Brask's mercenary attitude
- [x] Add boss killed event: Gareth/Fenn loot comedy
- [x] Rewrite epilogue: Fenn joins, belt pouch stolen, marketplace flickering CRP hint
- [x] New support conversations: Fenn/Gareth (loot), Halvar/Bryn (silence)
- [x] Change boss: Naxos → Brask (fighter, aggressive AI) with deathQuote

## Chapter 5: "Above the Clouds" — Dialogue Polish

> **Ref:** [`specs/story/chapters/ch5.md`](specs/story/chapters/ch5.md)

- [x] Polish prologue: Elin "clouds loading in SQUARES", more urgent tone
- [x] Polish epilogue: Match spec wording (Lisette's seed reveal, Akira's confidence, Shigeru's "broken tiles")
- [x] Mid-battle events already spec-aligned (terrain shift, data void, forecast flicker, boss approach)
- [x] Boss portraits added: Elin, Hagen, Vidar, Olrik, Brask, Roderic

## Character Voice Notes (Applied Across All Chapters)

- [x] Shigeru: tired wisdom, tries to protect others from truth, speaks in hints
- [x] Akira: earnest, brave, loyal — doesn't fully understand but trusts Shigeru
- [x] Lisette: analytical, speaks in data terms, shaken when data fails
- [x] Gareth: direct, combat-focused, comic relief through bluntness
- [x] Mirelle: empathetic, dating-sim genre-displaced, sees everything as relationship building
- [x] Halvar: dry, observational, questions why things work the way they do
- [x] Bryn: perceptive, quiet, minimal words
- [x] Fenn: genre-displaced (stealth game), speaks in game terminology
- [x] Elin: wide-eyed, saw impossible things, needs answers

## Validation

- [x] `npm run build` — zero type errors
- [x] `npx vitest run` — all 628 tests pass
- [x] Boss unit IDs updated in chapter enemy placements (hagen, vidar)
- [x] Speaker portraits added for all bosses + Elin
- [x] Campaign config chapter names updated
- [x] Tone progression: meta-comedy → serious by ch5 epilogue
