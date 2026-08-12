# Character Roster

Master roster for the 25-chapter campaign. Units 1-12 are implemented in
`src/data/units.ts`; 13-20 are Arc 3-5 placeholders. See
[characters.md](characters.md) for writing briefs and
[arc-structure.md](arc-structure.md) for chapter context.

---

## Full Roster

| # | Name | id | Class | Joins | Leaves | Role |
|---|------|----|-------|-------|--------|------|
| 1 | **Shigeru** | `shigeru` | Lord | Ch1 | — | Protagonist. Bears the Flamebrand. Must survive every chapter. |
| 2 | **Akira** | `akira` | Cavalier | Ch1 | — | Sworn retainer. Survives the campaign — deliberately. |
| 3 | **Kanna** | `kanna` | Mage | Ch1 | — | Court scholar. Tracks the blight. Crisis chapter is Ch7. |
| 4 | **Hina** | `hina` | Cleric | Ch1 (epilogue) | — | Shrine maiden of Hitotsu. Supplies the setting's folklore. |
| 5 | **Goro** | `goro` | Fighter | Ch1 (turn 2) | — | Woodcutter. Asks the questions the player is thinking. |
| 6 | **Genzo** | `genzo` | Soldier | Ch2 (defects) | **Ch8 (dies)** | Kurogane sergeant. His death is the campaign's turning point. |
| 7 | **Sayo** | `sayo` | Archer | Ch3 | — | Kiri huntress. Speaks in single words. |
| 8 | **Hachi** | `hachi` | Thief | Ch4 | — | Minato pickpocket. Feeds people with stolen keys. |
| 9 | **Yuki** | `yuki` | Pegasus Knight | Ch5 | — | Sky Watch rider. Sees the blight from above first. |
| 10 | **Raiga** | `raiga` | Mercenary | Ch6 | — | Sellsword. The company's memento mori. |
| 11 | **Mio** | `mio` | Troubadour | Ch6 | — | Heals both armies and will not be argued out of it. |
| 12 | **Kagura** | `kagura` | Dancer | Ch9 | — | Performer. Refresh ability. Grief chapter's counterweight. |
| 13 | *TBD* | — | Shaman | Ch11 | — | Arc 3 — dark magic that answers the blight in its own language. |
| 14 | *TBD* | — | Wyvern Rider | Ch13 | Conditional | Arc 3 — partially blighted. Can be saved or lost. |
| 15 | *TBD* | — | Monk | Ch14 | — | Arc 3 — shrine keeper. Light magic vs Corruption. |
| 16 | **Tsubame** | — | Falcon Knight | Ch18 | — | Arc 4 — the Ch6 sky captain, if spared. Ending flag. |
| 17 | *TBD* | — | Armor Knight | Ch19 | — | Arc 4 — Kurogane officer who stands aside, then turns. |
| 18-20 | *TBD* | — | — | Arc 5 | — | Shrine wardens / late recruits. |

---

## Deployment

| Chapter | Slots | Force-deployed |
|---|---|---|
| Ch1 | 5 | `shigeru` (preparation skipped) |
| Ch2 | 5 | `shigeru` |
| Ch3 | 6 | `shigeru` |
| Ch4 | 7 | `shigeru` |
| Ch5-7 | 7 | `shigeru` |
| Ch8 | 8 | `shigeru`, `genzo` — Genzo must be present for the corridor to be held |
| Ch9 | 7 | `shigeru` |
| Ch10 | 8 | `shigeru` |

## Permadeath and scripted loss

- Ordinary casualties go to `deadUnitIds` and are gone for the rest of the run
  (classic mode) or retreat at 1 HP (casual mode). Shigeru is always permanent —
  losing him ends the run either way.
- **Genzo is different.** His Ch8 death is scripted, not a casualty: the chapter
  sets the `genzo_dead` event flag, `Game.tsx` bridges it to campaign flags, and
  `campaignStore` removes him from the roster and applies the `grief` trauma skill
  to every surviving unit for two chapters.

## NPCs

| Name | id | Chapter | Purpose |
|---|---|---|---|
| Genzo (ally) | `genzo_npc` | Ch8 | Spawns at (8,16) when he takes the corridor. Soldier, aggressive AI. |
| Elder Toki | `elder_toki` | Ch10 | Protect target. Keeps the village chronicle. Stationary. |
