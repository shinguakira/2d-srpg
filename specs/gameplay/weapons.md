# Weapons

All weapon definitions, stat blocks, and special effects. Staves are included here as they follow the same data structure.

See [stats.md](stats.md) for combat formulas (ATK, hit rate, crit, weapon triangle).
See [items.md](items.md) for consumable items.

---

## Weapon Stats

| Field | Description |
|-------|------------|
| **Type** | sword, lance, axe, bow, knife, fire, thunder, wind, dark, light, staff |
| **Might** | Base damage added to STR (physical) or MAG (magic/staff) |
| **Hit** | Base accuracy added to SKL formula |
| **Crit** | Base crit chance added to SKL/2 |
| **Weight** | Currently unused in combat. Reserved for future AS calculation. |
| **Range** | Min-Max attack range in tiles |
| **Uses** | Durability. Weapon breaks at 0. (Currently not implemented in code — all weapons infinite.) |
| **Rank** | Weapon proficiency required (E/D/C/B/A/S). See Weapon Ranks below. |

---

## Weapon Triangle

### Physical Triangle
```
Sword > Axe > Lance > Sword
```

### Anima Magic Triangle
```
Fire > Wind > Thunder > Fire
```

### Dark/Light Interaction
```
Light is effective vs Dark (×2 might, not ×3)
Dark has no triangle advantage/disadvantage — it exists OUTSIDE the system
```

| Matchup | Hit Mod | Damage Mod |
|---------|---------|------------|
| Advantage | +15 hit | +1 damage |
| Disadvantage | -15 hit | -1 damage |
| Neutral / cross-type | 0 | 0 |
| Light vs Dark | +10 hit | effective (×2 might) |

- Physical vs Magic: no triangle interaction.
- Staves: non-combat, no triangle.
- Bows: no triangle. 2-range only. Effective vs flying (×3 might).
- Knives: no triangle. 1-2 range. Debuff effects on hit.

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

## Bows

Ranged physical. 2-range only — cannot attack adjacent or counterattack at melee. Effective vs flying (×3 might).

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Iron Bow** | 6 | 85 | 0 | 5 | 2 | 45 | E | Standard. Solid ranged physical. |
| **Steel Bow** | 9 | 75 | 0 | 9 | 2 | 30 | D | Stronger, heavier. |
| **Silver Bow** | 13 | 80 | 0 | 6 | 2 | 20 | A | Top-tier bow. Good balance. |
| **Killer Bow** | 9 | 75 | 30 | 7 | 2 | 20 | C | Crit bow. Sniper + Killer Bow = death machine. |
| **Longbow** | 5 | 65 | 0 | 10 | 2-3 | 20 | D | Extended range. Low accuracy/might but safe. |
| **Brave Bow** | 7 | 70 | 0 | 10 | 2 | 30 | A | Double strike at range. Devastating with doubling. |
| **Nira's Sightbow** | 8 | 95 | 10 | 4 | 2 | — | Prf | **Nira only**. Highest hit rate of any bow. Infinite uses. |

---

## Knives

Low might, high speed, debuff on hit. 1-2 range. No triangle interaction.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Iron Knife** | 3 | 95 | 5 | 3 | 1-2 | 40 | E | Light, accurate, weak. The utility weapon. |
| **Steel Knife** | 5 | 90 | 5 | 5 | 1-2 | 30 | D | Slightly stronger. Still light. |
| **Silver Knife** | 9 | 85 | 5 | 4 | 1-2 | 20 | A | Top-tier. Best knife might. |
| **Poison Dagger** | 4 | 85 | 0 | 4 | 1-2 | 15 | C | Inflicts Poison status on hit (5 HP/turn). |
| **Stiletto** | 6 | 80 | 30 | 3 | 1 | 15 | B | Melee only. Highest crit for a knife. Assassin's tool. |
| **Wind Knife** | 3 | 100 | 0 | 2 | 1-2 | 25 | C | Lightest weapon in game. 100 hit. For guaranteed chip damage. |
| **Coda's Data Knife** | 5 | 95 | 10 | 2 | 1-2 | — | Prf | **Coda only**. Steal +1 WEXP on hit. Infinite uses. "Extracting data." |

