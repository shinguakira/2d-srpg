# Classes — Expanded (25-Chapter Scale)

All classes for the full 25-chapter campaign: 16 base classes, ~24 promoted classes, 8 master classes. Three-tier progression: **Base (Lv1-15) → Promoted (Lv15+) → Master (Lv30+)**.

For existing 6 base classes (Lord, Cavalier, Mage, Fighter, Cleric, Soldier), see [classes.md](classes.md). This file covers new base classes and ALL promoted/master classes.

See [promotion.md](promotion.md) for promotion mechanics and item requirements.

---

## New Base Classes (10)

### Archer
Nira's class. Ranged physical damage. Bows only — 2-range, no melee counter.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 18 | 5 | 0 | 4 | 2 | 7 | 7 | 5 | 3 | 3 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 65 | 40 | 0 | 20 | 20 | 45 | 50 | 35 | 20 | 25 |

- **Bow-locked**: 2-range only. Cannot counterattack at melee range. Effective vs flying.
- **Highest SKL**: 50% growth. The accuracy specialist — never misses, crits often.
- **Weakness**: Melee-vulnerable. If an enemy reaches her, she can't fight back. Low bulk.

### Thief
Coda's class. Utility specialist. Knives + Lockpick + Steal.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 17 | 4 | 0 | 3 | 2 | 9 | 6 | 8 | 3 | 3 | 6 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 55 | 25 | 0 | 15 | 15 | 60 | 40 | 45 | 15 | 20 |

- **Knife**: 1-2 range, low might, high crit, can debuff on hit.
- **Lockpick**: Open chests and doors without consuming a key item.
- **Steal**: Take consumable items from enemies (not weapons). Uses action.
- **6 MOV**: High base mobility. Gets in, gets out.
- **Weakness**: Lowest combat stats. Cannot trade blows — hit-and-run only.

### Pegasus Knight
Yuel's class. Flying lance user. High mobility, mage-killer.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 17 | 5 | 2 | 4 | 6 | 8 | 6 | 7 | 4 | 3 | 7 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 55 | 30 | 15 | 20 | 40 | 50 | 35 | 40 | 30 | 25 |

- **Flying**: Ignores terrain movement cost. Can cross water/mountains. Immune to terrain bonuses (no DEF/avoid from terrain while flying).
- **Lance-locked**: Standard lances. Javelin for 1-2 range.
- **7 MOV flying**: The most mobile unit in the game. Reaches anywhere.
- **Weakness**: Bows deal effective damage (×3 might). Wind magic (Excalibur) also effective. Low HP/DEF.

### Wyvern Rider
Zael's class. Flying heavy attacker. Axe + lance.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 22 | 8 | 0 | 7 | 0 | 5 | 5 | 3 | 2 | 4 | 7 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 75 | 50 | 0 | 35 | 5 | 25 | 25 | 20 | 15 | 30 |

- **Flying**: Same as Pegasus Knight — ignores terrain, no terrain bonuses.
- **Axe + Lance**: Full physical triangle coverage.
- **7 MOV flying**: High mobility + high STR = devastating hit-and-run.
- **Weakness**: Bows effective (×3). Very low RES (0 base, 5% growth). Mages and archers destroy Wyvern Riders.

### Troubadour
Faye's class. Mounted healer. Staff only until promotion.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 16 | 1 | 5 | 3 | 5 | 6 | 4 | 6 | 5 | 2 | 7 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 50 | 5 | 40 | 15 | 40 | 35 | 25 | 45 | 35 | 15 |

- **Staff only**: Cannot attack. Heals with staves.
- **7 MOV mounted**: Can keep up with frontliners. Reaches wounded allies fast.
- **High CHA**: 35% growth. Natural aggro draw — position carefully.
- **Weakness**: Cannot fight back. Mounted penalty in rough terrain. Low WIL.

