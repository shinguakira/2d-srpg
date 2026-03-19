# Terrain

All terrain types, movement costs, bonuses, and special rules. Terrain is the tactical foundation — positioning on the right tile wins battles.

See [stats.md](stats.md) for terrain bonus formulas (DEF bonus added to effective DEF, avoid bonus added to Evade).
Code reference: `src/core/terrain.ts`

---

## Terrain Types

| Terrain | Move Cost | DEF Bonus | Avoid Bonus | HP Regen | STA Recovery | Notes |
|---------|-----------|-----------|-------------|----------|-------------|-------|
| **Plain** | 1 | 0 | 0 | — | — | Open ground. No benefits, no costs. |
| **Forest** | 2 | +1 | +20 | — | — | Standard defensive tile. Costs extra movement. |
| **Mountain** | 3 | +2 | +30 | — | — | Best natural defense. Expensive to reach. |
| **Fort** | 1 | +3 | +20 | +5 HP/turn | -3 STA/turn | Safe zone. Heals and recovers stamina passively. |
| **Village** | 1 | 0 | +10 | — | — | Can be visited for rewards (items, gold, story). |
| **Throne** | 1 | +5 | +30 | +10 HP/turn | -5 STA/turn | Boss tile. Best defensive bonuses. Seize target. |
| **Water** | Impassable | — | — | — | — | Cannot be crossed by any ground unit. |
| **Wall** | Impassable | — | — | — | — | Map boundary or obstacle. |

### New Terrain Types (Meta-Narrative)

| Terrain | Move Cost | DEF Bonus | Avoid Bonus | Special | Notes |
|---------|-----------|-----------|-------------|---------|-------|
| **Glitched Tile** | 1 | 0 | 0 | +2 CRP/turn, +3-5 AWR (witness) | Corrupted terrain. Visually flickering. Appears Ch2+. |
| **Data Void** | 2 | -2 | -20 | +3 CRP/turn, SYNC -1/turn | Holes in the map data. Appears Ch3-4. Negative defense. |
| **Memory Tile** | 1 | +1 | +10 | Ren: LOOP +2 if standing at turn end | Tiles where significant events happened in past cycles. Only visible to AWR 30+. |
| **Corrupted Fort** | 1 | +3 | +20 | Heals +5 HP but +1 CRP/turn | A fort infected by the System. Heals your body, corrupts your data. |
| **Broken Throne** | 1 | +2 | +10 | No HP regen, +2 CRP/turn | Ch4. The System's corruption has broken the throne. Reduced bonuses. |

---

## Terrain Rules

### Movement Cost

- Movement cost is subtracted from MOV per tile traversed during BFS pathfinding.
- If remaining MOV < tile cost, the tile is unreachable.
- Impassable tiles (water, wall) cannot be entered regardless of MOV.
- **STA interaction**: Each tile moved adds +1 STA. Forest/Mountain tiles do NOT add extra STA beyond the base +1 per tile — the movement cost limits how far you go, which naturally limits STA.

### Defensive Bonuses

- **DEF Bonus**: Added to the defending unit's effective DEF during damage calculation.
- **Avoid Bonus**: Added to the defending unit's Evade during hit rate calculation.
- Bonuses only apply when the unit is **defending** — not when attacking from the tile.
- Bonuses apply against both physical AND magical attacks.

### Fort/Throne Healing

- HP regeneration triggers at the **start of the unit's turn** (before acting).
- Forts heal +5 HP per turn. Thrones heal +10 HP per turn.
- Does not exceed max HP.
- STA recovery from Forts (-3) and Thrones (-5) triggers passively — does NOT require Wait. This is important for Bram (No Patience — cannot Wait).
- SYNC bonus: healing at a fort/throne grants +2 SYNC (see stats.md).

### Class-Specific Movement Rules

| Rule | Classes Affected | Effect |
|------|-----------------|--------|
| **Mounted movement** | Cavalier (Kael) | Forest costs 3 instead of 2. Mountain costs 4 instead of 3. Penalty for riding through rough terrain. |
| **Infantry standard** | Lord, Mage, Fighter, Cleric, Soldier | Normal movement costs as listed. |
| **Heavy armor** | Knight (enemy only) | Forest costs 3. Mountain impassable. Slow but tanky. |

