import type { Script } from './dialogue';

/**
 * 会話パートの台本。`specs/story/chapters/ch1.md` の第1章「久田への道」。
 *
 * 黒鉄が小茂田浜に上陸し、王は砂の上で討たれ、厳原は燃えた。翌日の正午、
 * 天城の王子シゲルは父の親衛隊の残りを連れ、南へ抜ける唯一の道である
 * 久田の門へ向かっている。
 *
 * 役どころは PoC のキャストに載せている。シゲル以外は PoC のユニットのままで、
 * 従士＝ジェイガン（本名アキラ）、魔道士＝テオ、僧＝ミナ、斧＝ガロン、門を塞ぐ男＝ヴァルガ。
 */

const L = (speaker: string, who: string, side: 'left' | 'right', text: string) => ({ speaker, who, side, text });
const N = (text: string) => ({ text });

export const OPENING: Script = {
  id: 'opening',
  title: '第1章  「久田への道」',
  lines: [
    N('黒鉄の船団が夜明けとともに小茂田浜に上陸した。王は西へ馬を駆り、砂の上でこれを迎え撃った。'),
    N('日暮れには王は討たれ、厳原は燃えていた。翌日の正午、王子は父の親衛隊の残りを連れ、海沿いの道を南へ下っていた。'),
    L('ジェイガン', 'p_akira', 'right', '殿下、久田の砦が落ちました。黒鉄の旗を掲げた山賊どもです。村人を川際に追い詰めています。'),
    L('シゲル', 'p_shigeru', 'left', 'なら取り返す。南へ抜ける道はあの門しかない。他に行く場所もない。'),
    L('ジェイガン', 'p_akira', 'right', '王宮を出てから一睡もしておられません。皆も同じです。もしお望みなら――'),
    L('シゲル', 'p_shigeru', 'left', '望むなら父上に生きていてほしかった。隊列を組め。'),
    L('ガロン', 'p_garon', 'right', 'おおい！こっちだ！そりゃ王家の旗か？夜明けからこいつらを叩いてるんだが、そろそろ一人は飽きた！'),
    L('テオ', 'p_teo', 'right', '……門の向こうに旗が増えています。数はこちらが少ない。'),
    L('ヴァルガ', 'e_boss', 'right', '王家の旗か。俺の道にな。'),
    L('シゲル', 'p_shigeru', 'left', '……行くぞ。門を開ける。'),
    N('［目標］敵を全滅させよ　／　シゲルが倒れると敗北'),
  ],
};

export const BOSS_TALK: Script = {
  id: 'bossTalk',
  lines: [
    L('ヴァルガ', 'e_boss', 'right', 'お前が王子か。十二の子供みてえだな。'),
    L('シゲル', 'p_shigeru', 'left', '部下を連れて南へ行け。追わない。'),
    L('ヴァルガ', 'e_boss', 'right', 'できねえ。黒鉄が弟の村を押さえてる。それが報酬のもう半分だ。'),
    L(
      'ヴァルガ',
      'e_boss',
      'right',
      '二十年この街道で食ってきた。払う奴には手は出さねえ。そこへ黒鉄が本物の金と本物の命令を持って通りやがった。',
    ),
    L('シゲル', 'p_shigeru', 'left', '……ならば、すまない。'),
    L('ヴァルガ', 'e_boss', 'right', '詫びるな。手早くやれ。'),
    N('ヴァルガの守りが揺らいだ。（このターン、ヴァルガの守備 −2）'),
  ],
};

export const RECRUIT_ROU: Script = {
  id: 'recruitRou',
  lines: [
    L('シゲル', 'p_shigeru', 'left', 'お前は山賊ではないな。その剣の構えは訓練を受けた者のものだ。'),
    L('ロウ', 'e_m1', 'right', 'よく分かるな。金で雇われただけの流れ者さ。'),
    L('シゲル', 'p_shigeru', 'left', 'では聞け。黒鉄はこの街道の村を人質に取って人を雇っている。次はお前の村だ。'),
    L('ロウ', 'e_m1', 'right', '……ああ。門の男も同じ口だったな。弟の村がどうとか。'),
    L('ロウ', 'e_m1', 'right', '割に合わねえ仕事だ。降りる。——王子さんよ、あんたの側につくぜ。'),
    N('ロウが仲間になった！'),
  ],
};

