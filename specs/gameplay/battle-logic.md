# Battle Logic

Turn structure, phase flow, and action system. This covers the FLOW — for combat math and formulas, see [combat.md](combat.md).

Code reference: `src/stores/actions/turnActions.ts`, `selectionActions.ts`, `enemyActions.ts`

---

## Phase Structure

```
Player Phase → Enemy Phase → Player Phase → ...
```

Each chapter loops through these two phases until a victory or defeat condition is met. Turns are counted per full cycle (Player + Enemy = 1 turn).

### Phase Banner

Each phase starts with a full-screen phase banner (「Player Phase」/「Enemy Phase」) that pauses gameplay until dismissed. During the banner:
- No input is accepted (except dismiss)
- Fort/throne healing triggers
- Reinforcements spawn (enemy phase only)
- STA passive recovery on forts/thrones triggers

---

## Preparation Phase (Pre-Chapter)

Before each chapter (Ch2+), the player enters a preparation screen with the following options.

| Action | Description |
|--------|-------------|
| **Deploy units** | Choose which units to deploy from the roster (up to deployment limit) |
| **Position units** | Rearrange starting positions within deployment zone |
| **View map** | See terrain, starting positions, enemy placements (limited by INS) |
| **Equip skills** | Swap skills in/out of slots (up to slot limit per unit) |
| **Equip weapons** | Choose equipped weapon per unit, manage inventory |
| **Supply convoy** | Deposit/withdraw items from shared storage |
| **Shop** | Buy/sell weapons, items, food. Inventory varies by arc (see [economy.md](economy.md)) |
| **Forge** | Upgrade weapons with gold + materials (Arc 3+, see [economy.md](economy.md)) |
| **Use items** | Use consumables or food before battle |
| **Shigeru's Teaching** | Spend EMB to teach skills to allies (see [skills.md](skills.md)) |
| **Distribute Bonus EXP** | Allocate earned Bonus EXP to deployed units (see [experience.md](experience.md)) |
| **Support conversations** | View/trigger available support conversations |
| **View stats** | Check unit stats, growth history, INS/EMB/ATT, weapon ranks |

### Deployment Limit by Arc

| Arc | Max Deploy | Roster Size |
|-----|-----------|------------|
| Arc 1 (Ch1-5) | 3→6 | 3→8 |
| Arc 2 (Ch6-10) | 6→8 | 8→12 |
| Arc 3 (Ch11-15) | 8→10 | 12→16 |
| Arc 4 (Ch16-20) | 10→12 | 16→19 |
| Arc 5 (Ch21-25) | 12 | 17→19 |

Shigeru is always deployed. Cannot be removed.

### Preparation Restrictions

- Cannot change skills mid-chapter — only during preparation
- Cannot change unit deployment after chapter starts
- Shigeru's Teaching costs carry over (+5 STA at chapter start, +2 CRP to both)

---

## Player Phase

### Flow

```
1. Phase banner: "Player Phase" → dismissed
2. All player units reset: hasActed = false
3. Fort/throne healing: +5 HP (fort) or +10 HP (throne) for all player units on those tiles
4. STA recovery on forts: -3/turn (fort) or -5/turn (throne) for units standing there
5. Player selects and acts with units in any order
6. When all units have acted OR player manually ends turn → Enemy Phase
```

### Unit Selection

- Click a player unit that hasn't acted yet → **selected**
- Shows movement range (blue overlay) and attack range (red overlay)
- Hover tiles within movement range → show pathfinding path
- Click outside ranges → deselect
- Click another player unit → switch selection

### Movement

- Click a tile within movement range → unit moves there (pending confirmation)
- Movement cost is per-tile (see [terrain.md](terrain.md))
- Cannot move through enemy-occupied tiles
- CAN move through ally-occupied tiles (but cannot stop on them)
- After moving → **Action Menu** appears

### Action Menu

Available actions depend on context. All actions consume the unit's turn (hasActed = true) except where noted.

| Action | Condition | Effect |
|--------|-----------|--------|
| **Attack** | Enemy within weapon range from current position | Enter attack targeting mode |
| **Heal** | Staff equipped AND ally within staff range | Enter heal targeting mode |
| **Item** | Has usable items in inventory | Open item submenu |
| **Trade** | Adjacent ally exists | Swap items with adjacent ally. Consumes turn. |
| **Dance** | Dancer class AND adjacent ally who has already acted | Grant target another action this turn. Dancer's turn ends. |
| **Steal** | Thief/Rogue class AND adjacent enemy with stealable items | Take one non-equipped item from enemy. Consumes turn. |
| **Lockpick** | Thief/Rogue AND adjacent locked door/chest AND has Lockpick/Lockpick+ | Open lock. Consumes turn. |
| **Rescue** | Mounted/armored unit AND adjacent ally (STR > ally weight) | Pick up ally. Unit can still move (Canto) but cannot act further. |
| **Drop** | Carrying a rescued ally | Place carried ally on adjacent empty tile. Consumes turn. |
| **Seize** | Lord class AND standing on throne/objective tile | Capture objective → chapter ends (victory) |
| **Visit** | Standing on unvisited village tile | Trigger village event (reward: item, gold, or story) |
| **Wait** | Always available (except Gareth — No Patience passive) | End turn at current position |

