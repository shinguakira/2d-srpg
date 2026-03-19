# Weapons

All weapon definitions, stat blocks, and special effects. Staves are included here as they follow the same data structure.

See [stats.md](stats.md) for combat formulas (ATK, hit rate, crit, weapon triangle).
See [items.md](items.md) for consumable items.

---

## Weapon Stats

| Field | Description |
|-------|------------|
| **Type** | sword, lance, axe, fire, thunder, wind, staff |
| **Might** | Base damage added to STR (physical) or MAG (magic/staff) |
| **Hit** | Base accuracy added to SKL formula |
| **Crit** | Base crit chance added to SKL/2 |
| **Weight** | Currently unused in combat. Reserved for future AS calculation. |
| **Range** | Min-Max attack range in tiles |
| **Uses** | Durability. Weapon breaks at 0. (Currently not implemented in code — all weapons infinite.) |
| **Rank** | Weapon proficiency required (E/D/C/B/A/S). See Weapon Ranks below. |

---

## Weapon Triangle

```
Sword > Axe > Lance > Sword
Fire > Wind > Thunder > Fire
```

| Matchup | Hit Mod | Damage Mod |
|---------|---------|------------|
| Advantage | +15 hit | +1 damage |
| Disadvantage | -15 hit | -1 damage |
| Neutral / cross-type | 0 | 0 |

Physical vs Magic: no triangle interaction. Staves: non-combat, no triangle.

---

## Swords

Light, accurate. Best hit rates. Moderate damage.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Slim Sword** | 3 | 100 | 5 | 2 | 1 | 30 | E | Starter. Light. High crit for its tier. |
| **Iron Sword** | 5 | 90 | 0 | 5 | 1 | 46 | E | Standard early-game sword. |
| **Steel Sword** | 8 | 75 | 0 | 10 | 1 | 30 | D | Heavier, stronger. Hit penalty noticeable. |
| **Silver Sword** | 13 | 80 | 0 | 8 | 1 | 20 | A | Top-tier. Good balance of might and accuracy. |
| **Killing Edge** | 9 | 75 | 30 | 7 | 1 | 20 | C | The crit weapon. Build around SKL. |
| **Armorslayer** | 8 | 80 | 0 | 10 | 1 | 18 | C | Effective vs armored (×3 might). |
| **Rapier** | 7 | 95 | 10 | 5 | 1 | 40 | Prf | **Ren only**. Effective vs cavalry and armored. Lord weapon. |
| **Brave Sword** | 9 | 75 | 0 | 12 | 1 | 30 | A | Attacks twice per combat (2 hits guaranteed, 4 if doubling). |

---

## Lances

High might, lower accuracy. Mounted units' primary weapon.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Iron Lance** | 7 | 80 | 0 | 8 | 1 | 45 | E | Standard. Solid might. |
| **Steel Lance** | 10 | 70 | 0 | 13 | 1 | 30 | D | Heavy but powerful. |
| **Silver Lance** | 14 | 75 | 0 | 10 | 1 | 20 | A | Top-tier lance. |
| **Javelin** | 6 | 65 | 0 | 11 | 1-2 | 20 | D | Ranged option. Accuracy and might suffer. |
| **Killer Lance** | 10 | 70 | 30 | 9 | 1 | 20 | C | Crit build lance. |
| **Horseslayer** | 7 | 70 | 0 | 13 | 1 | 18 | C | Effective vs cavalry (×3 might). |
| **Voss's Garrison Lance** | 9 | 85 | 5 | 9 | 1 | — | Prf | **Voss only**. Cannot break — infinite uses. The lance he held for 300 cycles. It's part of him. |

---

## Axes

