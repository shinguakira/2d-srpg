# Arc 3 Maps: Chapters 11-15 — "Corruption"

> **Prerequisites:** Gameplay Phase 4 (CRP system, meta-stats), Phase 1 (events)
> **Spec refs:** `specs/maps/ch11.md`–`ch15.md`, `specs/tasks/campaign-flags.md` (recruitment, CRP calc)
> **Deployment slots:** 8→10
> **Key mechanic:** CRP (Corruption) as active battlefield threat

---

## Chapter 11: "Spreading Plague" (18×18)

> **Ref:** [`specs/maps/ch11.md`](specs/maps/ch11.md), [`specs/story/chapters/ch11.md`](specs/story/chapters/ch11.md), [`specs/story/characters/kira.md`](specs/story/characters/kira.md)

### Config
- [ ] Create chapter11.ts — 18×18 grid, objective: Dual (Boss Kill + Protect 3/5 NPCs)
- [ ] Par turns: 22, deployment slots: 8, force deploy: Shigeru

### Terrain
- [ ] Market town with glitched tiles spreading from west
- [ ] East/south exits for NPC villager escape routes
- [ ] Blighted ground: start 3 tiles on west edge, spread 2 tiles/turn eastward
- [ ] Mix of plains, buildings (walls), market stalls (ruins terrain)
- [ ] Fort tiles at town center (defensive positions)

### Enemies
- [ ] Boss: Corrupted General — corrupted class, Lv14, dark tome, erratic AI
  - 58 HP, stats randomize ±3 per turn (unique boss mechanic)
  - May heal instead of attack (30% chance)
- [ ] 6 Dark Mages — Lv11-12, aggressive AI, dark tomes (+CRP on hit)
- [ ] 4 Soldiers — Lv11, guard AI at town entrances
- [ ] 3 Corrupted units — Lv12, aggressive AI, erratic movement
- [ ] Reinforcements Turn 8: 2 corrupted from glitched edge
- [ ] Total: ~14 enemies + reinforcements

### NPCs & Recruitment
- [ ] 5 NPC villagers: green allies, flee toward exits (escort AI toward exit tiles)
- [ ] Villagers panic Turn 7: reverse direction briefly (event)
- [ ] Must save 3/5 for victory
- [ ] Kira (Shaman) starts as enemy — defects mid-chapter
  - Create Kira unit data: Lv10, Nosferatu, Shaman class, CRP 60
  - Defection event: Turn 5, Kira switches to player after witnessing System truth

### Events
- [ ] Turn 2: Blighted ground spread (terrain mutation event, every 2 turns)
- [ ] Turn 5: Kira defection event + dialogue
- [ ] Turn 7: Villager panic — reverse movement for 2 turns
- [ ] Glitch spread continues: shrinks playable area over time
- [ ] Boss randomization: each enemy phase, boss stats reroll ±3

---

## Chapter 12: "The Turning" (16×18) — CORRUPTION LOSS

> **Ref:** [`specs/maps/ch12.md`](specs/maps/ch12.md), [`specs/story/chapters/ch12.md`](specs/story/chapters/ch12.md)

### Config
- [ ] Create chapter12.ts — 16×18 grid, objective: Boss Kill (Seras)
- [ ] Par turns: 20, deployment slots: 9, force deploy: Shigeru

### Terrain
- [ ] Monastery interior: tight corridors, shrine tile, side rooms
- [ ] Shrine tile at center — Seras position (throne bonuses)
- [ ] Side rooms with chest tiles (Purify staff fragment in west chest)
- [ ] Indoor terrain: mounted units -2 MOV

### Enemies
- [ ] Boss: Abbot Seras — Bishop (promoted cleric), Lv14, Lightning + Shine
  - 50 HP, light magic heals corrupted allies
  - Bonus damage vs units with CRP > 0
  - Boss AI, stationary on shrine
- [ ] 4 Monks — Lv11-12, light tomes, healer AI (heal Seras)
- [ ] 3 Knights — Lv12, guard AI (armored, corridors)
- [ ] 2 Archers — Lv11, stationary
- [ ] Total: ~10 enemies

### Corruption Loss Event
- [ ] Turn 5: Highest-CRP party member hits CRP 100
  - Event: dramatic dialogue, unit turns enemy faction
  - Turned unit fights against party (aggressive AI)
  - Must be defeated — permadeath, cannot be saved
- [ ] CRP boost mechanic (ensures event fires): all deployed units gain +15 CRP at chapter start from monastery's corrupted atmosphere
  - This guarantees at least one unit approaches threshold
  - Players who managed CRP well still lose someone, but the LEAST corrupted survive
  - Announced at chapter start: "The corruption here is overwhelming. Everyone feels it."
