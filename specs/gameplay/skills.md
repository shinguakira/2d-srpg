# Skills

Equippable abilities that modify combat, movement, or meta-stat interactions. Separate from **character passives** (innate, see [stats.md](stats.md)) — skills are learned and equipped.

---

## Equip Rules

- Each unit has up to **10 skill slots**.
- Slots unlock as the unit levels up: start with 2 slots, +1 slot every 3 levels (Lv1=2, Lv4=3, Lv7=4, Lv10=5, Lv13=6, Lv16=7, Lv19=8, promotion=10).
- Skills can be swapped freely during the preparation phase (before a chapter starts).
- Skills CANNOT be changed mid-chapter.
- A unit can only equip skills they have learned — skills are permanently added to a unit's skill pool once acquired.
- Character passives do NOT occupy skill slots.
- Trauma skills (auto-learned) occupy a slot and CANNOT be unequipped while active.

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

## Weapon Mastery Skills

One per weapon type. Flat +5 ATK bonus when attacking with that weapon type.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Swordfaire** | +5 ATK with swords | Swordmaster, Great Lord |
| **Lancefaire** | +5 ATK with lances | Halberdier, Falcon Knight |
| **Axefaire** | +5 ATK with axes | Berserker, Warrior |
| **Bowfaire** | +5 ATK with bows | Sniper |
| **Knifefaire** | +5 ATK with knives | Assassin |
| **Firefaire** | +5 ATK with fire magic | Sage (fire focus) |
| **Thunderfaire** | +5 ATK with thunder magic | Sage (thunder focus) |
| **Windfaire** | +5 ATK with wind magic | Sage (wind focus) |
| **Darkfaire** | +5 ATK with dark magic | Druid |
| **Lightfaire** | +5 ATK with light magic | Saint |
| **Stafffaire** | +5 healing with staves | Bishop |

---

## Class-Locked Skills (Base Classes)

