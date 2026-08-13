import type { ChapterData, TerrainType } from '../../core/types';

// Shorthand aliases for readability
const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

const B: TerrainType = 'bridge';

/**
 * Kuta: the river runs the width of the map with two crossings, the keep sits
 * on the far bank behind a single gate, and the village is caught between the
 * two — which is what the prologue says is happening.
 *
 * The shape is the lesson. Turn 1 is a real decision (west bridge or east),
 * neither route is safe, both converge on one gate, and the only way into the
 * keep is a tile wide.
 */
// 25 columns x 12 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
  [M, M, M, P, P, P, F, X, X, X, X, X, X, X, X, X, F, P, P, P, M, M, M, M, M], // row 0  — keep back wall
  [M, M, F, P, P, P, P, X, P, P, P, H, P, P, P, X, P, P, P, F, M, M, M, M, M], // row 1  — throne at (11,1)
  [M, F, P, P, T, P, P, X, P, T, P, P, P, T, P, X, P, P, T, P, F, M, M, M, M], // row 2  — garrison forts
  [M, F, P, P, P, P, P, X, X, X, X, P, X, X, X, X, P, P, P, P, P, F, M, M, M], // row 3  — the gate, one tile wide
  [P, P, P, P, F, P, P, P, P, P, P, P, P, P, P, P, P, P, V, P, P, P, F, M, M], // row 4  — approach + east village
  [P, P, F, P, P, P, P, P, F, V, P, P, P, P, F, P, P, P, P, P, F, P, P, M, M], // row 5  — Kuta, against the water
  [W, W, W, W, W, B, W, W, W, W, W, W, W, W, W, W, W, W, B, W, W, W, W, W, W], // row 6  — the river, two bridges
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 7
  [P, F, P, P, P, P, F, P, P, P, P, P, P, P, P, F, P, P, P, P, F, P, P, F, P], // row 8
  [F, P, P, P, T, P, P, P, P, P, P, P, P, P, P, P, P, P, P, T, P, P, P, P, F], // row 9
  [M, F, P, P, P, F, P, P, P, P, P, P, P, P, P, P, P, F, P, P, P, P, F, P, M], // row 10
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, F, F, M, M, M], // row 11 — the party arrives here
];

