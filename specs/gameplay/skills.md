# Skills

Equippable abilities that modify combat, movement, or meta-stat interactions. Separate from **character passives** (innate, see [stats.md](stats.md)) — skills are learned and equipped.

---

## Equip Rules

- Each unit has **2 skill slots**.
- Skills can be swapped freely during the preparation phase (before a chapter starts).
- Skills CANNOT be changed mid-chapter.
- A unit can only equip skills they have learned — skills are permanently added to a unit's skill pool once acquired.
- Character passives do NOT occupy skill slots.

---

## Skill Categories

### Combat Skills

Direct combat modifiers — trigger during attack, defense, or counterattack.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Vantage** | When HP ≤ 50%, always attack first when defending (even if enemy initiated). | Level 10+ any physical class |
| **Wrath** | When HP ≤ 50%, crit rate +30%. | Level 12+ Fighter |
| **Pursuit** | Double attack threshold lowered from 5 SPD to 3 SPD. | Level 8+ Cavalier |
| **Adept** | 20% chance (based on SPD) to immediately follow up with a bonus attack. | Level 10+ Lord |
| **Counter** | When attacked at melee range and surviving, reflect 50% of damage taken back to attacker. | Level 12+ Soldier |
| **Aegis** | SKL% chance to halve magic damage received. | Level 10+ any class |
| **Pavise** | SKL% chance to halve physical damage received. | Level 10+ Soldier or Cavalier |
| **Lethality** | SKL/2 % chance to instantly kill the target (ignores HP). Does not work on bosses. | Level 15+ Lord |
| **Sol** | On hit, heal HP equal to 50% of damage dealt. SKL% activation. | Level 12+ Cavalier |
| **Luna** | On hit, ignore 50% of enemy DEF/RES. SKL% activation. | Level 12+ any class |
| **Astra** | 20% chance to attack 5 times at half damage each. | Level 15+ Lord, Mage |

### Movement Skills

Affect movement and positioning.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Canto** | After attacking/acting, use remaining MOV to continue moving. | Cavalier class innate (always active, no slot needed) |
| **Pass** | Move through enemy-occupied tiles. | Level 10+ any class |
| **Shove** | Push an adjacent ally 1 tile in the direction you're facing. Free action (before your main action). | Level 5+ Fighter |
| **Swap** | Switch positions with an adjacent ally. Uses your action. | Level 5+ any class |
| **Warp Step** | Once per chapter, teleport to any tile within MOV×2 range. Costs 10 STA. | AWR 60+ |

### Support Skills

Buff allies, heal, or provide utility.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Rally STR** | Adjacent allies gain +4 STR until next turn. Uses your action. | Level 8+ Fighter |
| **Rally SPD** | Adjacent allies gain +4 SPD until next turn. Uses your action. | Level 8+ Lord or Cavalier |
| **Rally MAG** | Adjacent allies gain +4 MAG until next turn. Uses your action. | Level 8+ Mage |
| **Miracle** | When HP > 1, survive a lethal hit at 1 HP. LCK% activation. Once per chapter. | Level 10+ Cleric |
| **Renewal** | Heal 10% max HP at the start of each turn. | Level 10+ Cleric |
| **Charm** | All allies within 3 tiles gain +5 hit and +5 avoid. | CHA 8+ |
| **Inspiration** | All allies within 2 tiles gain +3 all combat stats for 1 turn after this unit kills an enemy. | LOY 80+ with any ally |

### Meta Skills

Unique to this game — interact with AWR, LOOP, SYNC, LOY, CRP, STA.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **System Sight** | See all enemy stats, AI types, and movement ranges regardless of AWR level. | AWR 50+ |
| **Corruption Resist** | CRP gain halved from all sources. | SYNC 80+ |
| **Iron Body** | STA accumulation reduced by 30%. | Kael passive or Level 12+ Soldier |
| **Defrag** | At chapter start, reduce own CRP by 3. | AWR 40+ AND SYNC 60+ |
| **Memory Leech** | When killing an enemy, gain +3 LOOP. | AWR 70+ |
| **Glitch Strike** | 15% chance per attack to randomize the target's stats for 1 turn (each stat rerolled ±3). Only activates if user SYNC < 50%. | SYNC < 50% (chaos skill) |
| **Data Echo** | After being healed, the healing effect repeats at 50% strength at the start of next turn. | LOOP 50+ |
| **Paranoia** | +5 avoid, -3 LOY per chapter. Constant unease keeps you alive but erodes trust. | AWR 80+ AND LOY < 50 |
| **Unbreakable** | Cannot be reduced below 1 HP by CRP stat drain effects. | WIL 10+ |
| **Overclock** | Once per chapter, take 2 actions in one turn. +15 STA afterwards. | LOOP 100+ |

### Trauma Skills (Mental Status)

Skills that represent psychological effects — the trauma system lives here, not as a stat.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Survivor's Guilt** | +10% damage dealt, -5 avoid. Permanent after an ally dies in your presence. | Auto-learned: ally dies within 3 tiles |
| **Vengeance** | Bonus damage = (max HP - current HP). The more hurt you are, the harder you hit. | Auto-learned: survive at ≤10% HP twice |
| **Numb** | Immune to LOY changes (positive and negative). Cannot benefit from CHA aura. Emotionally shut down. | Auto-learned: 3+ allies die across the campaign |
| **Flashback** | 10% chance per turn to freeze (lose action). Triggers when attacking same class as a dead ally. -5% per point of WIL. | Auto-learned: specific ally dies (Kael → vs lancers, etc.) |
| **Last Stand** | When only 2 or fewer allies remain on the map, +10 all combat stats. | Auto-learned: survive a chapter where 2+ allies died |
| **Grief** | -3 all stats for 2 chapters after an ally's death. Cannot be unequipped during this period. Fades naturally. | Auto-learned: Kael dies (ALL party members) |

---

## Ren's Teaching (LOOP Transfer)

Ren can spend LOOP to teach skills from past cycles to allies during preparation phase.

| Cost | Effect |
|------|--------|
| 10 LOOP | Teach one combat skill (from Ren's learned pool) to an adjacent ally. Permanent. |
| 15 LOOP | Teach one meta skill. The memory transfer is harder — requires deeper LOOP investment. |
| 5 LOOP | Teach one movement skill. Physical memory is the easiest to transfer. |

### Teaching Restrictions

- Ren can only teach skills HE has learned.
- An ally cannot learn a skill that requires a stat threshold they don't meet (e.g., can't learn AWR 70+ skill if their AWR is 30).
- Teaching costs +2 CRP to both Ren and the student — memory transfer introduces data instability.
- Teaching costs +5 STA to Ren at chapter start (the preparation effort carries over).
- Ren cannot teach Trauma Skills — those must be experienced firsthand.

---

## Skill × Time-of-Day Interactions

| Skill | Time Interaction |
|-------|-----------------|
| **Vantage** | At Night, threshold raised to HP ≤ 75% (darkness favors ambushes). |
| **System Sight** | At Night, also reveals hidden enemies in fog of war. |
| **Glitch Strike** | At Night, activation rate +5% (system instability increases in darkness). |
| **Renewal** | At Dawn, heals 15% instead of 10% (morning recovery boost). |

---

## Open Questions

- **Skill inheritance on death**: If a unit with learned skills dies, are those skills lost forever? Or can Ren remember them via LOOP for future teaching?
- **Enemy skills**: Do boss enemies have equippable skills? Or only innate passives?
- **Promotion skills**: Should class promotion unlock exclusive skills?
- **Skill scrolls**: Should there be consumable items that teach skills (like FE skill scrolls)?