Highest might, lowest accuracy. High-risk, high-reward.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Iron Axe** | 8 | 75 | 0 | 10 | 1 | 45 | E | Standard. Miss often. Hit hard. |
| **Steel Axe** | 11 | 65 | 0 | 15 | 1 | 30 | D | Very heavy. SPD penalty likely with low STR. |
| **Silver Axe** | 15 | 70 | 0 | 12 | 1 | 20 | A | Top-tier. Still sketchy accuracy. |
| **Hand Axe** | 7 | 60 | 0 | 12 | 1-2 | 20 | D | Ranged. Terrible hit but the flexibility is worth it. |
| **Killer Axe** | 11 | 65 | 30 | 11 | 1 | 20 | C | Crit axe. Terrifying if it connects. |
| **Hammer** | 10 | 55 | 0 | 15 | 1 | 20 | C | Effective vs armored (×3 might). Worst hit rate in the game. |
| **Brave Axe** | 10 | 65 | 0 | 16 | 1 | 30 | A | Double strike. Extremely heavy. |
| **Devil Axe** | 18 | 55 | 0 | 13 | 1 | 20 | E | Highest non-effective might in the game. 20% chance to hit YOURSELF instead. Low SYNC increases self-hit chance (+10% at SYNC <50%). |

---

## Fire Magic

Standard offensive magic. Attacks RES, not DEF.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Fire** | 5 | 90 | 0 | 4 | 1-2 | 40 | E | Basic fire tome. |
| **Elfire** | 10 | 85 | 0 | 8 | 1-2 | 30 | C | Mid-tier. Reliable. |
| **Bolganone** | 15 | 80 | 0 | 12 | 1-2 | 20 | A | Top-tier fire. Heavy for magic. |

## Thunder Magic

High crit, moderate accuracy. The "glass cannon" element.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Thunder** | 6 | 80 | 5 | 6 | 1-2 | 35 | E | Basic. Slight crit edge. |
| **Elthunder** | 9 | 75 | 10 | 10 | 1-2 | 25 | C | Good crit for a tome. |
| **Thoron** | 13 | 70 | 10 | 12 | 1-2 | 20 | A | High crit, lower hit. Risk/reward. |

## Wind Magic

High accuracy, low might. The safe option.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Wind** | 4 | 95 | 0 | 3 | 1-2 | 40 | E | Lightest tome. Almost always hits. |
| **Elwind** | 8 | 90 | 0 | 5 | 1-2 | 30 | C | Reliable. Good weight. |
| **Tornado** | 12 | 85 | 5 | 9 | 1-2 | 20 | A | Top wind. Best hit rate of any A-rank. |
| **Excalibur** | 14 | 90 | 10 | 7 | 1-2 | 25 | S | Effective vs flying (×3). Senna's endgame tome. |

---

## Staves

Healing/support. Cannot attack. Uses MAG for heal amount (MAG + staff might).

| Weapon | Might | Range | Uses | Rank | Effect |
|--------|-------|-------|------|------|--------|
| **Heal** | 10 | 1 | 30 | E | Basic heal. MAG + 10 HP restored. |
| **Mend** | 20 | 1 | 20 | C | Stronger heal. |
| **Recover** | 999 | 1 | 15 | B | Heal to full HP. |
| **Physic** | 10 | 1-5 | 15 | B | Ranged heal. Lower amount but safe positioning. |
| **Restore** | — | 1 | 10 | C | Cures all status effects (Poison, Daze, etc.). Does not heal HP. |
| **Barrier** | — | 1 | 15 | C | +7 RES for chapter on target ally. |
| **Purify** | — | 1 | 5 | A | -5 CRP on target. Lira's corruption cleanse. Rare. |

---

## Meta-Narrative Weapons

Unique weapons tied to the story's meta-awareness theme. Cannot be purchased.

| Weapon | Type | Might | Hit | Crit | Weight | Range | Uses | Owner | Effect |
|--------|------|-------|-----|------|--------|-------|------|-------|--------|
| **Debugger** | Sword | 7 | 100 | 0 | 3 | 1 | — | Ren (Ch4) | Deals bonus damage = target's CRP value. Higher CRP = more vulnerable. Infinite uses. Found when Senna "patches" Ren's weapon data. |
| **Memory Blade** | Sword | 1+LOOP/30 | 85 | 5 | 6 | 1 | — | Ren | Might scales with remaining LOOP. At 347 LOOP: 12 might. At 30 LOOP: 2 might. The weapon IS your memory. |
| **???'s Weapon** | Cycles | ??? | 80 | 10 | 8 | 1-2 | — | ???_CORRUPTED | Boss weapon. Type cycles each turn: sword→lance→axe→fire→thunder→wind. Triangle shifts every turn. |

---

## Weapon Ranks

