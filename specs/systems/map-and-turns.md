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
| `h` | 山 mountain | 1 | 30 | 4 | ∞ | 1 | |
| `^` | 峰 peak | 2 | 40 | ∞ | ∞ | 1 | |
| `s` | 砂地 sand | 0 | 5 | 2 | 3 | 1 | |
| `~` | 水辺 water | 0 | 10 | 3 | ∞ | 1 | |
| `w` | 岩壁 wall | 0 | 0 | ∞ | ∞ | ∞ | |
| `V` | 村 village | 0 | 10 | 1 | 1 | 1 | |
| `S` | 武器屋 shop | 0 | 10 | 1 | 1 | 1 | |
| `A` | 闘技場 arena | 0 | 0 | 1 | 1 | 1 | |
| `C` | 宝箱 chest | 0 | 0 | 1 | 1 | 1 | |
| `D` | 扉 door | 0 | 0 | ∞ | ∞ | ∞ | |
| `F` | 砦 fort | 2 | 20 | 1 | 1 | 1 | 20% |
| `G` | 門 gate | 3 | 20 | 1 | 1 | 1 | 10% |
| `T` | 玉座 throne | 3 | 20 | 1 | 1 | 1 | 10% |

Peaks and mountains stop cavalry outright. Water is wadeable at cost 3 rather
than a flier-only lane. The **throne also adds +5 res**, which is why a boss
sitting on one is worse for mages than the def figure suggests.

**Fliers get nothing from terrain** except on forts, gates and thrones. Standing
a pegasus in a forest buys no avoid.

A door opens with a key and the map character is rewritten to plain, so the
passage is permanent for the rest of the chapter.

## Movement range

Dijkstra out from the unit, bounded by `mov`. Enemies block passage entirely;
allies can be passed through but not stopped on. Units being carried are not on
the board at all and block nothing. `pathTo` walks the recorded predecessors
back, so the drawn path is the one the search actually costed.

**Canto** re-runs the same search with the movement the unit did not spend, so
a cavalier who moved two of seven may withdraw five after attacking.

## The turn

Player phase begins by clearing `acted`, ticking status (poison bites, sleep
keeps the unit down for the whole phase), healing anyone standing on a fort,
gate or throne, accumulating support points between adjacent allies, and
spawning any reinforcements due this turn. The phase ends when the player ends
it — or automatically if the オートターンエンド option is on.

Commands are offered only when they apply:

| | |
|---|---|
| 制圧 | the lord standing on the objective's throne |
| 訪問 / 宝箱 / 扉 / 武器屋 / 闘技場 | standing on (or beside, for a door) that terrain |
| 攻撃 | some weapon in the pack reaches somebody. Choosing it opens a **weapon list** first, with how many targets each reaches |
| 杖 | a staff with a valid target. Also a list, showing each staff's computed range |
| 踊る / 盗む | class flag, plus a valid adjacent target |
| 会話 / 支援 | an adjacent recruitable enemy, or a partner ready to rank up |
| 救出 / 降ろす / 引き取る | aid vs the target's con; 降ろす picks an empty adjacent tile |
| 輸送隊 | the lord, or anybody adjacent to the lord |
| トレード | an adjacent ally |
| 道具 | always — equip, 傷薬, マスタープルフ |
| 待機 | always. Ends the unit outright, skipping canto |

The map menu, opened by confirming on an empty tile, is FE8's: **ユニット /
状況 / ガイド / オプション / 中断 / ターン終了**.

Enemy phase runs the same status tick, then each enemy acts in turn. Anyone
under 狂戦 acts here too, whichever army they belong to.

## Reinforcements

A chapter may list `reinforcements` as `{turn, at, seed}`. They arrive at the
start of the player phase of that turn, at the named tile or the nearest free
one, already spent for that turn so they first move on the enemy phase that
follows. `specs/story/chapter-scale.md` sizes them per chapter.

## The arena

Terrain `A`, gated on the chapter declaring an `arenaLevel`. The wager is
`100 + arenaLevel × 30`; the opponent is built to **the challenger's** level.
Rounds repeat until one side falls, capped at eight and stopped early if a round
changes nothing. Winning pays double the wager, losing kills the unit for good.

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
leaves its tile and only swings at what comes to it. A berserked unit treats
everyone as a target, its own army included.

**There is no danger-zone overlay.** GBA FE has none: selecting a single enemy
shows that one enemy's reach, and nothing paints every threat at once. The
all-enemies display arrives with the DS games and does not belong here.
