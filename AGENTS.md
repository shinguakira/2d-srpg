# AGENTS.md

Rules that override judgement. `CLAUDE.md` describes how the project works.

## Art comes from the PixelLab API

`tools/sprites/` may call the API, arrange what comes back, and write it into
`src/assets/`. Nothing else.

Forbidden:

- rigs — joint angles, bone chains, anything that computes a pose and renders it
- cutting a character into parts and moving them
- hand-authored pixel art
- drawing any element procedurally — blade, cape, shadow, highlight

If the answer to "what draws this pixel?" is "our code", it is forbidden. When
generated art is wrong, change the request to the generator.

## Register the character before asking for more than one image

Two calls to a still endpoint return two drawings of a similar person, never the
same person, because each call is an independent diffusion sample. So a sheet
cannot be stitched from ordinary generations.

`create-character-v3` is the way around it. Register the approved standing frame
once and every later call names the character id instead of describing them
again; the service is then animating one saved drawing rather than inventing a
lookalike per clip. Shigeru's forty-six frames across seven clips are seven
calls, and they agree because of this.

So: **one still is one call. A sheet is a registration and then one call per
clip.** Stitching stills together is still forbidden.

## Never delete

- `src/assets/sprites/*.png` and `tools/sprites/reference/`. They were
  commissioned and approved, and several cannot be regenerated.
