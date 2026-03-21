# Arc 1 Story: Chapters 1-5 — "The Script"

> **Prerequisites:** Gameplay Phase 0 (renamed units), Phase 1 (event system)
> **Spec refs:** `specs/story/chapters/ch1.md` through `ch5.md`, `specs/story/arc-structure.md`
> **Dialogue format:** DialogueLine[] arrays in chapter data files

---

## Chapter 1: "Not This Again" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch1.md`](specs/story/chapters/ch1.md)

- [x] Rename chapter: "Not This Again"
- [x] Rewrite prologue: Ren speedruns opening, knows enemy positions
- [x] Add Bram to playerUnits (5 units total)
- [x] Add Turn 2 event: Bram's fighting-game confusion dialogue
- [x] Add Turn 3 event: Weapon triangle comedy (rock-paper-scissors)
- [x] Add Turn 4 event: Garrek boss intro (interrupted speech)
- [x] Add boss precombat event (unit_at): Garrek/Ren quiet moment about cycles
- [x] Add boss killed event: "See you next cycle" / "Maybe not"
- [x] Rewrite epilogue: Lira dating-sim introduction
- [x] Update village dialogue: Ren already knows rewards
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Bone → Garrek with deathQuote

## Chapter 2: "The Defector" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch2.md`](specs/story/chapters/ch2.md)

- [x] Rename chapter: "The Defector"
- [x] Add Bram to playerUnits (5 units total)
- [x] Rewrite prologue: Ren names Thane before anyone told him, Bram/Lira comedy
- [x] Expand Voss defection: "cycle 298" reference, Bram reacts
- [x] Add Turn 4 event: Senna's 17-combat seed observation
- [x] Add boss precombat event: Thane's professional stance, "347 mornings"
- [x] Add boss killed event: Voss reflects on Thane never knowing
- [x] Rewrite epilogue: Broken Seed discovery, seed conversation, Lira misinterprets
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Zonta → Thane (cavalier class) with deathQuote

## Chapter 3: "Scout's Honor" — Full Story + Events

> **Ref:** [`specs/story/chapters/ch3.md`](specs/story/chapters/ch3.md)

- [x] Rename chapter: "Scout's Honor"
- [x] Expand playerUnits to 7 (ren, kael, senna, lira, bram, voss, nira)
- [x] Add deploymentSlots: 6, forceDeploy, recruitableUnits
- [x] Rewrite prologue: Bram's forest cost complaint, Lira's tree metaphor
- [x] Add Turn 2 event: Terrain lesson (Bram hit on plain, Voss dodges in forest)
- [x] Add Turn 3 event: Nira rescue dialogue
- [x] Add Turn 5 event: First glitch (forest tile flickers, Senna notices, Ren deflects)
- [x] Add boss precombat event: Holtz duty speech, "347 mornings"
- [x] Add boss killed event: Nira asks "another way?", Ren "Not in this version"
- [x] Rewrite epilogue: Lira/Nira bonding, Senna questions glitch, Ren admits foreknowledge
- [x] Rewrite support conversations (Ren/Lira, Bram/Voss)
- [x] Rename boss: Bazba → Holtz (soldier class) with deathQuote

## Chapter 4: "The Pickpocket" — Theme Change + Coda

> **Ref:** [`specs/story/chapters/ch4.md`](specs/story/chapters/ch4.md)

- [x] Rename chapter: "The Pickpocket"
- [x] Re-skin enemies from undead to pirate names (same classes/stats)
- [x] Add 2 village tiles to terrain grid (3 total for protection objective)
- [x] Expand playerUnits to 8 (add bram, voss, nira, coda)
- [x] Add deploymentSlots: 7, forceDeploy, recruitableUnits: ['coda']
- [x] Rewrite prologue: Pirates, Bram wants loot, protect storehouses
- [x] Add Turn 2 event: Thief rush warning, split party comedy
- [x] Add Turn 3 event: Coda encounter (stealth-game persona, crouching invisibility)
- [x] Add Turn 5 event: Village pressure warning
- [x] Add boss precombat event: Marko's mercenary attitude
- [x] Add boss killed event: Bram/Coda loot comedy
- [x] Rewrite epilogue: Coda joins, belt pouch stolen, marketplace flickering CRP hint
- [x] New support conversations: Coda/Bram (loot), Voss/Nira (silence)
- [x] Change boss: Naxos → Marko (fighter, aggressive AI) with deathQuote

## Chapter 5: "Above the Clouds" — Dialogue Polish

> **Ref:** [`specs/story/chapters/ch5.md`](specs/story/chapters/ch5.md)

- [x] Polish prologue: Yuel "clouds loading in SQUARES", more urgent tone
- [x] Polish epilogue: Match spec wording (Senna's seed reveal, Kael's confidence, Ren's "broken tiles")
- [x] Mid-battle events already spec-aligned (terrain shift, data void, forecast flicker, boss approach)
- [x] Boss portraits added: Yuel, Garrek, Thane, Holtz, Marko, Aldric

## Character Voice Notes (Applied Across All Chapters)

- [x] Ren: tired wisdom, tries to protect others from truth, speaks in hints
- [x] Kael: earnest, brave, loyal — doesn't fully understand but trusts Ren
- [x] Senna: analytical, speaks in data terms, shaken when data fails
- [x] Bram: direct, combat-focused, comic relief through bluntness
- [x] Lira: empathetic, dating-sim genre-displaced, sees everything as relationship building
- [x] Voss: dry, observational, questions why things work the way they do
- [x] Nira: perceptive, quiet, minimal words
- [x] Coda: genre-displaced (stealth game), speaks in game terminology
- [x] Yuel: wide-eyed, saw impossible things, needs answers

## Validation

- [x] `npm run build` — zero type errors
- [x] `npx vitest run` — all 628 tests pass
- [x] Boss unit IDs updated in chapter enemy placements (garrek, thane)
- [x] Speaker portraits added for all bosses + Yuel
- [x] Campaign config chapter names updated
- [x] Tone progression: meta-comedy → serious by ch5 epilogue