export const ENDING: Script = {
  id: 'ending',
  title: '第1章  終了',
  lines: [
    L('ジェイガン', 'p_akira', 'right', '門は我らの手に。勝利です、殿下。'),
    L('シゲル', 'p_shigeru', 'left', '門ひとつだ。門ひとつを押さえて、国はもう無い。'),
    L('ミナ', 'p_mina', 'right', 'ごめんください！こちらが王家の隊ですね？白嶽の社から走り通しで来ました！'),
    L('シゲル', 'p_shigeru', 'left', '……何者だ。'),
    L(
      'ミナ',
      'p_mina',
      'right',
      '大巫女様に炎の聖剣の担い手を捜せと命じられ、そして見つけました。ですから動かないでください、その腕を診ます。',
    ),
    L('シゲル', 'p_shigeru', 'left', 'かすり傷だ。'),
    L('ミナ', 'p_mina', 'right', '四寸はあります。私が着いてからずっと庇っておいででした。お座りください。'),
    N('王子は座った。その日、彼が従った唯一の命令だった。'),
  ],
};

export const DEFEAT: Script = {
  id: 'defeat',
  lines: [L('ジェイガン', 'p_akira', 'right', '殿下——！ ……申し訳、ありません。'), N('炎の聖剣は、ここで失われた。')],
};

/** 死亡時の一言（FE 恒例） */
const DEATH_QUOTES: Record<string, string> = {
  p_shigeru: '父上……まだ、南へ……',
  p_akira: '殿下の……盾に、なれましたか……',
  p_garon: 'く……前に出すぎたか。わりぃな……',
  p_rina: '矢が……届かない……',
  p_teo: 'まだ、調べたいことが……あったのに……',
  p_mina: 'みなさんを守れなくて……ごめんなさい……',
  p_shiel: '……空が、遠い……',
  e_m1: '割に合わねえな……まったく……',
  e_boss: '久田だ。……弟の村の名だ。覚えておけ。',
};

