import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const H: TerrainType = 'throne';

// 18 columns x 20 rows — mountain fortress, two fronts (north throne + south corridor)
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [M, M, X, X, X, X, X, X, X, X, X, X, X, X, X, X, M, M], // row 0  — fortress north wall
  [M, X, P, P, P, P, P, P, P, H, P, P, P, P, P, P, X, M], // row 1  — throne at (9,1)
  [M, X, P, P, X, P, P, P, P, P, P, P, P, X, P, P, X, M], // row 2  — interior pillars
  [M, X, P, P, P, P, T, P, P, P, P, T, P, P, P, P, X, M], // row 3  — interior forts
  [M, X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, X, M], // row 4  — inner gate
  [M, P, P, P, P, F, P, P, P, P, P, P, F, P, P, P, P, M], // row 5  — fortress exit
  [M, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, M], // row 6  — courtyard
  [M, P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P, M], // row 7  — defensive forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 8  — open field
  [P, P, F, P, P, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 9  — approach
  [P, P, P, P, P, T, P, P, P, P, P, P, T, P, P, P, P, P], // row 10 — mid-field forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 11 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 2
  [M, M, P, P, P, X, X, P, P, P, P, X, X, P, P, P, M, M], // row 14 — south corridor entrance
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 15 — corridor narrows
  [M, M, M, P, P, X, P, P, T, P, P, P, X, P, P, M, M, M], // row 16 — Halvar's last stand position (8,16)
  [M, M, M, P, P, X, P, P, P, P, P, P, X, P, P, M, M, M], // row 17 — corridor
  [M, M, M, P, P, P, P, P, P, P, P, P, P, P, P, M, M, M], // row 18 — south gate (reinforcements)
  [M, M, M, M, P, P, P, P, P, P, P, P, P, P, M, M, M, M], // row 19 — south edge
];

