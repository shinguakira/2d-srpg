import type { Faction, WeaponType } from '../../core/types';
import { FACTION_COLORS } from '../sprites/classSprites';
import { renderBattlePose } from '../sprites/battlePoses';

type BattleSpriteProps = {
  classId: string;
  faction: Faction;
  mirrored?: boolean;
  pose?: 'idle' | 'attack';
  weaponType?: WeaponType;
};

export function BattleSprite({ classId, faction, mirrored, pose = 'idle' }: BattleSpriteProps) {
  const c = FACTION_COLORS[faction];
  return (
    <svg
      width={64}
      height={72}
      viewBox="0 0 32 36"
      style={{
        imageRendering: 'auto',
        transform: mirrored ? 'scaleX(-1)' : undefined,
      }}
    >
      {renderBattlePose(classId, c, pose)}
    </svg>
  );
}
