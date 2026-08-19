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
| Hit | `weapon hit + skl×2 + ⌊lck/2⌋ + triangle(±15) + S-rank(+5) + support hit` |
| Avoid | `AS×2 + lck + terrain avo + support avo` |
| Displayed hit | `hit − avoid`, clamped 0..100 |
| Crit | `weapon crit + ⌊skl/2⌋ + class bonus + S-rank(+5) + support crit` |
| Dodge | `lck + support ddg` |
| Displayed crit | `crit − dodge`, clamped 0..100 |
| Attack speed | `spd − max(0, weight − con)` |
| Doubling | attack speed lead of **4 or more** |
| Critical damage | normal damage **× 3** |
| Effective damage | the **weapon's might × 3**, not the total |

Magic uses `mag` against `res`; everything else uses `str` against `def`. Which
one applies is the weapon's `magical` flag.

**S-rank bonus.** Swinging a weapon whose type the wielder has at S adds +5 hit
and +5 crit. It is the reward for the rank itself, on top of what the weapon says.

**Rescue penalty.** A unit carrying somebody fights at **half skill and half
speed** — `effStats` halves both, and every number above is computed from that,
so picking up a wounded ally costs doubling, hit and avoid all at once.

**Terrain and fliers.** Terrain's def and avo apply to everyone except fliers,
who receive nothing outside forts, gates and thrones. The throne is the only
terrain that adds **res** rather than def.

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

FE8's formula, class bonuses and all. A promoted class carries **bonus A 20,
class power 3, bonus B 60**; an unpromoted one carries zeroes and a power of 1.

```
連撃  ⌊(31 + (敵Lv + 敵A) − (自Lv + 自A)) / 自クラス係数⌋      最低 1
撃破  上の値 + max(0, (敵Lv × 敵係数 + 敵B) − (自Lv × 自係数 + 自B)) + 20
```

A boss adds 40 more. Capped at 100 per battle, player units only. The shape this
produces is the series': killing a promoted enemy is worth a lot, and a promoted
unit farming unpromoted enemies earns almost nothing.

100 experience is a level. Every growth-bearing stat rolls once against its own
growth rate; stats at their cap do not roll. Max level 20.

## Staff accuracy

Healing never misses. The three staves that attack —— スリープ, サイレス,
バーサク —— roll against FE8's formula, which is a hit and an avoid like any
other exchange:

```
命中 = 30 + 魔力×5 + 技
回避 = 魔防×5 + 距離×2
```

Their **range is ⌊mag / 2⌋**, as is リブロー's. The weapon table's `maxRange`
only caps it.

## Status

One effect at a time; a new one replaces the old. Turns tick down at the start of
each side's own phase.

| | |
|---|---|
| 睡眠 | cannot act, and **cannot counter** —— `canAttack` is false while asleep |
| 沈黙 | staves and tomes are unusable; swords and lances still swing |
| 狂戦 | acts on the enemy phase and attacks whoever is nearest, friend or not |
| 毒 | loses HP at the start of its phase, never below 1 |

リザーブ clears any of them. 毒の牙 applies 毒 on a connecting blow that does not
kill.

## Effective damage

The weapon lists the tags it is effective against and the defender's class lists
the tags it has, so an armourslayer triples its might against armour. A bishop's
`slayer` flag does the same against every monster without needing the weapon to
say so.
