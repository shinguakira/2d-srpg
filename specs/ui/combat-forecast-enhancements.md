# Combat Forecast Enhancements

Planned improvements to `CombatPreview` to surface tactical data that exists in the game logic but is currently invisible to the player.

See [hud.md](hud.md) for current forecast spec. See [../gameplay/combat.md](../gameplay/combat.md) for combat formulas.

---

## Weapon Effectiveness Warning

When a weapon has `effectiveAgainst` tags matching the defender's class flags (armored, mounted, flying, system_construct), display a prominent warning. Effective weapons deal **3x weapon might** — the single biggest damage modifier.

- **Attacker side**: green pulsing "EFFECTIVE!" text below DMG stat
- **Defender side**: yellow "Weak to [weapon]!" text if their class matches
- Uses `isEffectiveAgainst(weapon, defenderUnit)` exported from `src/core/combat.ts`
- `data-testid="forecast-effective"`

Also shown in ActionMenu weapon selector: "Eff!" badge on weapons effective against the hovered target.

---

## Skill Descriptions & Activation Rates

Currently skills are listed by name only (e.g. "Sol", "Vantage"). Players cannot know what they do or how often they trigger.

### In Combat Forecast

Each skill name in the skills section shows inline or on-hover:
- **Description**: from `SKILLS[id].description` (e.g. "Heal HP equal to damage dealt")
- **Activation rate**: computed from unit stats + skill activation type
  - SKL-based: "{unit.stats.skl}%"
  - SPD-based: "{unit.stats.spd}%"
  - LCK-based: "{unit.stats.lck}%"
  - HP threshold: "Active below {threshold}% HP"
  - Passive: "Always active"

Format: `"Sol — 14% (SKL): Heal HP equal to damage dealt"`

### In Unit Detail Screen

Expand skill chips to show description text and activation info on a second line below the skill name. Use dimmer color (#9ca3af) for description text.

Data source: `SKILLS` from `src/data/skills.ts`

---

## Combat Modifier Breakdown

Collapsible section below main forecast stats showing the source of each modifier affecting DMG/HIT/CRIT. Only shows non-zero modifiers. Collapsed by default, toggle with small arrow.

### Modifier Sources

| Source | Example Display | Data Source |
|--------|----------------|-------------|
| Weapon triangle | "Triangle: HIT +15, DMG +1" | `getWeaponTriangle()` |
| Terrain (defender) | "Terrain (Forest): AVO +20" | `getTerrainData()` |
| Weather | "Rain: HIT -15 (bow)" | `getWeatherCombatModifiers()` |
| Support | "Support (Marcus B): HIT +10, AVO +10" | `getTotalSupportBonuses()` |
| SYNC bonus | "SYNC 85: HIT +5" | `applySyncHitBonus()` |
| STA penalty | "STA 32: SPD -1" | threshold check in `metaStats.ts` |
| Effectiveness | "Effective: Mt x3" | `isEffectiveAgainst()` |
| Non-proficient | "Not proficient: HIT -20, DMG -2" | proficiency check in `combat.ts` |

- Text style: 11px, opacity 0.6, left-aligned under main stats
- `data-testid="forecast-modifiers"`

---

## Boss Phase HP Indicators

When targeting a boss with `bossPhases`, show upcoming phase transitions:

### On HP Bar

Tick marks at each `hpThreshold` value on the enemy HP bar. Color-coded by phase (gold phase 0, red phase 1, purple phase 2+).

### Phase Info Text

Below the enemy stats, show the next phase transition:
- "Phase 2 at 50% HP: +Physical Immunity"
- "Phase 3 at 25% HP: Weapon swap, +Self Heal"

Fields from `bossPhases[]`: `hpThreshold`, `statChanges`, `weaponId`, `immunity`, `selfHeal`, `aiChange`

### In Unit Detail Screen

"Boss Phases" section after skills, listing all phases with:

| Phase | HP Threshold | Changes |
|-------|-------------|---------|
| Phase 1 | 75% | STR +3, DEF +2 |
| Phase 2 | 50% | Physical Immunity, Weapon: Dark |
| Phase 3 | 25% | Self Heal 10/turn, AI: Aggressive |

Data source: `unit.bossPhases` array

---

## Weapon Durability in Forecast

Show remaining weapon uses next to weapon name for both attacker and defender:

- Format: "Iron Sword (23/40)" or "Garrison Lance" (no count for infinite)
- Warn in red when durability <= 3: "Iron Sword (2/40)"
- `data-testid="forecast-durability"`
