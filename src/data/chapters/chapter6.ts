import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const B: TerrainType = 'bridge';

// 16 columns x 18 rows — coastal harbor town
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
  [W, W, W, M, M, P, P, P, P, P, P, M, M, W, W, W], // row 0  — water + cliffs (north)
  [W, W, M, P, P, X, X, P, P, X, X, P, P, M, W, W], // row 1  — harbor buildings
  [W, M, P, P, X, P, P, P, P, P, P, X, P, P, M, W], // row 2  — inner harbor
  [M, P, P, P, P, P, P, T, P, P, P, P, P, P, P, M], // row 3  — fort at (7,3), boss area
  [M, P, P, X, P, P, P, P, P, P, P, X, P, P, P, M], // row 4  — walls create corridors
  [P, P, P, P, P, F, P, P, P, P, F, P, P, P, P, P], // row 5  — town outskirts
  [P, P, F, P, P, P, P, P, P, P, P, P, P, F, P, P], // row 6  — approach area
  [P, P, P, P, P, P, T, P, P, T, P, P, P, P, P, P], // row 7  — defensive forts
  [M, P, P, P, P, P, P, P, P, P, P, P, P, P, P, M], // row 8  — cliff edges
  [M, P, P, F, P, P, P, P, P, P, P, P, F, P, P, M], // row 9
  [P, P, P, P, P, P, P, B, B, P, P, P, P, P, P, P], // row 10 — bridge crossing
  [W, P, P, P, P, P, W, W, W, W, P, P, P, P, P, W], // row 11 — water channel
  [P, P, P, V, P, P, P, B, B, P, P, P, P, P, P, P], // row 12 — village at (3,12), south bridge
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — south approach (Nadine appears)
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment area
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 16 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 17 — south escape zone
];

