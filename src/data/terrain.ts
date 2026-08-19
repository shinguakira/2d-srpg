import type { TerrainDef } from '../types';

const INF = 99;

/**
 * 数値は FE8 の地形表に合わせている。https://fe8.triangleattack.com/guides/terrain
 *
 * 玉座は門とは別物で、守備が高いうえに状態異常を消して魔防を上げる。ボスが
 * そこから動かない理由がこれ。海と湖は「通れない」ではなく「重い」。
 */
const TERRAIN: Record<string, TerrainDef> = {
  '.': { id: 'plain', name: '平地', color: '#3f6b46', color2: '#4a7a51', def: 0, avo: 0, cost: [1, 1, 1] },
  ',': { id: 'grass', name: '草原', color: '#476f3f', color2: '#57854a', def: 0, avo: 5, cost: [1, 1, 1] },
  b: { id: 'road', name: '道', color: '#8d7e5e', color2: '#9c8d6b', def: 0, avo: 0, cost: [1, 1, 1] },
  f: { id: 'forest', name: '林', color: '#2c5233', color2: '#356140', def: 1, avo: 20, cost: [2, 3, 1] },
  h: { id: 'mountain', name: '山', color: '#6b6157', color2: '#7d7266', def: 1, avo: 30, cost: [4, INF, 1] },
  '^': { id: 'peak', name: '峰', color: '#585047', color2: '#6a6157', def: 2, avo: 40, cost: [INF, INF, 1] },
  w: { id: 'wall', name: '岩壁', color: '#2a2b33', color2: '#34363f', def: 0, avo: 0, cost: [INF, INF, INF] },
  '~': { id: 'water', name: '水辺', color: '#22506e', color2: '#2b6389', def: 0, avo: 10, cost: [3, INF, 1] },
  s: { id: 'sand', name: '砂地', color: '#9c8757', color2: '#ab9666', def: 0, avo: 5, cost: [2, 3, 1] },
  F: { id: 'fort', name: '砦', color: '#6d6a80', color2: '#7f7c95', def: 2, avo: 20, cost: [1, 1, 1], heal: 0.2 },
  V: { id: 'village', name: '村', color: '#7a5b3a', color2: '#8d6c47', def: 0, avo: 10, cost: [1, 1, 1] },
  D: { id: 'door', name: '扉', color: '#5a4632', color2: '#6b543c', def: 0, avo: 0, cost: [INF, INF, INF] },
  C: { id: 'chest', name: '宝箱', color: '#6d6a80', color2: '#7f7c95', def: 0, avo: 0, cost: [1, 1, 1] },
  S: { id: 'shop', name: '武器屋', color: '#7a5b3a', color2: '#8d6c47', def: 0, avo: 10, cost: [1, 1, 1] },
  A: { id: 'arena', name: '闘技場', color: '#8a6448', color2: '#9d7455', def: 0, avo: 0, cost: [1, 1, 1] },
  G: { id: 'gate', name: '門', color: '#8a6f45', color2: '#9d8052', def: 3, avo: 20, cost: [1, 1, 1], heal: 0.1 },
  T: { id: 'throne', name: '玉座', color: '#7c5f8a', color2: '#8e6f9d', def: 3, avo: 20, cost: [1, 1, 1], heal: 0.1, res: 5 },
};

export function terrainAt(map: string[], x: number, y: number): TerrainDef {
  if (y < 0 || y >= map.length) return TERRAIN['w'];
  const row = map[y];
  if (x < 0 || x >= row.length) return TERRAIN['w'];
  return TERRAIN[row[x]] ?? TERRAIN['.'];
}
