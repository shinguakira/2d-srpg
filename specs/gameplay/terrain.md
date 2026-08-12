# Terrain

All terrain types, movement costs, bonuses, and special rules. Terrain is the tactical foundation — positioning on the right tile wins battles.

See [stats.md](stats.md) for terrain bonus formulas (DEF bonus added to effective DEF, avoid bonus added to Evade).
Code reference: `src/core/terrain.ts`

---

## Terrain Types

### Standard Terrain

| Terrain | Move Cost | DEF Bonus | Avoid Bonus | HP Regen | STA Recovery | Notes |
|---------|-----------|-----------|-------------|----------|-------------|-------|
| **Plain** | 1 | 0 | 0 | — | — | Open ground. No benefits, no costs. |
| **Forest** | 2 | +1 | +20 | — | — | Standard defensive tile. Costs extra movement. |
| **Mountain** | 3 | +2 | +30 | — | — | Best natural defense. Expensive to reach. |
| **Fort** | 1 | +3 | +20 | +5 HP/turn | -3 STA/turn | Safe zone. Heals and recovers stamina passively. |
| **Village** | 1 | 0 | +10 | — | — | Can be visited for rewards (items, gold, story). |
| **Throne** | 1 | +5 | +30 | +10 HP/turn | -5 STA/turn | Boss tile. Best defensive bonuses. Seize target. |
| **Water** | Impassable | — | — | — | — | Cannot be crossed by ground units. Flying passes over. |
| **Wall** | Impassable | — | — | — | — | Map boundary or obstacle. |
| **Bridge** | 1 | 0 | 0 | — | — | Crosses water. Can be destroyed (see destructible terrain). |
| **Sand** | 2 (foot), 3 (mounted) | 0 | -10 | — | +1 STA/tile | Desert terrain. Penalizes movement and drains stamina. |
| **Ice** | 1 | 0 | -10 | — | — | Slippery. Units that end turn here may slide 1 tile in movement direction (50% chance). |
| **Lava** | Impassable | — | — | — | — | Volcanic terrain. Flying units can cross but take 5 damage if ending turn above. |
| **Ruins** | 1 | +1 | +10 | — | — | Ancient structures. May contain hidden items (Thief can detect). |
| **Indoor** | 1 | 0 | 0 | — | — | Interior tile. Mounted units have -2 MOV in indoor chapters. Flying units dismount. |
| **Door** | Locked | — | — | — | — | Requires Door Key or Lockpick to open. Becomes plain tile when opened. |
| **Chest** | 1 | 0 | 0 | — | — | Requires Chest Key or Lockpick. Contains items. Becomes plain after opened. |
| **Armory** | 1 | 0 | 0 | — | — | Mid-chapter shop access. Can buy/sell during player phase. |

### New Terrain Types (Meta-Narrative)

| Terrain | Move Cost | DEF Bonus | Avoid Bonus | Special | Notes |
|---------|-----------|-----------|-------------|---------|-------|
| **Blighted Tile** | 1 | 0 | 0 | +2 CRP/turn, +3-5 INS (witness) | Corrupted terrain. Visually flickering. Appears Ch2+. |
| **Abyssal Rift** | 2 | -2 | -20 | +3 CRP/turn, ATT -1/turn | Holes in the map data. Appears Ch3-4. Negative defense. |
| **Memory Tile** | 1 | +1 | +10 | Shigeru: EMB +2 if standing at turn end | Tiles where significant events happened in past cycles. Only visible to INS 30+. |
| **Defiled Fort** | 1 | +3 | +20 | Heals +5 HP but +1 CRP/turn | A fort infected by the Blackflame. Heals your body, corrupts your data. |
| **Broken Throne** | 1 | +2 | +10 | No HP regen, +2 CRP/turn | Ch4. The Blackflame's corruption has broken the throne. Reduced bonuses. |

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
- STA recovery from Forts (-3) and Thrones (-5) triggers passively — does NOT require Wait. This is important for Goro (No Patience — cannot Wait).
- ATT bonus: healing at a fort/throne grants +2 ATT (see stats.md).

### Class-Specific Movement Rules

