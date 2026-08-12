# Classes

All playable unit classes. Each class defines base stats, growth rates, weapon proficiency, movement, and role.

See [stats.md](stats.md) for stat formulas and meta-stats.
See [weapons.md](weapons.md) for weapon details and ranks.
See [skills.md](skills.md) for learnable skills by class.

---

## Class Summary

| Class | Weapons | MOV | Role | User |
|-------|---------|-----|------|------|
| **Lord** | Sword | 5 | Balanced attacker. Required for Seize. | Shigeru |
| **Cavalier** | Sword, Lance | 7 | Mobile frontline. High MOV, dual weapons. | Akira |
| **Mage** | Fire, Thunder, Wind | 5 | Magic damage. Targets RES. 1-2 range. | Lisette |
| **Fighter** | Axe | 5 | Raw damage. High HP/STR, low accuracy. | Gareth |
| **Cleric** | Staff | 5 | Healer/support. Cannot attack. | Mirelle |
| **Soldier** | Lance | 5 | Defensive tank. High DEF, low SPD. | Halvar |

---

## Lord

Shigeru's class. Balanced stats, sword-locked. The only class that can **Seize** objectives.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 20 | 6 | 0 | 5 | 1 | 7 | 5 | 7 | 6 | 3 | 5 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 80 | 45 | 10 | 30 | 20 | 50 | 45 | 60 | 40 | 35 |

### Class Features
- **Seize**: Only the Lord can capture thrones/objectives to end chapters.
- **Rapier**: Access to Prf weapon effective vs cavalry/armored.
- **Innate Canto**: No (foot unit).
- **Weakness**: Must survive — if Shigeru dies, game over. High CHA = highly targeted by enemies.

### Design Notes
Stats are intentionally "good at everything, best at nothing." Shigeru's strength comes from EMB, passives, and four centuries of knowledge — not raw stats. His growths are above-average across the board but don't excel in any single area. SPD growth (50%) ensures he can double most enemies mid-game.

---

## Cavalier

Akira's class. High mobility, dual weapon proficiency (sword + lance). The reliable frontliner.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 22 | 7 | 0 | 6 | 0 | 6 | 5 | 4 | 5 | 7 | 7 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 75 | 40 | 5 | 35 | 15 | 35 | 30 | 40 | 35 | 45 |

### Class Features
- **Canto**: After acting, use remaining MOV to reposition. Innate — does not use a skill slot.
- **Dual Weapons**: Sword + Lance gives full triangle coverage with axes.
- **7 MOV**: Highest base movement. Reaches objectives and villages first.
- **Weakness**: Low RES (0 base, 15% growth). Mages delete him. Also STA accumulates fast due to high MOV.

### Design Notes
Akira is designed as the "safe pick" — always useful, always reliable, never a liability. His 100% ATT and high WIL (45% growth) make him the emotional and mechanical anchor. His death in Ch3 removes the party's most versatile unit AND their stability aura. The stat loss from losing Cavalier mobility alone changes how every subsequent map plays.

---

## Mage

Lisette's class. Ranged magic damage targeting RES (usually low on physical enemies). Glass cannon.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 16 | 1 | 6 | 3 | 5 | 5 | 4 | 5 | 2 | 5 | 5 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 55 | 5 | 55 | 15 | 40 | 30 | 45 | 30 | 15 | 40 |

### Class Features
- **1-2 Range**: All tomes hit at melee and ranged. Huge tactical flexibility.
- **Magic Triangle**: Fire > Wind > Thunder > Fire. Separate from physical triangle.
- **Targets RES**: Most physical enemies have low RES — mages shred them.
- **Weakness**: Lowest HP (16 base), lowest DEF (3 base). One physical hit can kill. STA rate ×1.2 — tires fast.

### Design Notes
Lisette's class rewards careful positioning — she kills everything she touches but dies to anything that touches her. Her high SKL growth (45%) synergizes with Exploit passive (needs to see enemy stats) and body targeting (SKL reduces hit penalties). Low CHA (2, 15% growth) means enemies rarely target her — she's invisible to AI, which is a feature, not a bug.

---

## Fighter

Gareth's class. Maximum physical damage at the cost of accuracy and defensive stats.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 24 | 8 | 0 | 4 | 0 | 5 | 4 | 3 | 4 | 6 | 5 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 90 | 55 | 0 | 35 | 5 | 25 | 20 | 25 | 30 | 35 |

### Class Features
- **Axe-locked**: Only axes. Highest might weapons but worst accuracy.
- **HP Monster**: 90% HP growth + 24 base. Will have 50+ HP by lategame.
- **No Patience passive**: Cannot Wait. Always moving, always fighting.
- **Weakness**: 0% MAG growth, 5% RES growth. Mages destroy him. 20% SKL growth means he NEEDS Killing Axes or body targeting support to crit.

### Design Notes
Gareth is designed to be chaotic. His stats swing wildly — sometimes he one-shots a boss, sometimes he misses 3 times in a row. Low ATT (40%) amplifies this. The No Patience passive forces aggressive play — you can't park Gareth on a fort and wait. He IS the push. Pair with Mirelle (Empathy Aura +10 hit) to patch his accuracy problem, or lean into Reckless (kill chains) with body targeting Legs → Head combos.

