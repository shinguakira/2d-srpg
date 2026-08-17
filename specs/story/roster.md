# Character Roster

Master roster for the 25-chapter campaign. **None of it is in the game.** There
is one chapter, its units are the ported PoC's in `src/data/chapter1.ts`, and
Shigeru is the only name on this list that appears there — as `p_shigeru`,
holding the PoC's lord stats. Everyone else below is a design target.

See [characters.md](characters.md) for writing briefs and
[arc-structure.md](arc-structure.md) for chapter context.

---

## Full Roster

| # | Name | id | Class | Joins | Leaves | Role |
|---|------|----|-------|-------|--------|------|
| 1 | **Shigeru** | `shigeru` | Lord | Ch1 | — | Protagonist. Bears the Flamebrand. Must survive every chapter. |
| 2 | **Akira** | `akira` | Cavalier | Ch1 | — | Sworn retainer. Survives the campaign — deliberately. |
| 3 | **Lisette** | `lisette` | Mage | Ch1 | — | Court scholar. Tracks the blight. Crisis chapter is Ch7. |
| 4 | **Mirelle** | `mirelle` | Cleric | Ch1 (epilogue) | — | Shrine maiden of Shiratake. Supplies the setting's folklore. |
| 5 | **Gareth** | `gareth` | Fighter | Ch1 (turn 2) | — | Woodcutter. Asks the questions the player is thinking. |
| 6 | **Halvar** | `halvar` | Soldier | Ch2 (defects) | **Ch8 (dies)** | Kurogane sergeant. His death is the campaign's turning point. |
| 7 | **Bryn** | `bryn` | Archer | Ch3 | — | Shiine huntress. Speaks in single words. |
| 8 | **Fenn** | `fenn` | Thief | Ch4 | — | Tsutsu pickpocket. Feeds people with stolen keys. |
| 9 | **Elin** | `elin` | Pegasus Knight | Ch5 | — | Sky Watch rider. Sees the blight from above first. |
| 10 | **Corwin** | `corwin` | Mercenary | Ch6 | — | Sellsword. The company's memento mori. |
| 11 | **Nadine** | `nadine` | Troubadour | Ch6 | — | Heals both armies and will not be argued out of it. |
| 12 | **Viviane** | `viviane` | Dancer | Ch9 | — | Performer. Refresh ability. Grief chapter's counterweight. |
| 13 | *TBD* | — | Shaman | Ch11 | — | Arc 3 — dark magic that answers the blight in its own language. |
| 14 | *TBD* | — | Wyvern Rider | Ch13 | Conditional | Arc 3 — partially blighted. Can be saved or lost. |
| 15 | *TBD* | — | Monk | Ch14 | — | Arc 3 — shrine keeper. Light magic, effective on the blight's units. |
| 16 | **Aeryn** | — | Falcon Knight | Ch18 | — | Arc 4 — the Ch6 sky captain, if spared. Ending flag. |
| 17 | *TBD* | — | Armor Knight | Ch19 | — | Arc 4 — Kurogane officer who stands aside, then turns. |
| 18-20 | *TBD* | — | — | Arc 5 | — | Shrine wardens / late recruits. |

---

## Deployment

| Chapter | Slots | Force-deployed |
|---|---|---|
| Ch1 | 5 | `shigeru` (preparation skipped) |
| Ch2 | 5 | `shigeru` |
| Ch3 | 6 | `shigeru` |
| Ch4-5 | 7 | `shigeru` |
| Ch6-9 | 8 | `shigeru`; Ch8 also `halvar` — he must be present to hold the corridor |
| Ch10 | 9 | `shigeru` |
| Ch11-13 | 10 | `shigeru` |
| Ch14-16 | 11 | `shigeru` |
| Ch17-22, Ch25 | 12 | `shigeru` |
| Ch23-24 | 16 | `shigeru` |

See [chapter-scale.md](chapter-scale.md) for board sizes, enemy counts and
reinforcements, and for why these numbers are shaped the way they are.

## Permadeath and scripted loss

Neither of these exists yet — the game has one map, no campaign, and no state
that outlives it. Both are requirements on whatever ends up carrying the roster
between chapters.

- Ordinary casualties are gone for the rest of the run. Shigeru is the exception
  in the other direction: losing him ends the run on the spot, which the game
  already does.
- **Halvar is different.** His Ch8 death is scripted rather than a casualty. He
  dies at a fixed turn whatever the player does, and the two chapters after it
  are fought by a company that is measurably worse because of it.

## NPCs

| Name | Chapter | Purpose |
|---|---|---|
| Halvar (ally) | Ch8 | Spawns at the mouth of the south corridor when he takes it. Soldier, aggressive AI. |
| Elder Ilse | Ch10 | Protect target. Keeps the village chronicle. Stationary. |
