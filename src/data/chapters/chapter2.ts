import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 18 columns x 10 rows — fills 16:9 desktop with square tiles
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [M, M, F, P, P, P, X, H, X, P, P, P, P, F, P, F, M, M], // row 0 — throne at (7,0)
  [M, F, P, P, F, P, P, P, P, P, P, F, P, P, P, P, F, M], // row 1
  [F, P, P, F, P, P, T, P, P, P, P, P, F, P, P, P, P, F], // row 2 — fort at (6,2)
  [P, P, P, V, P, W, W, W, W, P, P, P, P, V, P, P, P, P], // row 3 — river + 2 villages
  [P, F, P, P, W, P, P, P, P, W, P, P, F, P, P, F, P, P], // row 4 — river gap (bridge)
  [P, P, P, W, W, P, P, P, P, W, W, P, P, P, P, P, P, P], // row 5
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P, F, P, P, P], // row 6
  [P, F, P, P, P, T, P, P, P, P, P, P, F, P, P, F, P, P], // row 7 — fort at (5,7)
  [F, P, P, P, F, P, P, P, P, F, P, P, P, P, F, P, P, F], // row 8
  [M, M, F, P, P, P, P, P, P, P, P, P, P, P, P, F, M, M], // row 9
];

export const CHAPTER_2: ChapterData = {
  id: 'ch2',
  name: 'Chapter 2: The Sasu Crossing',
  chapterNumber: 2,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 8 } },
    { unitId: 'akira', position: { x: 10, y: 8 } },
    { unitId: 'lisette', position: { x: 7, y: 9 } },
    { unitId: 'mirelle', position: { x: 11, y: 9 } },
    { unitId: 'gareth', position: { x: 8, y: 8 } },
  ],
  enemyUnits: [
    { unitId: 'ch2_fighter_1', position: { x: 4, y: 5 } },
    { unitId: 'ch2_soldier_1', position: { x: 7, y: 3 } },
    { unitId: 'ch2_guard_1', position: { x: 6, y: 1 } },
    { unitId: 'vidar', position: { x: 7, y: 0 } },
    // Halvar: player template placed as enemy, defects turn 3 via event
    {
      unitId: 'halvar',
      position: { x: 8, y: 1 },
      faction: 'enemy',
      aiBehavior: { type: 'stationary' },
    },
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 7, y: 0 },
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'Dawn on the Sasu river. A Kurogane garrison holds the only bridge for thirty miles, and behind it the road runs south to Tsutsu and the last harbour still ours.',
          ja: '佐須川の夜明け。三十里のあいだ唯一の橋を黒鉄の守備隊が押さえている。その先の道は南へ、豆酘と、まだ我らの手に残る最後の港へ続いている。',
        },
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Regulars this time, my lord. Walls, watch rotations, a commander who knows his trade. Not brigands.',
          ja: '今度は正規兵です、殿下。城壁、交代制の見張り、戦を心得た指揮官。山賊ではありません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Their banner is Commander Vidar\u2019s. He took this bridge eleven days ago and has not moved a man since. He will not come out to meet us.',
          ja: '旗はヴィダル隊長のものです。十一日前にこの橋を押さえて以来、一兵も動かしていません。こちらへは出てきません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then we go to him. How do you know his banner, Lisette?',
          ja: 'ならこちらから行く。リゼット、なぜ旗がわかる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'I catalogued every heraldic device in the royal archive when I was fourteen. It was that or conversation.',
          ja: '十四のとき王室書庫の紋章を全て目録にしました。それか会話をするかの二択でしたので。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'I like her. Are these ones going to fight back, at least? The last lot mostly ran.',
          ja: '気に入ったぜ。で、今度のは少しは向かってくるのか？前のはほとんど逃げた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'I have bandages, thread, and a very stern speech about not dying. Please make me use only the first two.',
          ja: '包帯と糸と、死ぬなというお説教を用意してきました。使うのは前の二つだけにしてくださいね。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Take the bridge. Nobody crosses alone.', ja: '橋を取る。一人で渡るな。' },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Lisette',
        text: {
          en: 'Shigeru. Vidar was carrying a ward-stone. A shrine ward — the kind that is set into a seal and never, ever leaves it.',
          ja: 'シゲル様。ヴィダルが結界石を持っていました。社の結界石です。封印に嵌め込まれ、決してそこを離れることのない類のものです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'From which shrine?', ja: 'どこの社のものだ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'The one at Are. And it is cracked clean through. Wards do not crack. They are cut from a single stone precisely so they cannot.',
          ja: '阿連です。しかも真っ二つに割れている。結界石は割れません。割れないように一つの石から削り出すのです。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'The shrine at Are. That is where the Emperor went, before the war. Alone. He came back three days later and gave the order to march.',
          ja: '阿連の社。開戦の前、皇帝が行った場所だ。ひとりでな。三日後に戻ってきて、進軍を命じた。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Went there and did what?', ja: '行って何をした。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'Nobody asked. You do not ask Takeshi things.',
          ja: '誰も訊かん。タケシに物を訊く者はいない。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'The Sacred Flames hold the seal. If a ward is broken, then the seal is... my lord, that is not a small thing.',
          ja: '聖火が封印を保っています。結界石が割れているということは、封印は……殿下、これは小さな話ではありません。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Give me the stone and time. If something is leaking out of the west, it will leave traces, and traces can be mapped.',
          ja: 'その石と時間をください。西から何かが漏れ出しているなら痕跡が残ります。痕跡は図に落とせます。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'The company crossed the Sasu that evening, carrying a cracked ward and a name none of them wanted to say twice.',
          ja: 'その日の夕、隊は佐須川を渡った。割れた結界石と、誰も二度は口にしたくない名を携えて。',
        },
      },
    ],
  },
  villages: [
    {
      position: { x: 13, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: {
          en: 'The garrison has been pressuring us for taxes. Take this \u2014 we hid it from the soldiers.',
          ja: '守備隊に税を取り立てられ続けていました。これを持っていってください。兵から隠していたものです。',
        },
        speaker: 'Villager',
      },
    },
    {
      position: { x: 3, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'iron_lance',
        dialogue: {
          en: 'A weapon, for our liberators. My grandfather forged it.',
          ja: '解放者様に武器を。祖父が鍛えたものです。',
        },
        speaker: 'Villager',
      },
    },
  ],
  deploymentSlots: 5,
  forceDeploy: ['shigeru'],
  parTurns: 10,
  recruitableUnits: ['halvar'],
  events: [
    // Turn 2 — Bridge strategy + Lisette tracking
    {
      id: 'ch2_turn2_hint',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Akira',
                text: {
                  en: 'The bridge is narrow \u2014 only one unit can cross at a time.',
                  ja: '橋は狭い。一度に一人しか渡れません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Or we flank through the shallow water. Slower, but we approach from two sides.',
                  ja: 'あるいは浅瀬を回る。遅いですが、二方向から迫れます。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Note the sentry on the north wall who has not turned his head once. Either he is asleep or he wants us to think he is.',
                  ja: '北壁の歩哨、一度も首を動かしていません。眠っているか、眠っていると思わせたいかのどちらかです。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Halvar defection (expanded)
    {
      id: 'ch2_halvar_defection_dialogue',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Halvar',
                text: { en: 'I am done.', ja: 'もう終いだ。' },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Akira',
                text: { en: 'It is a trap. Hold the line!', ja: '罠です。隊列を保て！' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'It is not. Sergeant Halvar, second wall company. Eleven years I have stood a watch post for that man.',
                  ja: '罠ではない。第二城壁中隊、軍曹ハルヴァル。十一年、あの男のために見張り台に立ってきた。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'And today you are putting down your lance in front of an enemy prince. Why today?',
                  ja: 'その男が今日、敵国の王子の前で槍を置く。なぜ今日だ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'Three weeks ago my own army burned a village I could see from my post. I watched the smoke for two days and I did not leave my post, because that is what a good soldier does.',
                  ja: '三週間前、俺の軍が、俺の持ち場から見える村を焼いた。二日間その煙を見ていて、俺は持ち場を離れなかった。良い兵とはそういうものだからだ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'I have thought about that for three weeks. I have decided I would rather be a bad soldier.',
                  ja: '三週間それを考えた。悪い兵でいるほうがましだと決めた。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'Huh. That is either the bravest thing I have heard or the stupidest.',
                  ja: 'ふうん。今まで聞いた中でいちばん勇敢か、いちばん愚かかだな。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'It is both, lad. Most true things are.',
                  ja: '両方だよ、若いの。本当のことはたいていそうだ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    {
      id: 'ch2_halvar_defection_recruit',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [{ type: 'recruit_unit', unitId: 'halvar' }],
      once: true,
    },
    // Turn 4 — Lisette's seed observation
    {
      id: 'ch2_lisette_wards',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: 'My lord. The grass along the north wall is grey. Not dead \u2014 grey. It has no scorch, no rot, no insects.',
                  ja: '殿下。北壁沿いの草が灰色です。枯れているのではなく、灰色。焦げも腐りも虫もありません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Lisette, we are in the middle of\u2014',
                  ja: 'リゼット、今は戦の最中で――',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'It runs in a line. Two paces wide, arrow-straight, and it points west-north-west. Toward the sea cliffs.',
                  ja: 'それが線を成しています。幅二歩、矢のようにまっすぐ、西北西を指している。海の断崖の方角です。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'The old shrine songs call that ashfall. They say it comes before the Blackflame.',
                  ja: '古い社の歌はそれを灰降りと呼びます。黒炎の前触れだと。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Songs are not evidence. But a straight line across broken ground is, and something drew it.',
                  ja: '歌は証拠になりません。ですが起伏のある地面を貫く直線は証拠です。何かがそれを引いた。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Then mark it and finish the battle. We can be frightened later, in order.',
                  ja: 'なら印をつけて戦を終わらせろ。怖がるのは後だ、順番にな。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Vidar
    {
      id: 'ch2_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 7, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Vidar',
                text: {
                  en: 'Halt. I am Commander Vidar of the border garrison. State your purpose.',
                  ja: '止まれ。国境守備隊隊長、ヴィダルだ。用件を述べよ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'To cross your bridge. Amagi has fallen. There is nothing behind me worth defending and nothing ahead of me but road.',
                  ja: 'その橋を渡ることだ。天城は落ちた。背後に守る値打ちのものはなく、前には道しかない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: {
                  en: 'Then you are the prince. My orders name you. They do not, I notice, explain you.',
                  ja: 'では貴殿が王子か。命令書に名がある。もっとも、説明はされていないがな。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Your emperor broke the shrine at Are. Do your orders explain that?',
                  ja: '貴公の皇帝は阿連の社を破った。命令書にその説明はあるか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: {
                  en: '...My orders are to hold this bridge. A soldier who reads past his orders is a soldier looking for a reason to run.',
                  ja: '……私の命令はこの橋を保つことだ。命令の先を読む兵は、逃げる理由を探している兵だ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'One of your sergeants read past his this morning.',
                  ja: '貴公の軍曹が一人、今朝その先を読んだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Vidar',
                text: {
                  en: 'Then he will die a coward. Raise your sword.',
                  ja: 'ならば臆病者として死ぬ。剣を抜け。',
                },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Halvar reflects
    {
      id: 'ch2_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'vidar' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Halvar',
                text: {
                  en: 'He was not a cruel man. He simply never once looked up from his orders.',
                  ja: '残酷な男ではなかった。ただ一度も命令書から顔を上げなかっただけだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'That is most of the men we are going to have to kill, Halvar.',
                  ja: 'これから殺すことになる者の大半がそうだ、ハルヴァル。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'Aye. That is why I am telling you now, while it still bothers you.',
                  ja: 'そうだ。だから今のうちに言っておく。まだ堪えるうちにな。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [{ unitId: 'ch2_reinforce_1', position: { x: 0, y: 0 } }],
      message: { en: 'Enemy reinforcements arrive from the north!', ja: '北から敵の増援！' },
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
            en: 'My lord, may I be blunt? You give orders as though every one of them is already a mistake.',
            ja: '殿下、率直に申し上げても？あなたはどの命令も既に誤りであるかのように下されます。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'That is because most of them are.', ja: '実際たいてい誤りだからだ。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'A commander who is certain gets people killed for nothing. A commander who is uncertain gets them killed slowly. Pick a third thing.',
            ja: '確信のある指揮官は無駄に人を死なせます。確信のない指揮官はゆっくり死なせます。三つ目を選んでください。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'Which is?', ja: '三つ目とは。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Lisette',
          text: {
            en: 'Ask me for the numbers before you decide, instead of after. I am extremely good at numbers and extremely bad at consoling people.',
            ja: '決める前に数字を訊いてください。決めた後ではなく。私は数字が大変得意で、人を慰めるのが大変苦手です。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: '...Very well. Before, then.', ja: '……いいだろう。では、前にな。' },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'shigeru', stat: 'skl', amount: 1 },
    },
    {
      unitA: 'akira',
      unitB: 'mirelle',
      lines: [
        {
          speaker: 'Mirelle',
          text: {
            en: 'Sir Akira. You have been awake for two nights and you keep standing outside his tent.',
            ja: 'アキラ卿。二晩眠らず、殿下の天幕の外に立ち続けておいでですね。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: { en: 'It is the correct post for a retainer.', ja: '従者として正しい持ち場だ。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: 'It is the correct post for a man who is afraid that if he sits down he will start thinking about the palace.',
            ja: '座ったら王宮のことを考え始めてしまうと恐れている人の、正しい持ち場です。',
          },
          speakerFaction: 'player',
        },
        { speaker: 'Akira', text: { en: '...', ja: '…………' }, speakerFaction: 'player' },
        {
          speaker: 'Mirelle',
          text: {
            en: 'Sit down, Sir Akira. I will take the post. I am very small and very loud and nobody gets past me.',
            ja: 'お座りください、アキラ卿。持ち場は私が代わります。私はとても小さくてとてもうるさいので、誰も通れません。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 15 },
    },
  ],
};
