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

## Only approved references may be sent

`tools/sprites/reference/` holds the images the user has approved. Those are the
only images that may be sent to the API as a reference, style or init image.

Never send generated output back as a reference. Never send a modified version —
padding it to meet the endpoint's size requirement is allowed, altering it is
not.

For Shigeru that is `reference/shigeru.png`: one 64x64 standing frame.

## One image comes from one generation

Never build a sheet from several API calls. Each call is an independent
diffusion sample, so separate calls return separate drawings of a similar
character. If a sheet will not fit in one call, change the frame count or the
size — not the number of calls.

## Never delete

- `specs/old/` — frozen archive, read-only.
- `src/assets/sprites/*.png` and `tools/sprites/reference/`. Nothing in the
  renderer reads them today — `src/render/sprites.ts` draws characters in code —
  but they were commissioned and approved, and several cannot be regenerated.
