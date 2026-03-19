# Chapter 7 Map: "The Seed Breaks"

## Overview
- Grid size: 16×16
- Tileset: Fortress wall, stone floor, corridor, throne, fort, water (moat)
- Terrain focus: Coastal fortress interior — tight corridors, chokepoints, defensive positions
- Weather: Rain (+1 movement cost, -10 ranged hit)

## Layout
A square coastal fortress. The outer ring (rows 0-2 and 13-15, cols 0-2 and 13-15) is fortress wall — impassable except at four corridor entrances: north (row 0, cols 7-8), south (row 15, cols 7-8), east (row 7, col 15), west (row 7, col 0). The interior is divided into a large central courtyard (rows 5-10, cols 5-10) surrounded by corridors. The east corridor (rows 3-12, cols 12-13) and west corridor (rows 3-12, cols 2-3) are the two main defensible chokepoints — 2 tiles wide each. Admiral Varga's throne sits at (2, 8) in the north chamber. Fort tiles at (6, 3), (6, 12), (9, 3), (9, 12) anchor the corridor defenses. Three glitched tiles spawn on the north edge at rows 0-1, cols 12-14.

## Player Deployment
| Unit | Position | Notes |
|------|----------|-------|
| Ren | (13, 7) | Lord. South entrance. |
| Kael | (13, 8) | Cavalier. South entrance, right. |
| Senna | (14, 7) | Mage. Behind Ren. |
| Bram | (12, 5) | Fighter. West corridor approach. |
| Lira | (14, 8) | Cleric. Rear center. |
| Voss | (12, 10) | Soldier. East corridor approach. |
| Nira | (14, 6) | Archer. Rear support, covers both corridors. |
| Coda | (12, 3) | Thief. West flank. |
| Yuel | (13, 10) | Pegasus Knight. East approach — can fly over walls. |
| Rook | (12, 7) | Mercenary. Center. |
| Faye | (14, 9) | Troubadour. Rear support. Mounted healer. |

## Enemy Forces
| Enemy | Class | Level | Position | AI | Notes |
|-------|-------|-------|----------|-----|-------|
| Admiral Varga | General | 14 | (2, 8) Throne | Boss | Lance. 48 HP. High DEF. Optional kill — drops Hero Crest. |
| 2× Knight | Knight | 11 | (3, 7), (3, 9) | Escort | Varga's throne guards. |
| 2× Soldier | Soldier | 10 | (6, 3), (6, 12) | Guard (radius 3) | Corridor fort defenders. |
| 2× Archer | Archer | 10 | (4, 5), (4, 11) | Stationary | Inner wall positions. Rain debuffs their accuracy. |
| Cavalier | Cavalier | 10 | (8, 8) | Guard (radius 4) | Courtyard patrol. |
| Mage | Mage | 10 | (5, 8) | Guard (radius 3) | Courtyard. Thunder tome. |
| 2× Soldier | Soldier | 9 | (9, 3), (9, 12) | Guard (radius 3) | Outer corridor defenders. |

## Objective
- Victory: Survive 12 turns
- Defeat: Ren falls, or all player units are defeated
- Optional: Defeat Admiral Varga for Hero Crest drop

## Key Tiles
| Tile | Position | Effect |
|------|----------|--------|
| Throne | (2, 8) | +3 DEF, +10 Avoid, HP regen. Varga's seat. |
| Fort | (6, 3) | +2 DEF, +5 Avoid. West corridor anchor. |
| Fort | (6, 12) | +2 DEF, +5 Avoid. East corridor anchor. |
| Fort | (9, 3) | +2 DEF, +5 Avoid. Outer west corridor. |
| Fort | (9, 12) | +2 DEF, +5 Avoid. Outer east corridor. |
| Chest | (1, 13) | Contains Pure Water (+7 RES, 1 use). Near glitched spawn zone — risky. |
| Glitched tiles | (0-1, 12-14) | Corrupted spawn points. Enemies appear from these each turn. |

## Events
| Trigger | Event | Effect |
|---------|-------|--------|
| Turn 3 | Corrupted spawns begin | 1-2 corrupted soldiers spawn from glitched tiles each turn. |
| Turn 6 | Forecast breaks | Hit rates flicker between two values for Turns 6-8. Visual instability. |
| Turn 6 | Spawn rate increases | 2-3 corrupted enemies per turn from north glitched tiles. |
| Turn 9 | Senna's crisis | Flickering stops. Seed settles on a new value. Senna's old model obsolete. |
| Turn 9 | Spawn rate peaks | 3 corrupted enemies per turn. Maximum pressure. |
| Turn 12 | Corruption fades | Spawns stop. Gates unlock. Chapter complete. |

## Reinforcements
| Turn | Enemies | Spawn |
|------|---------|-------|
| Turn 3-5 | 1-2× Corrupted Soldier (Lv 9) per turn | North glitched tiles (0, 12-14). Aggressive AI. |
| Turn 6-8 | 2-3× Corrupted Soldier (Lv 10) per turn | North glitched tiles. Aggressive AI. |
| Turn 9-11 | 3× Corrupted Soldier (Lv 10) per turn | North glitched tiles. Aggressive AI. Scrambled stats (±2). |

## Tactical Notes
- **Survive vs optional kill**: The objective is survival, but defeating Varga yields a Hero Crest (first promotion item). Reaching him through escort guards while managing corrupted spawns is the chapter's risk-reward choice.
- **Corridor defense**: The east and west corridors are 2 tiles wide — perfect for pairing a tank (Voss) with a healer (Lira/Faye). Rotating defenders keeps the chokepoints sealed while the rest of the party deals with spawns.
- **Rain weather**: +1 movement cost slows cavalry and mounted units. -10 ranged hit penalizes archers on both sides. Melee-heavy compositions are favored. Senna's magic is unaffected by rain.
- **Spawn escalation**: Corrupted spawns start at 1-2 per turn (Turn 3) and peak at 3 per turn (Turn 9). The player must decide between aggressive pushing toward Varga early or turtling in corridors for the full 12 turns.
- **Forecast flickering**: Turns 6-8 display unstable hit rates. This is visual only — actual combat resolution is fair. Teaches players to commit to attacks despite uncertainty, mirroring Senna's crisis.
- **Chest risk**: The Pure Water chest at (1, 13) is near the glitched spawn zone. Coda must dash through spawning enemies to reach it — high risk, moderate reward.
