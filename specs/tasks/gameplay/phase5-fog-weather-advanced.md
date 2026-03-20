# Phase 5: Fog of War + Weather + Support Conversations + Advanced Mechanics

> **Prerequisites:** Phase 3 (ambush AI), Phase 4 (CRP for corruption storm)
> **Unlocks:** Phase 6 (Endgame Systems)
> **Critical files:** `src/core/pathfinding.ts`, `src/components/Grid/`, `src/stores/`
> **Spec refs:** `specs/gameplay/terrain.md`, `specs/gameplay/support-system.md`, `specs/gameplay/battle-logic.md`

## Fog of War

- [ ] Add `fogOfWar: boolean` to chapter config
- [ ] Add `visionRange` to unit type (default 3, thief 5)
- [ ] Calculate visible tiles: BFS from all player units up to vision range
- [ ] Fog rendering: tiles outside vision dimmed (opacity 0.4)
- [ ] Hidden tiles: fully black (never visited this chapter)
- [ ] Revealed but not visible: dimmed terrain visible, no units shown
- [ ] Enemy units in fog: not rendered, not targetable
- [ ] Enemy moves into vision: reveal with brief flash
- [ ] Player moves into fog: reveal tiles progressively
- [ ] Recalculate vision after every unit move
- [ ] Torch item: +5 vision radius for 3 turns (area reveal)
- [ ] AWR 61+: +1 vision range bonus
- [ ] Ambush AI integration: hidden units in fog attack when player enters range
- [ ] Fog does not affect enemy AI (enemies always know player positions)
- [ ] Danger zone in fog: only show for visible enemies

## Weather System

- [ ] Add `weather` to chapter config: `'clear' | 'rain' | 'fog' | 'snow' | 'sandstorm' | 'corruption_storm'`
- [ ] Add `weatherChanges` to chapter events (weather can shift mid-battle)
- [ ] Rain effects: -15 hit for bows/fire magic, -1 MOV mounted, fire magic -2 might
- [ ] Snow effects: +1 movement cost all ground, -2 SPD all units
- [ ] Sandstorm effects: -20 hit all ranged attacks, vision reduced to 2
- [ ] Corruption storm effects: +1 CRP/turn all units on map
- [ ] Weather visual overlay on entire grid (CSS filter/overlay)
- [ ] Rain: blue-tinted overlay + raindrop animation
- [ ] Snow: white particle overlay
- [ ] Sandstorm: tan/brown overlay + reduced visibility
- [ ] Corruption storm: purple pulsing overlay
- [ ] Weather indicator in HUD (icon + name next to turn counter)
- [ ] Weather tooltip: hover to see all active effects

## Destructible Terrain

- [ ] Add `hp` field to terrain tiles (null = indestructible)
- [ ] Wall tiles: HP 30, destroyed → rubble (passable, 0 bonuses)
- [ ] Bridge tiles: HP 20, destroyed → water (impassable, units fall!)
- [ ] Door tiles: HP 15, destroyed → open (passable)
- [ ] Forest tiles: can be burned by fire magic → charred (no cover bonus)
- [ ] Attack terrain: when unit attacks a destructible tile instead of enemy
- [ ] Axe bonus: +5 damage to destructible terrain
- [ ] Show terrain HP bar when targetable
- [ ] Bridge collapse: any unit on tile falls into water (flying units safe — hover above)
- [ ] Fallen unit: takes 10 damage, moved to nearest valid adjacent tile (auto-rescue)
  - If no adjacent land tile: unit trapped on water tile, cannot move, must be rescued via Rescue action from adjacent land
  - Flying units can rescue from water tiles (adjacent hover)
- [ ] Destruction animation: crumble/break effect

## Support Conversations

- [ ] Add `supportPoints: Record<string, number>` per unit pair
- [ ] Point gain: +2 adjacent at turn end
- [ ] Point gain: +3 fight same enemy in same turn
- [ ] Point gain: +2 heal an ally
- [ ] Point gain: +3 dance for an ally
- [ ] Point gain: +4 rescue an ally
- [ ] Support rank thresholds: C=20, B=50, A=100, S=150
- [ ] Support limit: 5 total partners per unit (S-rank counts toward the 5), 1 S-rank max
- [ ] Ren exception: unlimited support partners (story reason — central to all relationships)
- [ ] Combat bonuses when supported ally within 3 tiles:
  - C: +5 hit, +5 avoid
  - B: +10 hit, +10 avoid, +5 crit
  - A: +15 hit, +15 avoid, +10 crit, +1 damage
  - S: +20 hit, +20 avoid, +15 crit, +2 damage
- [ ] Support rank notification (popup when rank increases)
- [ ] Support conversation viewer in preparation screen
- [ ] Support conversation data per pair per rank (dialogue scenes)
- [ ] Combat forecast shows support bonuses when applicable
- [ ] Support partner indicator on map (small heart icon)

## Bonus EXP Distribution

- [ ] Calculate bonus EXP per chapter: `(parTurns - actualTurns) × 50`, max 300
- [ ] Store accumulated bonus EXP in campaign state
- [ ] Bonus EXP distribution UI in preparation screen
- [ ] Select unit → allocate EXP in increments of 10
- [ ] Show level-up preview when enough EXP allocated
- [ ] EXP allocated triggers normal level-up stat rolls
- [ ] Catch-up bonus: +20% EXP if unit 3+ levels below party average

## Forging System (Arc 3+)

- [ ] Add `forgeLevel` to weapon instances (0, +1, +2, +3)
- [ ] Forge materials: Adamant (+1/+2), Mithril (+3)
- [ ] Forge bonuses: +2 might per level, +5 hit per level
- [ ] Forge UI in preparation screen shop
- [ ] Forge cost: material + gold
- [ ] Forged weapon name prefix: "Forged " + original name
- [ ] Max forge level per material: Adamant=+2, Mithril=+3

## Validation

- [ ] Unit tests: fog vision calculation, tile reveal/hide
- [ ] Unit tests: weather stat modifications (rain -15 bow hit, snow +1 cost, etc.)
- [ ] Unit tests: destructible terrain HP, collapse effects
- [ ] Unit tests: bridge collapse — unit on bridge when HP 0 (takes damage, displaced)
- [ ] Unit tests: bridge collapse — flying unit safe
- [ ] Unit tests: support point accumulation, rank progression
- [ ] Unit tests: support cap enforcement (5 partners max, S-rank counts toward 5)
- [ ] Unit tests: support combat bonus application (adjacent ally check)
- [ ] Unit tests: bonus EXP calculation and distribution
- [ ] Unit tests: forge stat bonuses (+2 might, +5 hit per level)
- [ ] Save/load: support points persist across save/load
- [ ] Save/load: forged weapon levels persist
- [ ] Integration: fog of war chapter plays correctly (hidden enemies, reveal on approach)
- [ ] Integration: weather overlay renders and stat mods apply
- [ ] Edge case: torch in fog reveals correct radius
- [ ] Edge case: all bridges destroyed — verify alternate paths exist
- [ ] `npm run build` — zero errors
- [ ] `npx vitest run` — all tests pass
