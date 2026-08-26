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

## Nobody in the story knows they are in a game

Characters live on an island, not in a piece of software. **A line of dialogue
may never contain a word that only exists because this is a game.**

Forbidden in anything a character says, and in narration:

| never | because |
|---|---|
| 章 —— 「三章前に渡った谷」「第8章で決めた」「十九章ぶん」 | a chapter is a unit of the product, not of their lives |
| ターン —— 「十二ターン支えます」「あと何ターンで」 | so is a turn |
| 盤・マス・フェイズ・ユニット・レベル・経験値・クラスチェンジ・必殺・出撃枠 | rules vocabulary |
| プレイヤー・ゲーム・画面・セーブ | the machine |

Say it the way somebody standing there would:

| | |
|---|---|
| 「三章前に渡った谷」 | → 「私たちが渡った谷」／ name the place |
| 「第7章で私が申し上げた」 | → 「壁の砦で私が申し上げた」 |
| 「第8章で一人で決めた」 | → 「ヤタンで一人で決めた」 |
| 「十二ターン、支えます」 | → 「日が落ちるまで、支えます」 |
| 「九ターン持たせた」 | → 「九度、押し返した」 |
| 「一ターン立つごとに体力の一割」 | → 「足を止めるたび、体力の一割」 |
| 「十九章ぶん、足りました」 | → 「ここまでの道ぶん、足りました」 |

**Naming the place is almost always the fix, and it is a better line anyway.**
「第5章の砦から見えた山」 carries nothing; 「カンデルの砦から見えた山」 is a
memory. When the reference is to elapsed time rather than to a place, use time
somebody would actually count in —— 半刻, 三日, ひと月, 一年, 四百年.

**The interface is exempt, and it is marked.** `［目標］…`, `（このターン、〜の
守備 −2）`, and the `log:` strings are the game speaking to the player, not a
person speaking in the world. They keep the brackets so the difference is
visible on screen, and they may say ターン.

Chapter numbers are fine in a script's `title` (it is a chapter card), in file
names, in JSDoc and in `specs/`. The rule is about `text`.

**The reading page checks it.** `/story.html` marks any line carrying one of
these words, skipping `［…］` lines and `（…）` inserts, so a new script that
breaks the rule shows up the next time anybody reads the page. It is at zero;
keep it there.

## A character may only know what they were shown

The same rule one level up from vocabulary. **Before writing a line, ask where
that person learned it.** They were not reading the design document.

Takeshi opened the finale with 「洞門を開けたな」 — he cannot know that, and the
sentence contains two separate impossibilities. He cannot know the route the
party took. And **there was no 洞門 for him to have a word for**: the headland at
the end of the Arn road is a piece of mountain, uncut and unremarkable, and it
only becomes a 洞門 in the last minutes of Ch24 because this company put a hole
in it. What he knows is the cliff road, because he posted a rearguard on it. His
whole plan is that the road runs out and they stand in front of a mountain.

**A thing that does not exist yet cannot be referred to, by anybody, including
the narration.** The name belongs to the people who made it, and it may not be
used before they name it. Handing Takeshi the answer also threw away the chapter
that earned it.

Three questions that catch most of it:

- **Who told them?** If nobody did, the line is either a deduction — write it as
  one, out loud — or it does not belong to that character yet.
- **Does the payoff have a setup?** Ch17 has Lisette bet the company on a rule
  she「この川の水際で」first saw. That line is only worth anything because Ch2
  now contains the observation, and her refusing to generalise from one sighting.
- **Is the number the same everywhere?** Three sacred flames bought four
  centuries; Arn's went out before Ch1, Suza's goes out in Ch15. So Ch14 has two
  burning and Ch21 has one. Written separately, those three chapters each said
  something different.

**A chapter must not make the next one impossible.** Ch6's objective was
「エイリンの撃破」 while Ch18 had her walk in alive. Sparing somebody has to be
something the board allows, so Ch6 seizes the harbourmaster's office instead and
the flag is real: `Campaign.slain` records named enemies killed,
`ChapterEvent.unless` skips an arrival, `Seed.unlessSlain` keeps them off the
preparation list. Both halves are needed —— one alone leaves a dead woman in the
roster.

## Never delete

- `src/assets/sprites/*.png` and `tools/sprites/reference/`. They were
  commissioned and approved, and several cannot be regenerated.
