# Bosses

Chapter bosses for the 25-chapter campaign. **Three are in the game** —
ハーゲン `e_boss`, ヴィダル `c2_boss` and オルリク `c3_boss`, each with a
portrait, a pre-combat conversation and a death line. AI behaviour types are
documented in [map-and-turns.md](../systems/map-and-turns.md).

Hagen is a general on a gate rather than a brigand chief, because the chapter-1
map turned into a keep; the rest of his brief holds. Vidar's cracked ward is
narrated in the chapter-2 epilogue rather than dropped as an item — there is no
drop system.

**Writing rule for every boss in this game:** they are doing their job. Most of them
know something is wrong in the west and have been ordered not to look at it. The
player should feel the cost of each one.

---

## Arc 1 — Flight (Ch1-5)

### Ch1 — Hagen, brigand chief
- Fighter (axe, hand axe) · AI: boss (holds throne)
- Twenty years working the same stretch of road. Took Kurogane coin because the
  army was going to walk over him either way, and they hold his brother's village.
- **Pre-combat**: *"So you are the prince. You look about twelve."*
- **Death**: *"Kureha. The village is called Kureha. Somebody ought to know that."*

### Ch2 — Commander Vidar
- Cavalier (lance, steel lance) · AI: boss
- Professional. Refuses to read past his orders on principle, and says so.
- **Drops**: a **cracked shrine ward** from the seal at Arn — the campaign's first
  hard evidence, and the reason the party starts looking west.
- **Key line**: *"A soldier who reads past his orders is a soldier looking for a reason to run."*

### Ch3 — Captain Olrik
- Soldier (steel lance, javelin) · AI: boss, on a fort tile
- Holding a hill fort in a kingdom that no longer exists. Has been explicitly
  ordered not to look at the grey hillside behind him, and complies.
- **Mechanic**: high DEF on a fort (+3). Wants magic or weapon advantage.

### Ch4 — Brask, sea raider
- Fighter (steel axe, hand axe) · AI: aggressive (leaves throne)
- **Drops**: a signed, dated Kurogane pay chit. The Empire is paying pirates to
  starve the province it just conquered.
- **Mechanic**: aggressive — comes to the player while raiders race for storehouses.

### Ch5 — General Roderic ★ *(arc boss)*
- General Knight · AI: boss, with two escort knights
- Lost nine men to the rift in his own courtyard, reported it three times, and was
  told to hold the fortress. Complied.
- **Death**: reveals Takeshi visited in the spring, stood at the rift's edge for an
  hour without fear, and said *"Good. It is still hungry."*

---

## Arc 2 — The Broken Seal (Ch6-10)

### Ch6 — Captain Aeryn
- Pegasus Knight · AI: aggressive
- Reported the hole in the sky as weather, twice. The second report came back with
  her commission attached and a note telling her to fly lower.
- **Arc 4 hook**: if spared in a later route she is a recruit and an ending flag
  (`aerynRecruited`).

### Ch7 — Admiral Varro *(optional)*
- General Soldier · AI: stationary
- The chapter's objective is *survive 12 turns*; Varro is optional. Drops a Hero
  Crest. Watched his own north wall turn grey and kept the watch rotation unchanged.

### Ch8 — General Wulfram ★ *(arc boss)*
- Halberdier · AI: boss
- Does not defend a fortress — opens the south gate, lets you commit, and closes it
  behind you. Halvar served under him for six years and knows the pattern, which is
  the entire reason the chapter is survivable.
- **Death**: asks who held the corridor. On hearing Halvar's name: *"He was the only
  man in my command who ever asked me a question. I had him posted to a wall for it."*

### Ch9 — Raider Captain
- Cavalier · no dialogue
- Deliberately anonymous. Ch9 is a grief chapter; its enemies are not characters.

### Ch10 — Grand Magus Ezrin ★ *(arc boss)*
- Sage (elfire, mend) · AI: boss with three escort guards
- Came for Elder Ilse's chronicle, not for the hill. Read the same signs Lisette does
  and kept serving anyway. Drops a Master Seal.