### Terrain × CHA (Aggro)

- Units standing on defensive terrain (Forest, Mountain, Fort, Throne) have their Aggro Weight **reduced by 5**. Enemy AI is less likely to attack well-positioned units.
- Units standing on Plain or Glitched Tiles have **normal Aggro Weight**.
- This means: placing a high-CHA unit on a fort makes them a tank that enemies still target (CHA overcomes the -5), while a low-CHA unit on a fort becomes nearly invisible to AI.

---

## Terrain × Meta-Stats

| Terrain | AWR Interaction | SYNC Interaction | CRP Interaction | STA Interaction |
|---------|----------------|-----------------|----------------|----------------|
| **Forest** | — | — | — | — |
| **Mountain** | AWR 60+: can see 1 extra tile of enemy movement from elevation | — | — | — |
| **Fort** | — | +2 SYNC per turn (healing stabilizes) | — | -3 STA/turn passive |
| **Throne** | — | +3 SYNC per turn | — | -5 STA/turn passive |
| **Glitched Tile** | +3-5 AWR to units within 2 tiles (witnessing the glitch) | -2 SYNC/turn | +2 CRP/turn | — |
| **Data Void** | +5 AWR first time standing (existential shock) | -1 SYNC/turn | +3 CRP/turn | +2 STA/turn (hostile data drains energy) |
| **Memory Tile** | — | — | — | -2 STA/turn (past cycle peace) |
| **Corrupted Fort** | — | +1 SYNC/turn (reduced from normal fort) | +1 CRP/turn | -3 STA/turn |
| **Broken Throne** | — | — | +2 CRP/turn | — |

---

## Terrain × Time of Day

| Terrain | Day Effect | Night Effect |
|---------|-----------|-------------|
| **Forest** | Normal | +10 additional avoid (darkness + trees = hard to find) |
| **Mountain** | Normal | +5 additional avoid |
| **Fort** | Normal | +2 additional HP regen (safe rest at night) |
| **Plain** | Normal | -5 avoid (exposed in darkness — visible silhouette) |
| **Glitched Tile** | Normal | Glitch effect doubles (+4 CRP/turn, +6-10 AWR). System instability increases at night. |

---

## Terrain Placement Guide (Map Design)

Rules of thumb for chapter map design:

- **Forts**: Place 2-3 per map as rest/healing stations. NOT on the critical path — force the player to choose: push forward or detour to heal?
- **Forests**: Use liberally as defensive cover. Creates "lanes" of safe movement.
- **Mountains**: Chokepoint creators. Place them to force single-file movement.
- **Plains**: Open areas for cavalry charges and large enemy formations.
- **Villages**: Off the main path. Rewards exploration (items, gold, story) but costs turns to visit.
- **Glitched Tiles**: Scatter 3-5 per map starting Ch2. More in Ch3-4. Creates dangerous zones the player must navigate around — or through, if they're willing to eat CRP.
- **Data Voids**: Ch3-4 only. 1-2 per map. The most dangerous terrain. Block key shortcuts to force the player into longer, safer routes.
- **Memory Tiles**: 2-3 per map. Hidden (only visible to AWR 30+). Rewards for Ren — +2 LOOP per turn. Place them in tactically mediocre positions so standing on them is a LOOP vs positioning trade-off.

---

## Open Questions

- **Flying units**: If flying enemies or classes are added, they should ignore all movement costs (1 per tile, pass over water/mountains). Do they still benefit from terrain DEF/avoid?
- **Destructible terrain**: Should siege weapons or high-CRP explosions be able to destroy walls/forests? Adds tactical depth but complexity.
- **Weather**: Rain (+1 move cost to all terrain, +10 avoid on forests), snow (+2 move cost, -5 SPD to all units), sandstorm (fog of war + -10 hit). Worth adding?
- **Bridges**: Should bridges exist over water? Currently water is always impassable.
- **Terrain shift**: Glitched tiles spreading to adjacent tiles over time? Map degradation as a mechanic in Ch4.