---

## Cleric

Mirelle's class. Pure support — cannot attack, heals with staves. The party's lifeline.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 18 | 1 | 4 | 2 | 6 | 5 | 3 | 5 | 3 | 2 | 5 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 50 | 5 | 45 | 10 | 45 | 30 | 25 | 50 | 25 | 15 |

### Class Features
- **Staff Only**: Cannot attack. Period. EXP only from healing.
- **Heal EXP**: Gains EXP from healing (same formula as combat EXP, using staff rank instead of weapon rank).
- **Purify Staff**: Only Cleric can use the Purify staff to cleanse CRP.
- **Weakness**: Cannot fight back. If surrounded, she dies. Lowest DEF (2 base, 10% growth). STA rate ×1.3 — exhausts fastest.

### Design Notes
Mirelle cannot protect herself. She needs the party to protect HER. This creates a natural escort dynamic — and makes her death devastating both emotionally and tactically. Her MAG growth (45%) ensures strong heals. High LCK (50% growth) gives her Miracle skill activation (LCK% chance to survive lethal). Low WIL (15% growth) makes her the most vulnerable to mental effects — she feels everything deeply. Her Empathy Aura (+10 hit/avoid to adjacent) means she WANTS to be near allies, but being near frontlines risks her life.

---

## Soldier

Halvar's class. Defensive wall. High DEF, low SPD. Holds the line.

### Base Stats

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL | MOV |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 20 | 6 | 0 | 6 | 0 | 5 | 5 | 3 | 1 | 4 | 5 |

### Growth Rates

| HP | STR | MAG | DEF | RES | SPD | SKL | LCK | CHA | WIL |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 70 | 35 | 5 | 45 | 10 | 20 | 35 | 20 | 10 | 30 |

### Class Features
- **Lance-locked**: Lances only. Good might, decent accuracy.
- **DEF Wall**: 45% DEF growth = highest in the party. Becomes a physical wall.
- **Garrison Lance**: Prf weapon with infinite durability. His identity.
- **Weakness**: 20% SPD growth. Will almost never double. 0 RES base, 10% growth — mages are lethal. Lowest CHA (1 base, 10% growth) — enemies ignore him.

### Design Notes
Halvar is the opposite of Gareth: reliable, consistent, boring in the best way. His low CHA means enemies DON'T target him — which seems like a weakness but makes him perfect for flanking and positioning. Park him on a chokepoint with his Garrison Lance and he holds it indefinitely. His absurd STA rate (×0.7) means he's the last man standing when everyone else is exhausted. Residual Data passive rewards him for standing where enemies died — the soldier who stood still for 300 cycles now weaponizes positioning.

---

## Promotion (Future)

Promotion system is NOT implemented yet. Design direction:

- Promotion at **Level 20** using a class-specific item.
- Stat bonuses on promotion (+2-4 to key stats, +1 MOV for foot units).
- Unlocks additional weapon type.
- Raises stat caps from 20 to 30.

| Class | Promotes To | New Weapon | MOV Change |
|-------|-----------|-----------|-----------|
| Lord | Great Lord | +Lance | +1 (→ 6) |
| Cavalier | Paladin | — (keeps sword + lance) | +1 (→ 8) |
| Mage | Sage | +Staff | — |
| Fighter | Warrior | +Bow (if added) or +Sword | — |
| Cleric | Bishop | +Light magic (if added) | — |
| Soldier | General | +Sword | — |

### Promotion Notes
- Promotion is story-gated: items appear at specific chapter moments.
- Akira CANNOT promote — he dies in Ch3 before reaching Level 20. This is intentional. His peak is unpromoted Cavalier. The best version of him is the one you lose.
- Shigeru may promote mid-Ch3 or early Ch4 depending on story pacing.

---

## Enemy Classes

Enemies use the same 6 classes plus additional types:

| Class | Weapons | Notes |
|-------|---------|-------|
| **Boss** | Varies | Unique per boss. Cannot move (boss AI). Higher stats. |
| **Brigand** | Axe | Similar to Fighter but lower stats. Generic enemy. |
| **Archer** | Bow (2-range only) | Cannot counterattack at melee. Not available to player (no bow class). |
| **Knight** | Lance | Armored. Very high DEF, very low SPD/RES. Weak to effective weapons. |
| **Dark Mage** | Dark magic | Enemy-only. Targets RES. May inflict CRP on hit. |
| **Corrupted** | Cycles | System-corrupted units. Stats randomized. Weapon type shifts. Ch3-4. |

---

## Open Questions

- **Promotion items**: What are they called? Where found? One per class or universal (Master Seal)?
- **Bow class**: Should we add Archer as a player class? Currently enemy-only.
- **Third-tier classes**: Beyond promotion, is there a further upgrade? Probably not for a 4-chapter game.
- **Class change**: Should units be able to reclass (change class entirely)? FE allows it but adds complexity.
