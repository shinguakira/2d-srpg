/**
 * FE8 のオプション。値は全部「何番目か」の整数で持ち、左右で 1 ずつ回す。
 *
 * 音楽は無いので置いていない。効果音は WebAudio でその場で作っているので
 * スイッチがある —— 動かないスイッチを並べるほうが嘘になる、という線引き。
 *
 * 章をまたいで残るものなので campaign が持ち、Game は開始時に借りる。
 */
export interface GameOptions {
  /** 0 省略 / 1 キャラのみ / 2 背景あり */
  battleAnim: number;
  /** 0 ふつう / 1 はやい */
  gameSpeed: number;
  /** 0 遅い / 1 ふつう / 2 速い */
  textSpeed: number;
  /** 0 なし / 1 あり */
  terrainWindow: number;
  /** 0 なし / 1 バルーン / 2 パネル */
  unitWindow: number;
  /** 0 なし / 1 簡易 / 2 詳細 */
  battleWindow: number;
  /** 0 なし / 1 あり。フェイズの頭に目標を出す */
  showObjective: number;
  /** 0 その場 / 1 次のユニット。行動後にカーソルがどこへ行くか */
  autoCursor: number;
  /** 0 なし / 1 あり。全員動かし終えたら自動でターンを終える */
  autoEndTurn: number;
  /** 0 なし / 1 あり */
  sfx: number;
  /** ウィンドウの色 0..3 */
  windowColor: number;
}

export interface OptionRow {
  key: keyof GameOptions;
  label: string;
  values: string[];
}

export const OPTION_ROWS: OptionRow[] = [
  { key: 'battleAnim', label: '戦闘アニメ', values: ['省略', 'キャラのみ', '背景あり'] },
  { key: 'gameSpeed', label: 'ゲーム速度', values: ['ふつう', 'はやい'] },
  { key: 'textSpeed', label: '文字送り', values: ['遅い', 'ふつう', '速い'] },
  { key: 'terrainWindow', label: '地形ウィンドウ', values: ['なし', 'あり'] },
  { key: 'unitWindow', label: 'ユニットウィンドウ', values: ['なし', 'バルーン', 'パネル'] },
  { key: 'battleWindow', label: '戦闘ウィンドウ', values: ['なし', '簡易', '詳細'] },
  { key: 'showObjective', label: '目標表示', values: ['なし', 'あり'] },
  { key: 'autoCursor', label: 'オートカーソル', values: ['その場', '次のユニット'] },
  { key: 'autoEndTurn', label: 'オートターンエンド', values: ['なし', 'あり'] },
  { key: 'sfx', label: '効果音', values: ['なし', 'あり'] },
  { key: 'windowColor', label: 'ウィンドウカラー', values: ['青', '緑', '赤', '灰'] },
];

export const DEFAULT_OPTIONS: GameOptions = {
  battleAnim: 2,
  gameSpeed: 0,
  textSpeed: 1,
  terrainWindow: 1,
  unitWindow: 1,
  battleWindow: 2,
  showObjective: 1,
  autoCursor: 1,
  autoEndTurn: 0,
  sfx: 1,
  windowColor: 0,
};

/** ウィンドウの縁と地の色。FE8 のウィンドウカラーに当たる */
export const WINDOW_COLORS = [
  { border: '#cfe0ff', top: 'rgba(38,58,104,0.94)', bottom: 'rgba(18,28,56,0.94)' },
  { border: '#bfe8c8', top: 'rgba(32,74,52,0.94)', bottom: 'rgba(14,38,26,0.94)' },
  { border: '#ffc6c6', top: 'rgba(92,38,44,0.94)', bottom: 'rgba(44,16,22,0.94)' },
  { border: '#d8dce6', top: 'rgba(56,58,66,0.94)', bottom: 'rgba(24,25,30,0.94)' },
];
