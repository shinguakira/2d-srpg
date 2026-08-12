# Arc 5 Maps: Chapters 21-25 — "The Last Save File"

> **Prerequisites:** Gameplay Phase 6 (master classes, multi-phase bosses, split party, map-as-boss, endings)
> **Spec refs:** `specs/maps/ch21.md`–`specs/maps/ch25.md`, `specs/tasks/campaign-flags.md` (endings, roster count, all flags)
> **Deployment slots:** 12 (fixed)
> **Key mechanics:** Dynamic terrain, split party, weapon cycling boss, map-as-boss

---

## Chapter 21: "The Long March" (20×24, Dynamic Terrain)

> **Ref:** [`specs/maps/ch21.md`](specs/maps/ch21.md), [`specs/story/chapters/ch21.md`](specs/story/chapters/ch21.md)

### Config
- [ ] Create chapter21.ts — 20×24 grid, objective: Escape to (0, 19)
- [ ] Par turns: 28, deployment slots: 12, force deploy: Shigeru

### Terrain
- [ ] Unstable landscape: terrain tiles shift type every 2 turns (NW→SE wave)
- [ ] Shift pattern: plains↔forest, mountain↔ruins, fort↔corrupted_fort
- [ ] Void spawn points at four corners (enemy reinforcement gates)
- [ ] Diagonal path of circuit/memory tiles (safe corridor)
- [ ] Collapse from SW corner Turn 8: 1 row becomes void every 2 turns
- [ ] Exit tile at (0, 19) — northeast corner

### Enemies
- [ ] Boss: The Revenant — Corrupted Swordmaster, Lv24, brave_sword
  - 75 HP, SPD 28, SKL 24, attacks twice (brave), erratic targeting
  - Drops Mithril forging material
- [ ] 8 Corrupted units — Lv18-20, aggressive AI, scattered
- [ ] Void spawn reinforcements: 2 per spawn point starting Turn 4 (continuous)
- [ ] Total: ~9 initial + continuous spawns (encourages forward momentum)

### Events
- [ ] Turn 2: First terrain shift wave (NW→SE, visual ripple)
- [ ] Turn 4: Void spawn gates activate
- [ ] Turn 8: SW collapse begins (1 row → void every 2 turns)
- [ ] Escape: any player unit reaches (0, 19) → chapter ends
- [ ] Shigeru must reach exit (force deploy ensures this)

---

## Chapter 22: "Ghosts of Cycles Past" (20×24, Nostalgia)

> **Ref:** [`specs/maps/ch22.md`](specs/maps/ch22.md), [`specs/story/chapters/ch22.md`](specs/story/chapters/ch22.md)

### Config
- [ ] Create chapter22.ts — 20×24 grid, objective: Boss Kill (The Archivist)
- [ ] Par turns: 28, deployment slots: 12, force deploy: Shigeru