| Rule | Classes Affected | Effect |
|------|-----------------|--------|
| **Infantry standard** | Lord, Mage, Fighter, Cleric, Soldier, Mercenary, Archer, Thief, Shaman, Monk, Dancer | Normal movement costs as listed. |
| **Mounted movement** | Cavalier, Troubadour, Paladin, Great Knight, Mage Knight, Nomad Trooper, Valkyrie | Forest costs 3 instead of 2. Mountain costs 4. Sand costs 3. Indoor -2 MOV. |
| **Flying movement** | Pegasus Knight, Wyvern Rider, Falcon Knight, Dark Flier, Wyvern Lord, Malig Knight, Seraph | ALL terrain costs 1 (ignores terrain). Can cross water, mountains, lava. No terrain DEF/Avoid bonuses. Indoor: dismount (become infantry). |
| **Heavy armor** | Armor Knight, General, Marshal | Forest costs 3. Mountain impassable. Sand costs 4. Slow but tanky. |
| **Thief movement** | Thief, Assassin, Rogue | Desert/sand costs 1 (agile). Can detect hidden items in Ruins tiles. |

### Terrain × CHA (Aggro)

- Units standing on defensive terrain (Forest, Mountain, Fort, Throne) have their Aggro Weight **reduced by 5**. Enemy AI is less likely to attack well-positioned units.
- Units standing on Plain or Blighted Tiles have **normal Aggro Weight**.
- This means: placing a high-CHA unit on a fort makes them a tank that enemies still target (CHA overcomes the -5), while a low-CHA unit on a fort becomes nearly invisible to AI.

---

## Terrain × Meta-Stats

| Terrain | INS Interaction | ATT Interaction | CRP Interaction | STA Interaction |
|---------|----------------|-----------------|----------------|----------------|
| **Forest** | — | — | — | — |
| **Mountain** | INS 60+: can see 1 extra tile of enemy movement from elevation | — | — | — |
| **Fort** | — | +2 ATT per turn (healing stabilizes) | — | -3 STA/turn passive |
| **Throne** | — | +3 ATT per turn | — | -5 STA/turn passive |
| **Blighted Tile** | +3-5 INS to units within 2 tiles (witnessing the glitch) | -2 ATT/turn | +2 CRP/turn | — |
| **Abyssal Rift** | +5 INS first time standing (existential shock) | -1 ATT/turn | +3 CRP/turn | +2 STA/turn (hostile data drains energy) |
| **Memory Tile** | — | — | — | -2 STA/turn (past cycle peace) |
| **Defiled Fort** | — | +1 ATT/turn (reduced from normal fort) | +1 CRP/turn | -3 STA/turn |
| **Broken Throne** | — | — | +2 CRP/turn | — |

---

## Terrain × Time of Day

| Terrain | Day Effect | Night Effect |
|---------|-----------|-------------|
| **Forest** | Normal | +10 additional avoid (darkness + trees = hard to find) |
| **Mountain** | Normal | +5 additional avoid |
| **Fort** | Normal | +2 additional HP regen (safe rest at night) |
| **Plain** | Normal | -5 avoid (exposed in darkness — visible silhouette) |
| **Blighted Tile** | Normal | Glitch effect doubles (+4 CRP/turn, +6-10 INS). System instability increases at night. |

---

## Terrain Placement Guide (Map Design)

Rules of thumb for chapter map design:

- **Forts**: Place 2-3 per map as rest/healing stations. NOT on the critical path — force the player to choose: push forward or detour to heal?
- **Forests**: Use liberally as defensive cover. Creates "lanes" of safe movement.
- **Mountains**: Chokepoint creators. Place them to force single-file movement.
- **Plains**: Open areas for cavalry charges and large enemy formations.
- **Villages**: Off the main path. Rewards exploration (items, gold, story) but costs turns to visit.
- **Blighted Tiles**: Scatter 3-5 per map starting Ch2. More in Ch3-4. Creates dangerous zones the player must navigate around — or through, if they're willing to eat CRP.
- **Abyssal Rifts**: Ch3-4 only. 1-2 per map. The most dangerous terrain. Block key shortcuts to force the player into longer, safer routes.
- **Memory Tiles**: 2-3 per map. Hidden (only visible to INS 30+). Rewards for Shigeru — +2 EMB per turn. Place them in tactically mediocre positions so standing on them is a EMB vs positioning trade-off.

