# Auto-Play Uses Direct Distance — Gets Stuck on Impassable Terrain

> **Severity:** medium
> **Category:** gameplay
> **Affected files:** `src/core/ai.ts`, `src/core/pathfinding.ts`, `src/stores/actions/autoBattleActions.ts`, `src/stores/actions/enemyActions.ts`, `src/hooks/useGameLoop.ts`
> **Spec refs:** `specs/gameplay/ai.md`

## Description

Auto-play (and enemy AI) movement scoring uses Manhattan distance to evaluate how close a unit is to targets. This ignores impassable terrain (rivers, walls, mountains), causing units to get stuck trying to path through obstacles when the direct distance looks short but no valid path exists.

## Current Behavior

- `getManhattanDistance` in `pathfinding.ts` calculates `|x1-x2| + |y1-y2|` — pure grid distance
- AI scoring in `ai.ts` uses this direct distance across **all behavior types** — not just aggressive/chase
- 22+ call sites in `ai.ts` use `getManhattanDistance`, including 3 shared helpers:
  - `findMoveTowardNearestPlayer()` — used by aggressive, thief, coordinated, ambush
  - `findMoveAwayFromHostiles()` — used by survival, healer, escort
  - `findNearestFortPosition()` — used by survival
- Guard behavior: radius filtering (line 309) uses Manhattan correctly by design, but waypoint selection (lines 338/340) has the same BFS bug
- If a river or impassable area sits between the unit and target, Manhattan distance says "close" but the unit cannot actually reach the target
- Unit gets stuck moving back and forth or not moving at all

## Expected Behavior

- When computing movement toward a target, use **actual pathfinding distance** (BFS) instead of Manhattan distance
- If no valid path exists to the target at all, deprioritize that target and consider alternatives
- Fallback to Manhattan distance only when BFS confirms the path is unobstructed (optimization)

## Steps to Fix

- [x] Add a `getPathfindingDistance` utility in `pathfinding.ts` that runs BFS and returns actual tile-step distance (or `Infinity` if unreachable)
- [x] Replace `getManhattanDistance` with `getPathfindingDistance` in the 3 shared helpers:
  - `findMoveTowardNearestPlayer()` (line ~192/202)
  - `findMoveAwayFromHostiles()` (line ~228)
  - `findNearestFortPosition()` (line ~256)
- [x] Fix guard waypoint selection (lines 338/340) — keep guard radius filtering (line 309) as Manhattan (by design)
- [x] Audit remaining `getManhattanDistance` call sites in `ai.ts` — replace where movement pathing is involved, keep where range/radius checks are intentional
- [x] Add per-`decideAction()` BFS cache to avoid redundant pathfinding (10+ enemies each calling BFS multiple times)
- [x] Add early-exit optimization: if Manhattan distance equals BFS distance, path is unobstructed — skip full BFS
- [x] Handle `Infinity` distance: if target is completely unreachable, skip it in target selection
- [x] Auto-battle (`src/stores/actions/autoBattleActions.ts`) reuses `decideAction()` so fix is automatic — verify with test
- [x] Add unit tests: AI with river between unit and target should path around, not get stuck
- [x] Add unit tests: AI with no valid path should pick alternative target

## Spec Update

- [x] Update `specs/gameplay/ai.md` — add note under movement scoring: "Uses actual pathfinding distance (BFS) instead of Manhattan distance to avoid getting stuck on impassable terrain"
