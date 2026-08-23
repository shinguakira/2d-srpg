import type { Script } from './dialogue';
import { L } from './chapters/common';

/**
 * **章をまたいで残る会話。** 章ごとの台本は `story/chapters/` にあり、章の定義に
 * ぶら下がっている。ここに置くのは、どの章でも同じもの —— 死に際の一言と支援
 * 会話 —— だけ。
 *
 * 名前は `specs/story/roster.md` の設計名に揃えてある。ID が設計名、劇中の表記が
 * `roster.ts` の `name`。ジェイガンだけ二つが違うのは、それが彼の名乗る別名だから。
 */

/** 死亡時の一言（FE 恒例） */
const DEATH_QUOTES: Record<string, string> = {
  p_shigeru: '父上……まだ、南へ……',
  p_akira: '殿下の……盾に、なれましたか……',
  p_gareth: 'く……前に出すぎたか。わりぃな……',
  p_bryn: '矢が……届かない……',
  p_lisette: 'まだ、調べたいことが……あったのに……',
  p_mirelle: 'みなさんを守れなくて……ごめんなさい……',
  p_elin: '……空が、遠い……',
  p_ald: '光は……まだ、ありますか……',
  p_corwin: '割に合わねえな……まったく……',
  e_boss: 'クレハだ。……弟の村の名だ。覚えておけ。',
  c2_boss: '橋は……渡らせるな……以上だ……',
  c3_boss: '……振り向けば、よかったのか……',
};

