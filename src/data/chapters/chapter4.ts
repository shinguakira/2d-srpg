import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';

// 18 columns x 10 rows — pirate stronghold (reframed from ruins)
const terrain: TerrainType[][] = [
  //0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17
  [X, X, X, X, X, F, X, X, H, X, X, F, X, X, X, X, X, X], // row 0 — throne at (8,0)
  [X, P, P, X, P, P, P, P, P, P, P, P, P, X, P, P, P, X], // row 1
  [X, P, P, X, P, X, X, P, P, X, X, P, P, X, P, P, P, X], // row 2
  [X, P, P, P, P, X, P, P, P, P, X, P, P, P, P, X, P, X], // row 3
  [X, X, X, P, X, X, P, T, P, P, X, X, P, X, X, P, P, X], // row 4 — fort at (7,4)
  [X, V, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, X], // row 5 — village at (1,5), main corridor
  [X, P, X, X, P, X, P, P, P, X, P, X, X, P, V, P, P, X], // row 6 — village at (14,6)
  [X, P, P, P, P, X, P, T, P, X, P, P, P, P, P, P, P, X], // row 7 — fort at (7,7)
  [X, X, P, P, P, P, P, P, P, P, P, P, P, P, X, V, P, X], // row 8 — village at (15,8)
  [M, X, X, F, P, P, P, P, P, P, P, P, F, X, X, P, P, M], // row 9 — entrance
];

