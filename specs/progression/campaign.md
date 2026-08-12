# Campaign

Campaign flow, chapter progression, unlock conditions, and 5-arc structure.

---

## Campaign Structure

25 chapters across 5 arcs. Linear progression — no route splits. Story choices affect dialogue, recruitment, and difficulty but not the chapter order.

```
Arc 1: "The Script"         Ch1 → Ch2 → Ch3 → Ch4 → Ch5
Arc 2: "Fractures"          Ch6 → Ch7 → Ch8 → Ch9 → Ch10
Arc 3: "Corruption"         Ch11 → Ch12 → Ch13 → Ch14 → Ch15
Arc 4: "Awakening"          Ch16 → Ch17 → Ch18 → Ch19 → Ch20
Arc 5: "The Last Save File" Ch21 → Ch22 → Ch23 → Ch24 → Ch25
```

---

## Chapter Flow

### Sequence per Chapter

```
Title Card → Prologue Dialogue → Preparation Phase → Battle → Mid-Battle Events → Victory → Epilogue Dialogue → Results Screen → Save Prompt → Next Chapter
```

1. **Title Card**: Chapter number, name, arc title. Brief narration.
2. **Prologue Dialogue**: Story setup, character conversations, hints about the map.
3. **Preparation Phase**: Deploy units, manage inventory, shop, forge, use Bonus EXP. See [preparation.md](preparation.md).
4. **Battle**: Tactical combat. Player phase → Enemy phase loop until objective met.
5. **Mid-Battle Events**: Scripted events triggered by turn count, position, HP, or kills. See [objectives.md](../gameplay/objectives.md).
6. **Victory**: Objective complete → victory fanfare → defeated enemies removed.
7. **Epilogue Dialogue**: Story resolution, character reactions, setup for next chapter.
8. **Results Screen**: EXP earned, Bonus EXP calculated, items obtained, gold earned, par turns comparison.
9. **Save Prompt**: Auto-save + manual save option.
10. **Next Chapter**: Advance to next chapter's Title Card.

### First Chapter (Ch1) Exception

- No Preparation Phase (roster is fixed, no shop access)
- Prologue serves as tutorial narration
- Simpler results screen (fewer stats to display)

### Arc Transition Chapters (Ch5, Ch10, Ch15, Ch20)

Between arcs, additional events occur after the results screen:

- **Arc Summary**: Recap of key events, choices made, units lost
- **EMB Regen**: Shigeru recovers +10 EMB between arcs
- **CRP Decay Check**: Units below CRP 15 for 3+ chapters lose -1 CRP
- **Shop Refresh**: New arc's shop inventory unlocks
- **Story Interlude**: Extended dialogue scene setting up the next arc's theme

---

## Unlocks

### Chapter Unlocks

Chapters unlock linearly. Completing Ch*N* unlocks Ch*N+1*. No chapters can be skipped.

| Unlock | Condition |
|--------|-----------|
| Ch1 | Start new game |
| Ch2-5 | Complete previous chapter |
| Ch6-10 | Complete previous chapter |
| Ch11-15 | Complete previous chapter |
| Ch16-20 | Complete previous chapter |
| Ch21-25 | Complete previous chapter |

### System Unlocks (Progressive)

Features that unlock as the campaign progresses:

| Feature | Unlocked At | Notes |
|---------|------------|-------|
| **Preparation Phase** | Ch2 | Ch1 has no preparation |
| **Shops** | Ch2 | Iron-tier weapons and basic items |
| **Support Conversations** | Ch3 | After 3 units with adjacency history |
| **Villages** | Ch2 | Visitable for rewards |
| **Chests** | Ch4 | First keys and Thief available |
| **Promotion** | Ch7 | First class-specific seals in shop |
| **Arena** | Ch7 | Optional training venue |
| **Forging** | Ch11 | Unlocked at Arc 3 start |
| **Bonus EXP Distribution** | Ch6 | Available in preparation from Arc 2 |
| **Fog of War** | Ch13 | First fog chapter |
| **Master Class Seals** | Ch18 | First Master Crown |
| **Legendary Weapons** | Ch18 | Story-gated Prf weapons |

### Recruitment Unlocks

See [roster.md](../story/roster.md) for full recruitment timeline. Key conditions:

| Character | Chapter | Condition |
|-----------|---------|-----------|
| Halvar | Ch2 | Automatic (enemy defection event) |
| Bryn | Ch3 | Visit village tile |
| Fenn | Ch4 | Catch thief event |
| Elin | Ch5 | Automatic (start of chapter) |
| Corwin | Ch6 | Automatic (start of chapter) |
| Nadine | Ch6 | Automatic (mid-chapter) |
| Viviane | Ch9 | Talk with Mirelle (secondary objective) |
| Kira | Ch11 | Automatic (mid-chapter defection) |
| Zael | Ch13 | Spare at ≤5 HP + dialogue (conditional) |
| Elara | Ch14 | Automatic (start of chapter) |
| Ghael | Ch18 | Reduce to ≤5 HP + talk with Shigeru (conditional) |
| Echo | Ch20 | Protect NPC until chapter end (conditional) |

---

## Completion Tracking

### Per-Chapter Tracking

Each completed chapter records:

