# Chapter 9 Map: "The Void Left Behind"

## Overview
- Grid size: 14×14
- Tileset: Forest, road, plain, mountain, bridge, water (stream)
- Terrain focus: Narrow forest pass with a linear escape route south, side paths for optional combat

## Layout
A forest ravine running north to south. The party starts in the north (rows 0-3) and must escape south (row 13 escape tiles). A central road (cols 6-7) runs the length of the map but is exposed — forest tiles flank it on both sides offering cover. A narrow ravine at rows 8-9 forces units into a 3-tile-wide gap between mountain walls (cols 5-9), creating a natural chokepoint the player can defend or be caught in. A western side path (cols 1-3, rows 4-10) winds through heavy forest — slower but safer from the pursuing Paladin. An eastern clearing (cols 10-12, rows 5-7) has a village. A stream crosses at row 6 with a bridge at col 7. The escape tiles are at row 13, cols 5-8.

**North (rows 0-3)**: Starting zone. Open road with thin forest flanks. The Lieutenant and escort cavalry enter from row 0 on Turn 1 — the party must move south immediately.

**Mid (rows 4-9)**: The forest gauntlet. Dense trees slow mounted pursuit but also slow the party's infantry. The western side path is the safest route but adds 2-3 turns of travel time. The bridge at (6, 7) is a potential delay point.

**South (rows 10-13)**: Ravine exit leading to escape tiles. Brigand ambushers lurk here. The fort at (9, 7) is the last defensible position before the final sprint to safety.

## Player Deployment
| Unit | Position | Notes |
|------|----------|-------|
| Ren | (2, 6) | Lord. North road. |
| Senna | (3, 6) | Mage. Behind Ren. |
| Bram | (1, 5) | Fighter. Left of road. |
| Lira | (3, 7) | Cleric. Rear center. |
| Voss | (1, 8) | Soldier. Right of road. |
| Nira | (2, 8) | Archer. Rear guard position — covers north. |
| Coda | (2, 4) | Thief. West side path. |
| Yuel | (1, 7) | Pegasus Knight. Forward center. Can scout ahead. |
| Rook | (1, 6) | Mercenary. Forward. Takes Kael's point position. |
| Faye | (3, 8) | Troubadour. Rear right. Mobile healing. |

## Enemy Forces
| Enemy | Class | Level | Position | AI | Notes |
|-------|-------|-------|----------|-----|-------|
| Morryn's Lieutenant | Paladin | 14 | (0, 7) — enters Turn 1 | Aggressive | Lance/sword. 45 HP. 8 MOV. Pursues relentlessly. Optional kill for bonus EXP. |
| 2× Cavalier | Cavalier | 11 | Enter Turn 1 from (0, 5), (0, 9) | Aggressive | Lieutenant's escort. Chase the party. |
| 3× Soldier | Soldier | 10 | (6, 5), (6, 9), (8, 7) | Guard (radius 3) | Forest pass defenders. Block the route. |
| Archer | Archer | 10 | (5, 10) | Stationary | East clearing overwatch. Covers bridge approach. |
| 2× Brigand | Fighter | 9 | (10, 3), (10, 11) | Aggressive | Ambush units near the ravine exit. |

## Objective
- Victory: Move all surviving units to escape tiles (row 13, cols 5-8) within 15 turns
- Defeat: Ren falls, or Lieutenant catches and defeats 3+ party members

## Key Tiles
| Tile | Position | Effect |
|------|----------|--------|
| Escape tiles | (13, 5-8) | 4 tiles. All surviving units must reach these. |
| Village | (5, 11) | Visit for Speedwing (+2 SPD permanently). Optional detour. |
| Bridge | (6, 7) | Crosses stream. 1-tile-wide chokepoint. |
| Forest | flanking road | +1 DEF, +10 Avoid. Movement cost 2. Slows cavalry pursuit. |
| Ravine gap | (8-9, 5-9) | 5-tile-wide forced passage between mountains. |
| Fort | (9, 7) | +2 DEF, +5 Avoid. Center of ravine gap. Defensible rear-guard position. |

## Events
| Trigger | Event | Effect |
|---------|-------|--------|
| Turn 1 | Pursuit begins | Lieutenant + 2 Cavaliers enter from north edge. 8 MOV, aggressive. |
| Turn 5 | Orin appears | Orin (Dancer) enters from (7, 1) on west side path. Auto-joins. Dance ability tutorial. |
| Turn 5 | Orin dances Nira | Scripted Dance demonstration — Nira gets a second action. |
| Turn 9 | Formation gap | Dialogue about the party splitting without Kael's MOV to bridge front and rear. |

## Reinforcements
| Turn | Enemies | Spawn |
|------|---------|-------|
| Turn 4 | 2× Soldier (Lv 10) | North edge (0, 6), (0, 8). Join the pursuit. |
| Turn 8 | 1× Cavalier (Lv 11) | North edge (0, 7). Final pursuit reinforcement. |

## Tactical Notes
- **Kael's absence**: The party's movement formation is broken without Kael's 7 MOV cavalry bridging the front and rear. The gap between fast units (Yuel, Faye) and slow units (Voss, Lira) creates a splitting problem the player must actively manage.
- **Orin's Dance**: Orin joins Turn 5 and immediately demonstrates Dance. Using Dance on rear-guard units (Nira, Rook) gives them extra movement to keep pace. This is the intended solution to the mobility gap.
- **Optional boss kill**: The Lieutenant is beatable but engaging him means stopping the retreat. His 8 MOV Paladin stats make him dangerous in the open. The optimal approach: kite with Nira's arrows from forest tiles while the main group escapes south.
- **Forest exploitation**: Forest tiles flank the central road. They slow cavalry pursuit (movement cost 2 for mounted) while giving infantry +1 DEF and +10 Avoid. Route the party through forest, not the road.
- **Ravine chokepoint**: Rows 8-9 force everyone through a 5-tile gap. The fort tile at (9, 7) is the ideal rear-guard position — one tank unit can hold here for several turns while others escape.
- **Grief debuff active**: All units still carry -3 all stats from Ch8. Combined with the escape pressure, this chapter feels desperate by design. Orin's Dance and smart positioning are the tools to survive.
- **Speedwing detour**: The village at (5, 11) holds a permanent +2 SPD item. Reaching it requires leaving the main path and risking the Lieutenant's pursuit. Worth it for a key unit (Voss or Bram).
