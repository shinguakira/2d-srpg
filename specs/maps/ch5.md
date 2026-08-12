# Chapter 5 Map: "Above the Clouds"

## Overview
- Grid size: 14×16
- Tileset: Mountain, fortress wall, plain, forest, road, throne, void
- Terrain focus: Vertical ascent through mountain fortress; cliff edges, walls, fort tiles

## Layout
The map is a vertical assault up a mountain fortress called Skyhold. Player deploys at the bottom (rows 12-15) on a road winding up from the south. The road splits left and right around a forested ridge (rows 8-11) before converging at the fortress gate (row 6). Inside the fortress walls (rows 0-5), a courtyard surrounds General Roderic's throne at row 1, col 7. The northeast corner (rows 0-2, cols 10-13) is where the Abyssal Rift appears on Turn 5 — a 3×2 block of impassable tiles. Two fort tiles flank the road at rows 9-10, offering defensive positions for the mid-map fight. Mountain tiles line the east and west edges, impassable to ground units but traversable by Elin. A single bridge at row 7, col 4 crosses a narrow water gap on the left path.

**North (rows 0-5)**: Fortress interior. Walls on all sides except the gate at row 6. Roderic's throne is centered at (1, 7) with stone floor courtyard around it. Two archer positions on the walls at cols 3 and 11 have clear sightlines south.

**Mid (rows 6-11)**: The forested ridge. Dense forest tiles at cols 4-6 and 8-10 slow ground movement but provide defense bonuses. The road splits here — left fork goes under the bridge toward the village, right fork is a wider but more exposed approach past the brigand positions.

**South (rows 12-15)**: Open approach road. Plains and road tiles. Minimal cover — the party must advance quickly or face reinforcements from behind.

## Player Deployment
| Unit | Position | Notes |
|------|----------|-------|
| Shigeru | (14, 6) | Lord, required. Central road start. |
| Akira | (14, 7) | Cavalier. Adjacent to Shigeru. |
| Lisette | (15, 6) | Mage. Rear row. |
| Gareth | (13, 5) | Fighter. Left path starter. |
| Mirelle | (15, 7) | Cleric. Rear row behind Akira. |
| Halvar | (13, 8) | Soldier. Right path starter. |
| Bryn | (15, 5) | Archer. Rear left, covers both paths. |
| Fenn | (13, 9) | Thief. Right flank for chest access. |
| Elin | (14, 4) | Pegasus Knight. New recruit, left flank. Can fly over mountains. |

## Enemy Forces
| Enemy | Class | Level | Position | AI | Notes |
|-------|-------|-------|----------|-----|-------|
| General Roderic | General | 12 | (1, 7) Throne | Boss | Lance/sword. 50 HP. Very high DEF. Arc 1 final boss. |
| Knight Captain | Knight | 10 | (2, 6) | Escort | Lance. Guards Roderic's left flank. |
| Knight Sentinel | Knight | 10 | (2, 8) | Escort | Lance. Guards Roderic's right flank. |
| 2× Soldier | Soldier | 8 | (4, 5), (4, 9) | Guard (radius 3) | Courtyard defenders. |
| 2× Archer | Archer | 7 | (3, 3), (3, 11) | Stationary | Wall-top positions. 2-range only. |
| 2× Cavalier | Cavalier | 8 | (7, 3), (7, 10) | Guard (radius 4) | Patrol the mid-map fork. |
| Mage | Mage | 8 | (5, 7) | Guard (radius 3) | Courtyard center. Fire tome. |
| 2× Brigand | Fighter | 6 | (10, 4), (10, 10) | Aggressive | Road ambushers at the base approach. |

## Objective
- Victory: Seize the throne (Shigeru on Roderic's throne tile after Roderic is defeated)
- Defeat: Shigeru falls, or all player units are defeated

## Key Tiles
| Tile | Position | Effect |
|------|----------|--------|
| Throne | (1, 7) | +3 DEF, +10 Avoid, HP regen. Roderic's seat. |
| Fort | (9, 4) | +2 DEF, +5 Avoid. Left-path defensive position. |
| Fort | (10, 9) | +2 DEF, +5 Avoid. Right-path defensive position. |
| Village | (11, 2) | Visit for Iron Blade (sword). |
| Chest | (3, 12) | Contains Vulnerary. Fenn can reach via right wall. |
| Bridge | (7, 4) | Crossable. Narrow — 1-tile wide chokepoint on left path. |
| Abyssal Rift | (0-1, 10-12) | Appears Turn 5. Impassable 3×2 block. Scatters nearby Guard AI enemies to Aggressive. |

## Events
| Trigger | Event | Effect |
|---------|-------|--------|
| Turn 3 | Terrain shift | 6 random tiles change terrain type. Movement costs/bonuses shift. |
| Turn 5 | Abyssal Rift appears | 3×2 void block in NE corner. Guard AI enemies near void switch to Aggressive. |
| Turn 7 | Forecast flicker | Displayed hit rates flicker between two values for one combat round. Visual only. |
| Elin reaches (11, 2) | Village visit | Obtain Iron Blade. Dialogue about sky anomalies. |

## Reinforcements
| Turn | Enemies | Spawn |
|------|---------|-------|
| Turn 6 | 2× Soldier (Lv 7) | South edge (14, 3), (14, 10). Aggressive AI. |
| Turn 8 | 1× Cavalier (Lv 8) | West edge (8, 0). Aggressive AI. |

## Tactical Notes
- **Elin's debut**: Flying ignores the mountain edges — she can flank the fortress from the west while the ground team pushes the road. Teaches flying unit versatility.
- **Left vs right path**: Left path has the village (Iron Blade) and bridge chokepoint. Right path is faster but exposed. Splitting the party is optimal but risky for new players.
- **Roderic's escort**: The two Knights in Escort AI will not leave Roderic's side. The player must break through both to reach the throne. Magic (Lisette) bypasses their high DEF.
- **Abyssal Rift disruption**: When the void appears on Turn 5, Guard AI enemies near it scatter to Aggressive. This can create unexpected flanking threats but also pulls enemies off their defensive positions — exploitable.
- **Arc 1 capstone**: This is the last chapter before difficulty escalates. Enemy count (12) and level range (6-12) are the highest so far. Tests all mechanics taught in Ch1-4.