---

## Weather System

Some chapters have weather effects that modify terrain and combat. Weather is set per chapter (fixed, not random). Some chapters have weather that changes mid-battle.

### Weather Types

| Weather | Move Cost Mod | Hit Mod | Other Effects | Chapters |
|---------|--------------|---------|---------------|----------|
| **Clear** | None | None | Standard conditions | Most chapters |
| **Rain** | +1 to all terrain | -10 hit (all ranged) | Fire magic -20% damage. Thunder magic +20% damage. | Arc 2, Arc 4 |
| **Fog** | None | -15 hit (all units, unless Torch) | Visibility reduced to 2 tiles (1 less than normal). Thief sight unaffected. | Arc 3+ |
| **Sandstorm** | Sand costs +1 extra | -10 hit (all units) | -2 DEF (sand particles). Bow range reduced by 1. | Arc 3 (desert chapters) |
| **Snow** | +1 to all terrain | None | -2 SPD all units. Fire magic +20% damage. | Arc 4 (northern chapters) |
| **Corruption Storm** | None | None | +1 CRP/turn to ALL units on map. Blighted ground spread each turn. | Arc 5 (Ch24-25) |

### Weather × Class Interactions

- **Flying units in Rain/Sandstorm**: -1 MOV (turbulence)
- **Flying units in Snow**: -2 MOV (ice on wings)
- **Armored units in Rain**: No extra penalty (already slow)
- **Thief in Fog**: Full sight range (5 tiles, unaffected)
- **Mounted units in Snow**: Sand movement penalty applies to snow too (+1 cost)

---

## Destructible Terrain

Some terrain can be destroyed during combat.

| Terrain | Destroyable? | HP | When Destroyed Becomes |
|---------|-------------|----|-----------------------|
| **Wall** | Yes (some) | 30 | Rubble (plain tile, no bonus) |
| **Bridge** | Yes | 20 | Water (impassable) |
| **Forest** | Yes (fire magic) | — | Burnt ground (plain tile) |
| **Door** | Yes (can be smashed) | 15 | Open door (plain tile) |

- Only siege weapons (Ballista), axes, and fire magic can damage destructible terrain
- Destroying a bridge while enemies are on it = enemies fall (instant kill, but cruel)
- Forest burning: fire magic that kills an enemy on forest has 30% chance to burn the forest

---

## Corrupted Terrain Variants

Late-game (Arc 3-5), standard terrain types can become corrupted versions:

| Base Terrain | Corrupted Version | Additional Effect |
|-------------|-------------------|-------------------|
| Plain | Blighted Tile | +2 CRP/turn |
| Forest | Corrupted Forest | +1 DEF, +20 Avoid (same), but +1 CRP/turn |
| Fort | Defiled Fort | Heals +5 HP but +1 CRP/turn |
| Throne | Broken Throne | +2 DEF, +10 Avoid (reduced), +2 CRP/turn |
| Mountain | Data Spike | +2 DEF, +30 Avoid (same), but +3 CRP/turn |

Corrupted terrain spreads in late-game chapters: at the start of each enemy phase, one adjacent tile to each corrupted tile has a 20% chance of becoming corrupted. This creates escalating map pressure.

---

## Open Questions

- ~~**Flying units**~~: **RESOLVED** — flying ignores terrain costs, no terrain DEF/Avoid bonuses.
- ~~**Bridges**~~: **RESOLVED** — bridges exist, can be destroyed.
- ~~**Weather**~~: **RESOLVED** — weather system added.
- **Terrain shift**: Blighted ground spreading is now defined (corrupted terrain spread, 20% per turn). Should the spread rate increase in Arc 5? *Recommendation: Yes — 30% in Arc 5, 40% in Ch25.*
- **Lava flow**: Should lava tiles move/expand during volcanic chapters? *Recommendation: Only in 1-2 specific chapters. Scripted movement, not random.*
- **Ice sliding**: 50% chance to slide 1 tile feels right. Should sliding into an enemy deal collision damage? *Recommendation: No — too complex. Sliding stops at occupied tiles.*
