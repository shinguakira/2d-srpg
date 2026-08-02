import { useState, useEffect } from 'react';
import {
  getSheetConfig,
  sheetFrameW,
  sheetCols,
  sheetPxW,
  sheetPxH,
  sheetRows,
  sheetFrameH,
} from '../sprites/spriteSheetConfig';
import type { SheetConfig } from '../sprites/spriteSheetConfig';

/** All unique base sprite sheets */
const SHEET_ENTRIES: { id: string; label: string; cfg: SheetConfig; classes: string[] }[] = [
  {
    id: 'lord',
    label: 'Lord (Ren)',
    cfg: getSheetConfig('lord'),
    classes: ['lord', 'great_lord', 'conqueror', 'overlord'],
  },
  {
    id: 'cavalier',
    label: 'Cavalier (Kael)',
    cfg: getSheetConfig('cavalier'),
    classes: ['cavalier', 'paladin', 'great_knight', 'mage_knight', 'nomad_trooper'],
  },
  {
    id: 'mage',
    label: 'Mage (Senna)',
    cfg: getSheetConfig('mage'),
    classes: ['mage', 'sage', 'dark_flier', 'druid', 'summoner', 'archsage'],
  },
  {
    id: 'fighter',
    label: 'Fighter (Enemy)',
    cfg: getSheetConfig('fighter'),
    classes: ['fighter', 'warrior', 'berserker', 'hero', 'war_monk', 'reaver'],
  },
  {
    id: 'soldier',
    label: 'Soldier (Enemy)',
    cfg: getSheetConfig('soldier'),
    classes: ['soldier', 'general_soldier', 'halberdier', 'general_knight'],
  },
  {
    id: 'cleric',
    label: 'Cleric',
    cfg: getSheetConfig('cleric'),
    classes: ['cleric', 'bishop', 'saint', 'oracle'],
  },
  {
    id: 'generic',
    label: 'Generic',
    cfg: getSheetConfig('generic'),
    classes: ['generic (fallback)'],
  },
  {
    id: 'lira',
    label: 'Lira (Pegasus)',
    cfg: getSheetConfig('cleric', 'lira'),
    classes: ['lira (unit override)'],
  },
  {
    id: 'bram',
    label: 'Bram (Fighter)',
    cfg: getSheetConfig('fighter', 'bram'),
    classes: ['bram (unit override)'],
  },
  {
    id: 'garrek',
    label: 'Garrek (Boss)',
    cfg: getSheetConfig('fighter', 'garrek'),
    classes: ['garrek (unit override)'],
  },
];

const ROW_LABELS = ['Row 0', 'Row 1', 'Row 2', 'Row 3'];

const SPEED_PRESETS = [
  { label: 'Slow', ms: 400 },
  { label: 'Normal', ms: 200 },
  { label: 'Fast', ms: 100 },
  { label: 'Battle', ms: 70 },
];

const DISPLAY_SIZES = [80, 120, 160];

export function SpritesView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = SHEET_ENTRIES.find((e) => e.id === selectedId) ?? null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {SHEET_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            className={`debug-screen__entry ${entry.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-sprite-${entry.id}`}
            onClick={() => onSelect(entry.id)}
          >
            <div className="debug-screen__entry-sprite">
              <SheetPreviewThumb cfg={entry.cfg} />
            </div>
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{entry.label}</span>
              <span className="debug-screen__entry-meta">
                <span
                  className="debug-screen__badge"
                  style={{ background: entry.cfg.hasAlpha ? '#22c55e' : '#d97706' }}
                >
                  {entry.cfg.hasAlpha ? 'RGBA' : 'RGB'}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 11 }}>
                  {entry.classes.length} classes
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? (
          <SheetDetail entry={selected} />
        ) : (
          <div className="debug-screen__empty">Select a sprite sheet to view animations</div>
        )}
      </div>
    </div>
  );
}