- [ ] Campaign flag: `ch12_corruption_victim` = unitId of turned unit
- [ ] Post-loss dialogue: party realizes CRP management is life-or-death

### Events
- [ ] Turn 1: Monastery atmosphere dialogue
- [ ] Turn 5: Corruption loss event (scripted)
- [ ] West chest: Purify Staff fragment (reduces CRP, limited uses)
- [ ] Seras defeat: light magic revelation, anti-corruption tools introduced

---

## Chapter 13: "Second Chances" (18×20)

> **Ref:** [`specs/maps/ch13.md`](specs/maps/ch13.md), [`specs/story/chapters/ch13.md`](specs/story/chapters/ch13.md), [`specs/story/characters/zael.md`](specs/story/characters/zael.md)

### Config
- [ ] Create chapter13.ts — 18×20 grid, objective: Boss Kill (Fortress Warden)
- [ ] Par turns: 22, deployment slots: 9, force deploy: Shigeru

### Terrain
- [ ] Highland fortress with elevated wyvern perches
- [ ] Three entrances: main gate (south), side door (east), forest path (west)
- [ ] Fort tiles at fortress interior
- [ ] Mountain/cliff tiles around perimeter

### Enemies
- [ ] Boss: Fortress Warden — General (promoted soldier), Lv15, steel_lance
  - 55 HP, high DEF (22+), 2 armored escorts, stationary
- [ ] 2 Armored escorts — Lv13, knight class, guard AI
- [ ] 4 Soldiers — Lv12, aggressive AI
- [ ] 2 Archers — Lv12, stationed on perches
- [ ] 2 Wyvern Riders — Lv13, flying, aggressive AI
- [ ] Total: ~11 enemies + Zael

### Conditional Recruitment — Zael
> See `specs/tasks/campaign-flags.md` for exact conditions.

- [ ] Zael (Wyvern Rider) starts as enemy — CRP 43, ticking +3/turn
- [ ] Create Zael unit data: Lv12, steel_lance, Wyvern Rider class, CRP 43
- [ ] Recruitment condition: reduce Zael to ≤5 HP, then Shigeru uses Talk action
- [ ] Recruitment window: Turns 1-18 (Zael flees Turn 19)
- [ ] If recruited: Fortress Warden becomes boss (as normal)
- [ ] If killed/escapes: Zael becomes ch14 boss (harder variant)
- [ ] Campaign flag: `zael_recruited = true/false`

### Events
- [ ] Zael CRP ticking: +3/turn (visible), CRP 43 → 100 at Turn 19 (flees at Turn 19 regardless)
- [ ] Zael recruitment dialogue: "the buzzing" (CRP sensation)
- [ ] Turn 19: if not recruited, Zael flees map — "I can't hold on... I have to go"
- [ ] CRP and flee deadline now aligned: both point to Turn 19 as hard cutoff

---

## Chapter 14: "The Monastery" (16×16)

> **Ref:** [`specs/maps/ch14.md`](specs/maps/ch14.md), [`specs/story/chapters/ch14.md`](specs/story/chapters/ch14.md), [`specs/story/characters/elara.md`](specs/story/characters/elara.md)

### Config
- [ ] Create chapter14.ts — 16×16 grid, objective: Boss Kill
- [ ] Par turns: 24, deployment slots: 9, force deploy: Shigeru
- [ ] Boss varies based on `zael_recruited` flag

### Terrain
- [ ] Monastery complex: chapel (shrine/throne), library (chest), corrupted grove (north)
- [ ] Chapel shrine tile at center — Elara's position
- [ ] Library chest: Master Seal reward
- [ ] North: Dark Forest + data void tiles (corrupted grove)
- [ ] Indoor terrain for most of map

### Enemies (Default — Zael recruited)
- [ ] Boss: The Hollow — Druid (promoted shaman), Lv15, Eclipse tome (siege weapon)
  - 55 HP, Eclipse: range 3-10, MAG-based damage, hit rate 60% (flat), 8 might
  - Eclipse targeting: AI picks highest-CRP player unit each turn (bypasses front line)
  - Eclipse self-cost: 5 HP per cast (boss damages self to fire)
  - Self-damage is intended strategy: 5 HP/turn × 9 turns = ~45 HP lost by Turn 9
  - Siege tome mechanic: like ballista but MAG-based, cannot counter (too far)
