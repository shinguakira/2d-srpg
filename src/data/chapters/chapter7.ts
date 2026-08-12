import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';

// 16 columns x 16 rows — the fortress at the Cut; blighted seaward edge along row 0
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [W, W, P, P, P, P, P, P, P, P, P, P, P, P, W, W], // row 0  — blighted seaward edge (revenant spawns)
  [W, P, P, X, X, P, P, P, P, P, P, X, X, P, P, W], // row 1  — fortress walls
  [M, P, P, X, T, P, P, P, P, P, P, T, X, P, P, M], // row 2  — forts inside walls (Varro at 4,2)
  [M, P, P, P, P, P, X, P, P, X, P, P, P, P, P, M], // row 3  — inner corridors (2-wide)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 4  — open courtyard
  [P, P, X, X, P, P, P, T, T, P, P, P, X, X, P, P], // row 5  — central fortifications
  [P, P, X, P, P, P, P, P, P, P, P, P, P, X, P, P], // row 6  — corridor sides
  [P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P], // row 7  — transition zone
  [M, P, P, P, T, F, P, P, P, P, F, T, P, P, P, M], // row 8  — secondary defense line
  [M, P, P, F, F, P, P, P, P, P, P, F, F, P, P, M], // row 9  — forest belt
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 10 — open ground
  [P, P, F, P, P, P, T, P, P, T, P, P, P, F, P, P], // row 11 — rear forts
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 12 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_7: ChapterData = {
  id: 'ch7',
  name: 'Chapter 7: What the Wall Held',
  chapterNumber: 7,
  mapWidth: 16,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 13 } },
    { unitId: 'akira', position: { x: 8, y: 13 } },
    { unitId: 'lisette', position: { x: 7, y: 14 } },
    { unitId: 'gareth', position: { x: 6, y: 14 } },
    { unitId: 'mirelle', position: { x: 9, y: 14 } },
    { unitId: 'corwin', position: { x: 6, y: 13 } },
    { unitId: 'nadine', position: { x: 9, y: 13 } },
  ],
  enemyUnits: [
    { unitId: 'ch7_boss', position: { x: 4, y: 2 } }, // Admiral Varro on fort
    { unitId: 'ch7_soldier_1', position: { x: 7, y: 4 } }, // courtyard
    { unitId: 'ch7_soldier_2', position: { x: 8, y: 4 } }, // courtyard
    { unitId: 'ch7_fighter_1', position: { x: 5, y: 7 } }, // transition zone
    { unitId: 'ch7_fighter_2', position: { x: 10, y: 7 } }, // transition zone
    { unitId: 'ch7_mage_1', position: { x: 6, y: 5 } }, // central fort
    { unitId: 'ch7_mage_2', position: { x: 9, y: 5 } }, // central fort
  ],
  objective: {
    type: 'survive',
    turns: 12,
    description: 'Survive for 12 turns',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 12,
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The fortress at the Cut, where the channel splits the island in two. These walls have stood two hundred years. Tonight something is moving inside the seaward wall itself.',
          ja: '島を二つに割る瀬戸の砦。この城壁は二百年立ち続けてきた。今夜、海側の壁そのものの中で何かが動いている。',
        },
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'I have been at the ward readings all night. The blight is not spreading at random. It is answering.',
          ja: '一晩中、結界の読みを取っていました。灰は無作為に広がっているのではありません。応えているのです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: { en: 'Answering what?', ja: '何にだ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Me. Every time I chart where it will surface next, it surfaces somewhere else. Not once. Eleven times in a row. That is not weather, that is a thing that knows it is being looked at.',
          ja: '私にです。次にどこへ現れるかを図に落とすたび、別の場所に現れる。一度ではありません。十一回続けて。あれは天候ではない。見られていると知っているものです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Admiral Varro holds the keep above the channel. Old garrison, disciplined, spread thin along the wall.',
          ja: '瀬戸を見下ろす主郭はヴァロ提督が押さえてる。古参の守備隊、規律は固い、ただし壁沿いに薄く伸びてる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Hold the line and nobody chases. Lisette, stay at the rear — I need your eyes on the north wall, not on a lance.',
          ja: '線を保て、誰も追うな。リゼットは後方に。お前の目は槍ではなく北壁に要る。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'My eyes may be worth very little today, my lord. I want that said aloud before it matters.',
          ja: '今日の私の目はほとんど値打ちがないかもしれません。手遅れになる前に、それを声に出しておきます。',
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
          en: 'The revenants stop coming. The fortress goes quiet, and the quiet is worse than the noise was.',
          ja: '屍兵が出てこなくなった。砦は静まり返り、その静けさは先ほどまでの喧噪より悪かった。',
        },
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Six years of ward theory. Every book in the royal archive. All of it built on the one thing everyone agrees on — that a seal does not think. And it thinks, my lord. It waited for me to commit my readings and then it moved.',
          ja: '六年の結界学。王室書庫の蔵書すべて。その全部が、誰もが一致する一つの前提の上に建っています――封印は考えない、と。ところが考えるのです、殿下。私が読みを確定するのを待ってから動いた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Then stop trying to predict it.', ja: 'なら予測をやめろ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'That is all I am. Take the predicting away and there is a small rude woman with bad eyesight and no lance.',
          ja: '私はそれだけの人間です。予測を取り上げたら、目の悪い、無礼な、槍も持てない小柄な女が残るだけです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'You have been asking where it will go. Ask what it wants instead. You are the only one of us who could tell the difference.',
          ja: 'お前はどこへ行くかを問うてきた。代わりに何を欲しているかを問え。その違いが分かるのはこの隊でお前だけだ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: { en: '...That is not a measurement.', ja: '……それは測定ではありません。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'No. It is a question. Those are allowed too.',
          ja: 'ええ。問いです。問いも許されているんですよ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Whatever your readings said, you kept the north wall standing for twelve turns. I was on it. I noticed.',
          ja: '読みが何と出ていようと、あなたは北壁を十二の間保たせた。私はそこにいました。見ていました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'And you shouted the right things at the right people. That is most of what a commander does, and you did it without a horse.',
          ja: 'それに、正しい相手に正しいことを怒鳴った。指揮官の仕事の大半はそれだ。しかもあんたは馬なしでやった。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'That night Lisette burned two years of charts, and started a new book with one line at the top of it: WHAT DOES IT WANT?',
          ja: 'その夜リゼットは二年分の図表を焼き、新しい帳面を起こして、最初の行にこう記した。「それは何を欲しているのか」',
        },
      },
    ],
  },
  reinforcements: [
    {
      turn: 3,
      units: [
        { unitId: 'ch7_corrupted_1', position: { x: 5, y: 0 } },
        { unitId: 'ch7_corrupted_2', position: { x: 10, y: 0 } },
      ],
      message: {
        en: 'Revenants claw their way out of the north wall!',
        ja: '屍兵が北壁から這い出してくる！',
      },
    },
    {
      turn: 5,
      units: [
        { unitId: 'ch7_corrupted_3', position: { x: 3, y: 0 } },
        { unitId: 'ch7_corrupted_4', position: { x: 12, y: 0 } },
      ],
      message: {
        en: 'More revenants pull themselves free!',
        ja: 'さらに屍兵が身を引き抜いてくる！',
      },
    },
    {
      turn: 7,
      units: [
        { unitId: 'ch7_corrupted_5', position: { x: 4, y: 0 } },
        { unitId: 'ch7_corrupted_6', position: { x: 11, y: 0 } },
        { unitId: 'ch7_corrupted_7', position: { x: 7, y: 0 } },
      ],
      message: {
        en: 'The wall splits wider — three more come through!',
        ja: '壁の裂け目が広がる――さらに三体が抜けてきた！',
      },
    },
    {
      turn: 9,
      units: [{ unitId: 'ch7_corrupted_8', position: { x: 8, y: 0 } }],
      message: {
        en: 'One last thing drags itself out of the stone!',
        ja: '最後の一体が石の中から身を引きずり出す！',
      },
    },
  ],
  events: [
    // Turn 1: Lisette's forecast is off
    {
      id: 'ch7_lisette_off',
      trigger: { type: 'turn_start', turn: 1 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'The ward-stone has gone cold. Not cracked — cold, as though there were nothing left out west for it to point at.',
                  ja: '結界石が冷えました。割れたのではなく、冷えた。まるで西に指し示すものが何も残っていないかのように。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'That could be good news.', ja: '良い報せかもしれん。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'It could. It could also mean it is no longer out west. Watch the wall, my lord.',
                  ja: 'かもしれません。あるいは、もう西にはいないということかもしれません。壁を見ていてください、殿下。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3: Corrupted spawn + Lisette crisis
    {
      id: 'ch7_lisette_crisis',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'The north wall. The stone is going grey and something is climbing out of it.',
                  ja: '北壁です。石が灰色に変わって、何かが這い出してきています。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'Those are not soldiers. Gods — that one is wearing Amagi colours.',
                  ja: 'ありゃ兵じゃねえ。おい――あいつ、天城の色を着てるぞ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'They are revenants. The Blackflame does not kill men, it hollows them and stands them back up. Do not look at their faces. Please do not look at their faces.',
                  ja: '屍兵です。黒炎は人を殺しません。中を空にして、立ち上がらせるのです。顔を見ないで。お願いですから顔を見ないで。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'New orders. Nobody advances. We hold this courtyard and we outlast them.',
                  ja: '命令を変える。誰も前へ出るな。この中庭を保ち、耐え抜く。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 6: Lisette breakdown
    {
      id: 'ch7_lisette_breakdown',
      trigger: { type: 'turn_start', turn: 6 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'I called the east stair and it came up the west. I called the west and it came through the floor. It is not outrunning me — it is waiting to hear what I say.',
                  ja: '東の階段と読めば西から上がってきた。西と読めば床から出てきた。私を出し抜いているのではありません――私が何と言うかを待っているのです。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Nadine',
                text: {
                  en: 'Lisette. Breathe. In, and out, and again.',
                  ja: 'リゼットさん。息を。吸って、吐いて、もう一度。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'You do not understand. My whole use to this company is knowing. If I cannot know, what am I standing here for?',
                  ja: '分かっていません。この隊での私の値打ちは知ることだけです。知ることができないなら、私は何のためにここに立っているのですか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: {
                  en: 'Then stop calling it out loud, lass. Write it down and hand it to the prince. If the cursed thing is listening, make it work for what it hears.',
                  ja: 'なら声に出すのをやめろ、お嬢さん。書いて王子に渡せ。あの忌々しいものが聞いてるなら、聞くのに苦労させてやれ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: '...That is a horrible idea. Give me your chalk.',
                  ja: '……ひどい思いつきです。白墨を貸してください。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 9: Party rallies
    {
      id: 'ch7_rally',
      trigger: { type: 'turn_start', turn: 9 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Shigeru',
                text: {
                  en: "Three more turns. Hold the line — we're almost through this.",
                  ja: 'あと三つだ。線を保て――もう少しで抜ける。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: '...Fewer of them each wave. Whatever is pushing them up through that wall is tiring.',
                  ja: '……波ごとに数が減っています。壁越しに押し上げている何かが疲れてきている。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'Then we outlast it. That is a thing we are good at.',
                  ja: 'なら耐え抜く。それは我々の得意なことだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Lisette. Keep writing. I will keep reading.',
                  ja: 'リゼット。書き続けろ。私は読み続ける。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: { en: '...Thank you.', ja: '……ありがとうございます。' },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 11: Corruption fading, survive almost complete
    {
      id: 'ch7_corruption_fading',
      trigger: { type: 'turn_start', turn: 11 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'Thinner again. Whatever fuel it had, it is nearly through it. One more turn!',
                  ja: 'また薄くなりました。燃やしていたものが尽きかけています。あと一つ！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Hold your ground! One more push and the wall is ours!',
                  ja: '持ちこたえろ！もう一押しで壁は我らのものだ！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: {
                  en: 'Along the north wall the grey stone dulls and stops moving. Whatever was pushing through it has stopped pushing.',
                  ja: '北壁沿いの灰色の石が鈍く沈み、動きを止めた。そこを押し抜けようとしていた何かが、押すのをやめた。',
                },
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Survive complete — brief relief
    {
      id: 'ch7_survive_relief',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'Nothing more is coming out of the wall. It is spent.',
                  ja: '壁からはもう何も出てきません。尽きました。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'We made it. Everyone still standing?',
                  ja: '凌ぎました。全員立っていますか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Still standing. Barely.', ja: '立っている。かろうじてな。' },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Optional boss killed: Varro
    {
      id: 'ch7_isonami_killed',
      trigger: { type: 'unit_killed', unitId: 'ch7_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Varro',
                text: {
                  en: 'Two hundred years this keep has held the Cut. It will hold after me.',
                  ja: '二百年、この城は瀬戸を保ってきた。わしの後も保つ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'You watched your own wall turn grey, Admiral. You know it will not.',
                  ja: '提督、貴公は自分の壁が灰色に変わるのを見ていた。保たないと分かっているはずだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Narrator',
                text: {
                  en: "Admiral Varro's Hero Crest clatters to the stone floor.",
                  ja: 'ヴァロ提督の勇者の証が、石の床に音を立てて落ちた。',
                },
              },
            ],
          },
        },
        { type: 'give_item', unitId: 'shigeru', itemId: 'hero_crest' },
      ],
      once: true,
    },
  ],
  supportConversations: [
    {
      unitA: 'shigeru',
      unitB: 'lisette',
      lines: [
        {
          speaker: 'Lisette',
          text: {
            en: 'My lord. When you were seven you fell off the archive ladder trying to reach the ward-theory shelf.',
            ja: '殿下。七つのとき、結界学の棚に手を伸ばして書庫の梯子から落ちましたね。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'You were there?', ja: 'お前がいたのか。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'I was holding the ladder. Badly. Your father did not have me flogged, which surprised everyone including your father.',
            ja: '梯子を押さえていました。下手に。先王は私を鞭打たせなかった。あれには先王ご自身を含め全員が驚きました。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: 'He said you had the only interesting question in the room.',
            ja: '父上は、あの部屋で面白い問いを持っているのはお前だけだと言っていた。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: '...He said that? Well. Then I had better find another one.',
            ja: '……そう仰ったのですか。では、もう一つ見つけねばなりませんね。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'lisette', stat: 'mag', amount: 1 },
    },
    {
      unitA: 'lisette',
      unitB: 'fenn',
      lines: [
        {
          speaker: 'Fenn',
          text: {
            en: 'So your readings lie to you now. Welcome. That is how every day of my life has gone.',
            ja: '読みが嘘をつくようになったってことか。ようこそ。俺の人生は毎日そうだよ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: { en: 'That is not helpful, Fenn.', ja: '助けになっていません、フェン。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Fenn',
          text: {
            en: 'It was not meant to be helpful, it was meant to be true. You want to know how a thief works a house that lies to them?',
            ja: '助けるつもりはない、本当のことを言っただけだ。嘘をつく屋敷を盗人がどう攻めるか知りたいか？',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: { en: '...Go on.', ja: '……続けて。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Fenn',
          text: {
            en: 'You stop asking what is behind the door. You watch which door the owner never opens. Things give themselves away by what they protect.',
            ja: '扉の向こうに何があるかを訊くのをやめる。主人が決して開けない扉はどれかを見る。何を守っているかで正体が割れるのさ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'Fenn. That is genuinely the most useful thing anyone has said to me this month, and I resent it enormously.',
            ja: 'フェン。今月人に言われた中で本当にいちばん役に立ちました。そして猛烈に腹が立ちます。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
  ],
};
