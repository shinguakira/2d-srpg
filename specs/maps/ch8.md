# Chapter 8 Map: "The Last Ride"

## Overview
- Grid size: 18×20
- Tileset: Fortress wall, stone floor, road, mountain, fort, throne, gate
- Terrain focus: Large mountain fortress with outer courtyard, inner keep, and rear chokepoint corridor

## Layout
A massive fortress carved into a mountainside. The south (rows 14-19) is an open approach road through mountain passes — player deploys here. The outer courtyard (rows 8-13) has scattered wall segments creating partial cover and two fort tiles. The inner keep (rows 3-7) is walled with a gate at row 7, cols 9-10. Wulfram's throne sits at (1, 10) in the north chamber. The critical rear corridor runs south from row 13 to row 17 along cols 2-3 — a 2-tile-wide passage that becomes the chokepoint Akira defends. The south gate at (13, 2-3) is where reinforcements pour through on Turn 5. Mountain tiles are impassable along east and west edges. Ballista positions at (5, 4) and (5, 16) threaten the approach.

## Player Deployment
| Unit | Position | Notes |
|------|----------|-------|
| Shigeru | (16, 9) | Lord. Center approach road. |
| Akira | (16, 10) | Cavalier. Adjacent to Shigeru. 7 MOV — fastest ground unit. |
| Lisette | (17, 9) | Mage. Behind Shigeru. |
| Gareth | (15, 7) | Fighter. Left approach. |
| Mirelle | (17, 10) | Cleric. Rear center. |
| Halvar | (15, 12) | Soldier. Right approach. |
| Bryn | (17, 8) | Archer. Rear left. |
| Fenn | (16, 13) | Thief. Right flank. |
| Elin | (16, 6) | Pegasus Knight. Left flank — can bypass walls. |
| Corwin | (15, 10) | Mercenary. Forward center. |
| Nadine | (17, 11) | Troubadour. Rear right. Mobile healer. |

## Enemy Forces
| Enemy | Class | Level | Position | AI | Notes |
|-------|-------|-------|----------|-----|-------|
| General Wulfram | Halberdier | 16 | (1, 10) Throne | Boss | Lance. 55 HP. Tier 2 partial awareness. Does NOT leave throne. |
| 2× Knight | Knight | 12 | (3, 9), (3, 11) | Escort | Wulfram's inner keep guards. |
| Dark Mage | Dark Mage | 12 | (4, 10) | Guard (radius 3) | Inner keep. Flux tome. |
| 2× Soldier | Soldier | 11 | (7, 9), (7, 10) | Guard (radius 3) | Inner gate defenders. |
| 3× Soldier | Soldier | 10 | (10, 6), (10, 10), (10, 14) | Guard (radius 4) | Outer courtyard, spread formation. |
| 2× Archer | Archer | 10 | (5, 4), (5, 16) | Stationary | Ballista positions on walls. Long range threat. |
| Cavalier | Cavalier | 11 | (11, 8) | Guard (radius 4) | Courtyard patrol. |

## Objective
- Victory: Seize Wulfram's throne (Shigeru on throne after Wulfram retreats at critical HP)
- Defeat: Shigeru falls, or all player units are defeated
- Story: Akira's scripted death is mandatory — cannot be prevented

## Key Tiles
| Tile | Position | Effect |
|------|----------|--------|
| Throne | (1, 10) | +3 DEF, +10 Avoid, HP regen. Wulfram's seat. |
| Fort | (10, 7) | +2 DEF, +5 Avoid. Outer courtyard left. |
| Fort | (10, 13) | +2 DEF, +5 Avoid. Outer courtyard right. |
| Gate | (7, 9-10) | Inner keep entrance. 2 tiles wide. Main chokepoint to Wulfram. |
| Rear corridor | (13-17, 2-3) | 2-tile-wide passage. Akira's last stand location. |
| Chest | (2, 15) | Contains Silver Lance. In the keep's east chamber. |
| Village | (14, 16) | Visit for Vulnerary. On the approach road. |

## Events
| Trigger | Event | Effect |
|---------|-------|--------|
| Turn 2 | Akira advances | Akira pushes forward to draw aggro from ballista. Dialogue. |
| Turn 5 | South gate breaks | Reinforcements flood the rear corridor from (13, 2-3). |
| Turn 5 | Wulfram speaks | Wulfram recognizes Akira from past cycles. Dialogue about fragments. |
| Turn 8 | Akira volunteers | Akira moves to rear corridor automatically. Removed from player control. |
| Turn 10 | Akira becomes NPC | Akira fights alone as allied NPC. Player watches. Cannot intervene. |
| Turn 13 | Akira falls | Akira's HP reaches 0. Scripted death. Permadeath. GRIEF TRAUMA activates (-3 all stats, 2 chapters). |
| Wulfram at 25% HP | Wulfram's guard arrives | 2× Knight spawn from north. Fortress begins collapsing effects. |
| Wulfram at critical HP | Wulfram retreats | Wulfram escapes. Player seizes throne. |

## Reinforcements
| Turn | Enemies | Spawn |
|------|---------|-------|
| Turn 5 | 3× Soldier (Lv 10), 2× Cavalier (Lv 11) | South gate (13, 2-3). Aggressive AI. Flood the rear. |
| Turn 7 | 2× Soldier (Lv 10) | South gate. Aggressive. Target Akira's corridor. |
| Turn 9 | 2× Soldier (Lv 10), 1× Knight (Lv 11) | South gate. Final wave against Akira. |
| Wulfram at 25% HP | 2× Knight (Lv 12) | North edge (0, 8), (0, 12). Wulfram's personal guard. |

## Tactical Notes
- **Two-front battle**: The fortress has a clear north-to-south axis. The party pushes north toward Wulfram while reinforcements flood from the south gate at Turn 5. Akira's sacrifice solves the south problem — but only because he's fast enough to reach the chokepoint.
- **Ballista threat**: Archers at (5, 4) and (5, 16) have extended range covering the courtyard approach. Elin can fly behind the walls to eliminate them, or the party can advance using wall tiles as cover.
- **Akira's final turns**: From Turn 8, Akira is removed from player control. His AI fights optimally in the rear corridor — but the player watches him take damage they cannot heal. This is intentional emotional design.
- **Grief debuff impact**: After Turn 13, all remaining units receive -3 to all stats for 2 chapters. The Wulfram fight happens AFTER Akira falls — the player fights the boss while mechanically weakened.
- **Wulfram's retreat**: Wulfram does not die — he escapes at critical HP. This means the player must deal enough damage to trigger the retreat, not necessarily kill him. His 55 HP + throne bonuses require sustained pressure.
- **Largest map yet**: 18x20 is a significant size increase from Arc 1 maps. The party should not spread too thin — concentration of force matters against the coordinated enemies.