/** 支援会話。キーは "idA|idB"（ID の辞書順）、配列は C / B / A */
const SUPPORT_TABLE: Record<string, Script[]> = {
  'p_akira|p_shigeru': [
    {
      id: 'sup_shigeru_seth_C',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下。厳原を出てから、何も召し上がっていません。'),
        L('シゲル', 'p_shigeru', 'left', '腹は減っていない。'),
        L('ジェイガン', 'p_akira', 'right', '伺ったのは、減っているかどうかではありません。召し上がったかどうかです。'),
        L('シゲル', 'p_shigeru', 'left', '……食べていない。'),
      ],
    },
    {
      id: 'sup_shigeru_seth_B',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下、剣に無理があります。手首ではなく、腰で振ってください。'),
        L('シゲル', 'p_shigeru', 'left', '……父上と、同じことを言うのだな。'),
        L('ジェイガン', 'p_akira', 'right', '王も剣をお使いでした。……差し出がましいことを。'),
        L('シゲル', 'p_shigeru', 'left', 'いや。もっと言え。'),
      ],
    },
    {
      id: 'sup_shigeru_seth_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'ジェイガン。人を数として動かすのが、日ごとに楽になっている。'),
        L('ジェイガン', 'p_akira', 'right', '……存じております。'),
        L('シゲル', 'p_shigeru', 'left', 'それが怖い。'),
        L(
          'ジェイガン',
          'p_akira',
          'right',
          '怖いとお思いのうちは、まだ数ではありません。私が申し上げます。楽になりすぎたら、申し上げます。',
        ),
      ],
    },
  ],
  'p_garon|p_rina': [
    {
      id: 'sup_garon_rina_C',
      lines: [
        L('ガロン', 'p_garon', 'left', 'おいリナ、その弓、ちょっと俺に貸してみろ。'),
        L('リナ', 'p_rina', 'right', '無理よ。あなたの腕力で引いたら、弦が切れるわ。'),
        L('ガロン', 'p_garon', 'left', '……ちっ。斧の方が単純でいいや。'),
        L('リナ', 'p_rina', 'right', 'そうしてて。後ろから守ってあげるから。'),
      ],
    },
    {
      id: 'sup_garon_rina_B',
      lines: [
        L('リナ', 'p_rina', 'right', 'ガロン、また前に出すぎ。私の矢が当たるところだったわよ。'),
        L('ガロン', 'p_garon', 'left', '当たらねえよ。お前は外さねえ。'),
        L('リナ', 'p_rina', 'right', '……それ、褒めてるの？'),
        L('ガロン', 'p_garon', 'left', '信用してるって言ってんだ。'),
      ],
    },
    {
      id: 'sup_garon_rina_A',
      lines: [
        L('ガロン', 'p_garon', 'left', 'リナ。俺が突っ込んだら、お前は下がれ。'),
        L('リナ', 'p_rina', 'right', '嫌よ。届く距離にいないと、当てられない。'),
        L('ガロン', 'p_garon', 'left', '……頑固だな。'),
        L('リナ', 'p_rina', 'right', 'あなたほどじゃないわ。'),
      ],
    },
  ],
  'p_mina|p_teo': [
    {
      id: 'sup_teo_mina_C',
      lines: [
        L('テオ', 'p_teo', 'left', 'ミナ。その杖、光が弱い。魔力が落ちてる。'),
        L('ミナ', 'p_mina', 'right', 'わ、分かるんですか……？'),
        L('テオ', 'p_teo', 'left', '魔道士だからね。無理をしすぎだ。回復は、まず自分から。'),
        L('ミナ', 'p_mina', 'right', '……はい。気をつけます。'),
      ],
    },
    {
      id: 'sup_teo_mina_B',
      lines: [
        L('ミナ', 'p_mina', 'right', 'テオさんは、神様を信じていないのですね。'),
        L('テオ', 'p_teo', 'left', '測れないものは扱えない。それだけだ。否定はしていない。'),
        L('ミナ', 'p_mina', 'right', '……はい。否定ではないと、分かります。'),
        L('テオ', 'p_teo', 'left', '「測れない」と言っただけだよ。'),
      ],
    },
    {
      id: 'sup_teo_mina_A',
      lines: [
        L('ミナ', 'p_mina', 'right', 'テオさん。西の空が、変です。'),
        L('テオ', 'p_teo', 'left', '……気づいたか。方角がいつも同じだ。西北西。風でも雲でもない。'),
        L('ミナ', 'p_mina', 'right', '社では、あちらを見てはならないと教わりました。'),
        L('テオ', 'p_teo', 'left', '見ないことにした、の間違いだろうね。'),
      ],
    },
  ],
  'p_shiel|p_shigeru': [
    {
      id: 'sup_shigeru_shiel_C',
      lines: [
        L('シエル', 'p_shiel', 'right', '殿下、空から見えました。東の砦、伏兵がいます。'),
        L('シゲル', 'p_shigeru', 'left', '助かる。……ペガサスは、怖くないのか。'),
        L('シエル', 'p_shiel', 'right', '地上より安全です。矢さえ、なければ。'),
        L('シゲル', 'p_shigeru', 'left', '弓には気をつけろ。頼む。'),
      ],
    },
    {
      id: 'sup_shigeru_shiel_B',
      lines: [
        L('シエル', 'p_shiel', 'right', '殿下。風が冷たくなってきました。今年は冬が早い。'),
        L('シゲル', 'p_shigeru', 'left', '……村は、越せるか。'),
        L('シエル', 'p_shiel', 'right', '越させます。そのために、私たちが飛んでいるので。'),
      ],
    },
    {
      id: 'sup_shigeru_shiel_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'シエル。上からは、人はどう見える。'),
        L('シエル', 'p_shiel', 'right', '……形にしか見えません。動かなくなっても、形のままです。'),
        L('シゲル', 'p_shigeru', 'left', 'それを恐ろしいと思うか。'),
        L('シエル', 'p_shiel', 'right', '思います。だから毎回、降りて顔を見に行きます。'),
      ],
    },
  ],
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

export const SUPPORT_PAIRS: string[][] = Object.keys(SUPPORT_TABLE).map((k) => k.split('|'));

/** rank は 1(C) / 2(B) / 3(A) */
export function supportScript(a: string, b: string, rank: number): Script | undefined {
  return SUPPORT_TABLE[pairKey(a, b)]?.[rank - 1];
}

export function deathScript(unitId: string, name: string): Script {
  const quote = DEATH_QUOTES[unitId];
  return {
    id: `death_${unitId}`,
    lines: quote ? [{ speaker: name, who: unitId, side: 'left', text: quote }] : [{ text: `${name} は倒れた。` }],
  };
}