Units gain weapon EXP by using weapons in combat. Higher rank = access to stronger weapons.

| Rank | Weapon EXP Required | Notable Weapons Unlocked |
|------|-------------------|------------------------|
| **E** | 0 (starting) | Iron weapons, basic tomes, Heal staff |
| **D** | 30 | Steel weapons, Javelin, Hand Axe |
| **C** | 70 | Killer weapons, effective weapons, Elfire/Elthunder/Elwind, Mend, Restore, Barrier |
| **B** | 120 | Recover, Physic |
| **A** | 180 | Silver weapons, Brave weapons, top-tier tomes, Purify |
| **S** | 250 | Excalibur, other S-rank (TBD) |
| **Prf** | — | Character-locked. No rank needed. |

### Weapon EXP Gain

| Action | WEXP Gained |
|--------|-----------|
| Attack with weapon (hit or miss) | +1 |
| Kill an enemy with weapon | +2 (total: +3 with attack) |
| Heal with staff | +1 |

### Weapon Proficiency Per Class

| Class | Weapons |
|-------|---------|
| **Lord** | Sword |
| **Cavalier** | Sword, Lance |
| **Mage** | Fire, Thunder, Wind |
| **Fighter** | Axe |
| **Cleric** | Staff |
| **Soldier** | Lance |

---

## Special Effects

### Effective Weapons (×3 Might)

| Weapon | Effective Against |
|--------|-----------------|
| Rapier | Cavalry, Armored |
| Armorslayer | Armored |
| Horseslayer | Cavalry |
| Hammer | Armored |
| Excalibur | Flying |

### Brave Weapons (Double Strike)

Brave Sword and Brave Axe attack **twice** per combat. If the unit is also fast enough to double, they attack **4 times total**. Brave weapons are heavy — the double attack offsets the SPD penalty.

### Devil Axe (Self-Damage Risk)

20% chance per attack to deal full damage to the wielder instead of the target. Low SYNC (<50%) increases this to 30%. High AWR units see a warning: "The axe feels... wrong."

---

## Weapon Design Philosophy

- **Swords**: Reliable. Best hit, moderate damage. Reward consistent play.
- **Lances**: Mid-range stats. Javelin gives flexibility. Mounted units' bread and butter.
- **Axes**: Gamble weapons. Miss often, but when they hit, things die. Axes reward high-SKL builds or crit stacking.
- **Magic**: Targets RES (usually low). 1-2 range is huge. Balanced by weight and fragile mage stats.
- **Staves**: No combat. Pure support. Cleric viability depends entirely on staff utility.
- **Triangle matters**: +15/+1 is significant. Positioning to exploit triangle advantage is a core tactical skill.
- **Weight is cosmetic (for now)**: Weight exists in data but no AS penalty is implemented. This is an Open Question in stats.md.

---

## Weapon Availability by Chapter

| Chapter | New Weapons |
|---------|-----------|
| Ch1 | Slim Sword, Iron Sword/Lance/Axe, Fire, Thunder, Wind, Heal, Rapier (Ren start) |
| Ch2 | Steel weapons, Javelin, Hand Axe, Killing Edge, Armorslayer, Horseslayer, Elfire, Elthunder, Elwind, Mend, Voss's Garrison Lance, Memory Blade |
| Ch3 | Silver Sword, Killer Lance/Axe, Brave Sword, Hammer, Bolganone, Thoron, Tornado, Recover, Physic, Restore, Barrier, Devil Axe, Purify |
| Ch4 | Brave Axe, Silver Lance/Axe, Excalibur, Debugger, ???'s Weapon (boss only) |

---

## Open Questions

- **Weapon durability**: Currently not implemented in code (all infinite uses). Should we add it? Durability adds resource management but can be tedious.
- **Weapon forging**: Should players be able to upgrade weapons (e.g., Iron Sword +1) at shops? Classic FE feature.
- **Light/Dark magic**: Only fire/thunder/wind exist. Should there be a separate light (Lira?) or dark (enemy?) magic type?
- **S-rank weapons**: Only Excalibur defined. Need more S-rank weapons per type.
- **Siege tomes**: Long-range (3-10) magic like Bolting/Meteor? Useful for Ch4 boss arena.