### Mercenary
Rook's class. Balanced sword fighter. The "generic good unit."

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 20 | 6 | 0 | 5 | 1 | 8 | 7 | 5 | 3 | 4 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 70 | 40 | 5 | 30 | 15 | 50 | 45 | 35 | 20 | 30 |

- **Sword-locked**: Same weapons as Lord but without Rapier access.
- **Balanced growths**: Good at everything, excels at SPD (50%) and SKL (45%).
- **No special features**: The Mercenary IS the reliable pick. Promotes to Hero (adds axe) or Swordmaster (sword mastery).
- **Weakness**: No unique gimmick. Outspecialized by every other class in their niche.

### Shaman
Kira's class. Dark magic user. HP drain, self-sustaining.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 18 | 1 | 7 | 3 | 5 | 4 | 4 | 2 | 2 | 6 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 60 | 5 | 50 | 20 | 35 | 25 | 30 | 20 | 10 | 45 |

- **Dark magic**: No triangle advantage/disadvantage. Outside the system.
- **HP drain**: Nosferatu tome heals on hit. Makes Shaman self-sustaining.
- **High WIL**: 45% growth. Most mentally resistant unit. Immune to most status effects.
- **Weakness**: Low SPD (25%). Rarely doubles. Low LCK means vulnerable to crits. Low CHA — enemies ignore her.

### Monk
Elara's class. Light magic user. Anti-corruption specialist.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 18 | 2 | 5 | 3 | 6 | 5 | 5 | 6 | 4 | 5 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 55 | 10 | 45 | 15 | 45 | 30 | 35 | 40 | 30 | 40 |

- **Light magic**: Effective vs dark enemies and corrupted units (×2 might). Some light tomes heal user on hit.
- **Anti-corruption**: Light attacks reduce target's CRP by 1 on hit.
- **Balanced support**: Good MAG + RES. Promotes into healer hybrid.
- **Weakness**: Low STR means no physical combat. Moderate stats — not the best at anything except fighting corruption.

### Dancer
Orin's class. Unique support. Cannot attack, cannot promote. Dance refreshes allies.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 16 | 1 | 1 | 2 | 3 | 7 | 3 | 8 | 6 | 2 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 40 | 5 | 5 | 10 | 15 | 45 | 15 | 50 | 40 | 15 |

- **Dance**: Adjacent ally who has already acted can act again this turn. Uses Orin's action.
- **No weapons**: Cannot attack or equip weapons. Period.
- **No promotion**: Stays Dancer forever. This IS the class.
- **High LCK/CHA**: 50% LCK growth helps Miracle skill activation. 40% CHA makes him an aggro magnet — dangerous.
- **Weakness**: Cannot fight. Cannot take a hit. The most fragile unit. If Orin dies, the party loses its strongest support action.

### Armor Knight
Ghael's class. Immovable wall. Highest DEF, lowest SPD.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 22 | 7 | 0 | 9 | 0 | 3 | 5 | 3 | 2 | 5 | 4 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 75 | 40 | 0 | 55 | 5 | 10 | 30 | 15 | 10 | 35 |

- **Lance-locked**: Standard lances.
- **4 MOV**: Lowest movement in the game. Agonizingly slow.
- **55% DEF growth**: Highest in the game. Physical attacks bounce off.
- **Weakness**: 0 RES base, 5% growth — mages annihilate Armor Knights. 3 SPD base, 10% growth — will NEVER double. Weak to effective weapons (Armorslayer, Hammer, Rapier).

---

## Promoted Classes (~24)

Promotion at Level 15+ with appropriate item. See [promotion.md](promotion.md) for items and timing.

**Stat bonuses on promotion**: +2-4 to key stats, +1 MOV for foot units, +2 HP. Stat caps raised from 20 to 30.

