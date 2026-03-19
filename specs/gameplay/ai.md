# Enemy AI

Behavior types, target selection, movement logic, and meta-stat interactions for enemy-controlled units.

Code reference: `src/core/ai.ts`

---

## Behavior Types

Each enemy unit has an assigned AI behavior that determines how it moves and selects targets.

| Behavior | Movement | Target Selection | Use Case |
|----------|----------|-----------------|----------|
| **Aggressive** | Chase nearest player unit | Best target by score | Standard enemies, reinforcements |
| **Stationary** | Cannot move | Attack in weapon range only | Archers on walls, mages behind lines |
| **Guard** | Stay within radius of start position | Best target within guard zone | Area defenders, gatekeepers |
| **Boss** | Cannot move | Attack in range, prioritize Lord | Chapter bosses on thrones |
| **Survival** | Flee to fort/safe tile when low HP | Attack only when healthy | Self-preserving enemies, named enemies, mini-bosses |
| **Thief** | Beeline to treasure chests/villages | Ignore combat unless cornered | Enemy thieves racing for loot |
| **Healer** | Stay behind frontline, heal wounded allies | Heal lowest-HP ally in range | Enemy clerics/troubadours |
| **Escort** | Follow and protect a specific unit | Attack threats to escort target | Bodyguards, NPC protectors |
| **Coordinated** | Focus-fire a single target | All coordinated enemies pick same target | Elite squads, Arc 4-5 |
| **Ambush** | Wait hidden in fog, attack when enemy enters range | Highest damage target in range | Fog of war chapters |

### Aggressive

Default behavior. Moves toward and attacks the highest-scoring reachable target.

```
1. Calculate all movable positions (BFS from current position)
2. For each position, find attackable enemies
3. Score all (position, target) combinations
4. Pick the highest-scoring option
5. If no target reachable: move toward nearest player unit (close the gap)
```

### Stationary

Does not move. Only attacks if a player unit enters weapon range.

```
1. Check weapon range from current position
2. If target in range: attack best-scoring target
3. If no target: do nothing (stay in place)
```

### Guard

Moves freely but stays within a defined radius of its starting position.

```
1. Calculate movable positions
2. Filter: only positions within guard radius of start position (Manhattan distance)
3. Score reachable targets from valid positions
4. If no target reachable within zone: return to start position
```

Guard radius is defined per unit (e.g., `{ type: 'guard', radius: 3 }`).

### Boss

Like stationary but with Lord-targeting priority.

```
1. Check weapon range from current position (cannot move)
2. Score all targets in range
3. +50 bonus to score if target is Lord class
4. Attack best target
5. If no target: do nothing
```

### Survival

Self-preserving AI. Fights when healthy, retreats to heal when wounded. Makes enemies feel smarter — they don't suicidally charge when near death.

```
HP threshold: ≤ 30% max HP → retreat mode
HP threshold: > 50% max HP → attack mode
Between 30-50%: stay cautious (attack only safe targets, don't chase)

RETREAT MODE:
1. Find nearest fort/throne tile (healing terrain)
2. Move toward it (BFS shortest path)
3. If already on fort: stay and heal (do nothing)
4. If no fort reachable: move AWAY from nearest player unit (maximize distance)
5. Do NOT attack even if target is in range (priority is survival)

ATTACK MODE:
1. Behave like Aggressive — chase and attack best target
2. Full target scoring applies

CAUTIOUS MODE (30-50% HP):
1. Calculate all attack options
2. Only attack if: score > 80 AND self would survive the counter
3. If no safe attack: move toward fort or hold position
4. Will not chase — only attacks targets that come to them
```

**Use cases:**
- **Named enemies** that flee and return later in the chapter (mini-boss retreats, heals, comes back)
- **Mages** that kite — attack from range, retreat when approached
- **Thieves/Brigands** targeting villages — run toward village, attack only if cornered
- **Enemies with Vulneraries** — retreat, use item, then re-engage

**Survival + Items:**
When in retreat mode, if the unit has a healing item (Vulnerary, etc.), they will use it instead of attacking — even if a target is in range. Item use consumes their action for the turn.

```
RETREAT MODE with item:
1. If has healing item AND current HP < max HP: use item (action consumed)
2. Then move toward fort (if movement remains via Canto, otherwise stay)
3. If no healing item: move toward fort without acting
```

### Thief

Prioritizes stealing loot over combat. Used for enemy thieves that race toward treasure chests and villages.