### Attack Flow

```
1. Select "Attack" → show attack tiles (red overlay)
2. Hover enemy in range → show Combat Forecast panel
3. Click enemy → lock target
4. Weapon select (if multiple weapons can reach): choose weapon
5. Body targeting (if unlocked, Ch2+): choose target zone (body/head/arm/legs/weak point)
6. Confirm → resolve combat (see combat.md)
7. Combat animation plays
8. Results applied (damage, death, EXP, level-up)
9. Unit's turn ends (hasActed = true)
10. Canto: if mounted, remaining MOV available for repositioning
```

### Heal Flow

```
1. Select "Heal" → show heal range (green overlay)
2. Click ally in range → heal resolved immediately
3. Heal amount = MAG + staff might (capped at target's max HP)
4. Healer gains EXP
5. Unit's turn ends
```

### Dance Flow

```
1. Select "Dance" → highlight adjacent allies who have already acted
2. Click target ally → target's hasActed reset to false (can act again this turn)
3. Dancer gains 20 EXP (flat)
4. Dancer gains +3 STA (performance is tiring)
5. Dancer's turn ends
```

Viviane's Dance is unique — only Dancers can use this action. The refreshed ally gets a full turn (move + act). A unit can only be Danced once per turn.

### Steal Flow

```
1. Select "Steal" → show adjacent enemies
2. View enemy inventory → select item to steal (cannot steal equipped weapon)
3. Steal check: Thief's SPD > enemy SPD → auto-success. Otherwise: SPD×5% chance.
4. If success: item transfers to Thief's inventory (must have space)
5. Thief gains 15 EXP
6. Turn ends
```

Stealable items: consumables, gold, keys, unequipped weapons, forging materials. Cannot steal: equipped weapon, Prf items, key items.

### Rescue/Drop Flow

```
Rescue:
1. Select "Rescue" → highlight adjacent allies
2. Click ally → ally is picked up. Ally disappears from map.
3. Rescuer's STR and SPD halved while carrying.
4. Rescuer's MOV -2.
5. Rescuer can still use Canto (remaining MOV after action).

Drop:
1. Select "Drop" → highlight adjacent empty tiles
2. Click tile → carried ally placed there with hasActed = true
3. Rescuer's stats return to normal
4. Turn ends
```

**Weight rule**: Can only Rescue allies whose CON (= base class MOV value, used as weight proxy) is less than the rescuer's STR.

### Cancel / Undo

- **Before confirming action**: press Escape / right-click → return to action menu
- **Before moving**: press Escape → deselect unit
- **After action resolves**: no undo — turn is consumed

---

## Enemy Phase

### Flow

```
1. Phase banner: "Enemy Phase" → dismissed
2. Fort/throne healing for all enemy units on those tiles
3. Reinforcements spawn (if scheduled for this turn)
4. AI computes all enemy actions (see ai.md)
5. Actions execute one at a time, sequentially (with animation)
6. After all enemies act → Player Phase (next turn)
```

### Reinforcement Spawning

- Defined per chapter: which units spawn, where, and on which turn
- Spawn on the enemy phase of the specified turn
- Cannot spawn on occupied tiles (skipped if blocked)
- Show reinforcement message to player (e.g., "Enemy reinforcements!")
- Reinforcements can act immediately on the turn they spawn (Hard mode) or next turn (Classic/Casual mode)

### Enemy Action Execution

Each enemy acts one at a time in sequence:
1. Camera pans to the acting enemy
2. Enemy moves (if moving)
3. Enemy attacks (if target available)
4. Combat animation plays
5. Results applied
6. Brief pause → next enemy

---

## Fog of War

Some chapters (primarily Arc 3+) use limited visibility.

### Rules

- Player vision is limited to units' sight range (default: 3 tiles around each unit)
- Tiles outside vision are darkened — terrain visible but enemies/items hidden
- Moving a unit into fog may reveal hidden enemies (ambush risk)
- Enemies always have full vision (they know the map)
- Revealed enemies stay visible until they move out of all player vision

### Sight Range

| Class/Item | Sight Range |
|------------|------------|
| Most units | 3 tiles |
| Thief/Rogue | 5 tiles (keen eyes) |
| Torch (item) | Reveals 5-tile radius around user for current turn |
| Torch Staff | Reveals 7-tile radius at target location for 3 turns |
| INS ≥ 61 (Decoded) | +1 sight range (System-enhanced awareness) |

### Design Intent

Fog of war creates information scarcity. High-INS units and Thieves become valuable scouts. Forces cautious play and punishes reckless advancing.

---

## Auto-Battle