### From Lord

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Great Lord** | +Lance | +3 HP, +2 STR, +1 SPD, +1 DEF, +1 SKL | 6 | Well-rounded. Rapier + Lance = full triangle coverage. Access to Seize retained. |
| **Conqueror** | +Axe | +2 HP, +3 STR, +2 DEF, +1 CHA | 6 | Tank lord. Higher STR/DEF, trades SPD for power. CHA aura expands. |

### From Cavalier

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Paladin** | — (keeps Sword+Lance) | +3 HP, +2 STR, +2 DEF, +2 RES | 8 | The complete package. Canto retained. Balanced stat boost. |
| **Great Knight** | +Axe | +4 HP, +3 STR, +3 DEF, -1 SPD | 7 | Full triangle coverage but heavier. Slower but unkillable. |

### From Mage

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Sage** | +Staff | +2 HP, +3 MAG, +2 RES, +1 SPD | 6 | Attack + heal. The ultimate magic unit. |
| **Mage Knight** | +Sword (mounted) | +3 HP, +1 MAG, +2 SPD, +2 DEF | 7 | Mounted mage. Trades MAG for mobility and bulk. |

### From Fighter

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Warrior** | +Bow | +4 HP, +3 STR, +1 SKL, +1 DEF | 6 | Axe + Bow. Ranged option patches accuracy problem. |
| **Berserker** | — (Axe only) | +3 HP, +4 STR, +15% crit | 6 | Pure damage. Innate crit bonus. The one-shot machine. |

### From Cleric

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Bishop** | +Light | +2 HP, +3 MAG, +3 RES, +1 LCK | 6 | Heal + Light magic. Can finally attack. Anti-dark effective. |
| **Valkyrie** | +Light (mounted) | +2 HP, +2 MAG, +2 SPD, +1 RES | 7 | Mounted healer + light attack. High mobility support. |

### From Soldier

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **General** | +Sword | +4 HP, +2 STR, +3 DEF, +2 RES | 5 | Supreme tank. Now fights back with swords too. |
| **Halberdier** | — (Lance only) | +2 HP, +3 STR, +2 SPD, +2 SKL | 6 | Fast lancer. SPD boost means Halberdier can actually double. |

### From Archer

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Sniper** | — (Bow only) | +2 HP, +3 SKL, +2 SPD, +15% crit | 6 | The one-shot. Innate crit + highest SKL. Guaranteed kill on crit. |
| **Nomad Trooper** | +Sword (mounted) | +3 HP, +2 STR, +2 SPD, +1 DEF | 7 | Mounted archer + sword. Finally has melee counter. |

### From Thief

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Assassin** | — (Knife only) | +2 HP, +2 STR, +3 SPD, +Lethality | 6 | Innate Lethality skill (SKL/2% instant kill). The invisible killer. |
| **Rogue** | +Sword | +2 HP, +1 STR, +2 SPD, +2 LCK | 7 | Sword + Knife. Better combat but loses Lethality. Steals weapons too (not just items). |

### From Pegasus Knight

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Falcon Knight** | +Sword | +2 HP, +2 STR, +2 SPD, +2 RES | 8 | Lance + Sword flying. The fastest, most mobile unit in the game. |
| **Dark Flier** | +Dark | +2 HP, +3 MAG, +1 SPD, +1 RES | 7 | Flying dark mage. Unique — dark magic from the sky. Nosferatu sustain + flight. |

### From Wyvern Rider

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Wyvern Lord** | — (Axe+Lance) | +4 HP, +3 STR, +3 DEF, +1 SPD | 8 | Flying fortress. Highest STR + DEF of any flying class. |
| **Malig Knight** | +Dark (drops Lance) | +2 HP, +3 MAG, +2 DEF, +2 RES | 7 | Flying dark mage tank. Axe + Dark. Strange but devastating. |

### From Troubadour

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Valkyrie** | +Light | +2 HP, +3 MAG, +2 RES, +1 SPD | 8 | Mounted healer + light attack. Same as Cleric's Valkyrie path. |
| **Maid** | +Knife | +2 HP, +1 MAG, +3 SPD, +2 LCK | 7 | Healer + debuffer. Knives apply debuffs, staff heals. Utility hybrid. |

