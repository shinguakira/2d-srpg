# Characters

The playable cast, in join order. Stats, classes and levels live in
`src/data/units.ts` — this file is the writing brief. One rule holds for all of
them: nobody knows they are in a game, and nobody talks like they do.

## Shigeru — Lord (protagonist)

Prince of Amagi, nineteen, bearer of the Flamebrand. His father died in the first
hour of the invasion and handed him a sword with 347 names on it.

He is not prophesied and not chosen. He is the one who was standing there. He is
quiet, methodical, and asks for the numbers before he decides rather than after.
His private fear — which he admits only to Akira, and only in Ch1 — is that giving
orders that spend people is getting easier.

**Voice**: short sentences, no rhetoric. Says "no" a lot and then reconsiders in
public, which his officers find reassuring and his enemies find readable.

**Arc**: Ch1 flight → Ch5 realising the blight follows *him* → Ch8 giving Genzo
permission to die → Ch10 refusing Takeshi to his face → Arc 3 walking north.

**Key line** (Ch8): *"I have not lost anyone since Amagi and I am not starting
tonight because it is efficient."*

## Akira — Cavalier

Shigeru's sworn retainer since they were children. Formal to the point of comedy,
completely immovable, and the only person who asks the prince how he is and waits
for a real answer.

He survives the whole campaign. That is deliberate: the companion who does not die
is what makes Genzo's death land instead of feeling like a quota.

**Voice**: "my lord" in every other sentence, doctrine-first, dryly funny about it.

**Key line** (Ch1 support): *"Then I will keep your pace. And when you do stop, I
will be there for that as well."*

## Kanna — Mage

Court scholar of the shrine archives. Blunt, impatient, catalogues heraldry for
fun. She is the one who notices the grey line at the Kuze bridge in Ch2 and spends
five chapters proving it is a line and not a coincidence.

**Arc — the spine of Arc 2.** She builds a model of where the blight will surface.
In Ch7 the model breaks, because the blight starts moving to stay ahead of her
readings. Her crisis is identity, not competence: *"My whole use to this company is
knowing. If I cannot know, what am I standing here for?"* She resolves it by
changing the question from *where will it go* to *what does it want*.

## Hina — Cleric

Shrine maiden of Hitotsu, sent to find the Flamebrand's bearer. Warm, extremely
loud, physically fearless about grabbing wounded soldiers of either army. She prays
for enemies and means it.

She is the one who supplies the setting's folklore — ashfall, the Abyss, revenants
— from shrine songs everyone else dismissed as songs.

## Goro — Fighter

Woodcutter from the northern hills. Big, loud, warm, and considerably sharper than
he lets on: his questions are the ones that turn a lecture into a lesson ("So the
slow ground is the safe ground"). Serves as the player's proxy for tutorial beats
without ever being stupid.

## Genzo — Soldier *(dies Ch8)*

Kurogane sergeant, second wall company, eleven years on a watch post. He defects in
Ch2 because he watched his own army burn a village he could see from his post and
did not leave his post, and has been unable to stop thinking about it since.

He is the veteran who knows how the enemy actually operates, and he uses that
knowledge exactly once: in Ch8 he tells Shigeru what General Doumeki will do,
volunteers to be the man in the corridor, and disobeys a direct order to stay.

**Death**: scripted, Ch8 turn 13, after holding the south corridor alone for nine
turns as an ally NPC. Sets `genzo_dead`; the campaign store removes him from the
roster permanently and applies grief to everyone for two chapters.

**Key line**: *"You will lose someone tonight either way. The only question you get
to answer is whether it is somebody who chose it."*

## Sayo — Archer

Huntress of the Kiri woods, found defending a village alone from high ground.
Answers in single words and does not consider this a personality flaw. Green. No.
No.

## Hachi — Thief

Pickpocket of Minato harbour, cheerful, morally flexible, feeds people with stolen
keys. Hums when concentrating, which is how Shigeru catches them. Their thief's
instinct — *watch which door the owner never opens* — is what unsticks Kanna in Ch7.

## Yuki — Pegasus Knight

Rider of the Sky Watch. Sees the hole in the sky before anyone sees anything on the
ground. Her private fear is the inverse of Shigeru's: from the air, people are
shapes, and she has noticed she can watch a shape stop moving and feel nothing.

## Raiga — Mercenary

Grizzled sellsword, eleven captains' worth of experience, joins because the party
is the only group on the coast walking *toward* the thing everyone else is running
from. Serves as the company's memento mori: he has watched good commanders stop
counting their dead, and Shigeru orders him to say so when it starts happening.

## Mio — Troubadour

Travelling healer who treats both armies and will not be argued out of it. Young,
stubborn, and the first person to ask out loud why Kurogane's soldiers are fighting
at all — which is what lets Genzo explain that they all believe Takeshi when he
says this war is the last one.

## Kagura — Dancer

Travelling performer who steps out of the treeline in Ch9 and attaches herself to
the company on the grounds that they look like a funeral that has not finished
walking to the grave. Comic relief with a floor under it — she has seen grief
before, on better people than her, and says so once, quietly, and then never again.

## NPCs

- **Genzo (ally NPC)** — `genzo_npc`, Ch8 only, spawns when he takes the corridor.
- **Elder Toki** — `elder_toki`, Ch10 protect target. Keeper of a four-hundred-year
  village chronicle that records every time the Blackflame stirred.
- **King Sadao** — Shigeru's father. Dies before Ch1. Refused Takeshi the Flamebrand
  four times.

See also: [roster.md](roster.md), [bosses.md](bosses.md), [world.md](world.md).
