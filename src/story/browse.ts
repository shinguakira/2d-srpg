import { CHAPTERS } from '../data/chapters';
import { ROSTER } from '../data/roster';
import { DEFEAT } from './chapters/common';
import { SUPPORT_PAIRS, supportScript } from './supports';
import { deathScript } from './script';
import type { Script } from './dialogue';

/**
 * **書いてあるものを全部、読む順に並べる。**
 *
 * 台本は章に散らばっていて（`story/chapters/`）、支援は別（`story/supports.ts`）、
 * 死に際はまた別（`story/script.ts`）。通しで読み返す手段が無いと、声の揺れも
 * 重複も落ちも見つからない。
 *
 * **描画を一切知らない。** 盤の閲覧（`render/devBrowse.ts`）と読む用のページ
 * （`storyPage.ts`）の両方から使うので、canvas を引きずり込まないのが条件。
 */

const RANK = ['C', 'B', 'A'];

export interface StoryEntry {
  /** 一覧に出す見出し */
  label: string;
  /** 章の見出しなど、選べない行は script を持たない */
  script?: Script;
  /** 章の区切り行 */
  header?: boolean;
}

export function storyEntries(): StoryEntry[] {
  const out: StoryEntry[] = [];

  for (const [i, def] of CHAPTERS.entries()) {
    out.push({ label: def.title, header: true });
    const s = def.scripts ?? {};
    // 一つの台本が二か所から指されていることがある（加入の事件が説得台本を鳴らす等）。
    // 同じものを二度読まされると、書き直したときにどちらを直したのか分からなくなる
    const seen = new Set<Script>();
    const add = (label: string, script: Script) => {
      if (seen.has(script)) return;
      seen.add(script);
      out.push({ label, script });
    };
    if (s.opening) add('前口上', s.opening);
    if (s.bossTalk) add('ボス会話', s.bossTalk);
    for (const [id, script] of Object.entries(s.recruit ?? {})) add(`説得 — ${nameOf(id)}`, script);
    // 章のターン事件。会話を持つものだけ
    for (const e of def.events ?? []) if (e.script) add(`${e.turn} ターン目`, e.script);
    if (s.ending) add('幕切れ', s.ending);
    if (s.defeat) add('敗北', s.defeat);
    if (i === CHAPTERS.length - 1) add('（共通）敗北', DEFEAT);
  }

  out.push({ label: '支援会話', header: true });
  for (const [a, b] of SUPPORT_PAIRS) {
    for (const [r, label] of RANK.entries()) {
      const script = supportScript(a, b, r + 1);
      if (script) out.push({ label: `${nameOf(a)} × ${nameOf(b)}  ${label}`, script });
    }
  }

  out.push({ label: '死に際', header: true });
  for (const s of ROSTER) {
    const script = deathScript(s.id, s.name);
    if (script) out.push({ label: s.name, script });
  }
  for (const def of CHAPTERS) {
    for (const e of def.enemies) {
      const script = e.isBoss ? deathScript(e.id, e.name) : undefined;
      if (script) out.push({ label: e.name, script });
    }
  }
  return out;
}

/** id から劇中の表記へ。名簿 → 章の敵味方、の順に探す */
export function nameOf(id: string): string {
  const seed = ROSTER.find((s) => s.id === id);
  if (seed) return seed.name;
  for (const def of CHAPTERS) {
    const e = def.enemies.find((x) => x.id === id) ?? def.allies?.find((x) => x.id === id);
    if (e) return e.name;
  }
  return id;
}
