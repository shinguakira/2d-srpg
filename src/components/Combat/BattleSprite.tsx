import type { Faction, WeaponType } from '../../core/types';
import { getSheet, getClip, spriteBox, framePosition } from '../sprites/spriteSheetConfig';
import type { ClipName } from '../sprites/spriteSheetConfig';
import { useClipFrame, phaseOf } from '../sprites/useClipFrame';

type BattleSpriteProps = {
  classId: string;
  faction: Faction;
  mirrored?: boolean;
  pose?: ClipName;
  /** Combat animation phase — changing it replays a one-shot clip from frame 0. */
  phase?: string;
  weaponType?: WeaponType;
  weaponId?: string;
  unitId?: string;
  /** Show only the first idle frame — used for dialogue portraits. */
  static?: boolean;
};

/** On-screen height of the character in the battle stage, in px. */
const CONTENT_PX = 108;

export function BattleSprite({
  classId,
  mirrored,
  pose = 'idle',
  phase,
  unitId,
  static: isStatic,
}: BattleSpriteProps) {
  const sheet = getSheet(classId, unitId);
  const clip = getClip(sheet, pose);

  // One-shot clips restart whenever the pose or the hit index changes; looping
  // ones run free, offset per unit so identical classes are not in lockstep.
  const animated = useClipFrame(
    clip,
    clip.loop ? undefined : `${pose}:${phase ?? ''}`,
    clip.loop && unitId ? phaseOf(unitId) : 0,
  );
  const frame = isStatic ? clip.frames[0] : animated;

  const box = spriteBox(sheet, CONTENT_PX);
  const pos = framePosition(sheet, box, frame);

  return (
    <div
      style={{
        width: box.w,
        height: box.h,
        backgroundImage: `url(${sheet.url})`,
        backgroundPosition: `${pos.x}px ${pos.y}px`,
        backgroundSize: `${box.bgW}px ${box.bgH}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: (sheet.pixelArt
          ? 'pixelated'
          : 'auto') as React.CSSProperties['imageRendering'],
        transform: mirrored ? 'scaleX(-1)' : undefined,
      }}
    />
  );
}
