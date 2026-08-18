type Team = 'player' | 'enemy';

/** 剣/槍/斧/弓 + 理/光/闇/杖（FE8 の武器種） */
export type WeaponType = 'sword' | 'lance' | 'axe' | 'bow' | 'anima' | 'light' | 'dark' | 'staff' | 'monster';

/** 武器レベル */
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

/** 特効の対象 */
type Tag = 'armor' | 'cavalry' | 'flier' | 'monster' | 'dragon';

/** 支援の属性 */
export type Affinity = 'fire' | 'thunder' | 'wind' | 'ice' | 'dark' | 'light' | 'anima';

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  rank: Rank;
  mt: number;
  hit: number;
  crit: number;
  weight: number;
  minRange: number;
  maxRange: number;
  uses: number;
  magical?: boolean;
  /** 特効対象 */
  effective?: Tag[];
  /** 説明（アイテム画面用） */
  note?: string;
}

export interface Stats {
  hp: number;
  str: number;
  mag: number;
  skl: number;
  spd: number;
  lck: number;
  def: number;
  res: number;
  con: number;
  mov: number;
}

type MoveType = 'foot' | 'mounted' | 'flier';

interface Promotion {
  /** クラスチェンジ先のクラス ID（FE8 は 2 択分岐） */
  options: string[];
  /** 必要アイテム ID */
  item: string;
}

export interface UnitClass {
  id: string;
  name: string;
  moveType: MoveType;
  /** 扱える武器種と上限ランク */
  ranks: Partial<Record<WeaponType, Rank>>;
  color: string;
  accent: string;
  critBonus?: number;
  tags?: Tag[];
  /** 上級職か */
  promoted?: boolean;
  /** クラスチェンジ先 */
  promotion?: Promotion;
  /** クラスチェンジ時の能力上昇 */
  promoGain?: Partial<Stats>;
  /** 魔物特効を持つ（FE8 の司祭のスキル「魔物特効」） */
  slayer?: boolean;
}

type AiKind = 'aggressive' | 'guard' | 'boss';

interface SupportLink {
  /** 相手ユニットの ID */
  with: string;
  /** 友好度 */
  points: number;
  /** 確定済みのランク（会話で確定する） */
  rank: 0 | 1 | 2 | 3;
}

export interface Unit {
  id: string;
  name: string;
  team: Team;
  classId: string;
  level: number;
  exp: number;
  stats: Stats;
  growth: Stats;
  hp: number;
  x: number;
  y: number;
  items: Weapon[];
  equipped: number;
  potion: number;
  /** 扉と宝箱を開ける鍵。FE の「鍵」 */
  keys: number;
  acted: boolean;
  ai?: AiKind;
  isLord?: boolean;
  isBoss?: boolean;
  /** 支援の属性 */
  affinity: Affinity;
  /** 支援の状態 */
  supports: SupportLink[];
  /** 武器熟練度 */
  wexp: Partial<Record<WeaponType, number>>;
  /** マスタープルフなどの所持数 */
  seals: number;
  /** 説得で仲間にできる敵か（説得できるユニットの ID） */
  recruitableBy?: string;
  /** 描画用の補間位置（タイル単位） */
  px: number;
  py: number;
  dead?: boolean;
}

export interface TerrainDef {
  id: string;
  name: string;
  color: string;
  color2: string;
  def: number;
  avo: number;
  /** 通行コスト。foot / mounted / flier */
  cost: [number, number, number];
  /** ターン開始時の回復割合(0-1) */
  heal?: number;
}

export interface Pos {
  x: number;
  y: number;
}
