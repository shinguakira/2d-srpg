# Map Design

Map philosophy, grid conventions, size guidelines, and per-arc design patterns.

---

## Philosophy

Maps are tactical puzzles, not empty arenas. Every map should:

1. **Teach something**: Each map introduces or reinforces a mechanic (terrain, weapon type, objective, enemy behavior)
2. **Force decisions**: Multiple valid approaches — rush the boss, clear methodically, split the party, protect NPCs
3. **Scale with the roster**: Early maps are tight (6 units). Late maps are wide (12 units) with multiple fronts
4. **Support the story**: Map layout reflects narrative (a monastery looks like a monastery, the Blackflame's domain looks abstract)
5. **Respect the player's time**: No filler. Every tile, enemy, and chest placement has a reason.

---

## Grid Conventions

### Coordinate System

- **Grid**: 2D array of tiles, indexed as `(row, col)` — row 0 is top, col 0 is left
- **Tile size**: Uniform square tiles rendered via CSS Grid
- **Origin**: Top-left corner is `(0, 0)`

### Map Boundaries

- Maps are rectangular (no irregular edges)
- All tiles within bounds have a terrain type — no "empty" tiles
- Map edges act as impassable walls (units cannot move off-map)

### Spawn Tiles

- Player spawn tiles are marked in map data (deployment order maps to spawn positions)
- Enemy spawn tiles are pre-placed in map data
- Reinforcement spawn tiles are defined but initially empty (activated by triggers)
- All spawn tiles must be on passable terrain

---

## Map Size Guidelines

### Size by Arc

| Arc | Grid Size (rows × cols) | Playable Area | Notes |
|-----|------------------------|---------------|-------|
| Arc 1 (Ch1-5) | 10×12 to 14×16 | 120-224 tiles | Small, focused. Tutorial-friendly. |
| Arc 2 (Ch6-10) | 14×16 to 18×20 | 224-360 tiles | Medium. Multiple paths emerge. |
| Arc 3 (Ch11-15) | 16×20 to 20×24 | 320-480 tiles | Large. Multiple fronts, complex terrain. |
| Arc 4 (Ch16-20) | 18×22 to 22×26 | 396-572 tiles | Large. Indoor/outdoor mixed. |
| Arc 5 (Ch21-25) | 20×24 to 24×28 | 480-672 tiles | Maximum size. System domain complexity. |

### Special Map Sizes

| Chapter | Size | Reason |
|---------|------|--------|
| Ch1 | 10×12 | Tutorial — small and clear |
| Ch9 | 12×20 | Long corridor — escape map (narrow, linear) |
| Ch23 | 2× (14×16) | Split party — two separate smaller maps |
| Ch25 | 24×28 | Largest map — final battle, shifting terrain |

### Size Constraints

- **Minimum**: 10×10 (100 tiles) — anything smaller feels cramped with 6+ units
- **Maximum**: 24×28 (672 tiles) — larger maps become tedious to navigate
- **Ideal enemy-to-tile ratio**: 1 enemy per 15-25 tiles (ensures spacing and tactical breathing room)

---

## Map Design Per Arc

### Arc 1 — Borderlands (Plains/Rural)

**Tileset**: Grass, forest, village, bridge, road, river, fort, mountain, throne

| Ch | Name | Layout | Key Features |
|----|------|--------|-------------|
| 1 | "Not This Again" | Open plains with a village and fort | Starter map. 1 chokepoint (bridge). Boss on throne. Village gives Iron Blade. |
| 2 | "The Defector" | Border garrison with walls | Fort tiles for defense. 2 villages. Enemy cavalier patrols. |
| 3 | "Scout's Honor" | Rolling hills with forest clusters | Terrain variety intro. 2 villages for side objectives. Elevated archer positions. |
| 4 | "The Pickpocket" | Town square with marketplace | Indoor-feel open map. 3 chests. Thief enemy paths. Multiple approach routes. |
| 5 | "Above the Clouds" | Mountain fortress with cliff edges | Vertical-feeling map. Flying units introduced. Fortress at top, player starts bottom. |

**Arc 1 patterns**: Simple layouts, 1-2 chokepoints, clear boss position, villages as side objectives.

### Arc 2 — Fractured Coast (Maritime/Coastal)

**Tileset**: Sand, water, ship deck, docks, lighthouse, ruins, reef, cliff

| Ch | Name | Layout | Key Features |
|----|------|--------|-------------|
| 6 | "New Alliances" | Coastal town with docks | Water tiles block ground movement. Multiple entry points. NPC ally positions. |
| 7 | "The Seed Breaks" | Open beach — no cover | Survive map. Enemies flood from all sides. Minimal defensive terrain. Teaches positioning over terrain. |
| 8 | "The Last Ride" | Castle with inner courtyard | Tight indoor map. Akira holds rear chokepoint. Reinforcements from behind. |
| 9 | "The Void Left Behind" | Narrow canyon/road | Linear escape route. Pursuers from behind. Side paths for optional combat. |
| 10 | "What We Carry" | Ruined fortress on cliff | Multi-level feel. Boss at center. Guard positions surround. Dual objective requires splitting. |

**Arc 2 patterns**: Varied terrain, more enemy variety, pressure mechanics (survive/escape), emotional maps (Ch8, Ch9).

### Arc 3 — Corrupted Highlands (Mountains/Dark)

**Tileset**: Mountain, corrupted tile, lava, ruins, monastery, dark forest, Abyssal Rift

| Ch | Name | Layout | Key Features |
|----|------|--------|-------------|
| 11 | "Spreading Plague" | Village being corrupted | Corrupted tiles spread each turn. NPCs flee toward exits. Dynamic terrain changes. |
| 12 | "The Turning" | Monastery interior | Indoor map. Tight corridors. Boss is a corrupted ally (spawns from within party formation). Protect NPC objective. |
| 13 | "Second Chances" | Highland fortress with wyvern perches | Elevated positions for flyers. Zael patrols a flight route. Multiple approaches to boss. |
| 14 | "The Monastery" | Large monastery complex | Multi-room indoor map. Dark mage siege from outside. Elara's ritual tile at the center. Light/dark theme. |
| 15 | "The Rally" | Highland battlefield, wide open | Largest map yet. 20+ enemies. Multiple approach routes. Player chooses formation and direction. |

**Arc 3 patterns**: Corrupted terrain, indoor maps, larger enemy counts, moral choice maps, fog of war introduction.

### Arc 4 — System's Domain (Industrial/Abstract)

**Tileset**: System tile, data stream, void, terminal, construct wall, glitch terrain

| Ch | Name | Layout | Key Features |
|----|------|--------|-------------|
| 16 | "Through Its Eyes" | Abstract grid — symmetric, artificial | The Blackflame's perspective. Perfectly symmetrical. Ballista positions. Feels "designed." |
| 17 | "Data Recovery" | Archive/dungeon with fog | Fog of war throughout. Data node tiles to capture. Hidden enemies. Torch-dependent exploration. |
| 18 | "Legacy Weapons" | Relic vault / fortress hybrid | Treasure-heavy map. 4+ chests with rare items. Strong guards. Ghael blocks a chokepoint. |
| 19 | "The Offer" | Corridor leading to System terminal | Linear with branching side rooms. Memory Shard on hidden tile. Survive objective with increasing waves. |
| 20 | "Point of No Return" | Gateway fortress — last conventional map | Massive defensive position. Echo as NPC in danger zone. Multiple phases as doors open. |

**Arc 4 patterns**: Abstract/artificial aesthetics, fog of war, treasure puzzles, System-authored symmetry, NPC protection.

### Arc 5 — The Final File (Void/Abstract)

**Tileset**: Void, glitch, memory fragment, unstable tile, System core, final throne

| Ch | Name | Layout | Key Features |
|----|------|--------|-------------|
| 21 | "The Long March" | Shifting corridor — tiles change each turn | Dynamic terrain. Path forward opens and closes. Continuous reinforcements. Escape-forward pressure. |
| 22 | "Ghosts of Cycles Past" | Echo of Ch1's map — distorted | Nostalgic callback. Same layout as Ch1 but glitched. Phantom enemies. Boss at original throne position. |
| 23 | "The Penultimate" | Two linked maps (split party) | Party divided. Each half fights independently. Both must complete. Communication cut. |
| 24 | "???_CORRUPTED" | Arena — circular, no cover | Boss arena. No terrain bonuses. Pure tactical combat. ???_CORRUPTED at center. Emotional, not strategic. |
| 25 | "The Last Save File" | Shifting maze → open core | Phase 1: maze that restructures. Phase 2: terrain corrupts. Phase 3: all walls drop, open arena. Final throne at center. |

**Arc 5 patterns**: Dynamic/shifting terrain, callbacks to earlier maps, emotional arenas, the game world breaking down visually.

---

## Map Element Guidelines

### Chokepoints

- **Arc 1-2**: 1-2 obvious chokepoints per map (bridges, doorways)
- **Arc 3-4**: 3-4 chokepoints, some created by terrain/walls that can be broken
- **Arc 5**: Chokepoints shift as terrain changes

### Treasure Placement

| Arc | Chests per Map | Guarding |
|-----|---------------|----------|
| Arc 1 | 0-1 | Unguarded or near boss |
| Arc 2 | 1-2 | Guarded by enemies or behind locked doors |
| Arc 3 | 2-3 | Guarded + enemy thieves racing for them |
| Arc 4 | 2-4 | Heavily guarded, require keys or thief |
| Arc 5 | 1-2 | Hidden tiles, require specific units to access |

### Boss Positioning

| Pattern | Description | Used In |
|---------|-------------|---------|
| **Throne** | Boss on throne tile (+3 DEF, +10 Avoid, HP regen) | Ch1-3, Ch5, Ch7, Ch10, Ch14-16, Ch18, Ch20, Ch22, Ch25 |
| **Roaming** | Boss moves toward party (Aggressive AI) | Ch4, Ch6, Ch8 boss Doumeki, Ch9, Ch21 |
| **Flying** | Boss airborne, must be grounded | Ch5 (sub-boss), Ch6 |
| **Arena** | Boss in open area, no terrain advantage | Ch24 |
| **Multi-phase** | Boss changes behavior at HP thresholds | Ch20, Ch24, Ch25 |
| **Dialogue** | Boss can be talked to under conditions | Ch17, Ch13 (Zael), Ch18 (Ghael) |

### Spawn Positions

- **Player spawns**: Bottom or left side of map (convention — advancing "forward")
- **Boss position**: Top or right side (or center for arena maps)
- **Reinforcement spawns**: Edges of map, behind player, or from Abyssal Rift tiles
- **NPC positions**: Near player spawns (protect objective) or scattered (rescue objective)

---

## Weather per Chapter

Weather affects movement, visibility, and combat. See [terrain.md](../gameplay/terrain.md) for mechanical effects.

| Chapter | Weather | Effect |
|---------|---------|--------|
| Ch7 | Rain | +1 movement cost, -10 ranged hit |
| Ch13 | Fog | -15 hit, 2-tile vision |
| Ch17 | Fog | -15 hit, 2-tile vision |
| Ch21 | Sandstorm | +1 sand cost, -10 hit |
| Ch23 | Snow | +1 movement cost, -2 SPD |
| Ch25 Phase 2 | Corruption Storm | +1 CRP/turn all units |

All other chapters: Clear weather (no effects).

---

## Objective-to-Map Relationship

Map layout should support its objective type:

| Objective | Map Design Principle |
|-----------|---------------------|
| **Rout** | Multiple enemy clusters with space between. No single chokepoint bottleneck. |
| **Seize** | Clear path to throne with meaningful obstacles. Boss visible from start. |
| **Boss Kill** | Boss positioned with escorts. Player must break through guards. |
| **Survive** | Defensible position for player. Reinforcements from multiple directions. Open space = death. |
| **Escape** | Linear path with exits clearly marked. Pursuers from behind. Side paths for optional objectives. |
| **Protect** | NPC path visible. Player must position between NPC and enemies. |
| **Capture** | Target tiles spread across map. Requires splitting forces. |
| **Dual** | Map supports both objectives without one trivializing the other. |

---

## Open Questions

- **Map interactivity**: Should there be switches, levers, or other interactive objects beyond doors/chests? *Recommendation: Minimal — ballista (Ch16) and destructible walls cover this.*
- **Map transitions**: Should any maps have mid-chapter transitions to a second map? *Recommendation: Ch25 could benefit (maze → open core). Others stay single-map.*
- **Elevation**: Should height affect combat (high ground bonus)? *Recommendation: Not for this project. Terrain type bonuses cover this adequately. Height adds rendering complexity to DOM-based maps.*
- **Map editor**: Should the project include a map editor tool for faster chapter creation? *Recommendation: Yes, eventually — but post-25-chapter spec completion.*
