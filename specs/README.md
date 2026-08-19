# Game Specs

## Structure

- **systems/** — how the game actually works. Written from the code, kept true
  to it.
- **story/** — the narrative: world, characters, bosses, arc, 25 chapter
  scripts, and the scale each chapter is built to. This is design intent, and
  most of it is **not implemented**.

## systems/ describes the code; story/ describes the intent

The game is a port of a Fire Emblem: The Sacred Stones PoC — TypeScript and
Canvas 2D, three chapters, the PoC's cast. `systems/` documents that.

`story/` is the Amagi campaign: Shigeru, Akira, Takeshi, twenty-five chapters
across the island. Three are built, and the cast in them is still the PoC's with
two exceptions. Everything else is a target, not a description. Do not read
`story/` as an account of what the code does.

Everything that documented the deleted React implementation was removed with it.
Git history has it.

## Conventions

- Keep files under 150 lines to stay context-friendly
- One topic per file — split if it grows too large
- Use tables for stat blocks
- Reference code paths where relevant (e.g. `src/battle/combat.ts`)