export const CHAPTER_6: ChapterData = {
  id: 'ch6',
  name: 'Chapter 6: The Harbour at Kechi',
  chapterNumber: 6,
  mapWidth: 16,
  mapHeight: 18,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 7, y: 15 } },
    { unitId: 'akira', position: { x: 8, y: 15 } },
    { unitId: 'lisette', position: { x: 7, y: 16 } },
    { unitId: 'gareth', position: { x: 6, y: 16 } },
    { unitId: 'mirelle', position: { x: 9, y: 16 } },
    { unitId: 'corwin', position: { x: 6, y: 15 } },
    { unitId: 'halvar', position: { x: 9, y: 15 } },
  ],
  enemyUnits: [
    { unitId: 'ch6_boss', position: { x: 7, y: 3 } }, // Captain Aeryn on fort
    { unitId: 'ch6_soldier_1', position: { x: 5, y: 1 } }, // harbor guard
    { unitId: 'ch6_soldier_2', position: { x: 10, y: 1 } }, // harbor guard
    { unitId: 'ch6_soldier_3', position: { x: 4, y: 4 } }, // corridor guard
    { unitId: 'ch6_soldier_4', position: { x: 11, y: 4 } }, // corridor guard
    { unitId: 'ch6_archer_1', position: { x: 3, y: 0 } }, // cliff archer (anti-air)
    { unitId: 'ch6_archer_2', position: { x: 12, y: 0 } }, // cliff archer (anti-air)
    { unitId: 'ch6_fighter_1', position: { x: 5, y: 6 } }, // town outskirts
    { unitId: 'ch6_fighter_2', position: { x: 10, y: 6 } }, // town outskirts
    { unitId: 'ch6_fighter_3', position: { x: 8, y: 8 } }, // approach
    { unitId: 'ch6_cavalier_1', position: { x: 3, y: 5 } }, // flank left
    { unitId: 'ch6_cavalier_2', position: { x: 12, y: 5 } }, // flank right
  ],
  objective: {
    type: 'boss_kill',
    description: 'Defeat Captain Aeryn',
  },
  deploymentSlots: 7,
  forceDeploy: ['shigeru'],
  parTurns: 16,
  recruitableUnits: ['corwin', 'nadine'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The harbour at Kechi, on the inner water of Aso Bay. Salt air and smoke off the headlands. The company arrives at dawn looking for a hull that will carry them.',
          ja: '浅茅湾の内海に面した鶏知の港。潮の匂いと、岬から流れる煙。隊は夜明けに着き、自分たちを運べる船を探していた。',
        },
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Corwin. Sellsword. My last contract was a pack train out of the Sasu valley. There is no pack train and there is no Sasu valley, so here I am.',
          ja: 'コーウィン。傭兵だ。最後の契約は佐須の谷から出る荷駄隊の護衛だった。荷駄隊も佐須の谷もない。それでここにいる。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'No valley.', ja: '谷がない、だと。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Grey ground where the road was, from Shimobaru to the river mouth. I walked back the way I came and there was nothing to walk back to. Do not ask me to describe it better than that.',
          ja: '道があったところが灰色の地面だ。下原から河口まで。来た道を引き返したが、引き返す先がなかった。これ以上うまく説明しろとは言うな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'My lord, that is the fifth mark, and it is behind us now. It went past us in the night.',
          ja: '殿下、五つ目の印です。しかも我々の後方にある。夜のうちに追い越されました。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Past us? Then it is between us and every road south.',
          ja: '追い越された？では南へ向かう道すべてとの間にあるということか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Which settles the argument. We were turning west anyway. Corwin — you said you were between contracts.',
          ja: 'なら議論は終わりだ。どのみち西へ向きを変えるところだった。コーウィン――契約の合間だと言ったな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Everyone else on this bay is running east. You are the only fools walking the other way. I want to see how that ends.',
          ja: 'この湾の人間はみんな東へ逃げてる。逆へ歩いてる馬鹿はあんたらだけだ。どう終わるか見てみたい。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'A Kurogane patrol holds the harbour. Captain Tsubame’s riders wheel above the masts, waiting for a target to stand still.',
          ja: '黒鉄の哨戒隊が港を押さえていた。アエリン隊長の騎士たちが帆柱の上を旋回し、標的が足を止めるのを待っている。',
        },
      },
    ],
  },
  epilogue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'The harbor is clear. Kurogane banners hang torn in the sea wind.',
          ja: '港は片付いた。黒鉄の旗が裂けたまま潮風に垂れている。',
        },
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'So this is the work. Fight Kurogane, pick up strays, keep walking.',
          ja: 'これが仕事か。黒鉄と戦い、はぐれ者を拾い、歩き続ける。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Something like that.', ja: 'そんなところだ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Nadine',
        text: {
          en: 'The soldier I set a bone for — he was younger than me. He kept apologising while I worked. What is he even fighting for?',
          ja: '骨を継いだ兵――私より年下でした。手当ての間ずっと謝っていた。あの人は何のために戦っているんですか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Corwin',
        text: {
          en: 'Because a man he has never met told him to. That is the whole of it, girl, in every war there has ever been.',
          ja: '会ったこともない男にそう言われたからだ。それが全部だよ、嬢ちゃん。どんな戦争でもな。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'It is not quite the whole of it. He is fighting because Takeshi told him the war would be the last one. Every soldier in Kurogane believes that. It is why they march so well.',
          ja: '全部ではない。あいつが戦っているのは、この戦が最後の戦になるとタケシが言ったからだ。黒鉄の兵は皆それを信じている。だからあれほどよく行軍する。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'And do you still believe it?', ja: 'お前は今も信じているのか。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: '...I believe he believes it. That is the part that frightens me, my lord.',
          ja: '……あの男が信じていることは信じている。恐ろしいのはそこです、殿下。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'Then we make time. The Cut next — and after that, west.',
          ja: 'なら急ぐ。次は瀬戸だ。その後は西へ。',
        },
        speakerFaction: 'player',
      },
    ],
  },
  villages: [
    {
      position: { x: 3, y: 12 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_bow',
        dialogue: {
          en: "My son was a sailor before Kurogane came. He'd want you to have this.",
          ja: '息子は黒鉄が来る前は船乗りでした。これはあなた方に持っていてほしいはずです。',
        },
        speaker: 'Harbor Elder',
      },
    },
  ],
  reinforcements: [
    {
      turn: 8,
      units: [
        { unitId: 'ch6_reinforce_1', position: { x: 2, y: 0 } },
        { unitId: 'ch6_reinforce_2', position: { x: 13, y: 0 } },
        { unitId: 'ch6_reinforce_3', position: { x: 5, y: 0 } },
        { unitId: 'ch6_reinforce_4', position: { x: 10, y: 0 } },
      ],
      message: { en: 'Kurogane cavalry arrive from the north!', ja: '北から黒鉄の騎兵が到着！' },
    },
    {
      turn: 12,
      units: [
        { unitId: 'ch6_reinforce_5', position: { x: 3, y: 0 } },
        { unitId: 'ch6_reinforce_6', position: { x: 12, y: 0 } },
        { unitId: 'ch6_reinforce_7', position: { x: 5, y: 0 } },
        { unitId: 'ch6_reinforce_8', position: { x: 10, y: 0 } },
        { unitId: 'ch6_reinforce_9', position: { x: 7, y: 0 } },
        { unitId: 'ch6_reinforce_10', position: { x: 8, y: 0 } },
      ],
      message: {
        en: 'A full Kurogane column pours into the harbour!',
        ja: '黒鉄の一個縦隊が港へ雪崩れ込んでくる！',
      },
    },
  ],
  events: [
    // Turn 2: Corwin combat callout
    {
      id: 'ch6_corwin_callout',
      trigger: { type: 'turn_start', turn: 2 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Corwin',
                text: {
                  en: 'Pegasus knights, wall sentries, and cavalry on the flanks. What did I sign up for?',
                  ja: '天馬騎士に城壁の歩哨、両翼に騎兵か。俺は何に雇われたんだ。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'You signed up for coin. Still want it?',
                  ja: '金で雇われたんだろ。まだ欲しいか？',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Corwin',
                text: { en: '...Double the rate.', ja: '……倍もらう。' },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 4: Nadine appears and joins
    {
      id: 'ch6_nadine_joins',
      trigger: { type: 'turn_start', turn: 4 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'A mounted figure approaches from the southern docks, staff raised in peace.',
                  ja: '南の桟橋から騎乗の人影が近づいてくる。杖を掲げ、戦意のないことを示している。',
                },
              },
              {
                speaker: 'Nadine',
                text: {
                  en: 'Wait — please! There are wounded soldiers on both sides. I can help!',
                  ja: '待って――お願いします！どちらの側にも傷ついた兵がいます。手当てさせてください！',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Akira',
                text: {
                  en: "She is binding a Kurogane man's wounds. Is she one of theirs?",
                  ja: '黒鉄の兵の傷を巻いています。あちらの者では？',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'No. She is on the side of the hurt. I know that side.',
                  ja: 'いいえ。あの人は痛んでいる側の味方です。私はその側を知っています。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Nadine',
                text: {
                  en: 'People are hurt and I can help. That has always been enough for me.',
                  ja: '人が傷ついていて、私は手当てができる。私にはいつもそれで十分でした。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'More than enough. Welcome, Nadine.',
                  ja: '十分すぎる。ようこそ、ナディーヌ。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
        {
          type: 'spawn_units',
          units: [{ unitId: 'nadine', position: { x: 8, y: 13 } }],
          faction: 'player',
        },
      ],
      once: true,
    },
    // Turn 8: Reinforcement warning
    {
      id: 'ch6_reinforcement_warning',
      trigger: { type: 'turn_start', turn: 8 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Corwin',
                text: {
                  en: "Cavalry from the north road. Heavy armor — these aren't scouts.",
                  ja: '北の道から騎兵。重装だ――斥候じゃない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Reinforcements! We need to finish this and pull back!',
                  ja: '増援だ！片を付けて退く！',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Turn 12: Overwhelming wave warning
    {
      id: 'ch6_overwhelming_wave',
      trigger: { type: 'turn_start', turn: 12 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Lisette',
                text: {
                  en: "The north road — I'm counting at least a full company. We cannot hold this position.",
                  ja: '北の道――少なくとも一個中隊は数えられます。この位置は保てません。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Everyone fall back! South, now!', ja: '全員後退！南へ、今すぐだ！' },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed
    {
      id: 'ch6_sera_defeat',
      trigger: { type: 'unit_killed', unitId: 'ch6_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Aeryn',
                text: {
                  en: 'Beaten out of the air by a girl on a farm pegasus. My instructors would weep.',
                  ja: '農場育ちの天馬に乗った小娘に空を奪われるとはな。教官が泣くぞ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Elin',
                text: {
                  en: 'Your riders held formation. That is why I could predict every one of you.',
                  ja: 'あなたの騎士は隊形を崩さなかった。だから全員の動きが読めたの。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Aeryn',
                text: {
                  en: '...Noted. Rider — you have flown the western coast. Tell me you have seen it too.',
                  ja: '……覚えておく。騎士殿――西の海岸を飛んだのだろう。あれを見たと言ってくれ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Elin',
                text: { en: 'The hole in the sky. Yes.', ja: '空の穴ね。見た。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Aeryn',
                text: {
                  en: 'I reported it as weather. Twice. The second report came back with my commission attached to it and a note telling me to fly lower.',
                  ja: '天候として二度報告した。二度目の返答には私の任官状が添えられ、もっと低く飛べと書いてあった。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'We are going west to see what it is.',
                  ja: '我々はそれが何かを見に西へ行く。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Aeryn',
                text: {
                  en: 'Then you are braver than my whole wing, boy, and I hope somebody writes it down.',
                  ja: 'ならば貴様は我が飛行隊の全員より勇敢だ、小僧。誰かが書き留めてくれることを祈る。',
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
      unitB: 'corwin',
      lines: [
        {
          speaker: 'Corwin',
          text: {
            en: 'You count your dead by name. Out loud, every night, when you think nobody is listening.',
            ja: 'あんたは死んだ者を名前で数える。毎晩、声に出して、誰も聞いていないと思っているときに。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'Is that a criticism?', ja: '咎めているのか。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: {
            en: 'It is an observation. I have served eleven captains. The good ones did that for about a year, and then they stopped.',
            ja: '観察だ。十一人の隊長に仕えた。まともな連中は一年ほどそれをやって、それからやめた。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'Why did they stop?', ja: 'なぜやめた。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Corwin',
          text: {
            en: 'Because the list gets long, lad. Every one of them thought they would be the exception too.',
            ja: '名簿が長くなるからだよ、若いの。全員、自分だけは例外だと思っていた。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: '...Then tell me when I stop. That is an order, Corwin.',
            ja: '……なら私がやめたときに言え。これは命令だ、コーウィン。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'exp_both', amount: 20 },
    },
    {
      unitA: 'mirelle',
      unitB: 'nadine',
      lines: [
        {
          speaker: 'Mirelle',
          text: {
            en: 'You healed that enemy soldier without hesitation. Most healers choose sides.',
            ja: '敵兵を迷いなく癒しましたね。たいていの癒し手は側を選ぶのに。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Nadine',
          text: {
            en: "Pain doesn't choose sides. Why should I?",
            ja: '痛みは側を選びません。なぜ私が選ぶのですか。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Mirelle',
          text: {
            en: "That's... a different philosophy than mine. But I respect it deeply.",
            ja: 'それは……私とは違う考え方です。でも深く敬います。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Nadine',
          text: {
            en: "We'll make a good team. You guard the soul, I'll guard the body.",
            ja: 'いい組になれますね。あなたが魂を守って、私が体を守ります。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'nadine', stat: 'mag', amount: 1 },
    },
  ],
};
