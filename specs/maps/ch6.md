# Chapter 6 Map: "New Alliances"

## Overview
- Grid size: 16×18
- Tileset: Sand, water, road, cliff, bridge, plain, forest, dock
- Terrain focus: Coastal harbor town with cliffs, docks, and a southern escape route

## Layout
A coastal town stretching north to south. The northern third (rows 0-5) is open cliffside with scattered forest — Captain Sera's patrol zone. The central section (rows 6-11) is the harbor town: roads, buildings (wall tiles), docks along the east edge with water tiles. A marketplace at rows 8-9 has a village tile. The southern third (rows 12-17) narrows to a bridge crossing at row 14, cols 7-8, leading to three escape tiles at row 17. Cliffs (mountain terrain) line the east edge from rows 0-6, and water tiles fill the SE corner (rows 12-17, cols 14-17). The west side has forest patches for cover. Two dock tiles at rows 7-8, cols 16-17 are on water's edge.

**North (rows 0-5)**: Sera's aerial domain. Open terrain with minimal cover. Ground units crossing here are exposed to dive attacks. Scattered forest tiles at cols 2-4 offer the only cover.

**Center (rows 6-11)**: Harbor town. Wall tiles (buildings) create narrow streets. The marketplace village tiles are side objectives. Cavalier patrols sweep east-west through the streets.

**South (rows 12-17)**: Narrowing escape corridor. The bridge at row 14 is the critical chokepoint — a single Knight blocks the party's only exit. Beyond the bridge, the road widens to three escape tiles at row 17.

## Player Deployment
| Unit | Position | Notes |
|------|----------|-------|
| Ren | (10, 8) | Lord. Town center start. |
| Kael | (10, 9) | Cavalier. Adjacent to Ren. |
| Senna | (11, 7) | Mage. Rear support. |
| Bram | (9, 6) | Fighter. Forward left. |
| Lira | (11, 8) | Cleric. Behind frontline. |
| Voss | (10, 10) | Soldier. Right flank. |
| Nira | (11, 10) | Archer. Center rear — bow covers Sera's dive lanes. |
| Coda | (9, 11) | Thief. Near docks for chest access. |
| Yuel | (9, 8) | Pegasus Knight. Forward center — can intercept Sera. |

## Enemy Forces
| Enemy | Class | Level | Position | AI | Notes |
|-------|-------|-------|----------|-----|-------|
| Captain Sera | Pegasus Knight | 12 | (2, 9) Airborne | Aggressive | Flying boss. 38 HP. Dives, attacks, retreats. Must be grounded. |
| 2× Pegasus Knight | Pegasus Knight | 9 | (1, 5), (3, 13) | Aggressive | Sera's wing patrol. Support her dives. |
| 2× Soldier | Soldier | 9 | (6, 7), (6, 10) | Guard (radius 3) | Town gate guards. |
| Archer | Archer | 9 | (5, 4) | Stationary | Cliff-top sniper. Covers the north approach. |
| 2× Cavalier | Cavalier | 9 | (8, 3), (8, 14) | Guard (radius 4) | Town patrol, east and west flanks. |
| Knight | Knight | 10 | (14, 7) | Stationary | Bridge guard. Blocks the escape route. |
| Soldier | Soldier | 8 | (14, 8) | Stationary | Bridge guard support. |

## Objective
- Victory: Defeat Captain Sera AND move all surviving units to escape tiles (row 17, cols 7-9)
- Defeat: Ren falls, or reinforcements arrive before party escapes (Turn 12 after warning)

## Key Tiles
| Tile | Position | Effect |
|------|----------|--------|
| Village | (8, 6) | Visit for Javelin (lance, 1-2 range). |
| Village | (12, 3) | Visit for 500 gold. |
| Chest | (7, 16) | On dock. Contains Elixir. Requires Coda/thief access. |
| Bridge | (14, 7-8) | 1-tile wide chokepoint. Knight guards it. |
| Escape tiles | (17, 7-9) | 3 tiles. All surviving player units must reach these. |
| Forest | scattered west | +1 DEF, +10 Avoid. Movement cost 2. Cover from Sera's dives. |

## Events
| Trigger | Event | Effect |
|---------|-------|--------|
| Turn 3 | Faye arrives | Faye (Troubadour) appears at (6, 16) as green NPC. Auto-recruits when a player unit moves adjacent. |
| Start of map | Rook joins | Rook (Mercenary) joins during prologue. Deployed at (10, 6). |
| Turn 5 | Sera dives | Sera shifts from patrol to active dive attacks on player units. |
| Turn 8 | Reinforcement warning | 4-turn countdown. Imperial column approaching from north. |
| Turn 12 | Imperial reinforcements | 4× Knight, 2× Cavalier spawn north edge. Overwhelming — escape or die. |

## Reinforcements
| Turn | Enemies | Spawn |
|------|---------|-------|
| Turn 7 | 2× Soldier (Lv 8) | East edge (9, 17), (11, 17). Aggressive AI. |
| Turn 12 | 4× Knight (Lv 11), 2× Cavalier (Lv 10) | North edge. Overwhelming force. Triggers defeat if not escaped. |

## Tactical Notes
- **Dual objective pressure**: Defeat Sera AND escape south. Killing Sera while ignoring the bridge guard leaves the exit blocked. Clear the bridge early with a small team while the main force handles Sera.
- **Anti-air tactics**: Sera dives, attacks, and retreats using full flying MOV. Nira's bow threatens her approach lanes — position Nira centrally to limit Sera's safe attack angles. Yuel can intercept Sera in the air but risks taking a counter.
- **Faye's recruitment**: She arrives Turn 3 as a green NPC at the east cliff. Move any unit adjacent to auto-recruit. She has 7 MOV mounted — immediately useful for healing the push south.
- **Rook's positioning**: He joins at deployment with high SPD and SKL but low DEF. Use him to finish weakened enemies, not tank hits. Sword user — strong against the axe-wielding units but weak to the lance-heavy garrison.
- **Time pressure**: The Turn 8 warning gives 4 turns to kill Sera and reach the exit. Orin is not yet available — no Dance for extra actions. This chapter rewards efficient play over cautious turtling.
- **Bridge chokepoint**: The Knight at (14, 7) blocks the only escape route. His high DEF requires magic or weapon triangle advantage to break quickly. Senna or a strong axe user should be routed south early.
