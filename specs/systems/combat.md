# Combat

`src/battle/combat.ts`. GBA Fire Emblem arithmetic, not an approximation of it.

## Forecast

Both sides are evaluated symmetrically by `forecast(a, aPos, d, dPos, units)`,
which returns each side's damage, hit, crit, attack speed and whether it doubles.
The same function feeds the player's forecast panel and the enemy AI, so what
the AI sees is exactly what the player is shown.

| | |
|---|---|
| Attack | `str (or mag) + might + triangle(±1) + support atk` |
| Damage | `attack − (def or res + terrain def + support def)`, floor 0 |
| Hit | `weapon hit + skl×2 + ⌊lck/2⌋ + triangle(±15) + support hit` |
| Avoid | `AS×2 + lck + terrain avo + support avo` |
| Displayed hit | `hit − avoid`, clamped 0..100 |
| Crit | `weapon crit + ⌊skl/2⌋ + class bonus + support crit` |
| Dodge | `lck + support ddg` |
| Displayed crit | `crit − dodge`, clamped 0..100 |
| Attack speed | `spd − max(0, weight − con)` |
| Doubling | attack speed lead of **4 or more** |
| Critical damage | normal damage **× 3** |
| Effective damage | the **weapon's might × 3**, not the total |

Magic uses `mag` against `res`; everything else uses `str` against `def`. Which
one applies is the weapon's `magical` flag.

## Hit is 2RN

`rng.hitCheck` averages **two** rolls and compares that to the displayed number.
A displayed 80 lands about 91% of the time; a displayed 30 lands about 18%. High
numbers are better than they look and low numbers are worse, which is the whole
texture of the series. Crit and growths are single-roll.

## Weapon triangle

Sword > axe > lance > sword, and anima > light > dark > anima. Advantage is
**+1 might and +15 hit**, disadvantage the reverse. Staves never trigger it.

## Order of blows

Attacker, then defender, then the attacker's follow-up, then the defender's. A
side only swings if its weapon reaches — `distance` inside `[minRange, maxRange]`
— so a bow user counters a mage at 2 and neither counters the other at 1.

Each blow spends one use of the weapon and one point of weapon experience.

## Experience

`(31 + defenderLv − attackerLv) / 3`, floor 1, for connecting. On a kill add
`20 + max(0, levelDiff) × 2`, and 40 more if the target is a boss. Capped at 100
per battle. Player units only.

100 experience is a level. Every growth-bearing stat rolls once against its own
growth rate; stats at their cap do not roll. Max level 20.

## Effective damage

The weapon lists the tags it is effective against and the defender's class lists
the tags it has, so an armourslayer triples its might against armour. A bishop's
`slayer` flag does the same against every monster without needing the weapon to
say so.
