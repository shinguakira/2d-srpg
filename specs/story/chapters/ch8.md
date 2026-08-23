# Chapter 8: The Last Stand on Yatan

Built. `src/data/chapters/ch8.ts` and `src/story/chapters/ch8.ts`. **The nine turns are on the turn counter and nothing the player does changes them**: turn 4 takes Halvar out of the player's hands, turn 13 kills him. Not a casualty — a scripted death, so no healing and no rescue reaches him.

**Halvar dies here.** This
is the campaign's turning point and the chapter everything before it is building
toward.

## Summary

A mountain fortress with two fronts: the throne room to the north, and a south
corridor that General Wulfram will deliberately fill once the party commits. Halvar
knows the trick because he served under Wulfram for six years — and knows what it
costs to answer it.

## Setup

- **Map**: 24×19; throne at the north end; a one-wide south corridor with a fort
  at its mouth
- **Objective**: Seize the throne —— Wulfram is on it, so seizing means killing
  him first
- **Deploy**: 8 slots; **`p_shigeru` and `p_halvar` force-deployed** —— the
  corridor sequence requires him on the field, and the chapter names him in
  `ChapterDef.forced` so the preparation screen will not let him be taken out.
  Without that, turn 4 and turn 13 fire at a unit who is not there and the whole
  sequence silently does not happen
- **Enemies**: 16 — General Wulfram (halberdier), knights, cavaliers and mages
- **Reinforcements**: 3 per turn, turns 4 to 9, from the south gate and the east
  wall at once
- **Par**: 20 turns

## The sacrifice sequence

Scripted on the turn counter, not on anything the player does. **He holds for
nine turns**, and the count is the point — every line about this chapter, here
and in [characters.md](../characters.md), is built on that number.

| Turn | Effect |
|---|---|
| 4 | Halvar disobeys the order to stand down. He leaves the player's control and takes the corridor as an **ally NPC**, aggressive AI |
| 7 | Off-screen: a lance being set, over and over, in a doorway one man wide |
| 11 | He is slowing. Urgency on the throne |
| 13 | He dies. Nine turns held |

Afterwards he is off the roster for good, and the two chapters that follow are
fought at reduced stats — see [roster.md](../roster.md).

## Beats

**Prologue — the argument.** Halvar lays out Wulfram's method. Akira proposes
splitting the company; Halvar refuses it — half the company does not take Wulfram.
What is needed is everything going up to the throne and one man in the corridor who
knows how long it can be held.

Shigeru says no, twice, and gives his reason: *"I have not lost anyone since Ilza
and I am not starting tonight because it is efficient."*

Halvar's answer is the line the chapter is built on:

> *"You will lose someone tonight either way. The only question you get to answer is
> whether it is somebody who chose it."*

Nadine says she will stay near the corridor. Halvar sends her to the prince.

**Turn 4 — the refusal.** *"I am afraid I am going to disobey an order, my lord. It
is becoming a habit."* Eleven years he stood a post because a man told him to. This
one he picked. He asks Shigeru to tell Takeshi that a sergeant of the second wall
company stopped believing him.

**Turn 13 — the death.** No speech. The lance comes up one more time, more slowly
than the last, and does not come down. *"Post... held..."* Mirelle tries to go; Corwin
has Gareth hold her.

> *"Nothing else came up the south corridor that night. It had taken a full company
> all evening to get past one man, and by then the throne was already lost."*

**Boss death.** Wulfram asks who held the corridor for nine turns. Told it was
Halvar: *"He was the only man in my command who ever asked me a question. I had him
posted to a wall for it."* Then he sends Shigeru west to look at what his emperor
is carrying.

**Epilogue — the cost.** Shigeru's confession is that he *gave permission*: said the
word out loud and then turned around and walked up to the throne. Lisette refuses to
soften it and refuses to let him only feel the guilt: the fortress is theirs and
eleven people are alive who would not be, and both are true at once.

Gareth puts his fist into the wall. Akira counts the turns — nine, on foot, alone, and
nothing in the histories of this kingdom like it. Nadine could not get down the stair.
Corwin tells her that was the entire idea: *"He picked a place where nobody could
reach him so that nobody would have to try."*

## Supports

- **Shigeru × Halvar** — *"do not come back for me"* / *"do not let it be for nothing.
  That is all a soldier actually asks for, whatever the songs say."*
- **Halvar × Mirelle** — he has been frightened for eleven years of the wrong things.
  Tonight he is frightened of something worth it, and finds it restful.
