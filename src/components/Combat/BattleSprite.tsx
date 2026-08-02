import { useState, useEffect } from 'react';
import type { Faction, WeaponType } from '../../core/types';
import {
  getSheetConfig,
  sheetFrameW,
  sheetCols,
  sheetPxW,
  sheetPxH,
  sheetFrameH,
} from '../sprites/spriteSheetConfig';

type BattleSpriteProps = {
  classId: string;
  faction: Faction;
  mirrored?: boolean;
  pose?: 'idle' | 'attack';
  /** Current combat animation phase — used to pick attack sub-frame */
  phase?: string;
  weaponType?: WeaponType;
  weaponId?: string;
  unitId?: string;
  /** When true, show only the first idle frame — no animation */
  static?: boolean;
};

/* ===== Battle display constants ===== */
const DISPLAY = 120; // display size in battle stage (px)
const SHEET_IDLE_MS = 150;
const SHEET_ATTACK_MS = 70;

function buildSeq(row: number, cols: number): readonly [number, number][] {
  return Array.from({ length: cols }, (_, i) => [row, i]);
}

export function BattleSprite({
  classId,
  mirrored,
  pose = 'idle',
  unitId,
  static: isStatic,
}: BattleSpriteProps) {
  const cfg = getSheetConfig(classId, unitId);
  const cfgCols = sheetCols(cfg);
  const cfgFrameW = sheetFrameW(cfg);
  const cfgSheetW = sheetPxW(cfg);
  const cfgSheetH = sheetPxH(cfg);
  const dScale = cfg.displayScale ?? 1;
  const displayW = DISPLAY * dScale;
  const scale = displayW / cfgFrameW;

  const [sheetFrame, setSheetFrame] = useState(0);
  const sheetSeq =
    pose === 'attack' ? buildSeq(cfg.attackRow, cfgCols) : buildSeq(cfg.idleRow, cfgCols);
  const sheetMs = pose === 'attack' ? SHEET_ATTACK_MS : SHEET_IDLE_MS;

  useEffect(() => {
    if (isStatic) return;
    setSheetFrame(0);
    const id = setInterval(() => setSheetFrame((f) => (f + 1) % sheetSeq.length), sheetMs);
    return () => clearInterval(id);
  }, [isStatic, pose, sheetSeq.length, sheetMs]);

  const [row, col] = sheetSeq[sheetFrame % sheetSeq.length];
  const frameH = sheetFrameH(cfg);
  const displayH = displayW * (frameH / cfgFrameW);
  return (
    <div
      style={{
        width: displayW,
        height: displayH,
        backgroundImage: `url(${cfg.url})`,
        backgroundPosition: `${-col * displayW}px ${-row * displayH}px`,
        backgroundSize: `${cfgSheetW * scale}px ${cfgSheetH * scale}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated' as React.CSSProperties['imageRendering'],
        transform: mirrored ? 'scaleX(-1)' : undefined,
        /* RGB sheets have black bg — screen blend makes black transparent */
        mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
      }}
    />
  );
}