export const CHAPTER_4: ChapterData = {
  id: 'ch4',
  name: 'Chapter 4: The Cape of Tsutsu',
  chapterNumber: 4,
  mapWidth: 18,
  mapHeight: 10,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 9 } },
    { unitId: 'akira', position: { x: 10, y: 9 } },
    { unitId: 'lisette', position: { x: 6, y: 9 } },
    { unitId: 'mirelle', position: { x: 11, y: 9 } },
    { unitId: 'gareth', position: { x: 8, y: 9 } },
    { unitId: 'halvar', position: { x: 9, y: 9 } },
    { unitId: 'bryn', position: { x: 5, y: 9 } },
    { unitId: 'fenn', position: { x: 4, y: 9 } },
  ],
  enemyUnits: [
    { unitId: 'ch4_soldier_1', position: { x: 4, y: 7 } },
    { unitId: 'ch4_soldier_2', position: { x: 13, y: 7 } },
    { unitId: 'ch4_soldier_3', position: { x: 15, y: 5 } },
    { unitId: 'ch4_fighter_1', position: { x: 8, y: 5 } },
    { unitId: 'ch4_fighter_2', position: { x: 3, y: 5 } },
    { unitId: 'ch4_fighter_3', position: { x: 13, y: 3 } },
    { unitId: 'ch4_mage_1', position: { x: 11, y: 3 } },
    { unitId: 'ch4_mage_2', position: { x: 5, y: 3 } },
    { unitId: 'ch4_guard_1', position: { x: 7, y: 4 } }, // on fort
    { unitId: 'ch4_guard_2', position: { x: 4, y: 1 } },
    { unitId: 'ch4_boss', position: { x: 8, y: 0 } }, // boss — aggressive AI, will leave throne
  ],
  objective: {
    type: 'seize',
    description: 'Seize the throne',
  },
  seizePosition: { x: 8, y: 0 },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  recruitableUnits: [],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: "Shigeru's company arrives at the cape town of Tsutsu. Overturned stalls and fleeing merchants paint a grim picture.",
          ja: 'シゲル一行は岬の町、豆酘に着いた。倒れた露店と逃げ惑う商人が、事の有様を語っていた。',
        },
      },
      {
        speaker: 'Akira',
        text: { en: 'Raiders? This far south?', ja: '略奪者？こんな南まで？' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Sea raiders. They have been working this cape for weeks. Three storehouses are still holding out.',
          ja: '海の略奪者です。数週間この岬を荒らしています。倉が三つ、まだ持ちこたえている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'Pirates. Do pirates keep good axes? Asking for professional reasons.',
          ja: '海賊か。海賊はいい斧を持ってるのか？職業上の関心だ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: {
          en: 'Gareth. These people are losing their homes.',
          ja: 'ガレス。この人たちは家を失おうとしているんですよ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: {
          en: 'Aye, and I mean to take the axes off the men doing it. Where is the disagreement?',
          ja: 'ああ、そしてやってる連中から斧を取り上げるつもりだ。どこに食い違いがある？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'We protect the storehouses. All three. If even one falls, the town loses its trade route.',
          ja: '倉を守る。三つとも。一つでも落ちれば、この町は交易路を失う。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Mirelle',
        text: {
          en: "Fenn, was it? You're really staying with us?",
          ja: 'フェン、でしたね？本当に一緒に来てくれるんですか？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Fenn',
        text: {
          en: 'You lot move through a town like a parade and somehow nobody has killed you. I want to see how far that goes.',
          ja: 'あんたら行列みたいに町を歩いて、なぜか誰にも殺されてない。それがどこまで続くか見たいんだ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'They took my belt pouch. Twice. During the battle.',
          ja: '腰の巾着を盗られた。二度もだ。戦の最中に。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Fenn',
        text: {
          en: 'And gave it back twice. Consider it a lesson, grandfather.',
          ja: '二度とも返したろ。授業料だと思いなよ、爺さん。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Gareth',
        text: { en: 'I like them.', ja: 'こいつは気に入った。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Fenn',
        text: {
          en: 'One thing, though. The back lane behind the north storehouse. Do not go down it.',
          ja: 'ただ一つだけ。北の倉の裏の路地。あそこは通るな。',
        },
        speakerFaction: 'player',
      },
      { speaker: 'Lisette', text: { en: 'Why not?', ja: 'なぜです。' }, speakerFaction: 'player' },
      {
        speaker: 'Fenn',
        text: {
          en: 'Cats will not walk it. Every cat in Tsutsu, and not one of them will set foot in that lane. I have been picking pockets in this town since I was six and I have learned to bet on the cats.',
          ja: '猫が歩かない。豆酘中の猫が一匹もあの路地に足を踏み入れない。六つの頃からこの町で掏摸をやってる。猫に賭けるのが正しいと学んだよ。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: { en: 'Which way does the lane run?', ja: 'その路地はどちらを向いていますか。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Fenn',
        text: {
          en: 'West-north-west. Straight as a rule. Why has everyone gone quiet?',
          ja: '西北西。定規みたいにまっすぐだ。……なんでみんな黙った？',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'That night Lisette walked the lane end to end with a lamp, and came back without saying what she had found.',
          ja: 'その夜、リゼットは灯りを持って路地を端から端まで歩き、何を見たかを言わずに戻ってきた。',
        },
      },
    ],
  },
  villages: [
    {
      position: { x: 1, y: 5 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: {
          en: 'You saved my shop! Here \u2014 take this blade. It is the least I can do.',
          ja: '店を助けてくださった！これを――この剣をお持ちください。せめてものお礼です。',
        },
        speaker: 'Merchant',
      },
    },
    {
      position: { x: 14, y: 6 },
      reward: {
        type: 'weapon',
        weaponId: 'silver_sword',
        dialogue: {
          en: 'The raiders hid this in my cellar. Take it before they come back.',
          ja: '略奪者どもが私の蔵に隠していったものです。奴らが戻る前に持っていってください。',
        },
        speaker: 'Shopkeeper',
      },
    },
    {
      position: { x: 15, y: 8 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: {
          en: 'My grandfather forged this. Use it well against those scoundrels.',
          ja: '祖父が鍛えたものです。あの外道どもに存分に使ってくだされ。',
        },
        speaker: 'Old Fisherman',
      },
    },
  ],
  parTurns: 12,
  reinforcements: [
    {
      turn: 4,
      units: [
        { unitId: 'ch4_reinforce_1', position: { x: 4, y: 9 } },
        { unitId: 'ch4_reinforce_2', position: { x: 12, y: 9 } },
        { unitId: 'ch4_reinforce_3', position: { x: 16, y: 8 } },
      ],
      message: {
        en: 'More raiders come in off the boats!',
        ja: '舟からさらに略奪者が上がってきた！',
      },
    },
  ],
  events: [
    // Turn 2 — Thief rush warning
    {
      id: 'ch4_thief_rush',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: "Raiders \u2014 heading for the storehouses. They're fast and they won't stop to fight.",
                  ja: '略奪者が倉へ向かっています。速い上に、戦うために足を止めません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Split up. Cover all three routes.',
                  ja: '分かれろ。三つの経路すべてを塞ぐ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'Split three ways? Against that many? We will be thin everywhere and strong nowhere.',
                  ja: '三方に分けるのか？あの数を相手に？どこも薄くなって、どこも強くならんぞ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: 'He is right, my lord. Doctrine says concentrate.',
                  ja: '彼の言う通りです、殿下。兵法は集中せよと説きます。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Doctrine assumes the objective is the enemy. It is not. It is three roofs full of a town’s winter grain. Split up.',
                  ja: '兵法は目標が敵だと前提している。違う。目標は町の冬の麦が詰まった三つの屋根だ。分かれろ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 3 — Fenn encounter
    {
      id: 'ch4_fenn_encounter',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Fenn',
                text: {
                  en: 'Purse. Purse. Ooh, a good purse. And what have we here \u2014 a very fine sword on a very tired prince\u2014',
                  ja: '財布。財布。おっと、いい財布だ。おやおや、これは――ずいぶん疲れた王子様に、ずいぶん見事な剣が――',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Put it down.', ja: '置け。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: {
                  en: 'How did you even see me? I was behind a barrel!',
                  ja: 'なんで見えたんだ？樽の陰にいたのに！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'You were behind half a barrel. Also you were humming.',
                  ja: '半分しか隠れていなかった。あと鼻歌を歌っていた。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: {
                  en: '...I hum when I concentrate. It is a flaw. I am working on it.',
                  ja: '……集中すると鼻歌が出るんだ。欠点だよ。直そうとしてる。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'The pirates are three streets away and about to burn the grain. Run, or help.',
                  ja: '海賊は三筋向こうで、麦を焼こうとしている。逃げるか、手を貸すかだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: {
                  en: 'Those are the only two choices? No third option where I take the sword and run?',
                  ja: '二択しかないのか？剣を頂いて逃げる三つ目は？',
                },
                speakerFaction: 'player',
              },
              { speaker: 'Shigeru', text: { en: 'No.', ja: 'ない。' }, speakerFaction: 'player' },
              {
                speaker: 'Fenn',
                text: {
                  en: '...Fine. I know every alley in this town, which is more than your knight does. Follow me and try not to clank.',
                  ja: '……いいだろう。この町の路地は全部頭に入ってる。そこの騎士様よりはな。ついてこい、なるべく音を立てるな。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 5 — Village pressure
    {
      id: 'ch4_village_pressure',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: "That raider is closing on the southern storehouse. If they reach it, it's lost.",
                  ja: '略奪者が南の倉に迫っています。届かれたら終わりです。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Bryn',
                text: {
                  en: "I can intercept \u2014 but I'd be overextended.",
                  ja: '私なら止められる。ただし突出しすぎる。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: "Do it. We can't lose any of them.", ja: 'やれ。一つも失えない。' },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss pre-combat — Shigeru approaches Brask
    {
      id: 'ch4_boss_precombat',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 8, y: 1 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Brask',
                text: {
                  en: 'A prince. In my town. Wearing a crown-sword worth more than this whole quarter.',
                  ja: '王子様が、俺の町に。この一区画より高くつく王家の剣を提げてな。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Take your boats and go. I have no interest in you.',
                  ja: '舟を出して去れ。お前に興味はない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Brask',
                text: {
                  en: 'Kurogane pays for grain and asks no questions. Amagi is a name on a burnt map. Why would I go anywhere?',
                  ja: '黒鉄は麦に金を払い、何も訊かねえ。天城は焼けた地図の上の名前だ。なんで俺がどこかへ行く必要がある？',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Because the men who pay you are also the reason the fish are leaving this coast. Ask your own crews.',
                  ja: 'お前に金を払っている連中が、この沿岸から魚が消えている原因でもあるからだ。自分の船子に訊いてみろ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Brask',
                text: { en: '...Pretty speech. Draw, boy.', ja: '……上等な演説だ。抜けよ、坊主。' },
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
      id: 'ch4_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch4_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: {
                  en: 'Search him. A man like that keeps his coin close.',
                  ja: '検めろ。ああいう手合いは金を身につけてる。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: {
                  en: 'Already have. It is a Kurogane pay chit, signed, dated this month.',
                  ja: 'もう済ませた。黒鉄の支払手形だ。署名入り、今月の日付。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'So the Empire is paying sea raiders to starve its own conquest.',
                  ja: '帝国が、自ら奪った土地を飢えさせるために海賊に金を出しているのか。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Halvar',
                text: {
                  en: 'A hungry province does not raise an army. That is not cruelty, my lord. That is the manual.',
                  ja: '飢えた州は軍を起こしません。あれは残酷なのではありません、殿下。教本通りです。',
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
  supportConversations: [
    {
      unitA: 'fenn',
      unitB: 'gareth',
      lines: [
        {
          speaker: 'Gareth',
          text: {
            en: 'Fenn. Best thing you ever lifted. Go.',
            ja: 'フェン。今まで盗った中で最高の物。言ってみろ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Fenn',
          text: {
            en: 'A ring of keys off a harbourmaster. Opened every warehouse on the north quay.',
            ja: '港湾長から抜いた鍵束さ。北桟橋の倉が全部開いた。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: {
            en: 'Keys. That is not treasure, that is a tool. I meant weapons. Armour. Things that hit.',
            ja: '鍵か。そりゃ宝じゃなくて道具だ。俺が言ったのは武器だ。鎧だ。殴れる物だよ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Fenn',
          text: {
            en: 'I fed forty families that winter with those keys. How many did your axe feed?',
            ja: 'あの鍵でその冬、四十世帯を食わせた。あんたの斧は何人食わせた？',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: {
            en: '...Right. Fine. Keys. Good answer.',
            ja: '……ああ。わかった。鍵だな。いい答えだ。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'gareth', stat: 'str', amount: 1 },
    },
    {
      unitA: 'halvar',
      unitB: 'bryn',
      lines: [
        {
          speaker: 'Halvar',
          text: { en: "You don't talk much.", ja: 'あまり喋らんな。' },
          speakerFaction: 'player',
        },
        { speaker: 'Bryn', text: { en: 'No.', ja: 'ない。' }, speakerFaction: 'player' },
        {
          speaker: 'Halvar',
          text: {
            en: 'Eleven years on a wall and nobody said a word to me either. It is not the worst way to pass a life.',
            ja: '十一年城壁の上にいて、誰も俺に一言もかけなかった。人生の過ごし方として最悪ではない。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Bryn',
          text: {
            en: 'I prefer high ground and clear sightlines to conversation.',
            ja: '会話より、高所と見通しのほうがいい。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Halvar',
          text: {
            en: '...That might be the most relatable thing anyone in this company has said to me.',
            ja: '……この隊で誰かに言われた中で、いちばん腑に落ちた言葉かもしれん。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'bryn', stat: 'skl', amount: 1 },
    },
  ],
};
