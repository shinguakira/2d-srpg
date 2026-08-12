# Arc 1 Story: Chapters 1-5 — "The Script"

> **Prerequisites:** Gameplay Phase 0 (renamed units), Phase 1 (event system)
> **Spec refs:** `specs/story/chapters/ch1.md` through `ch5.md`, `specs/story/arc-structure.md`
> **Dialogue format:** DialogueLine[] arrays in chapter data files

---

## Chapter 1: "Not This Again" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch1.md`](specs/story/chapters/ch1.md)

- [x] Rename chapter: "Not This Again"
- [x] Rewrite prologue: Shigeru speedruns opening, knows enemy positions
- [x] Add Goro to playerUnits (5 units total)
- [x] Add Turn 2 event: Goro's fighting-game confusion dialogue
- [x] Add Turn 3 event: Weapon triangle comedy (rock-paper-scissors)
- [x] Add Turn 4 event: Baraku boss intro (interrupted speech)
- [x] Add boss precombat event (unit_at): Baraku/Shigeru quiet moment about cycles
- [x] Add boss killed event: "See you next cycle" / "Maybe not"
- [x] Rewrite epilogue: Hina dating-sim introduction
- [x] Update village dialogue: Shigeru already knows rewards
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Bone → Baraku with deathQuote

## Chapter 2: "The Defector" — Meta-Comedy Rewrite

> **Ref:** [`specs/story/chapters/ch2.md`](specs/story/chapters/ch2.md)

- [x] Rename chapter: "The Defector"
- [x] Add Goro to playerUnits (5 units total)
- [x] Rewrite prologue: Shigeru names Ryuji before anyone told him, Goro/Hina comedy
- [x] Expand Genzo defection: "cycle 298" reference, Goro reacts
- [x] Add Turn 4 event: Kanna's 17-combat seed observation
- [x] Add boss precombat event: Ryuji's professional stance, "347 mornings"
- [x] Add boss killed event: Genzo reflects on Ryuji never knowing
- [x] Rewrite epilogue: Broken Seed discovery, seed conversation, Hina misinterprets
- [x] Rewrite support conversations to meta-comedy tone
- [x] Rename boss: Zonta → Ryuji (cavalier class) with deathQuote

## Chapter 3: "Scout's Honor" — Full Story + Events

> **Ref:** [`specs/story/chapters/ch3.md`](specs/story/chapters/ch3.md)

- [x] Rename chapter: "Scout's Honor"
- [x] Expand playerUnits to 7 (shigeru, akira, kanna, hina, goro, genzo, sayo)
- [x] Add deploymentSlots: 6, forceDeploy, recruitableUnits
- [x] Rewrite prologue: Goro's forest cost complaint, Hina's tree metaphor
- [x] Add Turn 2 event: Terrain lesson (Goro hit on plain, Genzo dodges in forest)
- [x] Add Turn 3 event: Sayo rescue dialogue
- [x] Add Turn 5 event: First glitch (forest tile flickers, Kanna notices, Shigeru deflects)
- [x] Add boss precombat event: Hyodo duty speech, "347 mornings"
- [x] Add boss killed event: Sayo asks "another way?", Shigeru "Not in this version"
- [x] Rewrite epilogue: Hina/Sayo bonding, Kanna questions glitch, Shigeru admits foreknowledge
- [x] Rewrite support conversations (Shigeru/Hina, Goro/Genzo)
- [x] Rename boss: Bazba → Hyodo (soldier class) with deathQuote

## Chapter 4: "The Pickpocket" — Theme Change + Hachi

> **Ref:** [`specs/story/chapters/ch4.md`](specs/story/chapters/ch4.md)

- [x] Rename chapter: "The Pickpocket"
- [x] Re-skin enemies from undead to pirate names (same classes/stats)
- [x] Add 2 village tiles to terrain grid (3 total for protection objective)
- [x] Expand playerUnits to 8 (add goro, genzo, sayo, hachi)
- [x] Add deploymentSlots: 7, forceDeploy, recruitableUnits: ['hachi']
- [x] Rewrite prologue: Pirates, Goro wants loot, protect storehouses
- [x] Add Turn 2 event: Thief rush warning, split party comedy
- [x] Add Turn 3 event: Hachi encounter (stealth-game persona, crouching invisibility)
- [x] Add Turn 5 event: Village pressure warning
- [x] Add boss precombat event: Zanba's mercenary attitude
- [x] Add boss killed event: Goro/Hachi loot comedy
- [x] Rewrite epilogue: Hachi joins, belt pouch stolen, marketplace flickering CRP hint
- [x] New support conversations: Hachi/Goro (loot), Genzo/Sayo (silence)
- [x] Change boss: Naxos → Zanba (fighter, aggressive AI) with deathQuote

## Chapter 5: "Above the Clouds" — Dialogue Polish

> **Ref:** [`specs/story/chapters/ch5.md`](specs/story/chapters/ch5.md)

- [x] Polish prologue: Yuki "clouds loading in SQUARES", more urgent tone
- [x] Polish epilogue: Match spec wording (Kanna's seed reveal, Akira's confidence, Shigeru's "broken tiles")
- [x] Mid-battle events already spec-aligned (terrain shift, data void, forecast flicker, boss approach)
- [x] Boss portraits added: Yuki, Baraku, Ryuji, Hyodo, Zanba, Tetsuzan

## Character Voice Notes (Applied Across All Chapters)

- [x] Shigeru: tired wisdom, tries to protect others from truth, speaks in hints
- [x] Akira: earnest, brave, loyal — doesn't fully understand but trusts Shigeru
- [x] Kanna: analytical, speaks in data terms, shaken when data fails
- [x] Goro: direct, combat-focused, comic relief through bluntness
- [x] Hina: empathetic, dating-sim genre-displaced, sees everything as relationship building
- [x] Genzo: dry, observational, questions why things work the way they do
- [x] Sayo: perceptive, quiet, minimal words
- [x] Hachi: genre-displaced (stealth game), speaks in game terminology
- [x] Yuki: wide-eyed, saw impossible things, needs answers

## Validation

- [x] `npm run build` — zero type errors
- [x] `npx vitest run` — all 628 tests pass
- [x] Boss unit IDs updated in chapter enemy placements (baraku, ryuji)
- [x] Speaker portraits added for all bosses + Yuki
- [x] Campaign config chapter names updated
- [x] Tone progression: meta-comedy → serious by ch5 epilogue
