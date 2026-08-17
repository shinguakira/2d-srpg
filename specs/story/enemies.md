# Enemies

Enemy types and writing guidelines. For AI behaviour see
[map-and-turns.md](../systems/map-and-turns.md); for named bosses see
[bosses.md](bosses.md).

---

## The Two Enemies

The campaign has two distinct hostile forces and they should never feel alike.

### 1. The Kurogane Empire

A real army: disciplined, well fed, well paid, and marching because their emperor
told them this war would be the last one — and they believe him. Kurogane soldiers
are not monsters and are never written as monsters.

Halvar is the party's window into them, which is why he defects in Ch2 and why his
death in Ch8 costs the player something.

### 2. The Blackflame

Not an army. It does not negotiate, hold ground, or take prisoners. It hollows
things out. Its "units" are the people it has already taken.

---

## Kurogane Enemy Classes

### Arc 1-2

| Class | Weapons | Key trait | First appears |
|-------|---------|-----------|---------------|
| **Brigand** | Axe | Hill bandits, mostly on Kurogane pay rather than in Kurogane service | Ch1 |
| **Soldier** | Lance | The Empire's backbone. Disciplined, ordinary, doing a job | Ch1 |
| **Archer** | Bow | 2-range only, no melee counter | Ch2 |
| **Knight** | Lance | High DEF, low SPD. Teaches effective weapons | Ch2 |
| **Mage** | Anima tomes | Ranged burst, fragile | Ch2 |
| **Cavalier** | Lance/Sword | Mobile, canto. Teaches anti-cavalry positioning | Ch4 |
| **Thief** | Knife | Races for chests and villages. Survival AI | Ch4 |
| **Pegasus Knight** | Lance | Flying, bow-vulnerable, fast flankers | Ch6 |
| **Shaman** | Dark tomes | Nosferatu — heals itself for what it deals | Ch7 |

### Arc 3-4 (promoted)

| Class | Weapons | Key trait | First appears |
|-------|---------|-----------|---------------|
| **Paladin** | Lance/Sword | Fast, tough, canto | Ch11 |
| **General** | Lance/Sword | Maximum-DEF wall | Ch12 |
| **Sage** | Anima/Staff | Attacks *and* heals. Priority target | Ch12 |
| **Sniper** | Bow | Long range, high crit, loves elevation | Ch13 |
| **Assassin** | Knife | Lethality. Ambushes in fog | Ch13 |
| **Berserker** | Axe | Glass cannon | Ch14 |
| **Wyvern Lord** | Axe/Lance | Flying tank. Bows and wind only | Ch15 |
| **Bishop** | Light/Staff | Healer AI; light magic hurts corrupted party members | Ch15 |
| **Swordmaster** | Sword | Extreme speed and crit | Ch17 |
| **Marshal / Archsage** | All physical / all magic | Master-class officers | Ch20+ |

---

## Blackflame Enemies

### Revenant

The dead the Blackflame has stood back up. They keep their own faces and their own
kit, which is the most upsetting fact in the setting and should be treated that way
— Mirelle's instruction in Ch7 is *"do not look at their faces."*

- The engine already has the class — `revenant`, clawed, no counter at range,
  and light magic is effective against it. Chapter 1 fields two, inherited from
  the PoC
- Comes out of blighted stone rather than marching in from a map edge
- Ch7 is the introduction: four waves, out of the fortress's north wall, some in
  Amagi colours

### Blackflame Colossus

Not a revenant — a revenant was one person. A Colossus has been **assembled**, out
of several.

- Knight frame · HP 50 / STR 15 / DEF 14 / RES 10 / SPD 3
- Slow, nearly unkillable head-on, and single-minded: it goes for an objective, not
  for whoever is nearest
- On death its ash runs west along the ground **against the wind**, which is the
  first trail the party can actually follow

### Blighted terrain

Terrain is an enemy in its own right from Ch3 onward. Three new terrains, in the
same shape as the ones in [map-and-turns.md](../systems/map-and-turns.md) — a map
character, a def and avo modifier, and a cost per move type. None of them exists
yet.

| | def | avo | foot | mounted | flier | on standing |
|---|---|---|---|---|---|---|
| **Blighted** | −1 | −10 | 2 | 2 | 1 | lose HP each turn |
| **Abyssal Rift** | — | — | ∞ | ∞ | ∞ | adjacent tiles take the Blighted penalty |
| **Hallowed Ground** | +2 | +10 | 1 | 1 | 1 | the blight will not cross it |

The point of the set is that blighted ground is *worse than open field* rather
than merely slow, so the map itself pushes the player forward. Hallowed Ground is
the counterweight and the only safe footing in Arc 5.

There is no hidden meter behind any of this. What the blight costs is HP, avoid
and defence — quantities the game already has and the player can already read.

---

## Writing generic enemies

Only one or two enemies per chapter get lines. Keep them short and human.

- **Soldiers** mean it when they shout for their commander. They are not cynics.
- **Brigands** are opportunists who took the winning side's coin and know exactly
  what that makes them.
- **Officers** almost all know something is wrong in the west and have been told
  not to look at it. That order is the recurring note of the whole campaign.
- **Revenants do not speak.** Ever. If a revenant says something, the scene is
  broken.
