# Arc 4 Maps: Chapters 16-20 — "Awakening"

> **Prerequisites:** Gameplay Phase 5 (fog of war), Phase 6 (multi-phase bosses, negotiate)
> **Spec refs:** `specs/maps/ch16.md`–`ch20.md`, `specs/tasks/campaign-flags.md` (AWR calc, negotiate, recruitment)
> **Deployment slots:** 10→12
> **Key mechanics:** System Constructs, fog of war, multi-phase bosses

---

## Chapter 16: "Through Its Eyes" (16×18)

### Config
- [ ] Create chapter16.ts — 16×18 grid, objective: Survive 12 turns → Defeat Sentinel Alpha
- [ ] Par turns: 25, deployment slots: 10, force deploy: Ren

### Terrain
- [ ] Perfectly symmetrical arena (reflects System's perspective)
- [ ] 4 data node tiles at cardinal points (special terrain)
- [ ] 2 ballista positions (siege weapon tiles)
- [ ] Mirrored chokepoints (2-tile corridors at N/S/E/W)
- [ ] Central open arena, minimal cover

### Enemies
- [ ] Boss: System Sentinel Alpha — System Construct, Lv18, all weapon types
  - 70 HP, immune to CRP, immune to status, drops System Fragment
  - Appears Turn 12 (after survive phase)
- [ ] Test Batch waves (survive phase):
  - Turn 1-3: 2 weak constructs per turn (Lv10)
  - Turn 4-7: 3 medium constructs per turn (Lv13)
  - Turn 8-11: 2 strong constructs per turn (Lv15)
- [ ] Sentinel Alpha enters at Turn 12 with 2 Lv15 escorts

### Events
- [ ] Turns 1-11: Test Batch spawns each turn (wave system)
- [ ] Turn 12: Survive phase complete → Sentinel Alpha spawns
- [ ] System narration: System explains itself through arena design
- [ ] Sentinel Alpha defeat: System Fragment drop, dialogue about System's grief

### Ballista Mechanic
- [ ] Ballista tile: special terrain, unit on tile gets "Fire Ballista" action in menu
- [ ] Fire Ballista: select target tile within 3-10 range (show targeting overlay)
- [ ] Fixed damage: 15 (ignores DEF/RES), hit rate: 75% (flat, ignores SKL)
- [ ] Uses unit's full action (cannot move after, ends turn)
- [ ] Ballista can target empty tiles (area denial) or occupied tiles
- [ ] Only one shot per turn per ballista
- [ ] Enemy constructs do not use ballistas (player advantage)

---

## Chapter 17: "Data Recovery" (18×20, Fog of War)

### Config
- [ ] Create chapter17.ts — 18×20 grid, objective: Capture 3 data nodes + Boss Kill/Negotiate
- [ ] Par turns: 25, deployment slots: 10, force deploy: Ren
- [ ] Fog of war: ON (vision range 3, thief 5)

### Terrain
- [ ] Archive dungeon: dark corridors, branching paths
- [ ] Three data nodes: Alpha (west), Beta (east), Gamma (south)
- [ ] Center: System manifestation room (boss position)
- [ ] Exit: north edge (must reach after boss)
- [ ] Torch pickups at key intersections
- [ ] Wall tiles forming maze-like corridors

### Enemies
- [ ] Boss: The System — System Construct, Lv20, dark tomes, MAG 25, RES 20
  - 75 HP, regen 5 HP/turn
  - Negotiation possible: party avg AWR ≥ 70 (`floor(sum(deployed.awr) / count)`) AND boss HP ≤ 50% → Ren Talk
- [ ] 8 Construct guardians — Lv14-16, guard AI at data nodes (2-3 per node)
- [ ] 4 Ambush constructs — hidden in fog, attack when player enters range
- [ ] Total: ~13 enemies

### Data Node Capture
- [ ] Data node tile: player unit steps on it → captured (one-time)
- [ ] Each capture: reveals lore dialogue about System's origin
  - Node Alpha: Cycle #1 was a real game with a real player
  - Node Beta: System became save manager
  - Node Gamma: Player stopped playing, System kept running
- [ ] All 3 captured: boss room door opens

### Negotiate Mechanic
- [ ] Check conditions: Ren adjacent to boss, boss HP ≤ 50%, party avg AWR ≥ 70
- [ ] Negotiate action appears in Ren's action menu
- [ ] Success: boss stands down, chapter ends peacefully
- [ ] Set campaign flag: `system_negotiated = true`
- [ ] Flag effect: ch25 boss Phase 1 stats -20%

---

## Chapter 18: "Legacy Weapons" (18×20)

### Config
- [ ] Create chapter18.ts — 18×20 grid, objective: Boss Kill / Recruit Ghael
- [ ] Par turns: 28, deployment slots: 11, force deploy: Ren

### Terrain
- [ ] Mountain fortress: Ghael's defensive line at row 8 (fort tiles, stationary)
- [ ] Treasure rooms west and east (chest tiles with legendary weapons)
- [ ] Vault behind Ghael (rows 0-7) with legacy weapon tiles
- [ ] Mountain approaches from south (player spawn rows 16-19)

### Enemies
- [ ] Boss: Ghael the Ironwall — General, Lv18, steel_lance + javelin
  - 70 HP, DEF 28, RES 8, stationary on fort
  - Recruitable: reduce to ≤5 HP, Ren Talk
- [ ] Alt Boss (if Ghael recruited): Relic Warden — System Construct, Lv16, 50 HP
  - Spawns blocking vault exit after Ghael recruitment
- [ ] 6 Soldiers — Lv15-16, defensive line along row 8
- [ ] 4 Knights — Lv15, guard AI at fortress entrance
- [ ] 2 Archers — Lv15, elevated positions
- [ ] Total: ~13 enemies

### Conditional Recruitment — Ghael
- [ ] Create Ghael unit data: Lv18, steel_lance + javelin, General class
- [ ] Recruitment: reduce to ≤5 HP + Ren Talk action
- [ ] If recruited: Relic Warden spawns as secondary boss, Ghael joins roster
- [ ] If killed: no secondary boss, miss Ghael permanently
- [ ] Campaign flag: `ghael_recruited = true/false`

### Rewards
- [ ] West treasure room: Master Crown #1 (story reward)
- [ ] East treasure room: Legendary weapon (Prf for Ren or random party member)
- [ ] Ghael defeat/recruit: Master Seal

---

## Chapter 19: "The Offer" (16×20)

### Config
- [ ] Create chapter19.ts — 16×20 grid, objective: Seize System terminal
- [ ] Par turns: 15 (survive-style pacing), deployment slots: 11, force deploy: Ren

### Terrain
- [ ] Symmetrical corridors (System inner sanctum)
- [ ] Side rooms with ghost boss spawn points
- [ ] Archive chamber (lore room)
- [ ] Memory Guardian blocking terminal at (4, 8)
- [ ] Terminal throne at (2, 8) — seize target
- [ ] Hidden tile: Kael's Memory Shard at (15, 19) — no visual indicator

### Enemies
- [ ] Boss: Memory Guardian — System Construct, Lv19, MAG 24, RES 22
  - 65 HP, summons ghost bosses every 3 turns
- [ ] Ghost bosses (summons): Phantom Garrek, Phantom Thane, Phantom Morryn
  - Each Lv10-12, one weapon, aggressive AI, despawn after 3 turns
- [ ] System Emissary — System Construct, replica of Cycle #1 Ren
  - Non-hostile, Talk triggers dialogue
- [ ] 4 Construct guards — Lv16, guard AI in corridors
- [ ] Total: ~6 permanent + rotating ghost summons

### Events
- [ ] Ghost summons: every 3 turns, Memory Guardian creates phantom enemies
- [ ] System Emissary Talk: triggers The Choice dialogue
  - "One more reset. Fix everything."
  - Ren refuses: "Even if the ending is imperfect, it's OURS."
  - Not a real mechanical choice — game continues regardless
  - LOY shift based on party members' reactions
- [ ] Hidden Kael Memory Shard: step on (15,19) to receive item
- [ ] Terminal seize: chapter ends with arc transition

---

## Chapter 20: "Point of No Return" (20×22)

### Config
- [ ] Create chapter20.ts — 20×22 grid, objective: Boss Kill (Sentinel Omega)
- [ ] Par turns: 25, deployment slots: 12, force deploy: Ren
- [ ] Weather: Corruption Storm (+1 CRP/turn all units)

### Terrain
- [ ] Fractured battlefield: void chasm at row 14 (impassable except bridge)
- [ ] Bridge crossing at center (destructible, HP 20)
- [ ] Gateway throne at north (3, 10) — seize after boss
- [ ] Echo's Core tile visible (special terrain, glow)
- [ ] Terrain corrupts every 2 turns (plains → glitched, shrinking playable area)

### Enemies
- [ ] Boss: System Sentinel Omega — System Construct, Lv22, multi-phase
  - Phase 1 (80-40 HP): physical stats (STR 24, DEF 22), melee weapons
  - Phase 2 (40-0 HP): magic stats (MAG 26, RES 20), +2 MOV, ranged
  - 80 HP total, phase transition at 40 HP
- [ ] 6 Constructs — Lv17-18, aggressive AI
- [ ] 4 Corrupted units — Lv16, erratic AI
- [ ] Turn 8: 3 reinforcement constructs from void edges
- [ ] Total: ~11 initial + reinforcements

### Conditional Recruitment — Echo
- [ ] Echo (System Construct with free will) appears Turn 5 as green ally NPC
- [ ] Create Echo unit data: Lv18, unique tome, System Construct class
- [ ] Echo auto-joins roster if alive at chapter end
- [ ] Campaign flag: `echo_saved = true/false`
- [ ] If Echo dies during chapter: permanently lost

### Events
- [ ] Turn 2: Terrain corruption begins (2-tile spread per 2 turns)
- [ ] Turn 5: Echo defects from System, appears as ally
- [ ] Phase transition: Sentinel Omega shifts at 40 HP (stat swap + dialogue)
- [ ] Chapter end: Ren seizes gateway, Arc 4 conclusion
- [ ] "No resets from now on" commitment dialogue

### Validation (All Arc 4)

- [ ] Fog of war in ch17: tiles outside vision dimmed, hidden enemies not rendered
- [ ] Fog: enemy entering vision → reveal flash, enemy leaving → hidden again
- [ ] Ballista in ch16: Fire Ballista action, 3-10 range, 15 fixed damage, 75% hit
- [ ] Negotiate in ch17: conditions checked (party avg AWR ≥ 70, boss HP ≤ 50%, Ren adjacent)
- [ ] Negotiate sets `system_negotiated = true` → ch25 Phase 1 stats -20%
- [ ] Ghost summons in ch19: spawn every 3 turns, despawn after 3 turns
- [ ] Multi-phase boss in ch20: Sentinel Omega transitions at 40 HP (physical → magic stats)
- [ ] Weather (corruption storm) in ch20: +1 CRP/turn to ALL units on map
- [ ] Terrain corruption spread in ch20: plains → glitched every 2 turns
- [ ] Campaign flags persist: `system_negotiated`, `ghael_recruited`, `echo_saved`
- [ ] Ghael recruitment: ≤5 HP + Ren Talk → Relic Warden spawns as secondary boss
- [ ] Echo survival: alive at ch20 end → `echo_saved = true`, added to roster
- [ ] Save/load: all Arc 4 flags persist correctly
- [ ] E2E: ch17 with AWR ≥ 70 → negotiate succeeds → peaceful end
- [ ] E2E: ch17 with AWR < 70 → must defeat boss traditionally
