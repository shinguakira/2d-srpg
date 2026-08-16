# Dialogue portraits

One PNG per speaker, named after the speaker as it appears in the script,
lowercased with non-alphanumerics turned into hyphens:

    Shigeru      -> shigeru.png
    Elder Ilse   -> elder-ilse.png

`src/components/sprites/portraits.tsx` globs this directory, so a file dropped
here appears in dialogue with no code change. A speaker with no file here falls
back to their battle sprite, scaled up.

These are not map sprites. A portrait is drawn at conversation resolution
(128px and up) and shows head and shoulders — the whole point is the detail that
does not survive at 32px. Generate one with:

    node tools/sprites/pixellab.mjs portrait shigeru "<description>" --size 128

then crop/clean and save it here. `tools/sprites/out/` is where the raw
generator output lands and is gitignored; only the finished file belongs in this
directory.
