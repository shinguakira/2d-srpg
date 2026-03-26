import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useCampaignStore } from '../../stores/campaignStore';
import { useUIStore } from '../../stores/uiStore';
import type { AnimationSpeed } from '../../stores/uiStore';

type SubPanel = 'none' | 'unit_list' | 'objective' | 'settings';

export function SystemMenu() {
  const playerAction = useGameStore(s => s.playerAction);
  const closeSystemMenu = useGameStore(s => s.closeSystemMenu);
  const endPlayerTurn = useGameStore(s => s.endPlayerTurn);
  const units = useGameStore(s => s.units);
  const objectiveDescription = useGameStore(s => s.objectiveDescription);
  const currentTurn = useGameStore(s => s.currentTurn);
  const goToTitle = useCampaignStore(s => s.goToTitle);
  const saveCurrentToSlot = useCampaignStore(s => s.saveCurrentToSlot);
  const gameMode = useCampaignStore(s => s.gameMode);

  const [subPanel, setSubPanel] = useState<SubPanel>('none');

  // Escape / B key handler
  useEffect(() => {
    if (playerAction !== 'system_menu') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        e.stopPropagation();
        if (subPanel !== 'none') {
          setSubPanel('none');
        } else {
          closeSystemMenu();
        }
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [playerAction, subPanel, closeSystemMenu]);

  // Reset sub-panel when menu closes
  useEffect(() => {
    if (playerAction !== 'system_menu') {
      setSubPanel('none');
    }
  }, [playerAction]);

  if (playerAction !== 'system_menu') return null;

  const handleEndTurn = () => {
    closeSystemMenu();
    endPlayerTurn();
  };

  const handleSuspend = () => {
    saveCurrentToSlot(0);
    goToTitle();
  };

  const handleBackdropClick = () => {
    if (subPanel !== 'none') {
      setSubPanel('none');
    } else {
      closeSystemMenu();
    }
  };

  return (
    <>
      <div className="system-menu__backdrop" onClick={handleBackdropClick} data-testid="system-menu-backdrop" />
      <div className="system-menu" data-testid="system-menu">
        <div className="system-menu__title">Menu</div>
        <div className="system-menu__items">
          <button className="system-menu__item" data-testid="system-menu-units" onClick={() => setSubPanel('unit_list')}>
            ユニット一覧
          </button>
          <button className="system-menu__item" data-testid="system-menu-objective" onClick={() => setSubPanel('objective')}>
            勝敗条件
          </button>
          <button className="system-menu__item" data-testid="system-menu-settings" onClick={() => setSubPanel('settings')}>
            環境設定
          </button>
          <button className="system-menu__item" data-testid="system-menu-suspend" onClick={handleSuspend}>
            中断
          </button>
          <button className="system-menu__item system-menu__item--end-turn" data-testid="system-menu-end-turn" onClick={handleEndTurn}>
            ターン終了
          </button>
        </div>
      </div>

      {subPanel === 'unit_list' && (
        <UnitListPanel units={units} onClose={() => setSubPanel('none')} closeSystemMenu={closeSystemMenu} />
      )}
      {subPanel === 'objective' && (
        <ObjectivePanel objectiveDescription={objectiveDescription} currentTurn={currentTurn} onClose={() => setSubPanel('none')} />
      )}
      {subPanel === 'settings' && (
        <SettingsPanel gameMode={gameMode} onClose={() => setSubPanel('none')} />
      )}
    </>
  );
}

// ===== Unit List Sub-panel =====

function UnitListPanel({ units, onClose, closeSystemMenu }: {
  units: Map<string, import('../../core/types').Unit>;
  onClose: () => void;
  closeSystemMenu: () => void;
}) {
  const playerUnits = Array.from(units.values()).filter(u => u.faction === 'player' && !u.isCarried);

  const handleUnitClick = useCallback((unitId: string) => {
    const unit = units.get(unitId);
    if (!unit) return;
    closeSystemMenu();
    if (!unit.hasActed) {
      useGameStore.getState().selectUnit(unitId);
    }
  }, [units, closeSystemMenu]);

  return (
    <div className="system-menu-panel__backdrop" onClick={onClose} data-testid="system-menu-unit-list-panel">
      <div className="system-menu-panel" onClick={e => e.stopPropagation()}>
        <div className="system-menu-panel__title">ユニット一覧</div>
        <table className="unit-list-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Lv</th>
              <th>HP</th>
              <th>Weapon</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {playerUnits.map(unit => (
              <tr key={unit.id} onClick={() => handleUnitClick(unit.id)}>
                <td>{unit.name}</td>
                <td>{unit.classId}</td>
                <td>{unit.level}</td>
                <td className="unit-list-table__hp">{unit.currentHp}/{unit.stats.hp}</td>
                <td>{unit.equippedWeapon.name}</td>
                <td>
                  {unit.hasActed
                    ? <span className="unit-list-table__status--acted">行動済</span>
                    : <span className="unit-list-table__status--ready">待機中</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Objective Sub-panel =====

function ObjectivePanel({ objectiveDescription, currentTurn, onClose }: {
  objectiveDescription: string;
  currentTurn: number;
  onClose: () => void;
}) {
  return (
    <div className="system-menu-panel__backdrop" onClick={onClose} data-testid="system-menu-objective-panel">
      <div className="system-menu-panel" onClick={e => e.stopPropagation()}>
        <div className="system-menu-panel__title">勝敗条件</div>
        <div className="objective-panel__section">
          <div className="objective-panel__label">Victory</div>
          <div className="objective-panel__text objective-panel__text--victory">{objectiveDescription}</div>
        </div>
        <div className="objective-panel__section">
          <div className="objective-panel__label">Defeat</div>
          <div className="objective-panel__text objective-panel__text--defeat">主人公が倒される</div>
        </div>
        <div className="objective-panel__section">
          <div className="objective-panel__label">Current Turn</div>
          <div className="objective-panel__text">{currentTurn}</div>
        </div>
      </div>
    </div>
  );
}

// ===== Settings Sub-panel =====

const SPEED_LABELS: Record<AnimationSpeed, string> = {
  '1x': '通常 (1x)',
  '2x': '高速 (2x)',
  'skip': 'スキップ',
};

function SettingsPanel({ gameMode, onClose }: {
  gameMode: string;
  onClose: () => void;
}) {
  const showDangerZone = useGameStore(s => s.showDangerZone);
  const toggleDangerZone = useGameStore(s => s.toggleDangerZone);
  const animationSpeed = useUIStore(s => s.animationSpeed);
  const cycleAnimationSpeed = useUIStore(s => s.cycleAnimationSpeed);

  return (
    <div className="system-menu-panel__backdrop" onClick={onClose} data-testid="system-menu-settings-panel">
      <div className="system-menu-panel" onClick={e => e.stopPropagation()}>
        <div className="system-menu-panel__title">環境設定</div>
        <div className="settings-panel__row">
          <span className="settings-panel__label">デンジャーゾーン表示</span>
          <button
            className={`settings-panel__toggle ${showDangerZone ? 'settings-panel__toggle--active' : ''}`}
            onClick={toggleDangerZone}
            data-testid="system-menu-settings-danger-zone"
          >
            {showDangerZone ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="settings-panel__row">
          <span className="settings-panel__label">アニメ速度</span>
          <button
            className="settings-panel__toggle settings-panel__toggle--active"
            onClick={cycleAnimationSpeed}
            data-testid={`speed-${animationSpeed}`}
          >
            {SPEED_LABELS[animationSpeed]}
          </button>
        </div>
        <div className="settings-panel__row">
          <span className="settings-panel__label">ゲームモード</span>
          <span className="settings-panel__info">{gameMode === 'classic' ? 'クラシック' : 'カジュアル'}</span>
        </div>
      </div>
    </div>
  );
}