Player can toggle auto-battle during player phase. The AI takes over player unit actions using the same AI system as enemies, but with faction-swapped targeting.

- Can be toggled on/off at any time during player phase
- When on, AI selects the next unacted player unit and executes an action
- Uses aggressive behavior by default
- Healers prioritize healing injured allies over waiting
- Auto-battle respects all normal rules (weapon triangle, terrain, etc.)
- Shigeru's EMB abilities are NOT used in auto-battle (too valuable for AI to spend)

---

## Unit State Per Turn

| State | Meaning | Visual |
|-------|---------|--------|
| **Available** | Has not acted this turn | Full color sprite |
| **Acted** | Has used their action (hasActed = true) | Greyed-out sprite |
| **Refreshed** | Was Danced — acting again this turn | Full color + sparkle effect |
| **Rescued** | Being carried by an ally | Not visible on map |
| **Dead** | HP reached 0 (permadeath) | Removed from map |

### Movement vs Action

A unit's turn consists of:
1. **Move** (optional) — move to a tile within range
2. **Action** (required) — Attack, Heal, Item, Trade, Dance, Steal, Rescue, Drop, Wait, Seize, Visit, or Lockpick

Once an action is taken, the unit is done for the turn. Exceptions:
- **Canto** (mounted units) — after acting, can use remaining MOV to reposition
- **Reckless** (Gareth) — after killing, can act again (up to 2 bonus turns)

---

## Turn Counter

- Starts at Turn 1
- Increments after both Player and Enemy phases complete
- Used for:
  - Reinforcement timing
  - Turn-limited objectives (par time for Bonus EXP)
  - STA accumulation tracking
  - Time-of-day progression
  - Mid-chapter event triggers

---

## Mid-Chapter Events

Scripted events that trigger during gameplay based on conditions:

| Trigger Type | Example |
|-------------|---------|
| **Turn-based** | "Reinforcements arrive on Turn 5" |
| **Position-based** | "Dialogue triggers when Shigeru steps on tile (5,3)" |
| **HP threshold** | "Boss enters Phase 2 at 50% HP" |
| **Kill-based** | "Defeat all mini-bosses to open the gate" |
| **Item-based** | "Use the Cipher Stone to reveal enemy positions" |

Events can: spawn reinforcements, change terrain, trigger dialogue, give/remove items, change victory conditions.

---

## End Turn

### Manual End Turn

Player can press "End Turn" button at any time during player phase. All unacted units forfeit their turn.

### Auto End Turn

When the last player unit acts (all units hasActed = true), the player phase ends automatically.

---

## Victory / Defeat Conditions

### Victory

| Condition | Description |
|-----------|-------------|
| **Rout** | All enemy units defeated |
| **Seize** | Lord captures the throne/objective tile |
| **Boss Kill** | Specific boss enemy defeated |
| **Survive** | Survive N turns (see [objectives.md](objectives.md)) |
| **Escape** | All required units reach exit tiles |
| **Protect** | Keep NPC alive for N turns |

Each chapter specifies which victory condition(s) apply. See [objectives.md](objectives.md) for full list.

### Defeat

| Condition | Result |
|-----------|--------|
| **Lord dies** | Instant game over — Shigeru must survive every chapter |
| **All player units die** | Game over |
| **Protected NPC dies** | Game over (protect objectives only) |
| **Turn limit exceeded** | Game over (timed objectives only) |

### Post-Victory

```
1. Victory fanfare
2. Chapter results screen (turns taken, units lost, Bonus EXP earned)
3. EXP/level-up summary for all units
4. Story scene / dialogue
5. Transition to preparation phase for next chapter
```

---

## Meta-Stat Phase Effects

| Stat | Phase Effect |
|------|-------------|
| **STA** | Accumulates during player actions (move/attack). Resets to 0 at chapter start. Recovery at forts/thrones. |
| **CRP** | Increases from glitched terrain, corrupted enemies, dark magic use. Decreases via healing, items, passive decay. See [stats.md](stats.md). |
| **LOY** | Changes based on player decisions during story events. Devotion auto-shield triggers during combat. |
| **ATT** | Increases at forts/thrones (+2/+3 per turn). Decreases on glitched terrain. Affects stat consistency. |
| **INS** | Increases from witnessing glitches, story events. Unlocks UI elements (enemy stats, terrain info). |
| **EMB** | Decreases when Shigeru uses memory abilities. Increases from kills, trauma. +10 regen between arcs. |

---

## Open Questions

- **Undo move**: Should the player be able to undo movement (before acting) like modern FE? *Recommendation: Yes — quality of life. Cancel movement if no action taken yet.*
- **Danger zone**: Currently shows attack range. Should it also show kill zones? *Recommendation: Show kill zones as darker red overlay for units that would die.*
- **Thief AI priority**: When enemy thieves target chests, should they ignore combat entirely? *Recommendation: Yes — creates urgency to reach chests first. See [ai.md](ai.md).*
