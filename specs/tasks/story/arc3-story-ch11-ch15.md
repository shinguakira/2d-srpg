# Arc 3 Story: Chapters 11-15 — "Corruption"

> **Prerequisites:** Gameplay Phase 4 (CRP system), Arc 2 Story complete
> **Spec refs:** `specs/story/chapters/ch11.md`–`ch15.md`, `specs/story/arc-structure.md`
> **Tone:** Dread → loss → fragile hope
> **New characters:** Kira, Zael (conditional), Elara

---

## Chapter 11: "Spreading Plague"

### Prologue
- [ ] CRP introduction: dark terrain spreading, civilians fleeing
- [ ] Senna explains corruption mechanics to party (tutorial dialogue)
- [ ] Ren recognizes this from past cycles: "It always starts here"
- [ ] Market town setting: formerly lively, now flickering

### Mid-Battle
- [ ] Turn 2: Glitch spread narration — terrain visibly changing
- [ ] Turn 5: Kira defection scene
  - Kira (Shaman, enemy): fighting corruption from inside
  - Witnesses System truth through dark magic connection
  - "I've been hearing whispers in the dark tomes. They're not spells. They're data."
  - Switches to player faction
- [ ] Villager escort dialogue: NPCs panicking, calling for help
- [ ] Turn 7: Villager panic reversal — dialogue: "They're running the wrong way!"
- [ ] Corrupted General boss: erratic dialogue (CRP affects speech patterns)

### Epilogue
- [ ] Kira integration: party wary of dark mage (CRP 60)
- [ ] Kira explains dark magic connection to System
- [ ] Senna fascinated by Kira's data insights
- [ ] CRP management tutorial: how to reduce/avoid corruption

## Chapter 12: "The Turning" — CORRUPTION LOSS

### Prologue
- [ ] Monastery approach: seeking light magic as counter to corruption
- [ ] Party CRP status review (foreshadowing who turns)
- [ ] Quiet dread: "One of us might not make it through this"

### Mid-Battle — Corruption Loss Event
- [ ] Turn 5: Highest-CRP unit hits CRP 100
  - Extended scene: unit starts glitching
  - "No... I can feel it taking over..."
  - Other party members try to help — can't
  - Unit turns hostile (enemy sprite, red tint)
  - "I'm sorry. I can't stop it."
- [ ] Post-turn: party dialogue processing the loss
  - Must defeat their former friend
  - Each attack on turned unit: guilt dialogue snippets
- [ ] Dynamic dialogue: turned unit's name referenced throughout

### Boss — Seras
- [ ] Seras (Bishop): light magic wielder, unaware tier 4
- [ ] Pre-combat: theological perspective on corruption
  - "Corruption is not evil. It is data without purpose."
- [ ] Post-defeat: Seras grants insight on purification
- [ ] Purify staff discovery dialogue

### Epilogue
- [ ] Grief for corrupted ally (different from Kael's death — this was preventable)
- [ ] Party realizes CRP management is survival mechanic
- [ ] Lira takes on anti-corruption role with new tools
- [ ] Kira's guilt: dark magic contributed to corruption spread

## Chapter 13: "Second Chances"

### Prologue
- [ ] Fortress approach: intel on Zael (corrupted wyvern rider)
- [ ] Ren knows Zael can be saved (from past cycles)
- [ ] Tactical discussion: how to weaken without killing

### Mid-Battle — Zael Recruitment
- [ ] Zael encounter dialogue: "The buzzing... it won't stop"
  - CRP ticking visible — party can see his corruption rising
- [ ] Reducing Zael's HP: "You're... trying to help?"
- [ ] Talk action (if conditions met):
  - Ren: "I've saved you before. In other cycles."
  - Zael: "I don't remember... but I believe you."
  - Recruitment success
- [ ] If Zael killed: "At least... the buzzing stops..." (death quote)
- [ ] If Zael escapes: "I'll see you again. But I won't be me."

### Epilogue
- [ ] Zael recruited: party helps manage his CRP, Lira's light magic assists
- [ ] Zael NOT recruited: somber — "We could have saved him"
- [ ] Either way: fortress secured, path to monastery clear

## Chapter 14: "The Monastery"

### Prologue
- [ ] Monastery arrival: seeking answers about corruption origin
- [ ] Elara introduction (Monk at chapel): has been studying anomalies independently
- [ ] If Zael recruited: Zael reacts to monastery's light magic presence
- [ ] If Zael NOT recruited: Corrupted Zael appears as boss (tragic dialogue)

### Mid-Battle
- [ ] Elara recruitment: player unit reaches chapel
  - "I've been praying for answers. I think YOU are the answer."
- [ ] Light magic tutorial: Elara's attacks reduce CRP on targets
- [ ] The Hollow (boss): Eclipse siege tome dialogue
  - "Distance won't save you. Nothing saves you from entropy."
  - Self-damage narration: "Even my weapon consumes me"
- [ ] Alt boss (Corrupted Zael): "I told you I'd see you again..." (if not recruited)

### Epilogue
- [ ] Elara joins permanently: anti-corruption specialist
- [ ] Light vs Dark discussion: Kira (dark) and Elara (light) philosophical debate
- [ ] Corruption origin theory: "It's not an infection. It's the world forgetting what it's supposed to be."
- [ ] Master Seal reward: promotion discussion

## Chapter 15: "The Rally"

### Prologue
- [ ] Fortress assault planning: three-pronged approach
- [ ] Ren's LOOP expenditure foreshadowing: "I might need to give something up"
- [ ] Party at full strength (largest deployment yet)
- [ ] Rally speech: each character contributes a line

### Mid-Battle
- [ ] Turn 8: LOOP expenditure event
  - Ren concentrates, visibly strained
  - "I'm overwriting the corruption. But I have to trade memories for it."
  - "Cycles 112 through 116... gone."
  - Senna: "What were those cycles?"
  - Ren: "I'll never know now."
  - Corrupted patches become normal terrain
- [ ] Turn 10: Promoted enemy reinforcements
  - "They're stronger now. The System is adapting."
- [ ] Ghast boss: "Three hundred years I've held this fortress. Against armies. Against time."

### Epilogue
- [ ] Arc 3 conclusion: corruption pushed back but not eliminated
- [ ] Ren weaker (LOOP spent) but party stronger (promotions, new tools)
- [ ] Cautious hope: "We can fight this. Together."
- [ ] Senna's breakthrough: "The corruption isn't random. It follows patterns. I can predict it."
- [ ] Arc transition: LOOP regen +10, CRP decay, shop refresh

## Character Data Files

- [ ] Create Kira character data: dark mage torn between power and corruption
- [ ] Create Zael character data: corrupted warrior fighting for control
- [ ] Create Elara character data: faithful monk seeking truth through light

## Validation

- [ ] Corruption loss event in ch12 dynamically references correct unit name
- [ ] Zael recruitment condition branching works (ch13 → ch14 boss change)
- [ ] Campaign flag `zael_recruited` persists and affects ch14
- [ ] LOOP expenditure event in ch15 (LOOP value decreases, terrain changes)
- [ ] Kira/Elara light vs dark dialogue flows naturally
- [ ] Tone arc: dread (ch11) → loss (ch12) → hope (ch13-14) → rally (ch15)
