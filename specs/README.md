# Game Specs

Design specifications for the 2D SRPG project.

## Structure

- **story/** — Narrative, characters, chapter scripts
- **gameplay/** — Combat, classes, weapons, items, AI, balance
- **maps/** — Per-chapter map layouts, objectives, placements
- **ui/** — HUD, animations, camera
- **progression/** — Campaign flow, saves, preparation

## Conventions

- Keep files under 150 lines to stay context-friendly
- One topic per file — split if it grows too large
- Use tables for stat blocks
- Reference code paths where relevant (e.g. `src/core/combat.ts`)