export const CHAPTER_8: ChapterData = {
  id: 'ch8',
  name: 'Chapter 8: The Last Stand on Yatate',
  chapterNumber: 8,
  mapWidth: 18,
  mapHeight: 20,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 8, y: 12 } },
    { unitId: 'akira', position: { x: 9, y: 12 } },
    { unitId: 'lisette', position: { x: 8, y: 13 } },
    { unitId: 'gareth', position: { x: 7, y: 13 } },
    { unitId: 'mirelle', position: { x: 10, y: 13 } },
    { unitId: 'halvar', position: { x: 7, y: 12 } },
    { unitId: 'corwin', position: { x: 10, y: 12 } },
    { unitId: 'nadine', position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    // Boss on throne
    { unitId: 'ch8_boss', position: { x: 9, y: 1 } },
    // Throne room guards
    { unitId: 'ch8_knight_1', position: { x: 8, y: 2 } },
    { unitId: 'ch8_knight_2', position: { x: 10, y: 2 } },
    { unitId: 'ch8_knight_3', position: { x: 6, y: 3 } },
    { unitId: 'ch8_knight_4', position: { x: 11, y: 3 } },
    // Courtyard attackers
    { unitId: 'ch8_cavalier_1', position: { x: 5, y: 6 } },
    { unitId: 'ch8_cavalier_2', position: { x: 12, y: 6 } },
    { unitId: 'ch8_cavalier_3', position: { x: 9, y: 7 } },
    // Mages
    { unitId: 'ch8_mage_1', position: { x: 7, y: 5 } },
    { unitId: 'ch8_mage_2', position: { x: 10, y: 5 } },
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Wulfram and seize the throne',
  },
  seizePosition: { x: 9, y: 1 },
  deploymentSlots: 8,
  forceDeploy: ['shigeru', 'halvar'],
  parTurns: 20,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'Night on Yatate, the highest ground on the island. The fortress commands the whole spine of the Lower Country. Two fronts — the throne room above, and a corridor below where the reinforcements will come.',
          ja: '島の最高所、矢立山の夜。砦は下県全体の背骨を睨んでいる。戦線は二つ――上の玉座の間と、増援が上がってくる下の通路。',
        },
      },
      {
        speaker: 'Halvar',
        text: { en: 'My lord. A word before we go in.', ja: '殿下。入る前に一つ。' },
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: { en: 'Say it.', ja: '言え。' }, speakerFaction: 'player' },
      {
        speaker: 'Halvar',
        text: {
          en: 'I served under Wulfram for six years. He does not defend a fortress — he opens the south gate, lets you commit, and closes it behind you.',
          ja: 'ウルフラムの下に六年いた。あの男は砦を守らない。南門を開け、こちらを踏み込ませ、背後で閉じる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Then we split the company. Half north to the throne, half holding the corridor.',
          ja: 'ならば隊を割る。半分は北の玉座へ、半分は通路を保つ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'No, lad. Half the company does not take Wulfram. You need everything you have going north, and one man in that corridor who knows how long it can be held.',
          ja: 'いや、若いの。半分ではウルフラムは落とせん。持てる全てを北へ向け、通路にはどれだけ保つか分かっている男を一人置く。それだ。',
        },
        speakerFaction: 'player',
      },
      { speaker: 'Shigeru', text: { en: 'No.', ja: '駄目だ。' }, speakerFaction: 'player' },
      {
        speaker: 'Halvar',
        text: { en: 'My lord—', ja: '殿下――' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'I said no. I have not lost anyone since Izuhara and I am not starting tonight because it is efficient.',
          ja: '駄目だと言った。厳原以来ひとりも失っていない。効率がいいという理由で今夜それを始めるつもりはない。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'You will lose someone tonight either way. The only question you get to answer is whether it is somebody who chose it.',
          ja: 'どちらにせよ今夜は誰かを失う。あんたが答えられる問いは一つだけだ。それが自分で選んだ者かどうか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'Nobody spoke for a long moment. Around them the company checked buckles and edges — small routine motions, done more slowly than usual.',
          ja: '長いあいだ誰も口をきかなかった。周りでは隊の者が留め金と刃を検めていた。いつもの小さな手順を、いつもより緩やかに。',
        },
      },
      {
        speaker: 'Mirelle',
        text: { en: 'May the dawn find us all.', ja: '夜明けが皆を見つけますように。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'Gareth shifted his grip on his axe, looked at Halvar, and said nothing at all.',
          ja: 'ガレスは斧を握り直し、ハルヴァルを見て、何も言わなかった。',
        },
      },
      {
        speaker: 'Nadine',
        text: {
          en: 'I will stay close to the corridor. I will.',
          ja: '私、通路の近くにいます。いますから。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'You will stay with the prince, girl. That is where the healing is needed.',
          ja: 'あんたは王子のそばにいろ、お嬢さん。癒しが要るのはそっちだ。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The fortress is taken. But the victory tastes like ash.',
          ja: '砦は落ちた。だが勝利は灰の味がした。',
        },
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'He asked me for permission and I gave it. I said the word out loud and then I turned around and walked north.',
          ja: 'あの男は私に許しを求め、私はそれを与えた。声に出してそう言い、そして背を向けて北へ歩いた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'You did. And the fortress is ours, and eleven of us are alive who would not be. Both of those are true at once, my lord. You will have to learn to hold them at once.',
          ja: 'そうです。そして砦は我らのもので、本来死んでいた十一人が生きている。その二つは同時に真実です、殿下。同時に抱えることを覚えねばなりません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'Gareth put his fist into the fortress wall. His knuckles split. Nobody stopped him.',
          ja: 'ガレスは砦の壁に拳を叩きつけた。指の皮が裂けた。誰も止めなかった。',
        },
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'He was a Kurogane man for eleven years and an Amagi man for six weeks. I will pray for him as an Amagi man. I do not think he would mind.',
          ja: 'あの人は十一年黒鉄の人で、六週間だけ天城の人でした。天城の人として弔います。きっと嫌がらないと思います。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'He held that corridor for nine turns. Nine. Against a full company, on foot, alone. I have read the histories of this kingdom and there is nothing in them like it.',
          ja: 'あの通路を九つのあいだ保った。九つだ。一個中隊を相手に、徒歩で、ひとりで。この国の史書は読んできたが、あれに並ぶ話はない。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Nadine',
        text: {
          en: 'I could not reach him. I tried to get down the stair and there were too many and I could not—',
          ja: '届かなかった。階段を降りようとしたのに敵が多すぎて、私は――',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'None of us could. Girl — that was the entire idea. He picked a place where nobody could reach him so that nobody would have to try.',
          ja: '誰も届かなかったさ。嬢ちゃん――それが狙いの全部だ。あの男は誰も届かない場所を選んだんだ。誰も届こうとせずに済むようにな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'The grief settles over the party like armor — heavy, suffocating, and impossible to remove. All stats reduced by 3 for the next two chapters.',
          ja: '悲嘆が鎧のように隊に降りた。重く、息苦しく、脱ぐこともできない。以後二章のあいだ、全能力が三下がる。',
        },
      },
    ],
  },
  reinforcements: [
    {
      turn: 5,
      units: [
        { unitId: 'ch8_reinforce_1', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_2', position: { x: 9, y: 19 } },
      ],
      message: {
        en: 'Enemy soldiers pour through the south gate!',
        ja: '南門から敵兵が雪崩れ込んでくる！',
      },
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch8_reinforce_3', position: { x: 7, y: 19 } },
        { unitId: 'ch8_reinforce_4', position: { x: 10, y: 19 } },
      ],
      message: { en: 'More reinforcements from the south!', ja: '南からさらに増援！' },
    },
    {
      turn: 9,
      units: [
        { unitId: 'ch8_reinforce_5', position: { x: 8, y: 19 } },
        { unitId: 'ch8_reinforce_6', position: { x: 9, y: 19 } },
        { unitId: 'ch8_reinforce_7', position: { x: 7, y: 19 } },
      ],
      message: {
        en: 'A final wave crashes against the south corridor!',
        ja: '最後の波が南の通路に叩きつける！',
      },
    },
  ],
  events: [
    // Turn 3: Tactical callout — throne room assessment
    {
      id: 'ch8_tactical_1',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Corwin',
                text: {
                  en: 'Knights guarding the throne room. Heavy armor — axes or magic will do better than swords.',
                  ja: '玉座の間はアーマーが固めてる。重装だ――剣より斧か魔法のほうが通る。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'I will draw them. Gareth, Corwin — take the flank while their eyes are on a horse.',
                  ja: '私が引きつけます。ガレス、コーウィン――敵の目が馬に向いているうちに側面を。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5: South gate reinforcement warning
    {
      id: 'ch8_tactical_2',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'Movement at the south gate. He is doing exactly what Halvar said he would.',
                  ja: '南門が動きました。ハルヴァルの言った通りのことをしています。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Then we go faster. Take Wulfram before that corridor fills.',
                  ja: 'なら急ぐ。通路が埋まる前にウルフラムを取る。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 7: South reinforcements dialogue
    {
      id: 'ch8_south_spotted',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Halvar',
                text: {
                  en: 'The corridor is filling, my lord. Someone holds it or they take us from behind.',
                  ja: '通路が埋まってきています、殿下。誰かが保たねば背後を突かれます。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'We cannot spare anyone. I need every blade for the throne room.',
                  ja: '誰も割けない。玉座の間に全ての刃が要る。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 8: HALVAR'S SACRIFICE — remove from player, spawn as NPC ally
    {
      id: 'ch8_halvar_to_npc',
      trigger: { type: 'turn_start', turn: 8 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  {
                    speaker: 'Akira',
                    text: { en: "I'll hold the corridor.", ja: '通路は俺が保つ。' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Shigeru',
                    text: { en: 'Halvar. Stand down.', ja: 'ハルヴァル。下がれ。' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Halvar',
                    text: {
                      en: 'I am afraid I am going to disobey an order, my lord. It is becoming a habit.',
                      ja: '命令に背かせてもらいます、殿下。癖になってきましたな。',
                    },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Halvar',
                    text: {
                      en: 'Eleven years I stood a post because a man told me to. This one I picked.',
                      ja: '十一年、男に言われたから持ち場に立ってきた。この持ち場は自分で選んだ。',
                    },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Shigeru',
                    text: { en: 'Halvar—', ja: 'ハルヴァル――' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Halvar',
                    text: {
                      en: 'Go north, my lord. And when you get to Takeshi, tell him a sergeant of the second wall company stopped believing him.',
                      ja: '上へ行ってくだされ、殿下。そしてタケシのところに着いたら伝えてくれ。第二城壁中隊の軍曹が一人、あんたを信じるのをやめた、と。',
                    },
                    speakerFaction: 'player',
                  },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'halvar' },
            {
              type: 'spawn_units',
              units: [{ unitId: 'halvar_npc', position: { x: 8, y: 16 } }],
              faction: 'ally',
            },
          ],
        },
      ],
      once: true,
    },
    // Turn 10: Halvar fighting alone — party watches
    {
      id: 'ch8_halvar_holding',
      trigger: { type: 'turn_start', turn: 10 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'From the south corridor: the flat ring of a lance being set, over and over, in a doorway one man wide.',
                  ja: '南の通路から――槍を構え直す平たい金属音が、人ひとり分の戸口で、何度も、何度も響いてくる。',
                },
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'Can anyone see him? Is he still—',
                  ja: '誰か見えますか？あの人はまだ――',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'He is holding. Do not waste it, Mirelle. North.',
                  ja: '保っています。無駄にしてはなりません、ミレーユ。北へ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Halvar fading — urgency
    {
      id: 'ch8_halvar_fading',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'The sounds from the south corridor are slowing. Fewer clashes. Longer pauses.',
                  ja: '南の通路の音が緩やかになっていく。打ち合いが減り、間が長くなる。',
                },
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'He is slowing. My lord, whatever we are going to do, it has to be now.',
                  ja: '遅くなっています。殿下、何をするにしても今しかありません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Everything forward. Take the throne. NOW.',
                  ja: '全て前へ。玉座を取れ。今だ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 13: HALVAR'S DEATH
    {
      id: 'ch8_halvar_death',
      trigger: { type: 'turn_start', turn: 13 },
      effects: [
        {
          type: 'chain',
          effects: [
            {
              type: 'show_dialogue',
              scene: {
                lines: [
                  {
                    speaker: 'Narrator',
                    text: {
                      en: 'In the south corridor the lance comes up one more time, more slowly than the last, and does not come down.',
                      ja: '南の通路で、槍がもう一度だけ、前より遅く持ち上がり――そして下りてこなかった。',
                    },
                  },
                  {
                    speaker: 'Halvar',
                    text: { en: 'Post... held...', ja: '持ち場……保った……' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Narrator',
                    text: { en: 'The doorway goes quiet.', ja: '戸口が静かになった。' },
                  },
                  {
                    speaker: 'Shigeru',
                    text: { en: 'HALVAR!', ja: 'ハルヴァル！' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Mirelle',
                    text: {
                      en: 'No — I can reach him, let me go, I can still—',
                      ja: 'いや――まだ届く、離して、まだ間に合う――',
                    },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Corwin',
                    text: { en: 'You cannot. Hold her, Gareth.', ja: '届かん。押さえろ、ガレス。' },
                    speakerFaction: 'player',
                  },
                  {
                    speaker: 'Narrator',
                    text: {
                      en: 'Nothing else came up the south corridor that night. It had taken a full company all evening to get past one man, and by then the throne was already lost.',
                      ja: 'その夜、南の通路からはもう何も上がってこなかった。一個中隊が男ひとりを抜くのに一晩を要し、その頃には玉座はすでに落ちていた。',
                    },
                  },
                ],
              },
            },
            { type: 'remove_unit', unitId: 'halvar_npc' },
            { type: 'set_flag', key: 'halvar_dead', value: 'true' },
          ],
        },
      ],
      once: true,
    },
    // Boss killed: Wulfram
    {
      id: 'ch8_doumeki_killed',
      trigger: { type: 'unit_killed', unitId: 'ch8_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Wulfram',
                text: {
                  en: 'The corridor. Nine turns. Who was it?',
                  ja: 'あの通路だ。九つのあいだ。誰だった。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Sergeant Halvar. Second wall company. He served under you for six years.',
                  ja: '軍曹ハルヴァル。第二城壁中隊。六年、貴公の下にいた。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Wulfram',
                text: {
                  en: '...Halvar. He was the only man in my command who ever asked me a question. I had him posted to a wall for it.',
                  ja: '……ハルヴァルか。わしの指揮下で唯一、わしに問いを立てた男だ。そのために城壁に飛ばした。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Wulfram',
                text: {
                  en: 'Boy. Go west and look at what your Emperor is carrying. Then decide whether any of us were ever soldiers at all.',
                  ja: '小僧。西へ行って、貴様の皇帝が何を抱えているかを見てこい。その上で、我々の誰かが本当に兵であったのかを決めるがいい。',
                },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'halvar',
      lines: [
        {
          speaker: 'Halvar',
          text: {
            en: 'My lord. If it comes to it tonight — do not come back for me.',
            ja: '殿下。今夜そうなったら――俺を取りに戻らんでくだされ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'I will not promise that.', ja: 'それは約束しない。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'Then promise me the other thing. Do not let it be for nothing. That is all a soldier actually asks for, whatever the songs say.',
            ja: 'ならもう一つのほうを約束してくれ。無駄にしないでくれ。歌が何と言おうと、兵が本当に求めるのはそれだけだ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'Halvar...', ja: 'ハルヴァル……' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'Say yes, my lord. It costs you nothing tonight and it will cost you a great deal later, which is how you will know it was worth saying.',
            ja: 'はいと言ってくだされ、殿下。今夜は何の代償もない。後で高くつく。だからこそ言う値打ちがあったと分かる。',
          },
          speakerFaction: 'player',
        },
        { speaker: 'Shigeru', text: { en: '...Yes.', ja: '……ああ。' }, speakerFaction: 'player' },
      ],
      reward: { type: 'exp_both', amount: 30 },
    },
    {
      unitA: 'halvar',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: {
            en: 'Halvar. You have been settled all evening. Everyone else is sick with nerves and you have been mending a strap.',
            ja: 'ハルヴァルさん。今夜ずっと落ち着いていますね。皆が神経をやられているのに、あなたは革帯を繕っている。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: { en: 'It needed mending.', ja: '繕う必要があった。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: { en: 'That is not what I asked.', ja: 'それは訊いたことの答えではありません。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: 'I have been frightened for eleven years, girl — every day, on a wall, of the wrong things. Tonight I am frightened of something worth it. It is quite restful.',
            ja: '十一年怯えて過ごしてきた、お嬢さん。毎日、城壁の上で、見当違いのものにな。今夜は値打ちのあるものに怯えている。ずいぶん休まるものだ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: '...I am going to pray for you whether you like it or not.',
            ja: '……お嫌でも、あなたのために祈ります。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: { en: 'I would take it kindly.', ja: 'ありがたく頂こう。' },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'halvar', stat: 'def', amount: 2 },
    },
  ],
};