```
1. Find nearest unopened chest or unvisited village
2. Move toward it (shortest path)
3. If adjacent to chest: open it (steals contents)
4. If on village: visit it (destroys village reward)
5. If no loot targets remain: behave like Aggressive
6. If cornered (player unit blocks path): attack to escape, then resume looting
7. After stealing: move toward map edge (tries to escape with loot)
```

**Counter-play**: Kill the thief before they reach chests, or block their path. If a thief steals an item and is killed, the item is recovered.

### Healer

Stays safe and heals wounded allies. Used for enemy clerics, troubadours, and bishops.

```
1. Find lowest-HP enemy ally within heal range
2. If ally found AND ally HP < 80%: heal them
3. If no one to heal: move toward the wounded ally closest to battle
4. NEVER initiate combat (even if target is available)
5. If attacked: can counter (if promoted with weapon), but won't seek fights
6. Self-preservation: if HP < 50%, move away from player units
```

### Escort

Follows and protects a specific escort target (usually the boss or a key unit).

```
1. Stay within 2 tiles of escort target
2. If player unit threatens escort target (within attack range of target): prioritize attacking that player unit
3. If escort target is safe: attack best available target within movement range
4. If escort target moves: follow (maintain 1-2 tile distance)
5. Will take hits for escort target (auto-shield at adjacent positions)
```

### Coordinated

Elite behavior. All units with Coordinated AI share target selection — they focus-fire the same player unit.

```
1. All Coordinated enemies evaluate the same target pool
2. Pick the player unit with highest kill potential (most enemies can reach + damage)
3. All Coordinated enemies attack that one target in sequence
4. If target dies mid-sequence: remaining Coordinated enemies pick next-best target
5. Requires 3+ Coordinated enemies to activate — otherwise behaves as Aggressive
```

**Design intent**: Creates dangerous enemy squads that punish exposed units. Player must position carefully to avoid letting one unit get focus-fired.

### Ambush

Hidden in fog of war. Waits until a player unit enters attack range, then strikes.

```
1. If NOT in fog of war or no player in range: behave like Stationary (don't move)
2. If player unit enters weapon range: attack with maximum damage target
3. After attacking: switch to Aggressive behavior for the rest of the chapter
4. Ambush units are hidden in fog — player cannot see them until they attack or are revealed
```

**Design intent**: Creates tension in fog chapters. Thieves can scout ahead to reveal ambushes safely.

---

## Target Scoring

The AI evaluates every possible attack with a numeric score. Higher score = better target.

```
score = 0

// Can we kill?
if (damage ≥ target HP): score += 100

// Raw damage value
score += damage × 2

// Hit reliability
score += hitRate × 0.5

// Prioritize wounded targets
score += (1 - currentHP / maxHP) × 30

// Self-preservation
if (defender can counter AND counter damage would kill us):
  score -= 50
```

### Score Breakdown Example

| Factor | Value | Notes |
|--------|-------|-------|
| Can kill | +100 | Highest priority — kills are always worth it |
| 15 damage | +30 | 15 × 2 |
| 85% hit | +42.5 | 85 × 0.5 |
| Target at 40% HP | +18 | (1 - 0.4) × 30 |
| Would die to counter | -50 | Risk penalty |
| **Total** | **140.5** | |

### CHA Aggro (Design Spec — Not Yet Implemented)

When CHA is implemented, target scoring adds aggro weight:

```
score += target.aggroWeight × 0.3
where: aggroWeight = 10 + CHA×2 + (maxHP - currentHP)/2
```

This makes high-CHA units (Ren: CHA 9 → weight 28) natural aggro magnets, while low-CHA units (Voss: CHA 2 → weight 14) are nearly ignored.

### Terrain Aggro Modifier (Design Spec)

Units on defensive terrain have reduced aggro:

```
if target on Forest/Mountain/Fort/Throne:
  aggroWeight -= 5
```

This creates a meaningful choice: position a high-CHA unit on a fort to tank (CHA overcomes the -5), or use low-CHA units on forts to hide them from AI.

---

## Movement Logic

### Aggressive Chase

When no target is reachable, aggressive enemies move toward the nearest player unit.

```
1. Find all player units
2. Calculate Manhattan distance from current position to each
3. Select nearest player unit
4. Among all movable positions, pick the one closest to that player
5. Move there
```

This creates a "closing in" behavior — enemies swarm the party over multiple turns.

### Guard Return

When a guard enemy has no targets and has drifted from its start position, it moves back.

```
1. If no targets in guard zone: stay in place (effectively returns to patrol area)
```

### Pathfinding

