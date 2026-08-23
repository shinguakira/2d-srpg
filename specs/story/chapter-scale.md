# Chapter Scale

Board size, deployment, enemy count and reinforcements for all 25 chapters.
Terrain, exact placement and events are not decided here — only how big each
chapter is and how much is on it.

Calibrated against Fire Emblem: The Sacred Stones, whose deployment and
reinforcement counts are documented on
[Serenes Forest](https://serenesforest.net/the-sacred-stones/general/chapter-guide/).

## What FE8 actually does

The numbers worth copying, taken from that guide rather than from memory:

| | |
|---|---|
| Deployment | 9 by Ch4-5, 10 by Ch6, 11-12 for most of the game, **17-18** for the two big set-pieces (Ch19-20), back to 12 for the finale |
| Early reinforcements | one or two waves of 2-3. Ch1 sends 3 on turn 2; Ch5 sends 2 each on turns 2, 6 and 8 |
| Mid reinforcements | several waves of 2-4 over turns 2-9, often from two edges at once (Ch9, Ch13, Ch15) |
| Late reinforcements | a wave nearly every turn from turn 2 to 12 (Ch17, Ch19) |
| Trigger-based | the back half leans on progress triggers rather than the turn counter — Ch12, Ch16, Ch20 all spawn off the player crossing a line |

The shape is: deployment roughly doubles across the campaign, reinforcement
*frequency* rises much faster than wave *size*, and the trigger replaces the
timer as the game goes on. Waves stay small — three or four — the whole way
through. What changes is how often they come and from how many directions.

## The window is 20×14; the map is not

The camera scrolls, so a chapter is drawn at the size it needs rather than the
size that fits on screen. The window shows twenty tiles by fourteen and the
board runs past it — see `specs/systems/presentation.md`. Only Ch1 and Ch2 fit
without scrolling, and that is a property of those two chapters, not a limit.

## Reinforcements

The engine spawns them: a chapter lists `reinforcements` as `{turn, at, seed}`
and they arrive at the start of that turn's player phase. **Ch1-10 all carry the
waves this table gives them**, give or take a body where the board wanted one
somewhere else. Ch11 on is still only a row.

Separately, `events` fires scripted things on the turn counter — arrivals,
defections, Halvar's nine turns, the Ch10 Colossus. See
`specs/systems/presentation.md`.

## The table

Enemy counts are units on the board at turn 1. Reinforcements are listed
separately and are not included in that number.

### Arc 1 — Flight

A company assembling. Small boards, one route decision each, reinforcements used
to teach that the map is not static.

| Ch | Title | Size | Deploy | Enemies | Reinforcements | Objective |
|---|---|---|---|---|---|---|
| 1 | The Road to Kureha | 20×14 | 5 | 6 | — | Seize the throne |
| 2 | The Sarz Crossing | 20×14 | 5 | 8 | 2 on turn 3 | Seize the throne |
| 3 | The Shena Hills | 22×15 | 6 | 10 | 3 on turn 4 | Rout |
| 4 | The Cape of Suza | 22×16 | 7 | 11 | 2 on turns 3 and 6 | Seize the throne |
| 5 | Kandel, Above the Clouds | 24×16 | 7 | 13 | 3 on turn 4, 3 on turn 7 | Defeat General Roderic and seize |

### Arc 2 — The Broken Seal

The rift starts moving. Ch8 is the campaign's turning point and is built as a
defence; Ch10 is the arc's set-piece.

| Ch | Title | Size | Deploy | Enemies | Reinforcements | Objective |
|---|---|---|---|---|---|---|
| 6 | The Harbour at Kesh | 24×16 | 8 | 14 | 3 on turns 3 and 6 | Defeat Captain Aeryn |
| 7 | What the Wall Held | 24×19 | 8 | 15 | 3 on turns 3, 5, 7, 9 | Survive 12 turns |
| 8 | The Last Stand on Yatan | 24×19 | 8 | 16 | 3 per turn, turns 4-9, two edges | Defeat General Wulfram and seize |
| 9 | The Empty Place | 24×17 | 8 | 12 | 3 on turn 6 | Rout |
| 10 | The Sands of Kodo | 24×17 | 9 | 18 | 4 on turns 3, 6, 9 | Defeat Ezrin, protect Elder Ilse |

### Arc 3 — The Ash Road

Endurance. Objectives stop being "kill everything" and start being "get there
with everyone". Blight edges replace some reinforcements as the pressure.

| Ch | Title | Size | Deploy | Enemies | Reinforcements | Objective |
|---|---|---|---|---|---|---|
| 11 | The Ash Road | 28×18 | 10 | 16 | 3 per turn, turns 3-7, behind | Escape west with everyone alive |
| 12 | The Silent Village | 26×18 | 10 | 14 | triggered, 4 per trigger, 3 triggers | Survive, night, fog of war |
| 13 | The Uzia Basin | 28×20 | 10 | 20 | 4 on turns 2, 5, 8 | Seize the far bridgehead |
| 14 | The Shrine on the Cape | 26×20 | 11 | 18 | 3 per turn, turns 4-8 | Defend the shrine precinct |
| 15 | The Burning of Suza | 28×20 | 11 | 22 | 4 on turns 3 and 6 | Rout, turn limit from the blight edge |

### Arc 4 — The Empire's Back

Kurogane ground going grey behind the front. Political, so several chapters are
about who stops fighting rather than who dies.

| Ch | Title | Size | Deploy | Enemies | Reinforcements | Objective |
|---|---|---|---|---|---|---|
| 16 | The Man Who Filed Nothing | 28×20 | 11 | 18 | triggered, 3 per trigger, 2 triggers | Seize |
| 17 | The Fords of Sarz | 30×20 | 12 | 20 | 3 per turn, turns 2-8, both banks | Hold the fords 10 turns |
| 18 | Two Crowns | 30×20 | 12 | 24 | 4 on turns 4 and 8 | Boss kill, scripted defection |
| 19 | The Flame on Shirato | 30×22 | 12 | 24 | 3 per turn, turns 3-9 | Protect the shrine keeper |
| 20 | The Wood That Was Never Cut | 32×22 | 12 | 26 | triggered, 4 per trigger, 4 triggers | Survive the crossing |

### Arc 5 — The Three Flames

The walk to Arn. Two of these are deliberately oversized set-pieces in FE8's
Ch19-20 mould, with the deployment to match.

| Ch | Title | Size | Deploy | Enemies | Reinforcements | Objective |
|---|---|---|---|---|---|---|
| 21 | The Forbidden Ground | 30×22 | 12 | 22 | 3 per turn, turns 3-8 | Reach the stone at the centre |
| 22 | Sworn Brothers | 30×20 | 12 | 24 | 4 on turns 4 and 7 | Boss kill |
| 23 | The Oath of Three Hundred | 32×24 | **16** | 28 | 4 per turn, turns 2-10 | Advance through the seal chamber |
| 24 | The Cliffs of Arn | 32×24 | **16** | 30 | triggered, 5 per trigger, 4 triggers | **Breach the Stone Gate** (ward 3 turns, then 力 accumulates) |
| 25 | The Sea Gate | 34×24 | 12 | 26 | triggered waves, 10 turns | Defeat Takeshi |

## Notes on the shape

**Deployment 5 → 16.** Slower to open than FE8, which is at 9 by its Ch4,
because our roster only reaches 12 named units at Ch9 and the Arc 3-5 slots are
still unwritten. Ch23-24 take the FE8 Ch19-20 spike; the finale drops back to 12
so the last chapter is the team the player chose, not everyone they own.

**Enemies 6 → 30.** Roughly 1.5 to 2 enemies per deployed unit for most of the
campaign, tightening in defence chapters where the attackers arrive over time
rather than standing on the board.

**Waves stay at 3-4.** Copied directly from FE8 and worth holding to. What
escalates is frequency and the number of edges they come from.

**Triggers take over after Ch11.** Turn-timed reinforcements punish slow play;
triggered ones punish careless advances. The back half of the campaign is about
advancing carefully, so it uses triggers.

**Ch8 and Ch19 are the exceptions.** Ch8 is where Halvar dies holding a corridor
and Ch19 is a protect objective — both need continuous pressure, so both get
per-turn reinforcements from more than one direction.

## Not decided here

Terrain layout, unit placement, classes, boss stats, village and chest contents,
event triggers. Those are per-chapter and belong in the chapter files.