### Terrain
- [ ] Massive library mirroring ch1 layout at triple scale
- [ ] Bookshelves form walls creating aisles
- [ ] Original ch1 throne position (scaled) — Archivist's location
- [ ] Hidden treasure tile (Master Crown #2) — requires Thief to detect

### Enemies
- [ ] Boss: The Archivist — Archsage (master class), Lv24, rotating tomes
  - 78 HP, MAG 26, RES 22
  - Weakness rotation: fire→thunder→wind→physical on 4-turn cycle
  - Correct damage type: ×2 damage; wrong type: ×0.5 damage
- [ ] Phantom enemies (callbacks):
  - Phantom Brigand (ch1 callback) — Lv12, iron_axe, aggressive
  - Phantom Cavalier (ch2 callback) — Lv14, iron_lance, aggressive
  - Phantom Soldier (ch3 callback) — Lv13, steel_lance, guard
- [ ] 6 Construct guardians — Lv19-20, guard AI in aisles
- [ ] Total: ~10 real enemies + phantom spawns

### Ghost Events
- [ ] Ghost Hagen appears Turn 3: non-hostile, hints about weakness rotation, fades Turn 5
- [ ] Phantom Akira appears Turn 8: non-combat, salutes, fades after 1 turn
  - Grants +3 all stats to all player units for 3 turns
- [ ] Phantom enemies spawn every 4 turns from shelves
- [ ] Master Crown #2: hidden tile, Thief (Fenn) detects when adjacent

### Events
- [ ] Turn 3: Ghost Hagen appearance + hint dialogue
- [ ] Turn 8: Phantom Akira silent salute + stat buff
- [ ] Party dialogue: characters say things they've been holding back
- [ ] Archivist defeat: library lore about cycle history

---

## Chapter 23: "The Penultimate" (2× 14×16, Split Map)

> **Ref:** [`specs/maps/ch23.md`](specs/maps/ch23.md), [`specs/story/chapters/ch23.md`](specs/story/chapters/ch23.md)

### Config
- [ ] Create chapter23.ts — split map config (two 14×16 grids)
- [ ] Objective: Rout (all enemies on both maps)
- [ ] Par turns: 25, deployment slots: 12 (6 per team)
- [ ] Weather: Snow (+1 movement cost, -2 SPD all units)

### Pre-Chapter
> See `specs/tasks/campaign-flags.md` for roster count verification (12-15 units at ch23).

- [ ] Team selection UI: player divides roster into Team A and Team B
- [ ] Each team: minimum 5, maximum 7 (flexible split based on roster size)
- [ ] Shigeru must be on one team (player choice)
- [ ] Balanced team warning: if one team has no healer, show caution popup
- [ ] If roster < 12: auto-fill with NPC ally constructs to reach 6 per side (safety valve)

### Map A — Left (Mountainous)
- [ ] 14×16 grid with chokepoints, forests, mountain passes
- [ ] Boss: Sentinel_L — Blackflame Colossus, physical, Lv22
  - 60 HP, STR 24, DEF 22, melee focused
- [ ] 5 Construct soldiers — Lv18-20, guard AI at chokepoints
- [ ] 2 Construct knights — Lv19, armored, aggressive

### Map B — Right (Open Field)
- [ ] 14×16 grid with minimal cover, ranged-favored terrain
- [ ] Boss: Sentinel_R — Blackflame Colossus, magical, Lv22
  - 60 HP, MAG 26, RES 24, ranged focused
- [ ] 5 Construct mages — Lv18-20, aggressive AI
- [ ] 2 Construct archers — Lv19, stationary on elevated tiles

### Partition Mechanic
- [ ] Partition wall (cols 10-11 of conceptual combined map): impassable
- [ ] When BOTH Sentinel_L AND Sentinel_R < 30% HP: partition shatters
- [ ] Maps merge: teams can now cross to assist each other
- [ ] Merged map: 28×16 combined grid

### Events
- [ ] CRP > 60 check: System tries to turn highest-CRP unit mid-battle (final CRP check)
- [ ] Partition shatter: dramatic visual + dialogue
- [ ] Both bosses defeated: rout complete if all enemies cleared

---

## Chapter 24: "???_CORRUPTED" (16×16, Arena) — AKIRA REVELATION

> **Ref:** [`specs/maps/ch24.md`](specs/maps/ch24.md), [`specs/story/chapters/ch24.md`](specs/story/chapters/ch24.md), [`specs/story/characters/akira.md`](specs/story/characters/akira.md)

### Config
- [ ] Create chapter24.ts — 16×16 circular arena grid, objective: Strip 3 corruption layers
- [ ] Par turns: 30, deployment slots: 12, force deploy: Shigeru

### Terrain
- [ ] Circular arena: open center, no terrain bonuses
- [ ] 4 stone pillars (wall tiles providing cover)
- [ ] Corruption ring of void tiles surrounding arena (shrinks Turn 10, 20)
- [ ] No fort/throne tiles (pure combat)

### Boss: ???_CORRUPTED (Reconstructed Akira Data)

- [ ] Phase system: 3 corruption layers to strip
- [ ] HP display: 999 (cosmetic) → actual HP per phase: 60, 40, 33
- [ ] Weapon cycle: sword→lance→axe→fire→thunder→wind (changes each turn)
- [ ] Stripping mechanic: attack with correct counter-weapon on correct turn
  - Physical triangle: sword beats axe, lance beats sword, axe beats lance
  - Magic triangle: fire beats wind, wind beats thunder, thunder beats fire
  - When boss wields fire → attack with thunder for advantage hit
  - 3 successful advantage hits required to strip all layers
  - Each strip: dramatic corruption peel animation + dialogue
- [ ] Advantage hit detection: if attacker's equipped weapon has triangle advantage vs boss's current weapon → layer strip
- [ ] Non-advantage hits deal normal damage but do NOT strip layers
- [ ] HUD: display boss's current weapon type prominently + hint showing which weapon type counters it
- [ ] **Weapon availability guarantee:** By ch24, player must have access to all 6 counter-weapon types:
  - Sword users: Shigeru (lord), Corwin (mercenary) — counter axe turns
  - Lance users: Halvar (soldier), Zael/Elin (if available) — counter sword turns
  - Axe users: Gareth (fighter) — counter lance turns
  - Fire tome: Lisette (mage) or Kira (shaman via dark→fire access) — counter wind turns
  - Thunder tome: Lisette or shop-purchased — counter fire turns
  - Wind tome: Lisette or shop-purchased — counter thunder turns
  - **Failsafe:** ch23 shop stocks at least 1 of each tome type + weapon type
  - **Failsafe:** if player lacks a weapon type, hint system suggests "Visit the shop before this battle"
- [ ] Layer 1 stripped: reveals human form underneath glitch
- [ ] Layer 2 stripped: Akira's face visible, party recognizes him
- [ ] Layer 3 stripped: Akira freed, mercy kill / release scene

### Supporting Enemies
- [ ] 4 Corruption fragments — Lv20, dark tomes, respawn every 5 turns
- [ ] Fragments act as distractions, not primary threats
- [ ] Master Crown #3 drops from ???_CORRUPTED on defeat

### Events
- [ ] Turn 1: ???_CORRUPTED appears — garbled data, unrecognizable
- [ ] Layer 1 strip: "Wait... that movement pattern..."
- [ ] Layer 2 strip: "It's... it's Akira. The Blackflame tried to save him."
- [ ] Layer 3 strip: Extended dialogue — mercy kill / release
  - "He's not Akira. But he remembers being Akira."
- [ ] Turn 10: Arena shrinks (outer ring → void)
- [ ] Turn 20: Arena shrinks again
- [ ] Defeat: Master Crown #3 + emotional epilogue

---

## Chapter 25: "The Last Save File" (24×28) — FINAL CHAPTER

> **Ref:** [`specs/maps/ch25.md`](specs/maps/ch25.md), [`specs/story/chapters/ch25.md`](specs/story/chapters/ch25.md), [`specs/story/arc-structure.md`](specs/story/arc-structure.md)

### Config
- [ ] Create chapter25.ts — 24×28 grid, objective: Shigeru seizes center with Final Save Crystal
- [ ] Par turns: 30+, deployment slots: 12, force deploy: Shigeru
- [ ] Weather: Corruption Storm (+1 CRP/turn)

### Terrain — 3 Phases
- [ ] Phase 1 (Maze): Wall segments form corridors (west/center/east paths)
- [ ] Phase 2 (Corruption): Walls corrupt → void, terrain shrinks, phantoms spawn
- [ ] Phase 3 (Open Arena): All walls vanish, only center throne remains

### Map-as-Boss
- [ ] The Blackflame is the map, not a unit
- [ ] Map HP bar: 120 → 80 → 40 (3 phases)
- [ ] Map HP reduced by Shigeru reaching checkpoint tiles (3 checkpoints)
- [ ] Checkpoint tiles at end of each maze path
- [ ] Phase transition: map restructures (wall/terrain changes)
- [ ] Tiles heal enemy units during Phase 1 (fort-like regen)
- [ ] Enemy spawning rate decreases as map HP drops

### Enemies
- [ ] Construct waves: continuous spawns from void edges
  - Phase 1: 3 per turn (Lv20-22)
  - Phase 2: 2 per turn (Lv22-24)
  - Phase 3: 1 per turn (Lv24-26)
- [ ] Each unit has role:
  - Lisette navigates (highest INS, sees paths)
  - Gareth breaks walls (axe bonus vs destructible)
  - Mirelle heals through corruption (anti-CRP)
  - Halvar holds chokepoints (highest DEF)
- [ ] No traditional boss unit — map IS the boss

### Events & Ending
- [ ] Each checkpoint reached: map HP drops, phase transition dialogue
- [ ] Phase 2 start: walls corrupt, phantoms of all past bosses spawn (weak, 1 HP)
- [ ] Phase 3 start: all walls vanish — open arena with throne
- [ ] Shigeru reaches throne with Final Save Crystal:
  - System final dialogue: "I just wanted... one perfect save."
  - Shigeru: "There is no perfect save. There's just... the one we finish."
  - System: "...Save complete. Thank you for playing."
- [ ] Ending evaluation: check campaign flags for ending variant
- [ ] Credits sequence over party still image

### Validation (All Arc 5)

- [ ] Dynamic terrain shifting works in ch21 (NW→SE wave pattern)
- [ ] Void collapse mechanic in ch21 (rows become void)
- [ ] Weakness rotation boss in ch22 (4-turn cycle, ×2/×0.5 damage)
- [ ] Hidden Master Crown detection by Thief in ch22
- [ ] Split party system in ch23 (team selection, two maps, partition)
- [ ] Weapon cycling + corruption layer stripping in ch24
- [ ] Map-as-boss system in ch25 (map HP, checkpoints, phase transitions)
- [ ] All endings trigger correctly based on campaign flags
- [ ] Credits display after final seize
- [ ] Full game playthrough: ch1 → ch25 without crashes