Skills only learnable by specific base classes. Learned by leveling within that class.

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Locktouch** | Open chests/doors without Lockpick or Key. Innate. | Thief (always active, no slot) |
| **Steal** | Take consumable items from enemies. Uses action. | Thief Lv5+ |
| **Dance** | Grant adjacent acted ally another action. Uses your action. | Dancer (always active, no slot) |
| **Canto** | Move remaining MOV after acting. | Cavalier/Troubadour (always active, no slot) |
| **Seize** | Capture thrones/objectives to end chapters. | Lord (always active, no slot) |
| **Sure Shot** | +20 hit when attacking with bows. | Archer Lv8+ |
| **Blade Breaker** | Knife attacks have +50% debuff chance (30% → 45%). | Thief Lv10+ |
| **Fortitude** | +5 DEF when standing still (didn't move this turn). | Armor Knight Lv5+ |
| **Elusive** | +15 avoid when on a tile with no adjacent allies (lone wolf). | Mercenary Lv8+ |
| **Dark Pulse** | Dark attacks deal +3 damage to targets with CRP > 0. | Shaman Lv8+ |
| **Blessed** | Light attacks heal user for 3 HP on hit. | Monk Lv8+ |
| **Wind Rider** | +10 avoid vs ranged attacks while flying. | Pegasus Knight Lv8+ |
| **Dive** | +3 damage when initiating attack (not counterattacking). Flying only. | Wyvern Rider Lv8+ |
| **Mounted Heal** | +5 healing with staves when mounted. | Troubadour Lv8+ |

---

## Promotion-Locked Skills

Skills unlocked when promoting to a specific class. Learned automatically on promotion.

| Skill | Effect | Promoted Class |
|-------|--------|---------------|
| **Aether** | On hit (SKL/2%): Sol then Luna in sequence (heal then pierce). | Great Lord |
| **Conqueror's Aura** | +3 CHA aura radius. All aura bonuses doubled. | Conqueror |
| **Discipline** | Double weapon EXP gain. | Paladin |
| **Full Triangle** | +2 damage (instead of +1) from weapon triangle advantage. | Great Knight |
| **Tomefaire** | +3 ATK with all anima magic (fire/thunder/wind). | Sage |
| **Mounted Magic** | Can cast magic after moving (normally dismounted only). | Mage Knight |
| **Colossus** | On hit (STR%): push target 1 tile back. | Warrior |
| **Wrath+** | Crit +50% when HP ≤ 25% (replaces base Wrath). | Berserker |
| **Corona** | Light attacks blind target (-10 hit for 1 turn). | Bishop |
| **Canto+** | Canto but can also trade items after acting (before moving). | Valkyrie |
| **Great Shield** | Negate all damage from one attack per combat (DEF% activation). | General |
| **Quick Draw** | +4 ATK when initiating combat (not defending). | Halberdier |
| **Deadeye** | On attack (SKL/2%): guaranteed hit, ignoring avoid. Cannot miss. | Sniper |
| **Mounted Archer** | Can attack after moving on horseback. Bow + Canto. | Nomad Trooper |
| **Silencer** | Lethality activation rate increased to SKL% (from SKL/2%). | Assassin |
| **Steal+** | Can steal weapons (not just items). | Rogue |
| **Stun** | Lance attacks have 15% chance to prevent target from counterattacking. | Falcon Knight |
| **Shadowgift** | Can use dark magic regardless of class weapon restrictions. | Dark Flier |
| **Savage Blow** | After combat, enemies within 2 tiles of target take 5 damage. | Wyvern Lord |
| **Lifetaker** | Heal 20% max HP after killing an enemy. | Malig Knight |
| **Demoiselle** | Male allies within 2 tiles take -2 damage received. | Maid |
| **Sol+** | Sol activation always heals 100% of damage dealt (up from 50%). | Hero |
| **Astra+** | Astra deals 75% damage per hit (up from 50%). | Swordmaster |
| **Venomous** | Dark attacks inflict Poison (5 HP/turn for 2 turns). | Druid |
| **Phantom Summon** | Summon a phantom unit (10 HP, 5 all stats, 1 per map). | Summoner |
| **Renewal+** | Heal 20% max HP per turn (up from 10%). | Saint |
| **Brawler** | Can counterattack at any range when unequipped (fist attack, 5 might). | War Monk |
| **Armored March** | +1 MOV if adjacent to another armored/mounted ally. | General (Armor Knight path) |

---

## Additional Combat Skills

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Nihil** | Negate all enemy skills during combat (both offensive and defensive). | Level 15+ any promoted class |
| **Resolve** | When HP ≤ 50%: +7 STR, +7 SPD, +7 DEF. | Level 12+ Fighter or Soldier |
| **Quick Riposte** | When defending at HP ≥ 70%, guaranteed follow-up attack (regardless of SPD). | Level 12+ Mercenary or Soldier |
| **Swordbreaker** | +50 hit and +50 avoid vs sword users. | Level 10+ any lance class |
| **Lancebreaker** | +50 hit and +50 avoid vs lance users. | Level 10+ any axe class |
| **Axebreaker** | +50 hit and +50 avoid vs axe users. | Level 10+ any sword class |
| **Bowbreaker** | +50 hit and +50 avoid vs bow users. | Level 10+ any magic class |
| **Seal STR** | After combat, enemy STR -6 for 1 turn. | Level 10+ any class |
| **Seal SPD** | After combat, enemy SPD -6 for 1 turn. | Level 10+ any class |
| **Seal DEF** | After combat, enemy DEF -6 for 1 turn. | Level 10+ any class |
| **Desperation** | When HP ≤ 50%, all follow-up attacks happen before enemy can counter. | Level 12+ Pegasus Knight or Mage |
| **Wary Fighter** | Cannot double or be doubled. Removes doubling from both sides. | Level 10+ Armor Knight or Soldier |
| **Vengeance** (skill) | Bonus damage = (max HP - current HP)/2. Scales with missing health. | Level 12+ any physical class |
| **Death Blow** | +6 ATK when initiating combat. | Level 15+ Fighter or Mercenary |
| **Darting Blow** | +6 SPD when initiating combat. | Level 15+ Pegasus Knight or Thief |

---

## Additional Movement Skills

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Galeforce** | After killing an enemy, take another full action (move + act). Once per turn. | Level 15+ Falcon Knight |
| **Reposition** | Move an adjacent ally to the opposite side of you. Free action. | Level 8+ Cavalier or Armor Knight |
| **Draw Back** | Pull an adjacent ally 1 tile toward you, then move 1 tile back. Free action. | Level 8+ Archer or Thief |
| **Pivot** | Move to the opposite side of an adjacent ally. Free action. | Level 8+ any class |
| **Wings of Mercy** | Warp to any ally with HP ≤ 50%. Uses your action. | Level 12+ Cleric or Troubadour |
| **Escape Route** | When HP ≤ 50%, can warp to any ally. Uses your action. | Level 12+ Thief or Pegasus Knight |
| **Smite** | Push an adjacent ally 2 tiles in the facing direction. Free action. | Level 10+ Fighter or Armor Knight |
| **Lunge** | After combat, swap positions with the target. | Level 10+ Wyvern Rider |

---

## Additional Support Skills

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Rally DEF** | Adjacent allies gain +4 DEF until next turn. Uses action. | Level 8+ Soldier or Armor Knight |
| **Rally RES** | Adjacent allies gain +4 RES until next turn. Uses action. | Level 8+ Cleric or Monk |
| **Rally Spectrum** | Adjacent allies gain +2 all stats until next turn. Uses action. | Level 15+ any promoted support class |
| **Fortify** (skill) | Heal all allies within 3 tiles for 10 HP. Uses action. Once per chapter. | Level 12+ Bishop or Saint |
| **Rescue** | Pull a distant ally (within MOV range) to an adjacent tile. Uses action. | Level 10+ Cleric, Troubadour, or Pegasus Knight |
| **Dual Guard** | Adjacent ally has 10% chance to negate all damage from one attack. | Level 10+ any class with support rank B+ |
| **Live to Serve** | When healing an ally with a staff, also heal yourself for 50% of the amount. | Level 8+ Cleric or Troubadour |
| **Demoiselle/Gentilhomme** | Allies of opposite gender within 2 tiles receive -2 damage. | Level 10+ Troubadour/any class |

---

## Additional Meta Skills

| Skill | Effect | Acquisition |
|-------|--------|------------|
| **Data Drain** | On kill, steal 1 point of the enemy's highest stat permanently. Max 5 uses per chapter. | AWR 80+ |
| **System Override** | Once per chapter, force one RNG roll to succeed (100% hit/crit). +5 CRP. | AWR 90+ AND SYNC < 70% |
| **Cycle Memory+** | LOOP abilities cost 20% less (rounded down). | LOOP 200+ |
| **Stability Field** | Allies within 2 tiles gain +10% SYNC per turn. | SYNC 90+ |
| **Loyalty Shield** | When LOY > 80, automatically take a lethal hit for an adjacent ally. LOY% chance. Once per chapter. | LOY 80+ |
| **Corruption Armor** | CRP stops increasing at 50 (instead of continuing to 100). Cannot be corrupted. | CRP 40+ AND WIL 12+ |
| **Fatigue Resist** | STA thresholds increase by 10 each (Winded at 25 instead of 15, etc.). | Level 10+ any class with STA rate < 1.0 |
| **System Exploit** | On glitched tiles, gain +5 all stats instead of CRP. | AWR 60+ AND SYNC 70+ |
| **Loop Break** | When an ally would die, spend 20 LOOP to rewind and prevent the death. Once per chapter. Ren only. | LOOP 100+ (Ren exclusive) |
| **Entropy** | Each turn, a random enemy within 5 tiles loses 1 random stat point. Uncontrollable. | CRP 30+ AND SYNC < 40% |

---

## Corruption Skills

Powerful abilities unlocked at high CRP. Risky — using them increases CRP further.

| Skill | Effect | CRP Cost/Turn | Acquisition |
|-------|--------|--------------|------------|
| **Corrupted Strike** | +50% damage dealt. +3 CRP per use. | +3 per attack | CRP 20+ |
| **Void Shield** | Negate one attack per turn. +2 CRP per activation. | +2 per block | CRP 30+ |
| **Data Overflow** | All stats +5 for 1 turn. +5 CRP. Can only use every 3 turns. | +5 per use | CRP 40+ |
| **Entropy Blade** | Attacks deal bonus damage = user's CRP value. The more corrupted you are, the harder you hit. | — (passive) | CRP 50+ |
| **Glitch Walk** | Teleport to any glitched tile on the map. +2 CRP. | +2 per use | CRP 25+ |
| **Corrupted Heal** | Heal 50% max HP. +8 CRP. Desperate self-sustain. | +8 per use | CRP 35+ |

---

## Master Class Skills (Innate)

These skills are automatically equipped when promoting to a master class. They do NOT occupy a skill slot.

| Skill | Effect | Master Class |
|-------|--------|-------------|
| **Cycle Authority** | All allies within 3 tiles gain +3 all stats. | Overlord (Ren only) |
| **Tri-Magic** | No magic triangle disadvantage. | Archsage |
| **Ironwall** | Cannot be pushed. Reduce all damage by 3 (flat). | Marshal |
| **Bloodlust** | Always heal 30% of damage dealt. No activation roll. | Reaver |
| **Divine Wings** | Immune to bow/wind effective damage. | Seraph |
| **Terror Aura** | Enemies within 2 tiles: -5 hit/avoid. | Dragon Lord |
| **Vanish** | After attacking, cannot be targeted until next turn. | Phantom |
| **Balance** | Light + Dark bonuses stack. Anti-corruption on all spells. | Oracle |

---

## Skill Count Summary

| Category | Count |
|----------|-------|
| Combat Skills (base) | 11 |
| Additional Combat | 15 |
| Movement Skills (base) | 5 |
| Additional Movement | 8 |
| Support Skills (base) | 7 |
| Additional Support | 8 |
| Meta Skills (base) | 10 |
| Additional Meta | 10 |
| Weapon Mastery | 11 |
| Class-Locked (base) | 14 |
| Promotion-Locked | 28 |
| Corruption Skills | 6 |
| Master Class (innate) | 8 |
| Trauma Skills | 6 |
| **Total** | **~147** |

---

## Open Questions

- **Skill inheritance on death**: If a unit with learned skills dies, are those skills lost forever? Or can Ren remember them via LOOP for future teaching? → Recommendation: Ren can spend 5 LOOP to "remember" a dead ally's skill, adding it to his teaching pool.
- **Enemy skills**: Boss enemies should have 2-3 equippable skills visible in the combat forecast. Regular enemies: 0-1 skills.
- **Skill scrolls**: Consumable items that teach one skill. Found in treasure chests or bought in Arc 4+ shops. 1-2 per chapter.
- **Skill capacity**: 147 skills with 10 slots per unit across 20 characters. Average unit will have access to ~15-25 skills and must choose 10. This creates meaningful build variety.
- **Balance concern**: Galeforce + Dance is extremely powerful (kill → Galeforce → Dance → kill again). Should Galeforce not trigger if the unit was Danced?