Enemy movement uses the same BFS pathfinding as player units:
- Respects terrain movement costs
- Cannot move through player-occupied tiles
- CAN move through ally (enemy) occupied tiles but cannot stop on them
- Class-specific movement costs apply (e.g., mounted enemies pay extra in forests)

---

## Enemy Phase Execution

### Sequence

```
1. computeEnemyActions(): AI decides actions for ALL enemies at once
2. executeNextEnemyAction(): actions execute one at a time
3. After each action: check for player deaths, game over conditions
4. After all enemies: endEnemyTurn() → Player Phase
```

### Action Priority

Enemies act in the order they were computed (currently: iteration order of the unit map). No explicit priority system — but could be added:

| Priority (future) | Unit Type |
|-------------------|-----------|
| 1 (first) | Healers (heal allies before they die) |
| 2 | Ranged units (soften targets) |
| 3 | Melee units (finish kills) |
| 4 | Boss (acts last, after minions) |

### Animation Timing

- Camera pans to acting enemy (~300ms)
- Movement animation plays
- Combat animation plays (if attacking)
- Brief pause between enemies (~200ms)
- Total enemy phase should feel snappy, not slow

---

## Enemy AI × Meta-Stats (Design Spec)

### AWR-Based Information

| Player AWR Level | AI Behavior Change |
|-----------------|-------------------|
| AWR Blind (0-10) | AI targets randomly (player can't see stats, AI plays fair) |
| AWR Aware (11-30) | Normal AI scoring |
| AWR Decoded (61-90) | AI becomes smarter — considers weapon triangle in scoring |
| AWR Awake (91-100) | AI plays optimally — considers terrain, support bonuses, future turns |

### SYNC-Based Consistency

| SYNC State | AI Effect |
|-----------|-----------|
| Volatile (<30%) | 20% chance enemy AI acts randomly (wrong target, suboptimal move) |
| Anchored (>90%) | AI acts perfectly — no randomization, optimal play |

### CRP-Based Corruption

| CRP Level | AI Effect |
|-----------|-----------|
| CRP Spreading (31-50) | Enemy attacks have 10% chance to spread +3 CRP to target |
| CRP Consumed (51-75) | Enemies deal +20% damage to units with CRP > 0 |
| CRP Critical (76+) | Corrupted enemies may attack other enemies (system breakdown) |

### LOY-Based Defiance

| LOY Level | AI Effect |
|-----------|-----------|
| LOY Defiant (<20) | 15% chance player unit ignores attack command during auto-battle |
| LOY Devoted (>80) | Auto-shield: unit takes a lethal hit for an adjacent ally (LOY% chance) |

---

## Enemy Composition Per Arc

Summary guidelines for enemy placement and behavior assignment across 25 chapters. Individual chapter enemy placement is defined in chapter files (`specs/story/chapters/`).

### Arc 1 — The Script (Ch1-5)

| Enemy Type | Behavior | Levels | Notes |
|-----------|----------|--------|-------|
| Brigand (axe) | Aggressive | 1-5 | Primary threat. Simple enemies. |
| Soldier (lance) | Stationary/Guard | 2-5 | Chokepoint defenders. |
| Archer | Stationary | 3-5 | Elevated terrain, ranged pressure. |
| Mage (fire/thunder) | Guard (r=3) | 3-6 | Protect boss. Teaches RES value. |
| Knight | Guard (r=2) | 4-7 | High DEF. Teaches effective weapons. |
| Thief | Thief | 3-5 | Ch4+. Races to chests. Teaches urgency. |
| Boss | Boss | 5-9 | Throne, higher stats, 1 per chapter. |
| Reinforcements | Aggressive | 2-5 | Turn 5-6. Single wave. Ch3-5 only. |

**Arc 1 AI philosophy**: Simple. Aggressive is dominant. Teach player to exploit stationary/guard limits.

### Arc 2 — Fractures (Ch6-10)

| Enemy Type | Behavior | Levels | Notes |
|-----------|----------|--------|-------|
| All Ch1 types | Mixed | 7-12 | Continuing, higher level |
| Dark Mage | Survival | 8-12 | CRP on hit, kites. First dark magic enemies. |
| Cavalier | Aggressive | 8-11 | Mobile threats. Teaches anti-cavalry. |
| Pegasus Knight | Aggressive | 9-12 | Flying. Teaches bow effectiveness. |
| Healer (enemy cleric) | Healer | 8-10 | Heals allies. Priority kill target. |
| Named mini-boss | Survival | 10-14 | Retreats to heal, returns. |
| Boss | Boss | 12-16 | Ch8 boss kills Kael (scripted). |
| Reinforcements | Aggressive | 7-11 | Multi-wave from Turn 4-5. |

**Arc 2 AI philosophy**: Introduce Survival and Healer. Enemies feel smarter — they retreat, they heal, they kite.

### Arc 3 — Corruption (Ch11-15)

| Enemy Type | Behavior | Levels | Notes |
|-----------|----------|--------|-------|
| Promoted enemies | Mixed | 14-18 | Paladins, Sages, Generals appear |
| Dark Mage (promoted) | Survival | 15-18 | High CRP spread. Nosferatu drain. |
| Wyvern Rider | Aggressive | 15-18 | Flying tank. Bow-vulnerable. |
| Assassin | Ambush | 16-18 | Fog chapters. Hidden killers. |
| Thief (improved) | Thief | 14-16 | Faster, steals weapons too. |
| Corrupted units | Aggressive | 14-20 | Stat randomization. CRP on contact. |
| Escort guard | Escort | 15-18 | Protecting boss. |
| Boss | Boss | 18-22 | May have skills. Higher stat bonuses. |
| Reinforcements | Aggressive/Ambush | 14-17 | Multi-wave. Fog ambush reinforcements. |

**Arc 3 AI philosophy**: Fog + Ambush creates tension. Corrupted enemies are unpredictable. Escort AI protects bosses.

### Arc 4 — Awakening (Ch16-20)

| Enemy Type | Behavior | Levels | Notes |
|-----------|----------|--------|-------|
| Elite promoted | Coordinated | 20-25 | Focus-fire squads. The biggest AI threat. |
| Master class enemies (rare) | Aggressive | 25-27 | 1-2 per chapter. Show what master classes do. |
| Dark Mage elite | Survival | 22-25 | Eclipse (siege), Fenrir (long range). |
| Mounted promoted | Aggressive | 20-25 | Paladins, Great Knights. Fast and strong. |
| System Constructs | Aggressive | 22-27 | Artificial enemies. No CRP. High stats. |
| Healer (promoted) | Healer | 20-23 | Physic range. Harder to reach. |
| Boss | Boss | 25-30 | Multi-phase. May retreat at 50% HP. |
| Reinforcements | Coordinated/Aggressive | 20-25 | Continuous in some chapters. |

**Arc 4 AI philosophy**: Coordinated is the signature challenge. Player must prevent focus-fire through positioning and threat management.

### Arc 5 — The Last Save File (Ch21-25)

| Enemy Type | Behavior | Levels | Notes |
|-----------|----------|--------|-------|
| Everything from Arc 4 | Mixed | 27-33 | Higher levels, more aggressive. |
| Master class enemies | Aggressive/Coordinated | 28-33 | Regular occurrence now. |
| Corrupted elites | Aggressive | 28-33 | High CRP, stat chaos, bonus dark damage. |
| ???_CORRUPTED (Ch24) | Boss (unique) | 33 | Kael's data. Cycling weapons. 3 phases. |
| System (Ch25 boss) | Boss (unique) | 35 | Reads LOOP data. Adapts to player strategy. |
| Reinforcements | Continuous | 27-30 | Every 2-3 turns. Corruption Storm spawns extras. |

**Arc 5 AI philosophy**: Everything at once. Coordinated squads, ambushes, healers, flying threats. The full AI toolkit deployed simultaneously.

---

## Open Questions

- ~~**AI difficulty scaling**~~: **RESOLVED** — AI behaviors scale by arc. Arc 1 is simple (Aggressive/Stationary), Arc 5 uses all behaviors.
- ~~**Retreat behavior**~~: **RESOLVED** — Survival AI type.
- ~~**Healer enemies**~~: **RESOLVED** — Healer AI type.
- ~~**Coordinated attacks**~~: **RESOLVED** — Coordinated AI type (Arc 4+).
- **AI cheating**: Should boss AI know player unit stats regardless of AWR? *Recommendation: Bosses always see player stats. They ARE the System's agents.*
- **Aggro leashing**: Should aggressive enemies that chase too far give up and return? *Recommendation: No leash — aggressive means aggressive. Guard behavior is the "leashed" version.*
- **Enemy item usage**: Should all enemies with items use them (not just Survival)? *Recommendation: Yes — any enemy with a Vulnerary uses it at ≤40% HP. Adds realism.*
- **Thief escape**: If a thief reaches the map edge with stolen loot, does the item disappear? *Recommendation: Yes — creates real urgency. The item is gone.*
