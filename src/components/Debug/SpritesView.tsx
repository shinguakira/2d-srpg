import { useState } from 'react';
import {
  ALL_SHEETS,
  CLIP_NAMES,
  getClip,
  hasClip,
  spriteBox,
  framePosition,
  type SpriteSheet,
  type ClipName,
} from '../sprites/spriteSheetConfig';
import { useClipFrame } from '../sprites/useClipFrame';

export function SpritesView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = ALL_SHEETS.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {ALL_SHEETS.map((entry) => (
          <button
            key={entry.id}
            className={`debug-screen__entry ${entry.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-sprite-${entry.id}`}
            onClick={() => onSelect(entry.id)}
          >
            <div className="debug-screen__entry-sprite">
              <ClipPlayer sheet={entry.sheet} clip="idle" contentPx={34} />
            </div>
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{entry.id}</span>
              <span className="debug-screen__entry-meta">
                <span
                  className="debug-screen__badge"
                  style={{ background: entry.sheet.pixelArt ? '#d97706' : '#22c55e' }}
                >
                  {entry.sheet.pixelArt ? 'pixel art' : 'hi-res'}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  {entry.sheet.cols}x{entry.sheet.rows}
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? (
          <SheetDetail id={selected.id} sheet={selected.sheet} />
        ) : (
          <div className="debug-screen__empty">Select a sprite sheet to view animations</div>
        )}
      </div>
    </div>
  );
}

/** Plays one clip at its configured fps, sized the way the game sizes it. */
function ClipPlayer({
  sheet,
  clip,
  contentPx,
}: {
  sheet: SpriteSheet;
  clip: ClipName;
  contentPx: number;
}) {
  const frame = useClipFrame(getClip(sheet, clip));
  return <FrameCell sheet={sheet} frame={frame} contentPx={contentPx} />;
}

/** One fixed frame, sized so the artwork is `contentPx` tall. */
function FrameCell({
  sheet,
  frame,
  contentPx,
}: {
  sheet: SpriteSheet;
  frame: number;
  contentPx: number;
}) {
  const box = spriteBox(sheet, contentPx);
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
        flexShrink: 0,
      }}
    />
  );
}

function SheetDetail({ id, sheet }: { id: string; sheet: SpriteSheet }) {
  const [contentPx, setContentPx] = useState(96);
  const frameW = sheet.sheetW / sheet.cols;
  const frameH = sheet.sheetH / sheet.rows;
  const box = spriteBox(sheet, contentPx);

  return (
    <div data-testid={`debug-sprite-detail-${id}`}>
      <h2 className="debug-screen__detail-name" style={{ marginBottom: 8 }}>
        {id}
      </h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: sheet.pixelArt ? '#d97706' : '#22c55e' }}
        >
          {sheet.pixelArt ? 'pixel art (nearest)' : 'hi-res (smooth)'}
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          {sheet.sheetW}x{sheet.sheetH}px
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          {sheet.cols}x{sheet.rows} = {sheet.cols * sheet.rows} frames
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          frame {frameW.toFixed(2)}x{frameH.toFixed(2)}px
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#3b82f6' }}
        >
          anchor {sheet.content.cx.toFixed(3)}, {sheet.content.bottom.toFixed(3)}
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#8b5cf6' }}
        >
          content height {(sheet.content.height * 100).toFixed(0)}%
        </span>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Display size</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>character height:</span>
          {[46, 96, 140].map((s) => (
            <button
              key={s}
              className={`debug-screen__sub-tab ${contentPx === s ? 'debug-screen__sub-tab--active' : ''}`}
              onClick={() => setContentPx(s)}
            >
              {s}px
            </button>
          ))}
          <span style={{ color: '#64748b', fontSize: 11 }}>
            frame window {box.w.toFixed(0)}x{box.h.toFixed(0)}px
          </span>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Clips</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {CLIP_NAMES.map((name) => {
            const clip = getClip(sheet, name);
            // A sheet that has no art for a state still plays something. Say
            // which, so a missing animation cannot pass as a working one.
            const own = hasClip(sheet, name);
            return (
              <div
                key={name}
                style={{
                  border: `2px solid ${own ? (name === 'idle' ? '#3b82f6' : '#ef4444') : '#475569'}`,
                  borderRadius: 8,
                  padding: 8,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  opacity: own ? 1 : 0.55,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: own ? (name === 'idle' ? '#3b82f6' : '#ef4444') : '#94a3b8',
                  }}
                >
                  {name}
                  {own ? '' : ' (fallback)'}
                </div>
                <ClipPlayer sheet={sheet} clip={name} contentPx={contentPx} />
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  frames {clip.frames[0]}-{clip.frames[clip.frames.length - 1]} · {clip.fps} fps ·{' '}
                  {clip.loop ? 'loop' : 'once'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {CLIP_NAMES.filter((name) => hasClip(sheet, name)).map((name) => (
        <div className="debug-screen__section" key={name}>
          <h3 className="debug-screen__section-title">Frame strip — {name}</h3>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '4px 0' }}>
            {getClip(sheet, name).frames.map((f) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '1px solid #334155',
                  borderRadius: 4,
                  padding: 2,
                  flexShrink: 0,
                }}
              >
                <FrameCell sheet={sheet} frame={f} contentPx={54} />
                <span style={{ fontSize: 9, color: '#64748b' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Full sprite sheet</h3>
        <div
          style={{
            overflow: 'auto',
            maxWidth: '100%',
            background: '#0f172a',
            borderRadius: 8,
            padding: 4,
            border: '1px solid #334155',
          }}
        >
          <img
            src={sheet.url}
            alt={`${id} sprite sheet`}
            style={{
              imageRendering: sheet.pixelArt ? 'pixelated' : 'auto',
              display: 'block',
              maxWidth: 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}
