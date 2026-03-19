# Game Specs

Design specifications for the 2D SRPG project.

## Structure

- **story/** — Narrative, characters, chapter scripts
- **gameplay/** — Combat, classes, weapons, items, AI, balance
- **maps/** — Per-chapter map layouts, objectives, placements
- **ui/** — HUD, animations, camera
- **progression/** — Campaign flow, saves, preparation
- **old/** — ⚠️ ARCHIVED SNAPSHOT. DO NOT DELETE. See below.

## ⚠️ WARNING: specs/old/ is READ-ONLY archive

**NEVER delete `specs/old/` or any files inside it.**

This folder is a frozen snapshot of the specs at a point in time, kept for reference and diff comparison. It must NEVER be modified, renamed, moved, or deleted — by humans or AI agents.

- Do NOT "clean up" by removing old/
- Do NOT merge old/ back into the main specs
- Do NOT update files inside old/ to match current specs
- If you need a new snapshot, create a new folder (e.g. `old-v2/`)

## Conventions

- Keep files under 150 lines to stay context-friendly
- One topic per file — split if it grows too large
- Use tables for stat blocks
- Reference code paths where relevant (e.g. `src/core/combat.ts`)