- [ ] 4 Dark Mages — Lv12-13, aggressive AI
- [ ] 3 Corrupted units — Lv13, erratic AI
- [ ] 2 Monks — Lv12, light tomes, healer AI

### Enemies (Alt — Zael NOT recruited)
- [ ] Boss: Corrupted Zael — CRP 100, erratic AI, Lv14, steel_lance
  - Cannot be saved, must be defeated, very high stats
- [ ] Same supporting enemies as default

### Recruitment
- [ ] Elara (Monk) starts as green NPC at chapel shrine
- [ ] Create Elara unit data: Lv11, Lightning + Shine, Monk class
- [ ] Auto-recruits when any player unit moves adjacent to her
- [ ] Elara's light magic: bonus damage vs CRP > 0, reduces target CRP

### Events
- [ ] Elara recruitment: adjacent trigger + dialogue about light magic
- [ ] The Hollow's Eclipse: fires each enemy phase at highest-CRP unit
- [ ] Boss self-damage tracking (visible HP drain)
- [ ] Library chest: Master Seal

---

## Chapter 15: "The Rally" (20×22)

> **Ref:** [`specs/maps/ch15.md`](specs/maps/ch15.md), [`specs/story/chapters/ch15.md`](specs/story/chapters/ch15.md)

### Config
- [ ] Create chapter15.ts — 20×22 grid, objective: Rout (all enemies)
- [ ] Par turns: 22, deployment slots: 10, force deploy: Shigeru

### Terrain
- [ ] Massive highland fortress with three entry points
- [ ] Main gate (south center), east sally port, west supply tunnel
- [ ] West tunnel: trap tiles (damage on step)
- [ ] Inner courtyard: 3 corrupted patches (3×2 blocks, CRP terrain)
- [ ] Throne at fortress heart — Ghast's position

### Enemies
- [ ] Boss: Warden Ghast — General, Lv16, steel_lance + javelin
  - 65 HP, extremely high DEF on throne, boss AI
- [ ] 6 Soldiers — Lv13-14, mix of guard and aggressive AI
- [ ] 4 Knights — Lv14, armored, guard AI at gates
- [ ] 3 Dark Mages — Lv13, aggressive AI
- [ ] 2 Archers — Lv13, stationed on walls
- [ ] Turn 10 reinforcements: 2 Paladins + 1 Sage (first promoted enemies!)
- [ ] Total: ~16 initial + 3 promoted reinforcements (hardest Arc 3 chapter)

### Events
- [ ] Turn 8: EMB expenditure event — Shigeru spends EMB to overwrite 3 corrupted patches
  - Dialogue: Shigeru loses memories of cycles 112-116
  - Corrupted terrain patches become normal terrain
  - EMB decreases by cost
- [ ] Turn 10: Promoted enemy reinforcements (Paladin, Sage) from fortress interior
- [ ] Three-pronged assault reward: chapters designed for 3-team split
- [ ] Ghast defeat: "three hundred years" dialogue
- [ ] Rout complete: Arc 3 conclusion, cautious hope

### Validation (All Arc 3)

- [ ] CRP system active and functional across all chapters
- [ ] Blighted terrain spreads correctly in ch11 (2 tiles/turn from west)
- [ ] Ch11 NPC villagers: 5 spawn, panic Turn 7, at least 3 must reach exits
- [ ] Ch12 corruption loss: +15 CRP boost at chapter start, highest-CRP unit turns at Turn 5
- [ ] `ch12_corruption_victim` flag set correctly to turned unit's ID
- [ ] Zael recruitment in ch13: ≤5 HP + Shigeru Talk within Turn 18 deadline
- [ ] Zael CRP: 43 + 3/turn = 100 at Turn 19 (aligned with flee deadline)
- [ ] Campaign flag `zael_recruited` affects ch14 boss: Hollow (true) vs Corrupted Zael (false)
- [ ] Elara joins correctly in ch14 (adjacent trigger, no Talk required)
- [ ] Eclipse tome: 3-10 range, 8 might, 60% flat hit, 5 HP self-cost per cast
- [ ] EMB expenditure event in ch15: EMB decreases, 3 corrupted terrain patches → normal
- [ ] Promoted enemy reinforcements in ch15 Turn 10 (Paladin, Sage — first promoted enemies)
- [ ] Indoor terrain in ch12/ch14: mounted -2 MOV, flying dismount
- [ ] Save/load: `zael_recruited` flag persists across save between ch13-ch14
- [ ] Save/load: CRP values persist across chapters
- [ ] Narrative branch: play ch13→ch14 with Zael recruited, then reload and play without → verify different boss