### Ch10 — Blackflame Colossus *(turn 6 spawn)*
- Stat block in [enemies.md](enemies.md#blackflame-colossus)
- Not a revenant — a revenant was a person once. This has been **assembled**, out of
  several. Goes straight for the chronicle. When killed, its ash runs west along
  the ground *against the wind*: the first thing in the campaign the party can
  actually follow.

---

## Arc 3-5

Ch11-23 bosses are Kurogane officers in provinces that are themselves going grey,
plus blight-born monsters that get less human as the party goes west. **All of
them are on their boards now.**

| Ch | | |
|---|---|---|
| 11 | **タルグ** | A column commander retreating *south* with two hundred of the eight hundred he took in. He cannot understand why anyone would be walking the other way, and asks. |
| 12 | — | **No boss.** The absence is the chapter: nothing on that board can be negotiated with, threatened or spared. |
| 13 | **ヴェルダ** | Sniper captain holding the Maishi ridge. Her army left two months ago without sending her a withdrawal order, so the gorge is hers now. Thirty-four people. |
| 14 | **ケーヴェ** | Reached the cape first and made Shigeru's argument with better manners and more gold. Ordered to put the flame out; did not ask why; says so plainly. Fourth in a row. |
| 15 | **ハウグ** | Has thrown away the standard and is running north with three hundred of eight hundred. Not from the party. The first Kurogane officer the player watches break. |
| 16 | **総督ハルヴィク** | Has kept the grey out of his emperor's sight for a year by not filing the reports. Not mad, holds his sword badly, and is the first enemy in the campaign who asks the party to keep going after he loses. |
| 17 | **ドルグ** | Wants the fords. Knows the blight will not cross running water — three months of staying alive taught him — and wants the bridge anyway, because eight hundred pairs of feet get wet otherwise. |
| 18 | **ソルグ** | Half his own officer corps has stopped fighting. He has not, because the Emperor saved his life forty years ago. He knows the argument is on the other side. He calls it 義理 and stands there. |
| 19 | **ヴォルカー** | Sent to put the northern flame out. Did not ask why. Fifth. When Shigeru names the other four he works out for himself that nobody in the chain ever asked. |
| 20 | — | **No boss.** Revenants and four-century-old armour; the reveal at the end is what the chapter has instead. |
| 21 | **番人** | Four hundred years on the forbidden ground, and still able to speak — three words at a time. What he says is that his relief never came. |
| 22 | **ゲルハルト** | Stood at the oath-taking and carried the water. His company killed King Sadao on the sand at Kodo, not Takeshi, and he says so before he dies because it is the last thing anyone can still tell Shigeru. |
| 23 | — | **No boss.** The wall of names is the chapter. |

### Ch24 — the rearguard commander

- Kurogane officer holding the headland in front of the **Stone Gate** · AI: boss
- He has not been told to win. He has been told to make them late, and he knows
  what being late costs them, because he has watched the road behind them going.
- **Key line**: *"He does not need you dead. He needs you tired. There is a
  difference and you will feel it tomorrow."*
- **Mechanic**: killing him does not open the gate and the gate does not need him
  dead. He is a tax on the turns the ward and the stone cost — the first boss in
  the campaign who stands in front of a clock rather than a door.

### Ch25 — Takeshi, Emperor of Ash ★★★ *(final boss)*
- Shaven-headed, a head taller than anyone else on the field, both arms burned to
  the elbow in a bark-like pattern from carrying the Blackflame.
- Once the finest general on the continent, and sworn brother to King Sadao. Taught
  Shigeru's father to ride.
- He broke the seal at Arn himself and took the Blackflame into his own body,
  because the 347 knights bought the world four centuries and he intends to end it
  instead of postponing it again.
- **He is never written as mad.** He is polite, patient, and completely certain. He
  makes the strongest argument in the game for his own position, and Shigeru never
  refutes it — he only refuses it.
- **Best outcome** is not proving him wrong. It is his choosing to put it down
  (`takeshiSpared` → *The Fourth Flame*).
- **Ch10 appearance**: unarmed, alone, asks for the Flamebrand, is refused, and walks
  away. Nobody raises a bow, and afterwards none of them can say why.

---

## Post-campaign — Akira ★★★ *(hidden final boss)*

The one companion the campaign promises will not leave. Fought after the credits,
as post-game content, and reached by playing for it rather than by finishing.

What is decided:

- It is **Akira** — the old retainer the player has called ジェイガン for
  twenty-five chapters, whose real name is not spoken once in the campaign. This
  fight is where the name arrives, and the fight is the last thing in the game.
- He looks **wrong**. Through the campaign he is white-haired; here his hair is
  black and he is dressed in a plain modern suit, a red and black tie at his
  throat, unshaven. Nothing else in this world dresses like that, and the player
  is meant to notice before a word is said.
- He is **young here, and everything else follows from that**. This — Akira in
  his twenties, black-haired, unlined — is the fixed point. He is an old man
  through the whole campaign *because* he is young at the end. That is his
  special property as a character, it is deliberate, and it is the reason the
  age gap exists at all. It is not two commissions that drifted, and nobody is
  to tidy it away by ageing this portrait or de-ageing the other one.
- What the property actually is, and how the game says so, is not written.
- Art exists: `src/assets/portraits/akira-secret-boss.png`. It is deliberately
  not wired into the game — nothing reads it yet.

What is not decided: how the fight is unlocked, what he says, why he is like
that, and whether the campaign is allowed to foreshadow it. See
[characters.md](characters.md) for the Akira the player spends the campaign
with.
