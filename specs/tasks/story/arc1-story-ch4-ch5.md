# Arc 1 Story: Chapters 4-5 — "The Script"

> **Prerequisites:** Gameplay Phase 0 (renamed units), Phase 1 (event system)
> **Spec refs:** `specs/story/chapters/ch4.md`, `specs/story/chapters/ch5.md`, `specs/story/arc-structure.md`
> **Note:** Chapters 1-3 story already implemented. Ch4 needs rename pass. Ch5 is new.
> **Dialogue format:** DialogueLine[] arrays in chapter data files

---

## Chapter 4: Rename Pass + Story Polish

- [ ] Update ch4 speaker names: Eirik→Ren, Seth→Kael, Lute→Senna, Natasha→Lira
- [ ] Update ch4 prologue dialogue to match spec character voices
- [ ] Update ch4 epilogue dialogue
- [ ] Add Coda's introduction dialogue (genre-displaced: thinks this is stealth game)
- [ ] Add Coda recruitment dialogue: "Data extraction complete" (calls stealing data extraction)
- [ ] Add marketplace flickering mention (subtle CRP foreshadowing)
- [ ] Add Bram + Coda bonding dialogue (loot obsession)
- [ ] Update boss (Marko) dialogue to spec version
- [ ] Verify ch4 dialogue plays through without errors after rename

## Chapter 5: Full Story Implementation

### Prologue (Pre-Battle)
- [ ] Yuel arrival scene: "The sky was loading in SQUARES"
- [ ] Party briefing: mountain fortress assault plan
- [ ] Ren's internal monologue: knows what's coming but script may change
- [ ] Kael's encouragement: still optimistic (pre-Arc 2 darkening)
- [ ] Senna's RNG analysis: tracking seed patterns across chapters

### Mid-Battle Events (Tied to Turn Triggers)
- [ ] Turn 3 dialogue: Forest tiles shift — Senna: "The terrain data just... stuttered"
- [ ] Turn 3: Other party members dismiss it (comedy still present)
- [ ] Turn 5 dialogue: Data Void appears — extended scene
  - Senna: "That's not loaded terrain. That's... nothing."
  - Ren (serious): "It's starting."
  - Kael: "What's starting?"
  - Ren: "The script isn't safe anymore."
- [ ] Turn 5: Yuel's reaction — she saw sky anomalies before joining
- [ ] Turn 8: Reinforcement arrival dialogue (brief, tactical)

### Boss Encounter
- [ ] Pre-combat Aldric dialogue: Tier 4 unaware, professional general
  - Aldric does not understand anomalies, focused on duty
- [ ] Post-defeat Aldric dialogue: confusion at void tiles
- [ ] Senna's seed revelation: "The seed changed. That doesn't happen."
  - Extended analysis: combat outcomes no longer match predictions

### Epilogue (Post-Victory)
- [ ] Arc 1 conclusion scene
- [ ] Comedy completely drops — party realizes world rules can change
- [ ] Ren admits more than he's let on about the cycles
- [ ] Senna's determination: "If the seed can change, I need to understand why"
- [ ] Kael's resolve: stands by Ren regardless (foreshadows ch8 loyalty)
- [ ] Lira's concern: spiritual/emotional perspective on anomalies
- [ ] Bram's reaction: "Can we still hit things? Good." (stays practical)
- [ ] Arc transition: LOOP regen +10, shop refresh

### Character Voice Notes
- [ ] Ren: tired wisdom, tries to protect others from truth, speaks in hints
- [ ] Kael: earnest, brave, loyal — doesn't fully understand but trusts Ren
- [ ] Senna: analytical, speaks in data terms, shaken when data fails
- [ ] Bram: direct, combat-focused, comic relief through bluntness
- [ ] Lira: empathetic, spiritual framing, worries about everyone
- [ ] Voss: dry, observational, questions why things work the way they do
- [ ] Nira: perceptive, quiet, notices details others miss
- [ ] Coda: genre-displaced (stealth game), speaks in game terminology
- [ ] Yuel: wide-eyed, saw impossible things, needs answers

## Validation

- [ ] All ch4 dialogue renders correctly after rename
- [ ] Ch5 prologue plays through (all lines display, portraits correct)
- [ ] Mid-battle events trigger at correct turns with dialogue
- [ ] Boss encounter dialogue plays pre/post combat
- [ ] Epilogue scene plays fully
- [ ] No speaker name mismatches (verify against unit IDs)
- [ ] Tone progression: comedy → serious by epilogue
