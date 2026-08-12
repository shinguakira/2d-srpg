# Phase 5: Fog of War + Weather + Support Conversations + Advanced Mechanics

> **Prerequisites:** Phase 3 (ambush AI), Phase 4 (CRP for corruption storm)
> **Unlocks:** Phase 6 (Endgame Systems)
> **Critical files:** `src/core/pathfinding.ts`, `src/components/Grid/`, `src/stores/`
> **Spec refs:** `specs/gameplay/terrain.md`, `specs/gameplay/support-system.md`, `specs/gameplay/battle-logic.md`

## Fog of War

> **Ref:** [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md), [`specs/gameplay/items.md`](specs/gameplay/items.md)

- [x] Add `fogOfWar: boolean` to chapter config
- [x] Add `visionRange` to unit type (default 3, thief 5)
- [x] Calculate visible tiles: BFS from all player units up to vision range
- [x] Fog rendering: tiles outside vision dimmed (opacity 0.4)
- [x] Hidden tiles: fully black (never visited this chapter)
- [x] Revealed but not visible: dimmed terrain visible, no units shown
- [x] Enemy units in fog: not rendered, not targetable
- [x] Enemy moves into vision: reveal with brief flash
- [x] Player moves into fog: reveal tiles progressively
- [x] Recalculate vision after every unit move
- [x] Torch item: +5 vision radius for 3 turns (area reveal)
- [x] INS 61+: +1 vision range bonus
- [x] Ambush AI integration: hidden units in fog attack when player enters range
- [x] Fog does not affect enemy AI (enemies always know player positions)
- [x] Danger zone in fog: only show for visible enemies

## Weather System

> **Ref:** [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] Add `weather` to chapter config: `'clear' | 'rain' | 'fog' | 'snow' | 'sandstorm' | 'corruption_storm'`
- [x] Add `weatherChanges` to chapter events (weather can shift mid-battle)
- [x] Rain effects: -15 hit for bows/fire magic, -1 MOV mounted, fire magic -2 might
- [x] Snow effects: +1 movement cost all ground, -2 SPD all units
- [x] Sandstorm effects: -20 hit all ranged attacks, vision reduced to 2
- [x] Corruption storm effects: +1 CRP/turn all units on map
- [x] Weather visual overlay on entire grid (CSS filter/overlay)
- [x] Rain: blue-tinted overlay + raindrop animation
- [x] Snow: white particle overlay
- [x] Sandstorm: tan/brown overlay + reduced visibility
- [x] Corruption storm: purple pulsing overlay
- [x] Weather indicator in HUD (icon + name next to turn counter)
- [x] Weather tooltip: hover to see all active effects

## Destructible Terrain

> **Ref:** [`specs/gameplay/terrain.md`](specs/gameplay/terrain.md)

- [x] Add `hp` field to terrain tiles (null = indestructible)
- [x] Wall tiles: HP 30, destroyed → rubble (passable, 0 bonuses)
- [x] Bridge tiles: HP 20, destroyed → water (impassable, units fall!)
- [x] Door tiles: HP 15, destroyed → open (passable)
- [x] Forest tiles: can be burned by fire magic → charred (no cover bonus)
- [x] Attack terrain: when unit attacks a destructible tile instead of enemy
- [x] Axe bonus: +5 damage to destructible terrain
- [x] Show terrain HP bar when targetable
- [x] Bridge collapse: any unit on tile falls into water (flying units safe — hover above)
- [x] Fallen unit: takes 10 damage, moved to nearest valid adjacent tile (auto-rescue)
  - If no adjacent land tile: unit trapped on water tile, cannot move, must be rescued via Rescue action from adjacent land
  - Flying units can rescue from water tiles (adjacent hover)
- [x] Destruction animation: crumble/break effect

## Support Conversations

> **Ref:** [`specs/gameplay/support-system.md`](specs/gameplay/support-system.md)

- [x] Add `supportPoints: Record<string, number>` per unit pair
- [x] Point gain: +2 adjacent at turn end
- [x] Point gain: +3 fight same enemy in same turn
- [x] Point gain: +2 heal an ally
- [x] Point gain: +3 dance for an ally
- [x] Point gain: +4 rescue an ally
- [x] Support rank thresholds: C=20, B=50, A=100, S=150
- [x] Support limit: 5 total partners per unit (S-rank counts toward the 5), 1 S-rank max
- [x] Shigeru exception: unlimited support partners (story reason — central to all relationships)
- [x] Combat bonuses when supported ally within 3 tiles:
  - C: +5 hit, +5 avoid
  - B: +10 hit, +10 avoid, +5 crit
  - A: +15 hit, +15 avoid, +10 crit, +1 damage
  - S: +20 hit, +20 avoid, +15 crit, +2 damage
- [x] Support rank notification (popup when rank increases)
- [x] Support conversation viewer in preparation screen
- [x] Support conversation data per pair per rank (dialogue scenes)
- [x] Combat forecast shows support bonuses when applicable
- [x] Support partner indicator on map (small heart icon)

## Bonus EXP Distribution

> **Ref:** [`specs/gameplay/experience.md`](specs/gameplay/experience.md)

- [x] Calculate bonus EXP per chapter: `(parTurns - actualTurns) × 50`, max 300
- [x] Store accumulated bonus EXP in campaign state
- [x] Bonus EXP distribution UI in preparation screen
- [x] Select unit → allocate EXP in increments of 10
- [x] Show level-up preview when enough EXP allocated
- [x] EXP allocated triggers normal level-up stat rolls
- [x] Catch-up bonus: +20% EXP if unit 3+ levels below party average

## Forging System (Arc 3+)

> **Ref:** [`specs/gameplay/economy.md`](specs/gameplay/economy.md), [`specs/gameplay/weapons.md`](specs/gameplay/weapons.md)

- [x] Add `forgeLevel` to weapon instances (0, +1, +2, +3)
- [x] Forge materials: Adamant (+1/+2), Mithril (+3)
- [x] Forge bonuses: +2 might per level, +5 hit per level
- [x] Forge UI in preparation screen shop
- [x] Forge cost: material + gold
- [x] Forged weapon name prefix: "Forged " + original name
- [x] Max forge level per material: Adamant=+2, Mithril=+3

## Validation

- [x] Unit tests: fog vision calculation, tile reveal/hide
- [x] Unit tests: weather stat modifications (rain -15 bow hit, snow +1 cost, etc.)
- [x] Unit tests: destructible terrain HP, collapse effects
- [x] Unit tests: bridge collapse — unit on bridge when HP 0 (takes damage, displaced)
- [x] Unit tests: bridge collapse — flying unit safe
- [x] Unit tests: support point accumulation, rank progression
- [x] Unit tests: support cap enforcement (5 partners max, S-rank counts toward 5)
- [x] Unit tests: support combat bonus application (adjacent ally check)
- [x] Unit tests: bonus EXP calculation and distribution
- [x] Unit tests: forge stat bonuses (+2 might, +5 hit per level)
- [x] Save/load: support points persist across save/load
- [x] Save/load: forged weapon levels persist
- [x] Integration: fog of war chapter plays correctly (hidden enemies, reveal on approach)
- [x] Integration: weather overlay renders and stat mods apply
- [x] Edge case: torch in fog reveals correct radius
- [x] Edge case: all bridges destroyed — verify alternate paths exist
- [x] `npm run build` — zero errors
- [x] `npx vitest run` — all tests pass
