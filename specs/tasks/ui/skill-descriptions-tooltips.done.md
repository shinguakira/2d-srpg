# Skill Descriptions & Activation Rates in UI

> **Severity:** high
> **Category:** ui
> **Affected files:** `src/components/Combat/CombatPreview.tsx`, `src/components/UI/UnitDetailScreen.tsx`, `src/data/skills.ts`
> **Spec refs:** `specs/ui/combat-forecast-enhancements.md`, `specs/ui/hud.md`

## Description

Skills are listed by name only — "Sol", "Vantage", "Nihil" — with no explanation of what they do or when they activate. The `SKILLS` data object already has `description` and `activation` fields that are never displayed. Players cannot make informed risk assessments without knowing skill effects and trigger rates.

## Current Behavior

- `CombatPreview.tsx:173-188` renders skill names as plain `<span>` elements with no description
- `UnitDetailScreen.tsx:180-205` renders skill chips showing only `skill.name` + "Innate" label
- `SKILLS[id]` in `src/data/skills.ts` contains `description` (string) and `activation` (object with type/threshold) fields — both unused in UI
- Only special cases shown: Vantage warning (red text), Nihil warning (red text)

## Expected Behavior

### Combat Forecast (CombatPreview)

- Each skill name in the skill list shows description inline or on hover
- Format: `"Sol — 14% (SKL): Heal HP equal to damage dealt"`
- Activation rate computed from unit stats:
  - SKL%: `unit.stats.skl` + "%"
  - SPD%: `unit.stats.spd` + "%"
  - LCK%: `unit.stats.lck` + "%"
  - HP threshold: "Active below {threshold}% HP"
  - Passive: "Always active"

### Unit Detail Screen

- Skill chips expand to show description text on second line
- Description in dimmer color (#9ca3af, 11px)
- Activation info shown as small badge: "SKL 14%" or "Passive"

## Steps to Fix

- [x] Create helper `getSkillActivationText(skill, unitStats)` — returns human-readable activation string
- [x] In `CombatPreview.tsx`: for each skill in `attackerSkills`/`defenderSkills`, look up `SKILLS[skillId]` and render description + activation rate below skill name
- [x] Style: description text at 11px, opacity 0.6, below the bold skill name
- [x] In `UnitDetailScreen.tsx`: expand innate and learned skill sections to show `skill.description` as second line under each chip
- [x] Show activation badge next to skill name: "SKL 14%" in small text
- [x] Handle edge cases: skills without activation (passive), skills with HP threshold
- [x] `data-testid="skill-description-{skillId}"` on each description element
- [x] Test: view unit with Sol skill → description "Heal HP equal to damage dealt" visible
- [x] Test: combat forecast shows skill descriptions for both attacker and defender skills

## Spec Update

- [x] Update `specs/ui/combat-forecast-enhancements.md` — confirm skill descriptions section
