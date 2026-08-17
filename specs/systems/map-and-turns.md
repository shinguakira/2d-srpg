# Map, movement and the turn

`src/core/grid.ts`, `src/data/terrain.ts`, `src/game/game.ts`.

## Terrain

The map is an array of strings and each character is a terrain. `src/data/terrain.ts`:

| char | | def | avo | foot | mounted | flier | heal |
|---|---|---|---|---|---|---|---|
| `.` | 平地 plain | 0 | 0 | 1 | 1 | 1 | |
| `,` | 草原 grass | 0 | 5 | 1 | 1 | 1 | |
| `b` | 道 road | 0 | 0 | 1 | 1 | 1 | |
| `f` | 林 forest | 1 | 20 | 2 | 3 | 1 | |
| `h` | 山 mountain | 2 | 30 | 4 | ∞ | 1 | |
| `w` | 岩壁 wall | 0 | 0 | ∞ | ∞ | ∞ | |
| `~` | 水辺 water | 0 | 0 | ∞ | ∞ | 1 | |
| `F` | 砦 fort | 2 | 20 | 1 | 1 | 1 | 20% |
| `G` | 門 gate | 3 | 20 | 1 | 1 | 1 | 20% |

Mountains stop cavalry outright and cost foot four. Water is a flier-only lane.
Forts and gates heal a fifth of max HP at the start of the owner's phase, which
is what makes a boss on a gate expensive to grind down.

## Movement range

Dijkstra out from the unit, bounded by `mov`. Enemies block passage entirely;
allies can be passed through but not stopped on. `pathTo` walks the recorded
predecessors back, so the drawn path is the one the search actually costed.

## The turn

Player phase begins by healing anyone standing on a fort or gate and then
accumulating support points between adjacent allies. Each unit acts once —
move, then a command — and the phase ends when all have acted or the player
ends it.

Commands are offered only when they apply: 攻撃 when something is in weapon
range, 杖 when a staff and a wounded ally are both in reach, 会話 when an
adjacent enemy is recruitable by this unit or an ally is ready to rank up, 傷薬
when carrying one and hurt, マスタープルフ at level 10 with a promotion
available.

Enemy phase runs the same healing, then each enemy acts in turn.

## Enemy AI

`src/game/ai.ts`. Every reachable tile is paired with every attackable target
and scored through the same forecast the player sees:

```
expected damage × 4
+ 220   if the blow is lethal and hit ≥ 50
+  40   if the target is the lord
−  1.6 × expected counter damage
− 120   if the counter would kill
+ terrain def × 3 + avo × 0.15
− target hp × 0.08
```

So it prefers kills, leans on the lord, avoids trading into its own death, and
takes the better tile when two are otherwise equal.

`aggressive` closes when it cannot attack. `guard` holds position. `boss` never
leaves its tile and only swings at what comes to it.

`threatTiles` unions every enemy's reachable tiles with their weapon range for
the danger overlay, so what is shaded is what the AI could actually reach.
