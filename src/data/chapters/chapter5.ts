import type { ChapterData, TerrainType } from '../../core/types';

const P: TerrainType = 'plain';
const F: TerrainType = 'forest';
const M: TerrainType = 'mountain';
const W: TerrainType = 'water';
const X: TerrainType = 'wall';
const T: TerrainType = 'fort';
const V: TerrainType = 'village';
const H: TerrainType = 'throne';
const B: TerrainType = 'bridge';
const C: TerrainType = 'chest';

// 14 columns x 16 rows — vertical mountain fortress assault
const terrain: TerrainType[][] = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13
  [X, X, X, X, X, X, X, X, X, X, P, P, P, M], // row 0  — fortress north wall, NE open (void target)
  [X, P, P, P, P, P, P, H, P, P, P, P, P, X], // row 1  — throne at (7,1)
  [X, P, P, X, P, P, P, P, P, P, X, P, P, X], // row 2  — interior pillars
  [X, P, P, P, P, X, P, P, X, P, P, P, C, X], // row 3  — archers + chest at (12,3)
  [X, X, P, P, P, P, P, P, P, P, P, P, X, X], // row 4  — fortress inner gate
  [M, X, P, P, F, P, P, P, P, F, P, P, X, M], // row 5  — fortress edge
  [M, F, P, F, P, P, P, P, P, P, F, P, F, M], // row 6  — forested ridge
  [M, F, P, W, B, P, P, P, P, P, P, P, F, M], // row 7  — bridge at (4,7), water at (3,7)
  [M, P, P, F, W, F, P, P, P, F, F, P, P, M], // row 8  — water below bridge
  [M, P, P, P, T, F, P, P, P, T, P, P, P, M], // row 9  — forts at (4,9) and (9,9)
  [P, P, F, P, P, P, P, P, P, P, P, F, P, P], // row 10 — brigand zone
  [P, P, V, P, P, F, P, P, F, P, P, P, P, P], // row 11 — village at (2,11)
  [P, P, P, P, F, P, P, P, P, F, P, P, P, P], // row 12 — approach
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 13 — deployment row 1
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 14 — deployment row 2
  [P, P, P, P, P, P, P, P, P, P, P, P, P, P], // row 15 — deployment row 3
];

