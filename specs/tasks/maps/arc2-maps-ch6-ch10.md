# Arc 2 Maps: Chapters 6-10 — "Fractures"

> **Prerequisites:** Gameplay Phase 3 (advanced AI, dance, rescue), Phase 2 (promotion items)
> **Spec refs:** `specs/maps/ch6.md`–`ch10.md`, `specs/tasks/campaign-flags.md` (grief trauma, recruitment)
> **Deployment slots:** 6→8

---

## Chapter 6: "New Alliances" (16×18)

> **Ref:** [`specs/maps/ch6.md`](specs/maps/ch6.md), [`specs/story/chapters/ch6.md`](specs/story/chapters/ch6.md), [`specs/story/characters/rook.md`](specs/story/characters/rook.md), [`specs/story/characters/faye.md`](specs/story/characters/faye.md)

### Config
- [ ] Create chapter6.ts — 16×18 grid, objective: Boss Kill (Sera) + Escape south
- [ ] Par turns: 16, deployment slots: 7, force deploy: Ren
- [ ] Reinforcement warning: Turn 8 (4 turns before overwhelming wave)

### Terrain
- [ ] Coastal harbor town: docks (plains), cliffs (mountain), water edges
- [ ] South escape zone: 3-tile-wide exit row
- [ ] North: harbor buildings (wall tiles), narrow streets (2-wide corridors)
- [ ] Elevated positions for archers on cliff tiles

### Enemies
- [ ] Boss: Captain Sera — pegasus_knight, Lv8, steel_lance, aggressive AI, flying
  - 38 HP, low DEF, high SPD, divebomb pattern
- [ ] 4 Soldiers — Lv6-7, guard AI around harbor
- [ ] 2 Archers — Lv6, stationed on cliffs (anti-air positions)
- [ ] 3 Fighters — Lv6, aggressive AI
- [ ] 2 Cavaliers — Lv7, aggressive AI, mounted
- [ ] Turn 8 reinforcements: 4 heavy cavalry from north (overwhelming, encourage escape)
- [ ] Total: ~12 enemies + reinforcements

### Recruitment
- [ ] Rook (Mercenary) joins at chapter start — add to roster
- [ ] Faye (Troubadour) appears mid-chapter as green NPC ally, auto-recruits on adjacent player unit
- [ ] Create Rook unit data: Lv5, iron_sword, Mercenary class
- [ ] Create Faye unit data: Lv4, heal_staff, Troubadour class, mounted

### Events
- [ ] Turn 4: Faye spawns as ally NPC at south dock
- [ ] Turn 8: Warning dialogue — "Reinforcements incoming, fall back!"
- [ ] Turn 12: Massive reinforcement wave (escape incentive)
- [ ] Sera defeat: dialogue about sky anomalies

---

## Chapter 7: "The Seed Breaks" (16×16)

> **Ref:** [`specs/maps/ch7.md`](specs/maps/ch7.md), [`specs/story/chapters/ch7.md`](specs/story/chapters/ch7.md)

### Config
- [ ] Create chapter7.ts — 16×16 grid, objective: Survive 12 turns
- [ ] Par turns: 12 (survive = par), deployment slots: 7, force deploy: Ren

### Terrain
- [ ] Coastal fortress with 2-tile-wide corridors
- [ ] North edge: glitched tiles that spawn enemies (corrupted spawn points)
- [ ] Fort tiles at defensive positions (healing + cover)
- [ ] Chokepoints for player defense positioning

### Enemies
- [ ] Boss: Admiral Varga (optional) — General, Lv9, steel_lance, stationary on fort
  - 48 HP, high DEF, Hero Crest drop (reward for defeating optional boss)
- [ ] Initial: 6 enemies (soldiers + fighters, Lv6-7)
- [ ] Corrupted spawns: Turn 3 (1-2), Turn 5 (2), Turn 7 (2-3), Turn 9 (3), stop Turn 12
- [ ] Spawned enemies: dark_mage class, Lv6, fire/thunder, aggressive AI
- [ ] Total: ~6 initial + ~10 spawned across 12 turns

### Events
- [ ] Turn 1: Senna's forecast starts flickering — dialogue
- [ ] Turn 3: First corrupted spawn + Senna's crisis dialogue
- [ ] Turn 6: "The system is changing the ANSWER" — Senna's breakdown
- [ ] Turn 12: Survive complete — enemies retreat, chapter ends
- [ ] Optional: defeat Varga before Turn 12 for Hero Crest

---

## Chapter 8: "The Last Ride" (18×20) — KAEL'S DEATH

> **Ref:** [`specs/maps/ch8.md`](specs/maps/ch8.md), [`specs/story/chapters/ch8.md`](specs/story/chapters/ch8.md), [`specs/story/characters/kael.md`](specs/story/characters/kael.md)

### Config
- [ ] Create chapter8.ts — 18×20 grid, objective: Seize throne
- [ ] Par turns: 20, deployment slots: 8, force deploy: Ren, Kael

### Terrain
- [ ] Mountain fortress, two fronts: Morryn (north throne), reinforcements (south corridor)
- [ ] North: fortress interior, throne at (2, 9)
- [ ] South: corridor where Kael makes last stand (rows 14-18)
- [ ] Fort tiles along defensive lines
- [ ] Chokepoints at corridor entrances

### Enemies
- [ ] Boss: General Morryn — Halberdier (promoted soldier), Lv12, steel_lance + javelin
  - 55 HP, boss AI, does not leave throne, tier 2 awareness
