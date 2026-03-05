import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';

export function FloatingNumbers() {
  const floatingNumbers = useGameStore((s) => s.floatingNumbers);
  const tileSize = useUIStore((s) => s.tileSize);
  const [visible, setVisible] = useState<typeof floatingNumbers>([]);

  useEffect(() => {
    if (floatingNumbers.length === 0) {
      setVisible([]);
      return;
    }
    setVisible(floatingNumbers);
    const timer = setTimeout(() => setVisible([]), 1200);
    return () => clearTimeout(timer);
  }, [floatingNumbers]);

  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((f) => (
        <div
          key={f.id}
          className="floating-number"
          style={{
            position: 'absolute',
            left: f.x * tileSize + tileSize / 2,
            top: f.y * tileSize,
            color: f.color,
            fontSize: 16,
            fontWeight: 'bold',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            pointerEvents: 'none',
            zIndex: 30,
            animation: 'float-up 1.2s ease forwards',
            transform: 'translateX(-50%)',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {f.text}
        </div>
      ))}
    </>
  );
}