/** 支援会話。キーは "idA|idB"（ID の辞書順）、配列は C / B / A */
const SUPPORT_TABLE: Record<string, Script[]> = {
  'p_akira|p_shigeru': [
    {
      id: 'sup_shigeru_akira_C',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下。イルザを出てから、何も召し上がっていません。'),
        L('シゲル', 'p_shigeru', 'left', '腹は減っていない。'),
        L('ジェイガン', 'p_akira', 'right', '伺ったのは、減っているかどうかではありません。召し上がったかどうかです。'),
        L('シゲル', 'p_shigeru', 'left', '……食べていない。'),
      ],
    },
    {
      id: 'sup_shigeru_akira_B',
      lines: [
        L('ジェイガン', 'p_akira', 'right', '殿下、剣に無理があります。手首ではなく、腰で振ってください。'),
        L('シゲル', 'p_shigeru', 'left', '……父上と、同じことを言うのだな。'),
        L('ジェイガン', 'p_akira', 'right', '王も剣をお使いでした。……差し出がましいことを。'),
        L('シゲル', 'p_shigeru', 'left', 'いや。もっと言え。'),
      ],
    },
    {
      id: 'sup_shigeru_akira_A',
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
  'p_bryn|p_gareth': [
    {
      id: 'sup_gareth_bryn_C',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'おいブリン、その弓、ちょっと俺に貸してみろ。'),
        L('ブリン', 'p_bryn', 'right', '無理よ。あなたの腕力で引いたら、弦が切れるわ。'),
        L('ガレス', 'p_gareth', 'left', '……ちっ。斧の方が単純でいいや。'),
        L('ブリン', 'p_bryn', 'right', 'そうしてて。後ろから守ってあげるから。'),
      ],
    },
    {
      id: 'sup_gareth_bryn_B',
      lines: [
        L('ブリン', 'p_bryn', 'right', 'ガレス、また前に出すぎ。私の矢が当たるところだったわよ。'),
        L('ガレス', 'p_gareth', 'left', '当たらねえよ。お前は外さねえ。'),
        L('ブリン', 'p_bryn', 'right', '……それ、褒めてるの？'),
        L('ガレス', 'p_gareth', 'left', '信用してるって言ってんだ。'),
      ],
    },
    {
      id: 'sup_gareth_bryn_A',
      lines: [
        L('ガレス', 'p_gareth', 'left', 'ブリン。俺が突っ込んだら、お前は下がれ。'),
        L('ブリン', 'p_bryn', 'right', '嫌よ。届く距離にいないと、当てられない。'),
        L('ガレス', 'p_gareth', 'left', '……頑固だな。'),
        L('ブリン', 'p_bryn', 'right', 'あなたほどじゃないわ。'),
      ],
    },
  ],
  'p_lisette|p_mirelle': [
    {
      id: 'sup_lisette_mirelle_C',
      lines: [
        L('リゼット', 'p_lisette', 'left', 'ミレイユ。その杖、光が弱い。魔力が落ちてる。'),
        L('ミレイユ', 'p_mirelle', 'right', 'わ、分かるんですか……？'),
        L('リゼット', 'p_lisette', 'left', '魔道士だからね。無理をしすぎだ。回復は、まず自分から。'),
        L('ミレイユ', 'p_mirelle', 'right', '……はい。気をつけます。'),
      ],
    },
    {
      id: 'sup_lisette_mirelle_B',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'リゼットさんは、神様を信じていないのですね。'),
        L('リゼット', 'p_lisette', 'left', '測れないものは扱えない。それだけだ。否定はしていない。'),
        L('ミレイユ', 'p_mirelle', 'right', '……はい。否定ではないと、分かります。'),
        L('リゼット', 'p_lisette', 'left', '「測れない」と言っただけだよ。'),
      ],
    },
    {
      id: 'sup_lisette_mirelle_A',
      lines: [
        L('ミレイユ', 'p_mirelle', 'right', 'リゼットさん。西の空が、変です。'),
        L('リゼット', 'p_lisette', 'left', '……気づいたか。方角がいつも同じだ。西北西。風でも雲でもない。'),
        L('ミレイユ', 'p_mirelle', 'right', '社では、あちらを見てはならないと教わりました。'),
        L('リゼット', 'p_lisette', 'left', '見ないことにした、の間違いだろうね。'),
      ],
    },
  ],
  'p_elin|p_shigeru': [
    {
      id: 'sup_shigeru_elin_C',
      lines: [
        L('エリン', 'p_elin', 'right', '殿下、空から見えました。東の砦、伏兵がいます。'),
        L('シゲル', 'p_shigeru', 'left', '助かる。……ペガサスは、怖くないのか。'),
        L('エリン', 'p_elin', 'right', '地上より安全です。矢さえ、なければ。'),
        L('シゲル', 'p_shigeru', 'left', '弓には気をつけろ。頼む。'),
      ],
    },
    {
      id: 'sup_shigeru_elin_B',
      lines: [
        L('エリン', 'p_elin', 'right', '殿下。風が冷たくなってきました。今年は冬が早い。'),
        L('シゲル', 'p_shigeru', 'left', '……村は、越せるか。'),
        L('エリン', 'p_elin', 'right', '越させます。そのために、私たちが飛んでいるので。'),
      ],
    },
    {
      id: 'sup_shigeru_elin_A',
      lines: [
        L('シゲル', 'p_shigeru', 'left', 'エリン。上からは、人はどう見える。'),
        L('エリン', 'p_elin', 'right', '……形にしか見えません。動かなくなっても、形のままです。'),
        L('シゲル', 'p_shigeru', 'left', 'それを恐ろしいと思うか。'),
        L('エリン', 'p_elin', 'right', '思います。だから毎回、降りて顔を見に行きます。'),
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

/**
 * 死に際の台詞。**持っている者だけが喋る。**
 *
 * FE で口をきくのは顔グラを持つ者だけで、雑魚は無言で消える。「山賊は倒れた」
 * のような報告は出ない。台詞が無ければ undefined を返し、呼び出し側は会話を
 * 挟まずに次へ進む。
 */
export function deathScript(unitId: string, name: string): Script | undefined {
  const quote = DEATH_QUOTES[unitId];
  if (!quote) return undefined;
  return { id: `death_${unitId}`, lines: [{ speaker: name, who: unitId, side: 'left', text: quote }] };
}