- [ ] 4 Knights — Lv8-9, guard AI around throne room
- [ ] 3 Cavaliers — Lv8, aggressive AI, north assault
- [ ] 2 Mages — Lv8, guard AI
- [ ] South reinforcements (Turn 5+): 2 soldiers per turn from south edge
- [ ] Total: ~10 initial + ~8 reinforcements

### Events — Kael's Death Sequence
- [ ] Turn 8: Kael removed from player control, becomes NPC ally
  - Dialogue: "Was I brave this time?" / "Every time"
- [ ] Kael repositions to south corridor automatically
- [ ] Turns 8-12: Kael fights alone as NPC (AI-controlled, aggressive)
- [ ] Turn 13: Kael's HP forced to 0 — death event triggers
  - Death dialogue scene (extended, emotional)
  - Kael permanently removed from roster
- [ ] Post-death: Grief Trauma applied — all remaining units -3 all stats for 2 chapters (ch9 + ch10, expires at ch10 END)
- [ ] Morryn dialogue: "I've killed you before... I remember it happening AGAIN"
- [ ] After Morryn defeat + seize: chapter end with extended epilogue

---

## Chapter 9: "The Void Left Behind" (14×14)

> **Ref:** [`specs/maps/ch9.md`](specs/maps/ch9.md), [`specs/story/chapters/ch9.md`](specs/story/chapters/ch9.md), [`specs/story/characters/orin.md`](specs/story/characters/orin.md)

### Config
- [ ] Create chapter9.ts — 14×14 grid, objective: Rout
- [ ] Par turns: 18, deployment slots: 7, force deploy: Ren
- [ ] Grief trauma active: all units -3 all stats (chapter 1 of 2)

### Terrain
- [ ] Narrow forest pass, linear escape route south
- [ ] Main path: forest-lined corridor (2-3 tiles wide)
- [ ] Western side path: slower but safer (more forest cover)
- [ ] Sparse enemy placement (party is weakened)

### Enemies
- [ ] No traditional boss (pressure chapter, not climactic)
- [ ] Raider Captain — cavalier, Lv9, pursuing from north (8 MOV, chases party)
- [ ] 6 Soldiers/Fighters — Lv7-8, scattered along path
- [ ] 2 Archers — Lv7, positioned at path bends
- [ ] Total: ~9 enemies (reduced count due to grief debuff)

### Recruitment
- [ ] Orin (Dancer) joins mid-chapter — event trigger Turn 3
- [ ] Create Orin unit data: Lv5, no weapons, Dancer class, dance innate skill
- [ ] Orin dialogue: genre-displaced (thinks this is a musical)

### Events
- [ ] Chapter start: dialogue acknowledging Kael's absence
- [ ] Turn 3: Orin appears, joins party — "You all look like you need a song"
- [ ] First dance tutorial: prompt player to use Dance action
- [ ] Grief trauma reminder in UI (stat penalty indicator)

---

## Chapter 10: "What We Carry" (16×18)

> **Ref:** [`specs/maps/ch10.md`](specs/maps/ch10.md), [`specs/story/chapters/ch10.md`](specs/story/chapters/ch10.md)

### Config
- [ ] Create chapter10.ts — 16×18 grid, objective: Dual (Boss Kill + Protect NPC)
- [ ] Par turns: 20, deployment slots: 8, force deploy: Ren
- [ ] Grief trauma expires at chapter end (chapter 2 of 2, `grief_trauma_remaining` → 0)

### Terrain
- [ ] Village at bottom (rows 14-17), fortified hill center/north
- [ ] Three approach routes to hill: left (forest), center (bridge), right (open)
- [ ] NPC Elder Maren at village (must survive)
- [ ] Throne at hilltop (3, 8) — Drayen's position

### Enemies
- [ ] Boss: General Drayen — Sage (promoted mage), Lv11, Elfire + Mend staff
  - 55 HP, boss AI, self-heals below 70% HP, drops Master Seal
- [ ] 3 Coordinated guards — Lv9, escort AI protecting Drayen (reposition when one hit)
- [ ] 4 Soldiers — Lv8-9, aggressive AI, split between hill and village approach
- [ ] 2 Mages — Lv8, guard AI on hill
- [ ] Turn 6: System Construct prototype spawns — Lv15, 50 HP, high stats, aggressive
  - First System enemy type, immune to status effects
- [ ] Village raiders: 2 fighters Lv8, approach village from sides
- [ ] Total: ~12 enemies + construct

### Events
- [ ] Turn 6: System Construct spawn event + dialogue — first direct System intervention
- [ ] Elder Maren death = chapter failure (protect objective)
- [ ] Drayen defeat: Master Seal reward
- [ ] Chapter end: grief trauma expires, stats restore
- [ ] Arc 2 closing dialogue

### Validation (All Arc 2)

- [ ] Each chapter loads without errors
- [ ] Enemy counts match spec difficulty curve (12→12→18→9→12)
- [ ] Kael's death sequence fires correctly in ch8 (Turn 8 NPC, Turn 13 death)
- [ ] Grief trauma applies at ch8 end, active in ch9 and ch10, expires at ch10 end
- [ ] `grief_trauma_remaining` flag: set to 2 at ch8 end, decremented each chapter, 0 at ch10 end
- [ ] Orin's Dance action works in ch9 (grants adjacent ally full new turn)
- [ ] Dual objective in ch10 (boss kill + NPC protect — failure if Elder Maren dies)
- [ ] Master Seal drops from ch10 boss (Drayen)
- [ ] Roster carries forward correctly: Kael gone, Rook/Faye/Orin added
- [ ] Save/load: grief trauma persists across save at ch9 start
- [ ] Save/load: roster state (Kael removed) persists
- [ ] E2E: ch8 → ch9 → ch10 sequential playthrough with grief debuff visible