| Data | Description |
|------|-------------|
| **Turns taken** | Total turns to complete |
| **Par met** | Whether completed at or under par turns |
| **Units lost** | Permadeath count (Classic mode) |
| **Secondary objective** | Completed or not |
| **Recruits obtained** | Characters recruited this chapter |
| **Boss fate** | Killed, spared, recruited, or negotiated |
| **Items obtained** | Key items, chests opened, village rewards |
| **Gold earned** | Total from all sources |
| **Bonus EXP earned** | From par turn performance |

### Campaign-Level Tracking

| Data | Description |
|------|-------------|
| **Total chapters completed** | 0-25 |
| **Current arc** | 1-5 |
| **Total units lost** | Cumulative permadeaths |
| **Total gold earned/spent** | Running economy totals |
| **Conditional recruits obtained** | Zael, Ghael, Echo (yes/no each) |
| **System negotiated** | Ch17 negotiation success (yes/no) |
| **Endings unlocked** | Based on choices across arcs |

---

## Branching (Conditional Content)

No route splits — the chapter order is always Ch1-25. But player choices create **state branches** that affect later content:

### Key State Variables

| Variable | Set By | Affects |
|----------|--------|---------|
| **kael_survive_turns** | Ch8 (how long Akira survived) | Dialogue in Ch24, grief intensity |
| **zael_recruited** | Ch13 (spare + talk) | Ch14 boss changes, roster |
| **ch12_corruption_victim** | Ch12 (who had highest CRP) | Which unit is lost to corruption |
| **system_negotiated** | Ch17 (INS ≥ 70 + boss HP ≤ 50%) | Ch25 final boss Phase 1 stats reduced by 20% |
| **ghael_recruited** | Ch18 (reduce + talk) | Roster, loses Master Crown drop |
| **echo_saved** | Ch20 (protect NPC) | Roster, Ch25 dialogue changes |
| **total_deaths** | Cumulative | Ending dialogue variations |
| **final_loop** | Ch25 Shigeru's EMB value | System Phase 1 stat scaling |

### Ending Conditions

| Ending | Requirements |
|--------|-------------|
| **True Ending** | Defeat System Phase 3 + use Final Save Crystal |
| **Bittersweet Ending** | Defeat System Phase 3 + choose to let System reset |
| **Tragic Ending** | Lose 5+ units total across campaign (adjusted dialogue) |
| **Perfect Ending** | True Ending + zero permadeaths + all conditionals recruited |

---

## Difficulty Modes

Selected at campaign start, cannot be changed mid-campaign.

| Mode | Permadeath | Enemy Stats | Reinforcement Timing | Notes |
|------|-----------|-------------|---------------------|-------|
| **Classic** | Yes (permanent) | Normal | Normal | Intended experience |
| **Casual** | No (return next chapter) | Normal | Normal | Story-focused players |
| **Hard** | Yes (permanent) | +10% all stats | 1 turn earlier | For SRPG veterans |

---

## New Game+

After completing the campaign once:

- **Carry over**: Support rank progress (not stats or items)
- **Unlock**: Hard mode (if not selected initially)
- **Unlock**: Gallery mode (view all obtained support conversations, boss dialogues)
- **Reset**: All stats, items, gold, levels start fresh
- **Meta twist**: Shigeru's cycle count changes from 347 to 348. His opening dialogue acknowledges the player's second run.

---

## Save System

### Save Slots

- **3 manual save slots** per campaign
- **1 auto-save slot** (overwrites each chapter transition)
- Save data stored in `localStorage` (see [saves.md](saves.md) for key schema)

### What's Saved

- Current chapter progress (start of chapter only — no mid-chapter saves)
- Full unit state: levels, stats, inventory, support ranks, meta-stats
- Campaign tracking data (see Completion Tracking above)
- State variables (see Branching above)
- Gold, convoy contents
- Difficulty mode

### Save Points

- Auto-save triggers at chapter start (after preparation, before battle)
- Manual save available at chapter start and after chapter completion
- No mid-battle saving (one-shot per chapter — true to the meta-narrative of "one save file")

---

## Chapter Names

| Ch | Name | Arc |
|----|------|-----|
| 1 | "Not This Again" | The Script |
| 2 | "The Defector" | The Script |
| 3 | "Scout's Honor" | The Script |
| 4 | "The Pickpocket" | The Script |
| 5 | "Above the Clouds" | The Script |
| 6 | "New Alliances" | Fractures |
| 7 | "The Seed Breaks" | Fractures |
| 8 | "The Last Ride" | Fractures |
| 9 | "The Void Left Behind" | Fractures |
| 10 | "What We Carry" | Fractures |
| 11 | "Spreading Plague" | Corruption |
| 12 | "The Turning" | Corruption |
| 13 | "Second Chances" | Corruption |
| 14 | "The Monastery" | Corruption |
| 15 | "The Rally" | Corruption |
| 16 | "Through Its Eyes" | Awakening |
| 17 | "Data Recovery" | Awakening |
| 18 | "Legacy Weapons" | Awakening |
| 19 | "The Offer" | Awakening |
| 20 | "Point of No Return" | Awakening |
| 21 | "The Long March" | The Last Save File |
| 22 | "Ghosts of Cycles Past" | The Last Save File |
| 23 | "The Penultimate" | The Last Save File |
| 24 | "???_CORRUPTED" | The Last Save File |
| 25 | "The Last Save File" | The Last Save File |
