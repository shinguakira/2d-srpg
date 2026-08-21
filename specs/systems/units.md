# Units, classes and weapons

`src/types.ts`, `src/data/classes.ts`, `src/data/weapons.ts`.

## Stats

`hp str mag skl spd lck def res con mov`

Two of those do not exist in most simplified takes on the series and both matter
here:

- **con** — build. Weight above build is subtracted from attack speed, so a
  heavy axe on a small unit loses doubling and avoid. It never grows.
- **mag** — separate from str. Magic damage uses it against res.

Growth rates are a parallel `Stats` block, read as percentages, rolled once per
level. `con` and `mov` do not grow. Caps are 20 for most stats, 60 hp, 30 lck,
25 con, 15 mov.

**Only one of `str` and `mag` ever grows.** GBA Fire Emblem has a single Pow
stat that reads as strength with a sword and as magic with a tome; splitting it
in two is this game's choice, and left alone it lets a fighter drift up in magic
he can never spend. `gainExp` skips the one the class cannot use —
`isMagicClass` in `classes.ts`, true for anima, light, dark or staff — so the
tables keep their off-stat percentages but nothing rolls against them. The
level-up screen shows the same single row, and would otherwise be hiding gains.

**Aid** is derived rather than stored, by `aidOf` in `classes.ts`: mounted
`25 − con`, flier `20 − con`, foot `con − 1`. It is the ceiling on whose `con`
this unit can pick up. FE8 splits mounted by sex (25 male, 20 female); this
game has no sex on units, so the split falls on move type instead — pegasus and
wyvern riders carry less, which lands in the same place for the same units.

## What a unit carries besides stats

| | |
|---|---|
| `items` | up to five weapons. Overflow lives in the convoy |
| `equipped` | index into `items`; the weapon menu sets it before choosing a target |
| `potion` `keys` `seals` | 傷薬, 鍵, マスタープルフ. Counts, not inventory slots |
| `status` | one `{kind, turns}` or nothing —— see `combat.md` |
| `rescuing` | the id of the unit being carried. Halves this unit's skl and spd |
| `carried` | set on the one being carried. Off the board: no tile, no threat, no target |
| `canto` | true only during the re-move that follows an action |
| `wexp` | weapon experience per type |
| `supports` | one link per partner |

## Classes

A class carries its move type, which weapon types it may hold and to what rank,
a crit bonus, tags, and its promotion.

**Move type** picks a column out of every terrain's `cost` triple:
`[foot, mounted, flier]`. Mounted cannot cross mountains; fliers ignore terrain
almost entirely, paying 1 everywhere including water.

**Tags** — `armor cavalry flier monster dragon` — are what effective weapons
look for.

**Canto** is not written per class; `classes.ts` grants it to every mounted and
flying class as the table is built, because GBA FE has no exceptions and writing
it out invites forgetting it on the next class added. A unit with canto that
acts may move again with whatever movement it did not spend. 待機 skips it.

**Class skills.** `steal` (thief, rogue, assassin) and `dance` (dancer) are
flags on the class. Both are implemented; no unit in the current roster has
either class, because the cast is fixed.

**Promotion** needs a Master Seal and level 10, and FE8-style it offers **two
destinations** for most classes; the cavalier picks paladin or great knight. The
gain is a flat `promoGain` block per class. Promoted classes cannot promote
again.

## Weapon ranks

Rank comes from accumulated weapon experience, not from a level or a class
grant. One point per swing.

| E | D | C | B | A | S |
|---|---|---|---|---|---|
| 0 | 31 | 71 | 121 | 181 | 251 |

A unit may equip a weapon if its class allows that weapon type **and** its
earned rank meets the weapon's. Both checks are in `canUse`.

## Durability

Every weapon has `uses` and every blow spends one. At zero it stops being
selectable — `battleWeapon` skips it and falls through to the next usable thing
in the inventory, so a unit whose weapon breaks mid-map is not defenceless if it
is carrying anything else.

## Staves

Staves never counter, never trigger the triangle, and are excluded from
`battleWeapon`. Healing is `20 + mag` for Mend, `10 + mag` for anything else.

A staff's `staffKind` decides who it may target and how far it reaches:

| kind | targets | range |
|---|---|---|
| heal (default) | wounded allies | the weapon's own |
| physic | wounded allies | ⌊mag/2⌋ |
| restore | allies with a status | the weapon's own |
| sleep / silence / berserk | enemies without a status | ⌊mag/2⌋ |

The three attacking staves roll for accuracy; the rest always land. Only the
healing ones get a battle screen —— the others resolve to a line of log.

## Convoy

Five item slots per unit is a hard cap. The overflow is the campaign's `convoy`,
which survives chapters. It is reachable from the preparations screen without
limit, and inside a chapter only by the lord or somebody standing next to them.