### Knife Debuff Effects

All knives (except Prf) have a 30% chance to apply a debuff on hit:

| Knife | Debuff | Duration |
|-------|--------|----------|
| Iron/Steel/Silver | SPD -3 | 1 turn |
| Poison Dagger | Poison (5 HP/turn) | Until cured |
| Stiletto | DEF -5 | 1 turn |
| Wind Knife | No debuff | — |

---

## Dark Magic

Outside the triangle. HP drain mechanics. Targets RES. For Shaman/Druid and enemy Dark Mages.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Flux** | 7 | 80 | 0 | 8 | 1-2 | 40 | E | Basic dark tome. Reliable. |
| **Nosferatu** | 6 | 70 | 0 | 10 | 1-2 | 20 | D | **Heals user HP = damage dealt.** Sustain weapon. Lower accuracy. |
| **Luna** (dark) | 5 | 85 | 0 | 6 | 1-2 | 20 | C | Ignore 50% of enemy RES. Shreds high-RES targets. |
| **Fenrir** | 12 | 70 | 0 | 14 | 1-2 | 15 | A | Heaviest tome. Highest dark might. Very slow. |
| **Eclipse** | 1 | 50 | 0 | 12 | 3-10 | 5 | S | **Halves target's current HP.** Siege range. Cannot kill (min 1 HP). The softener. |
| **Kira's Abyss** | 8 | 85 | 5 | 7 | 1-2 | — | Prf | **Kira only**. Heals 25% damage dealt. -1 CRP per kill. Infinite uses. |

### Dark Magic Rules