export const CHAPTER_5: ChapterData = {
  id: 'ch5',
  name: 'Chapter 5: Kaneda, Above the Clouds',
  chapterNumber: 5,
  mapWidth: 14,
  mapHeight: 16,
  terrain,
  playerUnits: [
    { unitId: 'shigeru', position: { x: 6, y: 14 } },
    { unitId: 'akira', position: { x: 7, y: 14 } },
    { unitId: 'lisette', position: { x: 6, y: 15 } },
    { unitId: 'gareth', position: { x: 5, y: 13 } },
    { unitId: 'mirelle', position: { x: 7, y: 15 } },
    { unitId: 'halvar', position: { x: 8, y: 13 } },
    { unitId: 'bryn', position: { x: 5, y: 15 } },
    { unitId: 'fenn', position: { x: 9, y: 13 } },
    { unitId: 'elin', position: { x: 4, y: 14 } },
  ],
  enemyUnits: [
    { unitId: 'ch5_boss', position: { x: 7, y: 1 } }, // Roderic on throne
    { unitId: 'ch5_knight_1', position: { x: 6, y: 2 } }, // escort left
    { unitId: 'ch5_knight_2', position: { x: 8, y: 2 } }, // escort right
    { unitId: 'ch5_soldier_1', position: { x: 5, y: 4 } }, // gate left
    { unitId: 'ch5_soldier_2', position: { x: 9, y: 4 } }, // gate right
    { unitId: 'ch5_archer_1', position: { x: 3, y: 3 } }, // wall archer left
    { unitId: 'ch5_archer_2', position: { x: 11, y: 3 } }, // wall archer right
    { unitId: 'ch5_cavalier_1', position: { x: 2, y: 7 } }, // flank cav left
    { unitId: 'ch5_cavalier_2', position: { x: 10, y: 7 } }, // flank cav right
    { unitId: 'ch5_mage_1', position: { x: 7, y: 5 } }, // courtyard mage
    { unitId: 'ch5_brigand_1', position: { x: 4, y: 10 } }, // approach brigand left
    { unitId: 'ch5_brigand_2', position: { x: 10, y: 10 } }, // approach brigand right
  ],
  objective: {
    type: 'seize',
    description: 'Defeat General Roderic and seize the throne',
  },
  seizePosition: { x: 7, y: 1 },
  deploymentSlots: 6,
  forceDeploy: ['shigeru'],
  parTurns: 14,
  recruitableUnits: ['elin'],
  prologue: {
    lines: [
      {
        speaker: 'Narrator',
        text: {
          en: 'Dawn below Shiroyama. The old border fortress of Kaneda stands over the south shore of Aso Bay, built four centuries ago to watch the western sea. Clouds hang unnaturally low. A pegasus knight descends, lance drawn.',
          ja: '城山の麓の夜明け。浅茅湾の南岸に立つ古い国境の砦、金田城。四百年前、西の海を見張るために築かれた。雲が不自然なほど低く垂れている。天馬騎士が槍を構えて舞い降りてきた。',
        },
      },
      {
        speaker: 'Elin',
        text: {
          en: "DON'T go up there. Please. Something is wrong with the sky.",
          ja: '上がらないで。お願い。空がおかしいの。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Wrong how?', ja: 'どうおかしい。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Elin',
        text: {
          en: 'There is a hole in it. Out over the western cliffs, a stretch of sky the size of a village where there is no cloud, no sun, no colour. My mare will not fly within a mile of it and she has flown through a storm front.',
          ja: '穴が開いてる。西の断崖の上、村ひとつ分の空に、雲も陽も色もない。うちの子は一里以内に近づこうとしない。嵐の前線を突っ切ったこともある子なのに。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: { en: 'Sky does not have holes in it.', ja: '空に穴など開かん。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Elin',
        text: { en: 'I know what I flew past.', ja: '何の横を飛んだかは分かってる。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'What bearing, rider? From the fortress — what bearing to the hole?',
          ja: '方位は、騎士殿。砦から見て、その穴はどの方位ですか。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Elin',
        text: { en: '...West-north-west. Why?', ja: '……西北西。それが何？' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Because that is the fourth one. Lisette?', ja: '四つ目だからだ。リゼット。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'Four marks on one bearing is not a line any more, my lord. It is an arrow, and the point of it is the shrine at Are.',
          ja: '同一方位に四つの印は、もう線ではありません、殿下。矢です。その鏃が阿連の社です。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'The fortress is held in strength. General Roderic has knights on every approach. If we are taking it, we take it from above — which means we need her.',
          ja: '砦は堅固に守られています。ロデリク将軍が全ての進入路に騎士を置いている。落とすなら上からです。つまり彼女が要る。',
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
          en: 'The fortress courtyard, after the battle. The rift at its centre has closed. The stones where it stood are grey, and nothing casts a shadow on them.',
          ja: '戦の後の砦の中庭。中央の裂け目は閉じていた。そこにあった石畳は灰色で、その上には何の影も落ちない。',
        },
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'I have it. Every mark we have seen since the Sasu bridge, laid on the survey maps. It is not a spreading stain. It is a line, and it is being drawn.',
          ja: '出ました。佐須の橋以来のすべての印を測量図に落としました。広がる染みではありません。線です。しかも今も引かれ続けている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: 'Drawn from where to where?', ja: 'どこからどこへ引かれている。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'From the shrine at Are \u2014 to us. Every mark is nearer than the last. It has been walking toward this company since the day we found the cracked ward.',
          ja: '阿連の社から――我々へ。印は一つごとに近い。割れた結界石を見つけた日から、それはこの隊へ向かって歩いてきています。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Elin',
        text: { en: 'Toward us. Not toward the cities?', ja: '私たちに向かって？町にではなく？' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Lisette',
        text: {
          en: 'It went past two cities to get here. It wants something we are carrying.',
          ja: 'ここへ来るのに町を二つ素通りしています。我々が運んでいる何かを求めている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Mirelle',
        text: { en: 'The Flamebrand.', ja: '炎の聖剣ですね。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Halvar',
        text: {
          en: 'Then say the rest of it, my lord, since nobody else will. The shrine at Are held the Blackflame. Takeshi went into that shrine alone before the war and came out changed. And now the thing that was sealed there is walking inland, and it knows where your sword is.',
          ja: 'では残りは俺が言う、殿下。誰も言わんからな。阿連の社は黒炎を抱えていた。タケシは開戦前にひとりでその社に入り、変わって出てきた。そして封じられていたものが今、内陸へ歩いていて、あんたの剣の在り処を知っている。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: { en: '...Yes. That is the shape of it.', ja: '……ああ。そういう形だ。' },
        speakerFaction: 'player',
      },
      {
        speaker: 'Akira',
        text: {
          en: 'Then we stop running. My lord \u2014 if it is following the Flamebrand, every town we pass through is a town it burns after we leave.',
          ja: 'では逃げるのはやめましょう。殿下――それが聖剣を追っているなら、我らが通る町は、我らが去った後に焼かれる町です。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Shigeru',
        text: {
          en: 'I know. We turn west at the harbour. Lisette \u2014 I want to know what it is before I take it to my father\u2019s sword.',
          ja: '分かっている。港で西へ向きを変える。リゼット――父上の剣をそれに近づける前に、それが何なのかを知りたい。',
        },
        speakerFaction: 'player',
      },
      {
        speaker: 'Narrator',
        text: {
          en: 'They had spent five chapters running from an empire. From that evening they were walking toward something older, and they knew its name.',
          ja: '彼らは五つの戦を、帝国から逃げて過ごした。その夕べから先は、より古い何かへ向かって歩いた。そしてその名を知っていた。',
        },
      },
    ],
  },
  villages: [
    {
      position: { x: 2, y: 11 },
      reward: {
        type: 'weapon',
        weaponId: 'steel_sword',
        dialogue: {
          en: 'This blade was forged for mountain warfare. Take it — you will need it up there.',
          ja: '山での戦のために鍛えた刃です。お持ちください。上では要りようになる。',
        },
        speaker: 'Mountain Smith',
      },
    },
  ],
  chests: [
    {
      position: { x: 12, y: 3 },
      reward: {
        type: 'weapon',
        weaponId: 'javelin',
        dialogue: {
          en: 'A javelin was stored inside the chest.',
          ja: '宝箱には手槍が納められていた。',
        },
        speaker: 'Narrator',
      },
    },
  ],
  reinforcements: [
    {
      turn: 6,
      units: [
        { unitId: 'ch5_reinforce_1', position: { x: 3, y: 14 } },
        { unitId: 'ch5_reinforce_2', position: { x: 10, y: 14 } },
      ],
      message: { en: 'Enemy reinforcements arrive from the south!', ja: '南から敵の増援！' },
    },
    {
      turn: 8,
      units: [{ unitId: 'ch5_reinforce_3', position: { x: 0, y: 10 } }],
      message: {
        en: 'An enemy cavalier charges from the west!',
        ja: '西から敵の騎兵が突撃してくる！',
      },
    },
  ],
  events: [
    // Turn 3 — Terrain Shift: 6 tiles change, disrupting planned paths
    {
      id: 'ch5_terrain_shift',
      trigger: { type: 'turn_start', turn: 3 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Gareth',
                text: {
                  en: 'Did that TREE just turn into a RIVER?',
                  ja: '今あの木が川になったか？',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Ground does not do that. I surveyed this valley from the ridge two hours ago.',
                  ja: '地面はそんなことをしません。二時間前に尾根からこの谷を測量したばかりです。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'Lisette. Your map.', ja: 'リゼット。地図は。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'Useless, my lord. Every route I plotted has changed under us. Warn the men — nobody trusts the ground they have not just walked on.',
                  ja: '使えません、殿下。引いた経路が全て足下で変わっています。全員に伝えてください――たった今歩いた地面以外は信用するなと。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
        { type: 'change_terrain', position: { x: 4, y: 8 }, terrain: 'plain' }, // water → plain
        { type: 'change_terrain', position: { x: 5, y: 6 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 9, y: 6 }, terrain: 'water' }, // plain → water
        { type: 'change_terrain', position: { x: 3, y: 9 }, terrain: 'forest' }, // plain → forest
        { type: 'change_terrain', position: { x: 10, y: 9 }, terrain: 'mountain' }, // plain → mountain
        { type: 'change_terrain', position: { x: 7, y: 8 }, terrain: 'forest' }, // plain → forest
      ],
      once: true,
    },
    // Turn 5 — Data Void: 3×2 block appears in NE corner, nearby enemies scatter
    {
      id: 'ch5_data_void',
      trigger: { type: 'turn_start', turn: 5 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Elin',
                text: {
                  en: 'That. That is the hole. That is what is in the sky, and now it is on the ground.',
                  ja: 'あれ。あれが穴。空にあったものが、今は地面にある。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Fenn',
                text: {
                  en: 'I threw a stone into it. I did not hear it land.',
                  ja: '石を投げ込んだ。落ちる音がしなかった。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'I cannot measure a thing that gives nothing back. No heat, no sound, no shadow. It is a hole in the world and I do not have a word for it.',
                  ja: '何も返してこないものは測れません。熱も音も影もない。世界に開いた穴です。私はそれを呼ぶ言葉を持たない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Mirelle',
                text: {
                  en: 'The shrine songs have a word. They call it the Abyss, and they say the Blackflame leaves one behind wherever it has fed.',
                  ja: '社の歌には言葉があります。深淵と呼びます。黒炎が喰らった跡には必ず一つ残ると。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'Nobody goes near it. Push on to Roderic.',
                  ja: '誰も近づくな。ロデリクへ押し込む。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
        // 3×2 data void block: rows 0-1, cols 10-12
        { type: 'change_terrain', position: { x: 10, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 0 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 10, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 11, y: 1 }, terrain: 'data_void' },
        { type: 'change_terrain', position: { x: 12, y: 1 }, terrain: 'data_void' },
        // Nearby enemies panic: scatter from guard to aggressive
        { type: 'change_ai', unitId: 'ch5_archer_2', newBehavior: { type: 'aggressive' } },
        { type: 'change_ai', unitId: 'ch5_cavalier_2', newBehavior: { type: 'aggressive' } },
      ],
      once: true,
    },
    // Turn 7 — Forecast Flicker: dialogue-only story beat
    {
      id: 'ch5_forecast_flicker',
      trigger: { type: 'turn_start', turn: 7 },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Narrator',
                text: {
                  en: 'For the space of a breath the whole valley goes silent — no wind, no birds, no ring of steel — and then the noise of the battle rushes back in.',
                  ja: 'ひと呼吸のあいだ、谷全体が静まり返った。風も、鳥も、鋼の音もない。そして戦の音が一斉に戻ってきた。',
                },
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'It moved. The rift. It was in the north corner and now it is thirty paces closer and nobody saw it cross.',
                  ja: '動きました。裂け目です。北の隅にあったものが三十歩近づいている。渡るのを誰も見ていない。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Gareth',
                text: {
                  en: 'Can we be frightened of the hole after the men with lances stop charging us?',
                  ja: '穴を怖がるのは、槍を持った連中が突っ込んでこなくなってからでいいか？',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Lisette',
                text: {
                  en: 'You are not listening. It is moving toward the prince. Not toward the fighting — toward him.',
                  ja: '聞いていませんね。あれは殿下に向かって動いています。戦場にではなく、あの方に。',
                },
                speakerFaction: 'player',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss approach — Shigeru reaches the fortress gate
    {
      id: 'ch5_boss_approach',
      trigger: { type: 'unit_at', unitId: 'shigeru', position: { x: 7, y: 4 } },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Roderic',
                text: {
                  en: 'You have beaten brigands and river scum. Now you meet a soldier.',
                  ja: '貴様が破ったのは山賊と川のごろつきだ。今度は兵と会うことになる。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'There is a hole in your courtyard, General, and it is getting bigger. How many of your men have you lost to it?',
                  ja: '将軍、貴公の中庭には穴が開いていて、しかも広がっている。あれで何人失った。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: {
                  en: 'Nine. I reported it to the capital three times. The reply was: hold the fortress.',
                  ja: '九人だ。三度都に報告した。返答は「砦を保て」だった。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'And that was enough for you?', ja: 'それで足りたのか。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: {
                  en: 'It has to be. A man my age does not get to start asking questions. Come and take the gate.',
                  ja: '足りねばならん。この歳になって問いを立て始める余裕はない。門を取りに来い。',
                },
                speakerFaction: 'enemy',
              },
            ],
          },
        },
      ],
      once: true,
    },
    // Boss killed — Roderic's denial
    {
      id: 'ch5_boss_killed',
      trigger: { type: 'unit_killed', unitId: 'ch5_boss' },
      effects: [
        {
          type: 'show_dialogue',
          scene: {
            lines: [
              {
                speaker: 'Roderic',
                text: {
                  en: 'Nine men to the hole. The rest to you. A fine account of a career.',
                  ja: '九人を穴に、残りを貴様に。見事な生涯の帳尻だ。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: {
                  en: 'It was not us that broke this place, General. It was already coming apart.',
                  ja: 'この場所を壊したのは我々ではない、将軍。すでに崩れ始めていた。',
                },
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: {
                  en: 'I know. Boy — the Emperor came through here in the spring. He walked to the edge of that hole and he stood at it for an hour and he was not afraid of it.',
                  ja: '分かっている。小僧――皇帝は春にここを通った。あの穴の縁まで歩いて一時間立っていた。恐れてはいなかった。',
                },
                speakerFaction: 'enemy',
              },
              {
                speaker: 'Shigeru',
                text: { en: 'What did he say?', ja: '何と言った。' },
                speakerFaction: 'player',
              },
              {
                speaker: 'Roderic',
                text: {
                  en: '"Good. It is still hungry." ...Take the fortress. I have nothing else to give you.',
                  ja: '「よし。まだ飢えている」……砦を取れ。他に渡せるものはない。',
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
      unitB: 'elin',
      lines: [
        {
          speaker: 'Elin',
          text: {
            en: 'My lord, may I speak plainly? From the air I can see the whole of a battle at once. It is not like being in one.',
            ja: '殿下、正直に言っても？空からは戦の全体が一度に見えます。中にいるのとは違う。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: { en: 'How is it different?', ja: 'どう違う。' },
          speakerFaction: 'player',
        },
        {
          speaker: 'Elin',
          text: {
            en: 'From up there they are shapes. I can watch a shape stop moving and feel nothing about it. That frightens me more than the hole in the sky does.',
            ja: '上からだと、みんな形にしか見えない。形が動かなくなるのを見ても、何も感じずにいられる。空の穴よりそっちのほうが怖い。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Shigeru',
          text: {
            en: '...I have the same problem from the ground. Come and find me when it starts feeling easy. I will do the same.',
            ja: '……地上にいる私も同じだ。楽になってきたと感じたら、私のところへ来い。私もそうする。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'elin', stat: 'spd', amount: 1 },
    },
    {
      unitA: 'akira',
      unitB: 'gareth',
      lines: [
        {
          speaker: 'Akira',
          text: {
            en: 'Gareth, your axework is... unconventional. But effective.',
            ja: 'ガレス、あなたの斧さばきは……型破りだ。しかし効く。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: {
            en: 'Hah! No one ever taught me proper form. I just hit things until they stop moving.',
            ja: 'はっ！ちゃんとした型なんぞ誰にも習ってねえ。動かなくなるまで叩くだけだ。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Akira',
          text: {
            en: 'Here — widen your stance when you swing overhead. It will add power without sacrificing balance.',
            ja: 'こうです――上段から振るときは足幅を広く。均衡を崩さずに力が乗ります。',
          },
          speakerFaction: 'player',
        },
        {
          speaker: 'Gareth',
          text: {
            en: 'A knight teaching a brawler? I like this army.',
            ja: '騎士が喧嘩屋に稽古をつけるのか。この軍は気に入った。',
          },
          speakerFaction: 'player',
        },
      ],
      reward: { type: 'stat', unitId: 'gareth', stat: 'skl', amount: 1 },
    },
  ],
};
