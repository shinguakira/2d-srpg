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

## Classes

A class carries its move type, which weapon types it may hold and to what rank,
a crit bonus, tags, and its promotion.

**Move type** picks a column out of every terrain's `cost` triple:
`[foot, mounted, flier]`. Mounted cannot cross mountains; fliers ignore terrain
almost entirely, paying 1 everywhere including water.

**Tags** — `armor cavalry flier monster dragon` — are what effective weapons
look for.

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