- No triangle advantage or disadvantage against anima magic (fire/thunder/wind)
- Light magic is effective against dark (×2 might)
- Dark magic can spread CRP: 10% chance per hit to inflict +1 CRP on target (dark mages only, not player units with dark tomes — they've learned to control it)
- Nosferatu drain: heals user for 100% of damage dealt. Does not exceed max HP.

---

## Light Magic

Effective vs dark enemies and corrupted units. Some heal the user on hit. Targets RES.

| Weapon | Might | Hit | Crit | Weight | Range | Uses | Rank | Notes |
|--------|-------|-----|------|--------|-------|------|------|-------|
| **Lightning** | 4 | 95 | 5 | 4 | 1-2 | 40 | E | Basic light tome. High accuracy. |
| **Shine** | 8 | 90 | 0 | 6 | 1-2 | 30 | C | Mid-tier. Reliable. |
| **Divine** | 12 | 85 | 5 | 9 | 1-2 | 20 | A | Top-tier light. Good all-around. |
| **Aura** | 15 | 80 | 0 | 12 | 1-2 | 15 | S | Highest light might. Heals user 5 HP on hit. |
| **Purge** | 8 | 75 | 0 | 10 | 3-5 | 10 | B | Ranged light. Siege option. Lower accuracy at range. |
| **Elara's Radiance** | 10 | 90 | 10 | 5 | 1-2 | — | Prf | **Elara only**. Reduces target CRP by 2 on hit. Infinite uses. |

### Light Magic Rules

- Effective vs dark enemies: ×2 might (not ×3 — dark is a faction, not a weakness type)
- Effective vs corrupted units: ×2 might (corrupted data is vulnerable to "clean" magic)
- Light attacks reduce target CRP by 1 on hit (all light tomes, stacks)
- Light tomes heal user on hit: Aura heals 5 HP, others heal 0 (except Prf)

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

### Weapon Proficiency Per Class (Base)

| Class | Weapons |
|-------|---------|
| **Lord** | Sword |
| **Cavalier** | Sword, Lance |
| **Mage** | Fire, Thunder, Wind |
| **Fighter** | Axe |
| **Cleric** | Staff |
| **Soldier** | Lance |
| **Archer** | Bow |
| **Thief** | Knife |
| **Pegasus Knight** | Lance |
| **Wyvern Rider** | Axe, Lance |
| **Troubadour** | Staff |
| **Mercenary** | Sword |
| **Shaman** | Dark |
| **Monk** | Light |
| **Dancer** | — (none) |
| **Armor Knight** | Lance |
| **System Construct** | Any (one at a time) |

See [classes-expanded.md](classes-expanded.md) for promoted class weapon additions.

---

## Special Effects

### Effective Weapons

| Weapon | Effective Against | Multiplier |
|--------|-----------------|-----------|
| Rapier | Cavalry, Armored | ×3 might |
| Armorslayer | Armored | ×3 might |
| Horseslayer | Cavalry | ×3 might |
| Hammer | Armored | ×3 might |
| Excalibur | Flying | ×3 might |
| All Bows | Flying | ×3 might |
| All Light magic | Dark enemies, Corrupted | ×2 might |

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

## S-Rank Weapons

One S-rank weapon per weapon type. The strongest non-Prf weapons in the game. Available Arc 4-5.

| Weapon | Type | Might | Hit | Crit | Weight | Range | Uses | Effect |
|--------|------|-------|-----|------|--------|-------|------|--------|
| **Ragnell** | Sword | 15 | 85 | 5 | 9 | 1-2 | 20 | Ranged sword. The only 1-2 range non-magic melee weapon at S-rank. |
| **Rex Hasta** | Lance | 16 | 80 | 0 | 10 | 1 | 20 | Highest lance might. +3 DEF while equipped. |
| **Tomahawk** | Axe | 14 | 65 | 10 | 14 | 1-2 | 15 | Ranged axe. Terrifying if it hits. |
| **Yoichi Bow** | Bow | 14 | 85 | 10 | 8 | 2-3 | 15 | Extended range + crit. Sniper's dream. |
| **Kard** | Knife | 10 | 90 | 15 | 3 | 1-2 | 15 | Highest knife might + crit. Guaranteed debuff (SPD -5). |
| **Excalibur** | Wind | 14 | 90 | 10 | 7 | 1-2 | 25 | Effective vs flying (×3). Best accuracy for S-rank magic. |
| **Valflame** | Fire | 17 | 80 | 5 | 14 | 1-2 | 15 | Highest fire might. Burns through everything. |
| **Mjölnir** | Thunder | 15 | 75 | 15 | 12 | 1-2 | 15 | Highest crit of any tome. The lottery ticket. |
| **Eclipse** | Dark | 1 | 50 | 0 | 12 | 3-10 | 5 | Halves target HP. Siege range. Cannot kill. (Also listed in Dark Magic.) |
| **Aura** | Light | 15 | 80 | 0 | 12 | 1-2 | 15 | Highest light might. Heals 5 HP on hit. (Also listed in Light Magic.) |
| **Fortify** | Staff | — | 1-∞ | — | 12 | All allies | 5 | Heals ALL allies on the map for MAG/2 HP. |

---

## Legendary Weapons (1 Per Arc)

Story-gated Prf weapons found at key narrative moments. Cannot be forged. Infinite uses.

| Weapon | Type | Arc | Might | Hit | Crit | Range | Owner | Effect |
|--------|------|-----|-------|-----|------|-------|-------|--------|
| **Memory Blade** | Sword | 1 | 1+LOOP/30 | 85 | 5 | 1 | Ren | Might scales with LOOP. At 347: 12 might. At 30: 2 might. |
| **Cycle Breaker** | Bow | 2 | 10 | 90 | 10 | 2-3 | Nira | 3-range bow. +5 damage vs enemies with AWR > 50. |
| **Debugger** | Sword | 3 | 7 | 100 | 0 | 1 | Ren | Bonus damage = target's CRP value. (Moved from Ch4 to Ch15 — Senna patches it mid-Arc 3.) |
| **Void Render** | Axe | 4 | 14 | 70 | 20 | 1 | Bram | Deals true damage (ignores DEF) on crit. Found in System's memory. |
| **Echo's Interface** | Any | 5 | 12 | 85 | 5 | 1-2 | Echo | Type matches equipped class. Deals bonus damage = user's SYNC%. |

---

## Weapon Availability by Arc

### Arc 1 (Ch1-5) — Iron Tier
| Type | Available Weapons |
|------|------------------|
| Sword | Slim Sword, Iron Sword, Rapier (Ren Prf), Memory Blade (Ren Prf) |
| Lance | Iron Lance, Voss's Garrison Lance (Prf) |
| Axe | Iron Axe |
| Bow | Iron Bow, Nira's Sightbow (Prf) |
| Knife | Iron Knife, Coda's Data Knife (Prf) |
| Fire | Fire |
| Thunder | Thunder |
| Wind | Wind |
| Staff | Heal |

### Arc 2 (Ch6-10) — Steel Tier
| Type | New Additions |
|------|--------------|
| Sword | Steel Sword, Killing Edge, Armorslayer |
| Lance | Steel Lance, Javelin, Horseslayer |
| Axe | Steel Axe, Hand Axe, Devil Axe |
| Bow | Steel Bow, Longbow, Killer Bow, Cycle Breaker (Nira Prf) |
| Knife | Steel Knife, Poison Dagger |
| Fire | Elfire |
| Thunder | Elthunder |
| Wind | Elwind |
| Dark | Flux, Nosferatu |
| Light | Lightning |
| Staff | Mend, Restore |

### Arc 3 (Ch11-15) — Killer Tier
| Type | New Additions |
|------|--------------|
| Sword | Debugger (Ren Prf) |
| Lance | Killer Lance |
| Axe | Killer Axe, Hammer |
| Bow | — |
| Knife | Wind Knife, Stiletto |
| Fire | Bolganone |
| Thunder | Thoron |
| Wind | Tornado |
| Dark | Luna (dark), Kira's Abyss (Prf) |
| Light | Shine, Divine, Purge, Elara's Radiance (Prf) |
| Staff | Physic, Barrier, Purify |
| Forging | Iron/Steel weapons can be forged |

### Arc 4 (Ch16-20) — Silver/Brave Tier
| Type | New Additions |
|------|--------------|
| Sword | Silver Sword, Brave Sword |
| Lance | Silver Lance |
| Axe | Silver Axe, Brave Axe, Void Render (Bram Prf) |
| Bow | Silver Bow, Brave Bow |
| Knife | Silver Knife |
| Fire | Valflame (S-rank) |
| Thunder | Mjölnir (S-rank) |
| Wind | — |
| Dark | Fenrir |
| Light | Aura (S-rank) |
| Staff | Recover |
| Forging | Silver weapons can be forged, +2 tier unlocked |

### Arc 5 (Ch21-25) — Endgame
| Type | New Additions |
|------|--------------|
| Sword | Ragnell (S-rank) |
| Lance | Rex Hasta (S-rank) |
| Axe | Tomahawk (S-rank) |
| Bow | Yoichi Bow (S-rank) |
| Knife | Kard (S-rank) |
| Wind | Excalibur (S-rank) |
| Dark | Eclipse (S-rank) |
| Staff | Fortify (S-rank) |
| Special | Echo's Interface (Prf), ???'s Weapon (boss only) |
| Forging | +3 tier unlocked |

---

## Open Questions

- **Weapon durability**: Currently not implemented in code (all infinite uses). Should we add it? Durability adds resource management but can be tedious. Recommendation: keep infinite for Prf, add durability for everything else.
- **Siege tomes**: Eclipse (dark S-rank) has 3-10 range. Should Bolting (thunder, 3-10) and Meteor (fire, 3-10) exist? Useful for big maps in Arc 4-5.
- **Knife triangle**: Should knives have a triangle relationship with anything? Currently neutral to all.
- **Dark CRP spread**: Should player-used dark tomes also have the 10% CRP spread chance? Currently enemy-only.
- **Ragnell 1-2 range**: A 1-2 range sword at S-rank is very strong. Should it have reduced stats at 2-range?