### From Mercenary

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Hero** | +Axe | +3 HP, +2 STR, +2 SPD, +2 DEF | 6 | Sword + Axe. Full physical triangle coverage (with lance enemies). Sol innate. |
| **Swordmaster** | — (Sword only) | +2 HP, +2 STR, +3 SPD, +20% crit | 6 | Pure sword. Innate crit bonus. The duelist supreme. |

### From Shaman

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **Druid** | +Staff | +2 HP, +3 MAG, +2 RES, +1 WIL | 6 | Dark + Staff. Dark attack with healing utility. |
| **Summoner** | +Summon | +2 HP, +2 MAG, +1 SPD, +1 DEF | 6 | Can summon phantom allies (weak, temporary, 1 per turn). |

### From Monk

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **War Monk** | +Staff +Axe | +3 HP, +2 STR, +2 MAG, +1 DEF | 6 | Hybrid melee + magic + heal. Jack of all trades. |
| **Saint** | +Staff | +2 HP, +3 MAG, +3 RES, +2 LCK | 6 | Pure caster. Light + Staff. Best healing + anti-corruption. |

### From Armor Knight

| Promoted Class | New Weapons | Stat Bonuses | MOV | Key Feature |
|---------------|------------|-------------|-----|-------------|
| **General** | +Sword | +4 HP, +2 STR, +3 DEF, +2 RES | 5 | Same as Soldier→General. Maximum defense. |
| **Great Knight** | +Axe (mounted) | +3 HP, +3 STR, +2 DEF, +1 SPD | 6 | Mounted armored unit. Lance + Axe + mobility. Trades DEF for movement. |

---

## Master Classes (8)

Available at Level 30+ with a Master Seal (rare, Arc 4-5 only). Stat caps raised to 35. Each master class has a unique class skill.

| Master Class | Promotes From | Weapons | MOV | Stat Caps | Unique Skill |
|-------------|--------------|---------|-----|-----------|-------------|
| **Overlord** | Great Lord, Conqueror | Sword+Lance+Axe | 7 | 35 all | **Cycle Authority**: All allies within 3 tiles gain +3 all stats. Ren only. |
| **Archsage** | Sage, Druid, Saint | All magic+Staff | 6 | 35 all | **Tri-Magic**: No magic triangle disadvantage. |
| **Marshal** | General (either path), Paladin | Sword+Lance+Axe | 6 | 35 all, 40 DEF | **Ironwall**: Cannot be moved by Shove/knockback. Reduces all damage by 3 (flat). |
| **Reaver** | Warrior, Berserker, Hero | Sword+Axe+Bow | 6 | 35 all, 40 STR | **Bloodlust**: Heal 30% of damage dealt. Always active (no activation roll). |
| **Seraph** | Falcon Knight, Valkyrie | Lance+Light+Staff | 9 | 35 all | **Divine Wings**: Immune to bow/wind effective damage. Flying retained. |
| **Dragon Lord** | Wyvern Lord, Malig Knight | Axe+Lance+Dark | 9 | 35 all, 40 DEF | **Terror Aura**: Enemies within 2 tiles suffer -5 hit/avoid. |
| **Phantom** | Assassin, Swordmaster | Sword+Knife | 7 | 35 all, 40 SPD | **Vanish**: After attacking, cannot be targeted until next turn. |
| **Oracle** | Bishop, Saint, War Monk | Light+Dark+Staff | 6 | 35 all | **Balance**: Light and Dark magic bonuses stack. Anti-corruption on all spells. |

### Master Class Design Notes

- Master classes are **endgame rewards**, not expected for every unit
- Only 2-3 Master Seals exist across the entire campaign
- Ren's Overlord is unique — only he can use it (Prf class)
- Master classes don't add new weapon types — they combine existing promoted weapons
- The stat cap increase (30 → 35) matters most for units that were already capping stats

