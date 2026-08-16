# AGENTS.md

Rules that override judgement. `CLAUDE.md` describes how the project works; this
file lists what is not up for discussion.

## Art is generated. Our code does not draw.

Every character pixel in this game comes out of the PixelLab API. Tooling in
`tools/sprites/` exists to **call the API, arrange what comes back, and put it in
the game**. That is the whole remit:

- call the endpoint
- slice or compose a sheet on a grid
- quantise to the colour budget, snap the outline, force hard alpha
- measure the anchor and write into `src/assets/`

### Forbidden, permanently

Do not propose, prototype, or build any of these, in any form or under any name:

- **a rig** — joint angles, bone chains, `solve()`, anything that computes a pose
  and renders limbs
- **cutting a character into parts** and moving them — cutout/paper-doll
  animation, "just the sword arm", "only the legs"
- **hand-authored pixel art** — palette maps, row strings, drawing a sprite by
  typing it
- **drawing any element procedurally** — a blade, a cape, a shadow, a highlight.
  If it is part of the character, the generator draws it.

All four have been tried in this repo and rejected. They are the same instinct
wearing different clothes: taking the drawing back into our own code. Recognise
it by the shape, not the name — if the answer to "what draws this pixel?" is
"our code", it is forbidden.

The tell is reaching for tooling we already wrote instead of the service the
user chose. When generated art comes out wrong, the fix is a different *request*
to the generator, never a decision to draw it ourselves.

## One image comes from one generation.

Never assemble one sprite sheet out of several API calls. Each call is an
independent diffusion sample: the reference image is a brief, not a source, so
separate calls return separate drawings of a similar character.

Measured on a sheet built from seven calls: the figure's own bounding box ranged
32–74px wide, one armour colour covered 33× more pixels in one frame than
another, and consecutive frames of the attack clip shared 28% of their
silhouette. No prompt or guidance setting fixes this. It is a property of
sampling, not of the wording.

So: **a sheet is one generation.** If a sheet cannot be produced in one call,
the number of frames or the size changes — not the number of calls.

## Never delete

- **`specs/old/`** — frozen archive of the game design specs. Read-only. If a
  new snapshot is wanted, create a new folder.
- **`src/assets/sprites/*.png` that the game still imports.** Some were produced
  by tooling that has since been removed; they are art, not build output, and
  cannot be regenerated. Check `spriteSheetConfig.ts` and `generatedSheets.ts`
  before removing any sprite.

## Secrets

`PIXELLAB_SECRET` lives in `.env.local`, gitignored via `*.local`. Never print
it, never paste it into a message, never commit it.
