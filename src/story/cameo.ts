import { build } from '../data/roster';
import type { Unit } from '../types';

/**
 * 幕間にだけ出てくる者。**盤に立たないので、ユニットとしてはどこにも居ない。**
 *
 * 会話の話者 id はユニットを引くのに使われる（`Game.speaker`）ので、ここが無いと
 * タケシは第10章の一番大事な場面で顔なしになる。彼が実際に盤へ出るのは第25章で、
 * それまでは「降りてきて、喋って、帰っていく」だけの存在。
 *
 * 作るのは顔と名前を運ぶだけの張りぼてで、能力値には意味がない。戦わないから。
 */
const CAMEO: Record<string, { name: string; classId: string }> = {
  c10_takeshi: { name: 'タケシ', classId: 'general' },
};

const made = new Map<string, Unit>();

export function cameo(id: string): Unit | undefined {
  const def = CAMEO[id];
  if (!def) return undefined;
  let u = made.get(id);
  if (!u) {
    u = build(
      {
        id,
        name: def.name,
        classId: def.classId,
        level: 1,
        x: 0,
        y: 0,
        affinity: 'dark',
        stats: { hp: 1, str: 0, mag: 0, skl: 0, spd: 0, lck: 0, def: 0, res: 0, con: 0, mov: 0 },
        growth: { hp: 0, str: 0, mag: 0, skl: 0, spd: 0, lck: 0, def: 0, res: 0, con: 0, mov: 0 },
        weapons: [],
      },
      'enemy',
    );
    made.set(id, u);
  }
  return u;
}