---

## Unique Class: System Construct (Echo)

Echo's class. One-of-a-kind. Cannot promote through normal means.

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 20 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 3 | 5 | 5 |

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 30 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 20 | 30 |

- **Flat growths**: 30% across the board. Perfectly balanced, perfectly average.
- **Any weapon (one at a time)**: Can equip any weapon type. Switches during preparation. Cannot change mid-chapter.
- **System Link**: Gains +2 to all stats when standing on glitched tiles (instead of CRP penalty).
- **No promotion**: Cannot promote. Stat caps are already 30 (equivalent to promoted). Growth rates compensate over time.
- **Narrative design**: Echo mirrors Ren — good at everything, best at nothing. But where Ren has 347 cycles of knowledge, Echo has raw system access.

---

## Enemy-Only Classes (Expanded)

| Class | Weapons | Notes |
|-------|---------|-------|
| **Brigand** | Axe | Generic enemy fighter. Lower stats. |
| **Archer** (enemy) | Bow | 2-range only. Cannot counter melee. |
| **Knight** (enemy) | Lance | High DEF armored. Weak to effective weapons. |
| **Dark Mage** (enemy) | Dark | CRP on hit. Nosferatu sustain. |
| **Berserker** (enemy) | Axe | Promoted brigand. High crit, reckless. |
| **Sniper** (enemy) | Bow | Promoted archer. Long range, lethal. |
| **General** (enemy) | Lance+Sword | Promoted knight. Wall. |
| **Sage** (enemy) | Fire/Thunder/Wind+Staff | Promoted mage. Heals allies. |
| **Paladin** (enemy) | Sword+Lance | Promoted cavalier. Fast, balanced. |
| **Wyvern Rider** (enemy) | Axe | Flying. High STR/DEF. Weak to bow/wind. |
| **Pegasus Knight** (enemy) | Lance | Flying. High SPD/RES. Weak to bow/wind. |
| **Assassin** (enemy) | Knife | High SPD, Lethality, fragile. |
| **War Monk** (enemy) | Light+Staff | Anti-corruption aura. Heals allies. Arc 3+. |
| **Corrupted** | Cycles | Randomized stats, shifting weapon type. Arc 3+. |
| **System Construct** | Varies | Artificial units created by the System. Perfect stats, predictable AI. Arc 4+. |

---

## Class Introduction Schedule

| Arc | New Player Classes Available | New Enemy Classes |
|-----|---------------------------|-------------------|
| Arc 1 (Ch1-5) | Lord, Cavalier, Mage, Fighter, Cleric, Soldier, Archer, Thief, Pegasus Knight | Brigand, Archer, Knight, Boss |
| Arc 2 (Ch6-10) | Mercenary, Troubadour, Dancer | Dark Mage, Berserker, Paladin, Wyvern Rider |
| Arc 3 (Ch11-15) | Shaman, Wyvern Rider, Monk | Sniper, General, Sage, Assassin, Corrupted, War Monk |
| Arc 4 (Ch16-20) | Armor Knight, System Construct | Pegasus Knight (enemy), System Construct |
| Arc 5 (Ch21-25) | — (no new classes) | All types + System Constructs |

---

## Open Questions

- **Class change (reclass)**: Should units be able to change class entirely (e.g., Lord → Mercenary)? Adds flexibility but complexity.
- **Trainee classes**: Should any unit start as a Trainee (weaker, promotes into base class) for extra growth?
- **Mounted indoor rules**: Should mounted units (Cavalier, Troubadour, etc.) be forced to dismount in indoor maps?
- **Summoner phantoms**: How strong are summoned units? Duration? Limit per map?
- **Great Knight overlap**: Both Cavalier→Great Knight and Armor Knight→Great Knight exist. Same class or different stat bonuses?
