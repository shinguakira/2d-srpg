# Stats

Defines every stat field in the game: what it means, how it's used in formulas, and design intent.

## Base Stats (per Unit)

| Stat | Abbr | Description | Used In |
|------|------|-------------|---------|
| **Hit Points** | HP | Health pool. Unit dies at 0. | Survival, currentHp tracks damage taken |
| **Strength** | STR | Physical attack power. | Physical damage = STR + weapon might - DEF |
| **Magic** | MAG | Magic attack/heal power. | Magic damage = MAG + might - RES; Heal = MAG + staff might |
| **Defense** | DEF | Reduces physical damage taken. | Subtracted from physical ATK |
| **Resistance** | RES | Reduces magic damage taken. | Subtracted from magic ATK |
| **Speed** | SPD | Evasion + double attack threshold. | Evade = SPD×2 + LCK; Double if SPD diff ≥ 5 |
| **Skill** | SKL | Accuracy + crit chance. | Accuracy = SKL×2 + LCK + weapon hit; Crit = SKL/2 + weapon crit |
| **Luck** | LCK | Small boost to hit, avoid, crit-avoid. | +LCK to accuracy & evade; -LCK from enemy crit |
| **Movement** | MOV | Tiles traversable per turn. | BFS pathfinding range; does NOT grow on level-up |

## Derived Stats (calculated, never stored)

These are computed on the fly from base stats + weapon + terrain.

| Derived Stat | Formula | Notes |
|--------------|---------|-------|
| **Attack (ATK)** | STR + weapon might (phys) or MAG + might (magic) | Before triangle modifier |
| **Accuracy** | SKL×2 + LCK + weapon hit | Before triangle modifier |
| **Evade** | SPD×2 + LCK + terrain avoid | Defender only |
| **Hit Rate** | Accuracy - Evade + triangle hit mod | Clamped 1–99% |
| **Crit Rate** | SKL/2 + weapon crit - enemy LCK | Clamped 0–100% |
| **Crit Damage** | Normal damage × 3 | Only on crit hit |
| **Terrain DEF** | terrain defenseBonus | Added to effective DEF |

## Weapon Triangle Modifiers

| Matchup | Hit Mod | Damage Mod |
|---------|---------|------------|
| Advantage (sword>axe, axe>lance, lance>sword) | +15 | +1 |
| Disadvantage | -15 | -1 |
| Neutral / cross-type | 0 | 0 |

Magic triangle: fire > wind > thunder > fire (same mods).

## Double Attack

A unit attacks twice if their SPD exceeds the opponent's SPD by **≥ 5**.
Both attacker and defender can double (defender only if they can counter).

## Growth Rates

Each class defines growth rates (0–100%) per stat (except MOV).
On level-up, each stat rolls independently against its growth rate: success = +1, fail = +0.

| Example: Lord | HP | STR | MAG | DEF | RES | SPD | SKL | LCK |
|---------------|----|----|-----|-----|-----|-----|-----|-----|
| Growth % | 80 | 45 | 10 | 30 | 20 | 50 | 45 | 60 |

## EXP & Level-Up

- **Base EXP**: 30 + (enemy level - attacker level) × 5, min 5
- **Kill bonus**: +50 EXP
- **Cap**: 100 EXP per action
- **Level-up**: at 100 EXP → carry remainder, gain 1 level, roll growths

## Stat Design Philosophy

- **STR vs MAG split**: Physical units dump MAG, mages dump STR — keeps them specialized
- **SPD is king**: Controls both offense (doubling) and defense (evade) — intentionally strong
- **SKL is subtle**: Matters most for low-hit weapons (axes) and crit builds
- **LCK is minor**: Small nudge to multiple formulas, never dominant — "nice to have" stat
- **DEF vs RES**: Most enemies are physical, so RES is niche but critical vs mages
- **MOV is class-locked**: Only changes via promotion (future), never via level-up — keeps cavalry unique

## Terrain Bonuses (for reference)

| Terrain | Move Cost | DEF Bonus | Avoid Bonus |
|---------|-----------|-----------|-------------|
| Plain | 1 | 0 | 0 |
| Forest | 2 | +1 | +20 |
| Mountain | 3 | +2 | +30 |
| Fort | 1 | +3 | +20 |
| Village | 1 | 0 | +10 |
| Throne | 1 | +5 | +30 |
| Water | impassable | — | — |
| Wall | impassable | — | — |

## Open Questions

- **Stat caps**: No global or per-class caps exist yet. Should we add them? (FE typically caps at 20-30 for unpromoted, 25-40 for promoted)
- **Weight / Attack Speed**: Weapons have a `weight` field but it's unused. Classic FE: AS = SPD - (weapon weight - STR), affecting double thresholds. Add this?
- **CON (Constitution)**: Some FE games add CON to offset weapon weight. Needed, or keep it simple?
- **Luck crit-avoid**: Currently LCK directly subtracts from enemy crit. Should this be LCK/2 instead?
