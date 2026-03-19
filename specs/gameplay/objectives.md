# Chapter Objectives

Victory conditions, optional objectives, and turn-based rewards across 25 chapters.

---

## Objective Types

| Type | Description | Victory Trigger |
|------|-------------|----------------|
| **Rout** | Defeat all enemies | Enemy count reaches 0 |
| **Seize** | Lord captures objective tile | Ren uses Seize on throne/gate |
| **Boss Kill** | Defeat specific boss | Boss HP reaches 0 |
| **Survive** | Survive N turns | Turn counter reaches target |
| **Escape** | All required units reach exit | All specified units on exit tiles |
| **Protect** | Keep NPC alive for N turns | NPC survives until turn target |
| **Capture** | Control specific tiles | All target tiles occupied by player units |
| **Dual** | Two conditions (AND or OR) | Both/either conditions met |

---

## Objectives by Chapter

| Chapter | Primary Objective | Secondary (Optional) | Par Turns | Notes |
|---------|------------------|---------------------|-----------|-------|
| Ch1 | Rout | — | 10 | Tutorial. Simple. |
| Ch2 | Seize | Visit all villages (2) | 15 | Learn seize + villages |
| Ch3 | Boss Kill | Recruit Nira (visit village tile) | 14 | Nira joins if visited |
| Ch4 | Rout | Open all chests (3) before thieves | 16 | Enemy thieves race to chests |
| Ch5 | Seize | Protect villagers (3 NPC survive) | 18 | Yuel recruitment chapter |
| Ch6 | Boss Kill | Rout within par turns | 16 | Rook/Faye join mid-chapter |
| Ch7 | Seize | Capture armory tile for bonus shop | 20 | First promotion items available |
| Ch8 | Survive 12 turns | Keep Kael alive as long as possible | 12 | Kael dies scripted. Bonus if he survives 10+ turns. |
| Ch9 | Escape (all units to exit) | Recruit Orin (talk with Lira) | 18 | Retreat chapter. Dancer joins. |
| Ch10 | Boss Kill + Seize | Complete in ≤15 turns for Master Seal | 20 | Arc 2 finale. Multi-objective. |
| Ch11 | Rout | No units gain CRP > 15 | 22 | Corruption introduction |
| Ch12 | Protect NPC (monk) 8 turns | Defeat all mini-bosses (3) | 20 | Monastery defense |
| Ch13 | Boss Kill | Recruit Zael (spare + dialogue) | 22 | Conditional recruitment |
| Ch14 | Seize | Cleansing ritual (reach tile with Elara) | 24 | Elara joins. Ancient Tome event. |
| Ch15 | Rout | Complete under par for Adamant | 22 | Arc 3 finale. Resource reward. |
| Ch16 | Seize | Capture all 3 ballista tiles | 25 | Siege chapter. System Fragment drop. |
| Ch17 | Boss Kill (dialogue option) | Negotiate with System (requires AWR ≥ 70 on Ren) | 25 | Can talk boss down if conditions met |
| Ch18 | Dual: Boss Kill + Seize | Recruit Ghael (reduce to ≤5 HP, talk) | 28 | Ghael joins. Master Crown reward. |
| Ch19 | Survive 15 turns | Find Memory Shard (hidden tile) | 15 | Defense chapter. Emotional flashback. |
| Ch20 | Boss Kill | Protect Echo (NPC → joins if alive) | 25 | Echo joins. Echo's Core event. |
| Ch21 | Rout | Complete under par for Mithril | 28 | Endgame begins |
| Ch22 | Seize | Find hidden Master Crown (Thief required) | 28 | Hidden treasure chapter |
| Ch23 | Escape (split team) | Both groups escape within 2 turns of each other | 25 | Split party chapter |
| Ch24 | Boss Kill (???_CORRUPTED) | Survive ???'s 3 phases | 30 | Kael reveal. Emotional devastation. |
| Ch25 | Defeat System | Use Final Save Crystal | 30+ | True ending requires crystal. Multiple phases. |

---

## Secondary Objective Rewards

| Reward Type | Example | Chapters |
|------------|---------|----------|
| **Bonus item** | Stat booster, rare weapon | Ch3, Ch10, Ch15, Ch21, Ch22 |
| **Recruitment** | Optional character joins | Ch3, Ch9, Ch13, Ch18, Ch20 |
| **Bonus EXP** | Extra Bonus EXP pool | All (par turn bonus) |
| **Story content** | Extra dialogue, lore | Ch17, Ch19, Ch24 |
| **Resource** | Adamant, Mithril, gold | Ch7, Ch15, Ch21 |
| **Deployment bonus** | +1 deploy next chapter | Ch10 |

Failing secondary objectives doesn't cause game over — only primary objectives are required.

---

## Par Turns (Bonus EXP Trigger)

Completing a chapter at or under par turns earns Bonus EXP:

```
Bonus EXP = (par - actual turns) × 50
Maximum: 300 Bonus EXP per chapter
```

Par turns are generous — designed so a competent player beats them without rushing. Aggressive/optimal play earns more Bonus EXP.

---

## Special Objective Rules

### Survive Chapters (Ch8, Ch19)

- Victory triggers automatically at the target turn — no need to kill anyone
- Player can still attack enemies for EXP (not required)
- Reinforcements increase each turn — overwhelming force by the end
- The challenge is positioning and healing, not killing

### Escape Chapters (Ch9, Ch23)

- All required units must reach designated exit tiles
- Units on exit tiles are "escaped" — removed from map, safe
- If Ren escapes, chapter ends (all remaining units auto-escape)
- Units that haven't escaped when Ren does lose any EXP they would have gained that turn
- Ch23 unique: party is split into two groups on separate map sections

### Protect Chapters (Ch5, Ch12, Ch20)

- NPC has their own stats and AI (moves on their own or follows nearest ally)
- NPC death = game over (for that chapter)
- NPCs cannot be healed by player staves (they're not in the party yet)
- After protection succeeds, NPC may join the party

### Negotiate Objective (Ch17)

- Unique one-time mechanic: Ren can attempt to talk to the chapter boss
- Requires: Ren adjacent to boss, Ren's AWR ≥ 70, boss HP ≤ 50%
- If conditions met: special dialogue plays, boss retreats (not killed)
- Affects Ch25 final boss difficulty (negotiated = easier final fight)
- If conditions NOT met: must kill boss normally

---

## Open Questions

- **Ranking system**: Should chapters grade performance (S/A/B/C) beyond just par turns? *Recommendation: Yes — turns, deaths, and secondary objectives all factor into rank. Rank affects post-chapter gold reward.*
- **Ironman mode**: No chapter retry — one continuous save? *Recommendation: Optional as a difficulty mode, not default.*
- **Multi-map chapters**: Should any chapters span two connected maps (e.g., indoor + outdoor)? *Recommendation: Ch18 (fortress) and Ch25 (final) could benefit from this.*