export const CHAPTER_1: ChapterData = {
  id: 'ch1',
  name: 'Chapter 1: The Road to Kuta',
  chapterNumber: 1,
  mapWidth: 25,
  mapHeight: 12,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 11, y: 10 } },
    { unitId: 'akira', position: { x: 13, y: 10 } },
    { unitId: 'lisette', position: { x: 10, y: 11 } },
    { unitId: 'mirelle', position: { x: 12, y: 11 } },
    // Gareth starts across the field on his own — the turn 2 scene is him
    // hailing the company, not joining it, so he has to be visible first.
    { unitId: 'gareth', position: { x: 3, y: 9 } },
  ],
  enemyUnits: [
    // One brigand on each route so neither crossing is free, the lance in the
    // middle where Gareth will reach it around turn 3 (his weapon-triangle
    // lesson), and Hagen alone behind the gate.
    { unitId: 'fighter_1', position: { x: 7, y: 5 } },
    { unitId: 'soldier_1', position: { x: 12, y: 4 } },
    { unitId: 'fighter_3', position: { x: 17, y: 4 } },
    { unitId: 'hagen', position: { x: 11, y: 1 } }, // boss on throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 11, y: 1 },
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The Kurogane fleet came ashore at Komoda Beach at first light, and the king rode west to meet them on the sand. By dusk he was dead and Izuhara was burning. By noon the next day the prince was on the coast road south with what was left of his father’s guard.',
          ja: '黒鉄の船団が夜明けとともに小茂田浜に上陸した。王は西へ馬を駆り、砂の上でこれを迎え撃った。日暮れには王は討たれ、厳原は燃えていた。翌日の正午、王子は父の親衛隊の残りを連れ、東の海沿いの道を南へ下っていた。',
        },
      },
      {
        speaker: 'Akira',
        text: {
          en: 'My lord — the keep at Kuta has fallen. Brigands, flying Kurogane colours. They have the village pinned against the river.',
          ja: '殿下、久田の砦が落ちました。黒鉄の旗を掲げた山賊どもです。村人を川際に追い詰めています。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then we take it back. The south road runs through that gate, and we have nowhere else to be.',
          ja: 'なら取り返す。南へ抜ける道はあの門しかない。他に行く場所もない。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'You have not slept since the palace. Neither has anyone. If you would rather we—',
          ja: '王宮を出てから一睡もしておられません。皆も同じです。もしお望みなら――',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'I would rather my father were alive. Form up.',
          ja: '望むなら父上に生きていてほしかった。隊列を組め。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 9, y: 5 },
      reward: {
        type: 'weapon',
        weaponId: 'hand_axe',
        dialogue: {
          en: 'Take my father’s hand axe, my lord. It throws true. He would rather it went with you than rusted over my hearth.',
          ja: '殿下、親父の手斧を持っていってくだせえ。よく飛びます。炉端で錆びさせるより、あんたに持たれたほうが親父も喜びまさあ。',
        },
        speaker: 'Villager',
      },
    },
    {
      position: { x: 18, y: 4 },
      reward: {
        type: 'weapon',
        weaponId: 'wind',
        dialogue: {
          en: 'The old scholar left this tome when he fled inland. Not one of us can read a word of it. Perhaps your mage can.',
          ja: '内陸へ逃げた老学者が置いていった魔道書です。村の誰も一文字も読めません。そちらの魔道士なら読めるかもしれない。',
        },
        speaker: 'Villager',
      },
    },
  ],
  epilogue: {
    lines: [
      {
        speaker: 'Akira',
        text: {
          en: 'The gate is ours, my lord. A victory.',
          ja: '門は我らの手に。勝利です、殿下。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'A gate. We hold one gate, and the kingdom is gone.',
          ja: '門ひとつだ。門ひとつを押さえて、国はもう無い。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Excuse me! Is this the royal company? I have run here from the Shiratake shrine and I have blisters in places I will not describe.',
          ja: 'ごめんください！こちらが王家の隊ですね？白嶽の社から走り通しで来ました、口では言えない場所に豆ができています！',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: '...Who are you?', ja: '……何者だ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Mirelle. Shrine maiden. The high priestess sent me to find the bearer of the Flamebrand, and I have found him, so please hold still while I look at that arm.',
          ja: 'ミレーユ。巫女です。大巫女様に炎の聖剣の担い手を捜せと命じられ、そして見つけました。ですから動かないでください、その腕を診ます。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'It is nothing.', ja: 'かすり傷だ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'It is four inches long and you have favoured it since I arrived. Sit down.',
          ja: '四寸はあります。私が着いてからずっと庇っておいででした。お座りください。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'The prince sat. It was the only order anyone gave him that day that he obeyed.',
          ja: '王子は座った。その日、彼が従った唯一の命令だった。',
        },
      },
    ],
  },
  deploymentSlots: 5,
  forceDeploy: ['shigeru'],
  skipPreparation: true,
  parTurns: 8,
  events: [
    // Turn 2 — Goro’s arrival
    {
      id: 'ch1_gareth_arrival',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: {
                  en: 'Oi! Down here! Is that the royal banner? I have been swinging at these bastards since sunup and it is getting lonely!',
                  ja: 'おおい！こっちだ！そりゃ王家の旗か？夜明けからこいつらを叩いてるんだが、そろそろ一人は飽きた！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Who are you?', ja: '何者だ。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'Gareth. I fell trees for a living. Turns out men come down about the same way.',
                  ja: 'ガレス。木こりだ。人間も似たような倒れ方をするとわかった。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'My lord, he is a woodcutter with an axe and no discipline whatsoever.',
                  ja: '殿下、斧を持った木こりです。規律のかけらもありません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'And you are a man on a horse who talks like a written letter. Are we fighting, or are we being introduced?',
                  ja: 'そっちは馬の上で書状みてえな喋り方をする男だな。戦るのか、それとも自己紹介の続きか？',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Weapon triangle lesson
    {
      id: 'ch1_weapon_triangle',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: {
                  en: 'Why did that lancer shrug me off? I caught him square!',
                  ja: 'なんであの槍兵は平気なんだ？まともに入ったぞ！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Because you caught him with an axe. Lances beat axes, swords beat lances, axes beat swords. Every drillmaster on the continent teaches it.',
                  ja: '斧で入れたからです。槍は斧に強く、剣は槍に強く、斧は剣に強い。大陸中の教練官が最初に教えることです。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'So I should have brought a sword.',
                  ja: 'じゃあ剣を持ってくりゃよかったのか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'You should have brought a lance. Do try to keep up.',
                  ja: '槍です。少しは話についてきてください。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 4 — Boss intro
    {
      id: 'ch1_boss_intro',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: { en: 'A royal banner. On my road.', ja: '王家の旗か。俺の道にな。' },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Your road?', ja: 'お前の道だと？' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: {
                  en: 'Twenty years I have worked this stretch. A toll here, a toll there, nobody hurt who paid. Then Kurogane came through with real coin and real orders.',
                  ja: '二十年この街道で食ってきた。ここで通行料、あそこで通行料、払う奴には手は出さねえ。そこへ黒鉄が本物の金と本物の命令を持って通りやがった。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'You are a brigand taking an emperor’s pay to hold a gate against your own countrymen.',
                  ja: '貴様は皇帝の金を受け取り、同胞に門を閉ざす山賊だ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: {
                  en: 'I am a man that army was going to walk over either way. This way I got paid first.',
                  ja: '俺はどのみちあの軍に踏み潰される男さ。こっちなら先に金がもらえる。',
                },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches the throne
    {
      id: 'ch1_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 11, y: 2 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: {
                  en: 'So you are the prince. You look about twelve.',
                  ja: 'お前が王子か。十二の子供みてえだな。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Take your men south. I will not chase you.',
                  ja: '部下を連れて南へ行け。追わない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: {
                  en: 'Can’t. Kurogane holds my brother’s village. That is the other half of the pay.',
                  ja: 'できねえ。黒鉄が弟の村を押さえてる。それが報酬のもう半分だ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: '...Then I am sorry.', ja: '……ならば、すまない。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: { en: 'Don’t be sorry. Be quick.', ja: '詫びるな。手早くやれ。' },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch1_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'hagen' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Hagen',
                text: {
                  en: 'Kuta. The village is called Kuta. Somebody ought to know that.',
                  ja: '久田。村の名は久田だ。誰か覚えておいてくれ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'I will remember it.', ja: '覚えておく。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Hagen',
                text: {
                  en: '...That is more than I expected from a prince.',
                  ja: '……王子にしては上出来だ。',
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
      unitB: 'akira',
      lines: [
        {
          speaker: 'Akira',
          text: {
            en: 'My lord. You have not eaten since Izuhara.',
            ja: '殿下。厳原を出てから何も口にしておられません。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'I am not hungry.', ja: '腹は減っていない。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: {
            en: 'That was not a question about your appetite.',
            ja: '食欲の話をしているのではありません。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: '...If I stop moving I will have to think about it. So I do not stop.',
            ja: '……止まれば考えねばならなくなる。だから止まらない。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: {
            en: 'Then I will keep your pace. And when you do stop, I will be there for that as well.',
            ja: 'ならば私も同じ歩調で参ります。そして殿下が止まられたときも、私はそこにおります。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'lisette',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: {
            en: 'Lisette, may I ask you something? Do you believe the Sacred Flames hear us when we pray?',
            ja: 'リゼット、ひとつ伺っても？聖火は祈りを聞いてくださると思いますか。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'I believe the shrines are warm, that warm people are calmer, and that calm soldiers fight better. Whether anything is listening, I have no way to measure.',
            ja: '社は暖かい。暖かければ人は落ち着く。落ち着いた兵はよく戦う。そこまでは信じます。何かが聞いているかどうかは、私には測る手立てがありません。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: 'That is the kindest refusal anyone has ever given me.',
            ja: '今まででいちばん優しい「いいえ」でした。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'It was not a refusal. I said I cannot measure it. Those are different things.',
            ja: 'いいえとは言っていません。測れないと言ったのです。別のことです。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'mirelle', stat: 'mag', amount: 1 },
    },
  ],
};
