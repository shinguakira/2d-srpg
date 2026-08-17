# Game Specs

## Structure

- **systems/** — how the game actually works. Written from the code, kept true
  to it.
- **story/** — the narrative: world, characters, bosses, arc, 25 chapter
  scripts, and the scale each chapter is built to. This is design intent, and
  most of it is **not implemented**.

## systems/ describes the code; story/ describes the intent

The game is a port of a Fire Emblem: The Sacred Stones PoC — TypeScript and
Canvas 2D, one chapter, the PoC's cast. `systems/` documents that.

`story/` is the Tsushima campaign: Shigeru, Akira, Takeshi, twenty-five chapters
across the island. Of it, only chapter 1's script and Shigeru himself are in the
game. Everything else is a target, not a description. Do not read `story/` as an
account of what the code does.

The specs that used to sit here — `gameplay/`, `maps/`, `ui/`, `progression/`,
`tasks/` — documented a React and Zustand implementation that no longer exists.
`old/` held a frozen archive of an earlier draft in which the world was openly a
game running on its 347th reset, with a different cast entirely; the current
story replaced it outright. All of it was removed rather than left to rot, on
the owner's instruction. Git history has every file.

## Conventions

- Keep files under 150 lines to stay context-friendly
- One topic per file — split if it grows too large
- Use tables for stat blocks
- Reference code paths where relevant (e.g. `src/battle/combat.ts`)