/** Small animated thumbnail for the list */
function SheetPreviewThumb({ cfg }: { cfg: SheetConfig }) {
  const cols = sheetCols(cfg);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % cols), 200);
    return () => clearInterval(id);
  }, [cols]);

  const fw = sheetFrameW(cfg);
  const size = 48;
  const scale = size / fw;
  const fh = sheetFrameH(cfg);
  const sizeH = size * (fh / fw);
  return (
    <div
      style={{
        width: size,
        height: sizeH,
        backgroundImage: `url(${cfg.url})`,
        backgroundPosition: `${-frame * size}px ${-cfg.idleRow * sizeH}px`,
        backgroundSize: `${sheetPxW(cfg) * scale}px ${sheetPxH(cfg) * scale}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
      }}
    />
  );
}

/** Full detail panel for a selected sprite sheet */
function SheetDetail({ entry }: { entry: (typeof SHEET_ENTRIES)[number] }) {
  const { cfg } = entry;
  const cols = sheetCols(cfg);
  const fw = sheetFrameW(cfg);
  const sw = sheetPxW(cfg);
  const sh = sheetPxH(cfg);
  const rows = sheetRows(cfg);

  const [speed, setSpeed] = useState(200);
  const [displaySize, setDisplaySize] = useState(120);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [manualFrame, setManualFrame] = useState(0);

  // Animation frame state
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (paused) return;
    setFrame(0);
    const id = setInterval(() => setFrame((f) => (f + 1) % cols), speed);
    return () => clearInterval(id);
  }, [speed, paused, cols]);

  const currentFrame = paused ? manualFrame : frame;
  const scale = displaySize / fw;
  const frameH = sheetFrameH(cfg);
  const displayH = displaySize * (frameH / fw);

  return (
    <div data-testid={`debug-sprite-detail-${entry.id}`}>
      <h2 className="debug-screen__detail-name" style={{ marginBottom: 8 }}>
        {entry.label}
      </h2>

      {/* Sheet metadata */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: cfg.hasAlpha ? '#22c55e' : '#d97706' }}
        >
          {cfg.hasAlpha ? 'RGBA (transparent)' : 'RGB (blend: screen)'}
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          {sw}x{sh}px
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          {cols}x{rows} grid = {cols * rows} frames
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#475569' }}
        >
          {fw}x{frameH}px per frame
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#3b82f6' }}
        >
          Idle: Row {cfg.idleRow}
        </span>
        <span
          className="debug-screen__badge debug-screen__badge--large"
          style={{ background: '#ef4444' }}
        >
          Attack: Row {cfg.attackRow}
        </span>
      </div>

      {/* Controls */}
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Controls</h3>
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: 8,
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Speed:</span>
          {SPEED_PRESETS.map((p) => (
            <button
              key={p.label}
              className={`debug-screen__sub-tab ${speed === p.ms && !paused ? 'debug-screen__sub-tab--active' : ''}`}
              onClick={() => {
                setSpeed(p.ms);
                setPaused(false);
              }}
            >
              {p.label} ({p.ms}ms)
            </button>
          ))}
          <button
            className={`debug-screen__sub-tab ${paused ? 'debug-screen__sub-tab--active' : ''}`}
            onClick={() => setPaused(!paused)}
          >
            {paused ? 'Play' : 'Pause'}
          </button>
        </div>
        {paused && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: '#94a3b8', fontSize: 12 }}>Frame:</span>
            <input
              type="range"
              min={0}
              max={cols - 1}
              value={manualFrame}
              onChange={(e) => setManualFrame(Number(e.target.value))}
              style={{ width: 200 }}
            />
            <span style={{ color: '#fbbf24', fontWeight: 700, minWidth: 24 }}>{manualFrame}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8', fontSize: 12 }}>Size:</span>
          {DISPLAY_SIZES.map((s) => (
            <button
              key={s}
              className={`debug-screen__sub-tab ${displaySize === s ? 'debug-screen__sub-tab--active' : ''}`}
              onClick={() => setDisplaySize(s)}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      {/* Animated previews — all rows */}
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Animations by Row</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {Array.from({ length: rows }, (_, row) => {
            const isIdle = row === cfg.idleRow;
            const isAttack = row === cfg.attackRow;
            const label =
              isIdle && isAttack
                ? 'Idle + Attack'
                : isIdle
                  ? 'Idle'
                  : isAttack
                    ? 'Attack'
                    : ROW_LABELS[row];
            const borderColor = isIdle ? '#3b82f6' : isAttack ? '#ef4444' : '#334155';

            return (
              <div
                key={row}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: `2px solid ${activeRow === row ? '#fbbf24' : borderColor}`,
                  borderRadius: 8,
                  padding: 8,
                  background: activeRow === row ? 'rgba(251,191,36,0.1)' : 'rgba(0,0,0,0.3)',
                }}
                onClick={() => setActiveRow(activeRow === row ? null : row)}
              >
                <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
                  {label}
                  {isIdle && <span style={{ color: '#3b82f6' }}> (idle)</span>}
                  {isAttack && !isIdle && <span style={{ color: '#ef4444' }}> (attack)</span>}
                </div>
                <div
                  style={{
                    width: displaySize,
                    height: displayH,
                    backgroundImage: `url(${cfg.url})`,
                    backgroundPosition: `${-currentFrame * displaySize}px ${-row * displayH}px`,
                    backgroundSize: `${sw * scale}px ${sh * scale}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
                  }}
                />
                <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 4 }}>
                  Frame {currentFrame}/{cols - 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frame strip for selected row */}
      {activeRow != null && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Frame Strip — Row {activeRow}</h3>
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '4px 0' }}>
            {Array.from({ length: cols }, (_, col) => (
              <div
                key={col}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: col === currentFrame ? '2px solid #fbbf24' : '1px solid #334155',
                  borderRadius: 4,
                  padding: 2,
                  background: col === currentFrame ? 'rgba(251,191,36,0.15)' : 'transparent',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onClick={() => {
                  setPaused(true);
                  setManualFrame(col);
                }}
              >
                <div
                  style={{
                    width: fw,
                    height: frameH,
                    backgroundImage: `url(${cfg.url})`,
                    backgroundPosition: `${-col * fw}px ${-activeRow * frameH}px`,
                    backgroundSize: `${sw}px ${sh}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
                  }}
                />
                <span style={{ fontSize: 9, color: col === currentFrame ? '#fbbf24' : '#64748b' }}>
                  {col}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full sprite sheet */}
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Full Sprite Sheet</h3>
        <div
          style={{
            overflow: 'auto',
            maxWidth: '100%',
            background: '#000',
            borderRadius: 8,
            padding: 4,
            border: '1px solid #334155',
          }}
        >
          <img
            src={cfg.url}
            alt={`${entry.label} sprite sheet`}
            style={{
              imageRendering: 'pixelated',
              display: 'block',
              maxWidth: 'none',
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{cfg.url}</div>
      </div>

      {/* Classes using this sheet */}
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">
          Classes Using This Sheet ({entry.classes.length})
        </h3>
        <div className="debug-screen__used-by">
          {entry.classes.map((cls) => (
            <span key={cls} className="debug-screen__used-by-chip">
              {cls}
            </span>
          ))}
        </div>
      </div>

      {/* Side-by-side: Idle vs Attack */}
      {/* Idle vs Attack side by side */}
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Idle vs Attack (side by side)</h3>
        {(() => {
          const bigScale = 160 / fw;
          const bigH = 160 * (frameH / fw);
          return (
            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 4 }}>
                  Idle (Row {cfg.idleRow})
                </div>
                <div
                  style={{
                    width: 160,
                    height: bigH,
                    backgroundImage: `url(${cfg.url})`,
                    backgroundPosition: `${-currentFrame * 160}px ${-cfg.idleRow * bigH}px`,
                    backgroundSize: `${sw * bigScale}px ${sh * bigScale}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
                    border: '1px solid #3b82f6',
                    borderRadius: 8,
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 4 }}>
                  Attack (Row {cfg.attackRow})
                </div>
                <div
                  style={{
                    width: 160,
                    height: bigH,
                    backgroundImage: `url(${cfg.url})`,
                    backgroundPosition: `${-currentFrame * 160}px ${-cfg.attackRow * bigH}px`,
                    backgroundSize: `${sw * bigScale}px ${sh * bigScale}px`,
                    backgroundRepeat: 'no-repeat',
                    imageRendering: 'pixelated',
                    mixBlendMode: cfg.hasAlpha ? undefined : 'screen',
                    border: '1px solid #ef4444',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
