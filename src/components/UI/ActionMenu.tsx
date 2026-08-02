import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useUIStore } from '../../stores/uiStore';
import { posKey } from '../../core/types';
import { canUseItem } from '../../core/items';
import { getManhattanDistance } from '../../core/pathfinding';
import { hasSkill } from '../../core/skills';
import { canRescueUnit } from '../../core/rescue';
import { isExhausted } from '../../core/metaStats';
import { canAttackTerrain } from '../../core/destructibleTerrain';
import { checkNegotiateCondition } from '../../stores/actions/negotiateActions';
import { canHealWithStaff, isEffectiveAgainst } from '../../core/combat';
import { getDurabilityColor } from '../../core/items';
import type { Weapon } from '../../core/types';

export function ActionMenu() {
  const playerAction = useGameStore((s) => s.playerAction);
  const confirmMove = useGameStore((s) => s.confirmMove);
  const cancelAction = useGameStore((s) => s.cancelAction);
  const startAttackTargeting = useGameStore((s) => s.startAttackTargeting);
  const startHealTargeting = useGameStore((s) => s.startHealTargeting);
  const pendingAttackTiles = useGameStore((s) => s.pendingAttackTiles);
  const pendingPosition = useGameStore((s) => s.pendingPosition);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const units = useGameStore((s) => s.units);
  const selectedWeaponIndex = useGameStore((s) => s.selectedWeaponIndex);
  const selectWeapon = useGameStore((s) => s.selectWeapon);
  const visitVillage = useGameStore((s) => s.visitVillage);
  const visitedVillages = useGameStore((s) => s.visitedVillages);
  const chapterVillages = useGameStore((s) => s.chapterVillages);
  const useItemAction = useGameStore((s) => s.useItem);
  const seizeAction = useGameStore((s) => s.seize);
  const startTalkAction = useGameStore((s) => s.startTalk);
  const escapeAction = useGameStore((s) => s.escape);
  const chapterData = useGameStore((s) => s.chapterData);
  const gameMap = useGameStore((s) => s.gameMap);
  const shoveAction = useGameStore((s) => s.shove);
  const swapAction = useGameStore((s) => s.swap);
  const repositionAction = useGameStore((s) => s.reposition);
  const startDanceTargeting = useGameStore((s) => s.startDanceTargeting);
  const startStealTargeting = useGameStore((s) => s.startStealTargeting);
  const startRescueTargeting = useGameStore((s) => s.startRescueTargeting);
  const startDropTargeting = useGameStore((s) => s.startDropTargeting);
  const lockpickAction = useGameStore((s) => s.lockpick);
  const openedChests = useGameStore((s) => s.openedChests);
  const startTradeTargeting = useGameStore((s) => s.startTradeTargeting);
  const restAction = useGameStore((s) => s.rest);
  const attackTerrainAction = useGameStore((s) => s.attackTerrain);
  const terrainHpMap = useGameStore((s) => s.terrainHpMap);
  const useTorchAction = useGameStore((s) => s.useTorch);
  const fogOfWar = useGameStore((s) => s.fogOfWar);
  const negotiateAction = useGameStore((s) => s.negotiate);
  const useBalanceAction = useGameStore((s) => s.useBalance);
  const cameraOffset = useUIStore((s) => s.cameraOffset);
  const tileSize = useUIStore((s) => s.tileSize);

  const [showItemMenu, setShowItemMenu] = useState(false);

  if (playerAction !== 'action_menu' || !pendingPosition) return null;

  const selectedUnit = selectedUnitId ? units.get(selectedUnitId) : null;

  // Exhaustion: STA > 45 — only Wait, Rest, Cancel allowed
  const exhausted = selectedUnit ? isExhausted(selectedUnit) : false;
  // Rest is available when STA > 20
  const canRest = selectedUnit ? selectedUnit.metaStats.sta > 20 : false;

  // Check if there are any enemies in attack range (any weapon can attack)
  const hasAttackWeapon = selectedUnit != null && selectedUnit.inventory.length > 0;
  let hasEnemyInRange = false;
  if (hasAttackWeapon) {
    for (const unit of units.values()) {
      if (unit.faction === 'enemy' && pendingAttackTiles.has(posKey(unit.position))) {
        hasEnemyInRange = true;
        break;
      }
    }
  }

  // Check if unit has a staff, is proficient, and damaged allies in range
  const canHeal = (() => {
    if (!selectedUnit) return false;
    // Only proficient staff users can heal
    if (!canHealWithStaff(selectedUnit)) return false;
    const staff = selectedUnit.inventory.find((w) => w.type === 'staff');
    if (!staff) return false;
    // Check for damaged allies in staff range from pending position
    for (const ally of units.values()) {
      if (ally.id === selectedUnitId) continue;
      if (ally.faction !== 'player') continue;
      if (ally.currentHp >= ally.stats.hp) continue;
      const dist = getManhattanDistance(pendingPosition, ally.position);
      if (dist >= staff.minRange && dist <= staff.maxRange) return true;
    }
    return false;
  })();

  // Check if adjacent to a recruitable unit (only for 'talk' recruitment, not event/defection)
  const canTalk = (() => {
    if (!selectedUnit || !pendingPosition) return false;
    for (const unit of units.values()) {
      if (
        unit.recruitableBy === selectedUnitId &&
        (!unit.recruitCondition || unit.recruitCondition === 'talk') &&
        getManhattanDistance(pendingPosition, unit.position) === 1
      ) {
        return true;
      }
    }
    return false;
  })();

  // Check if unit has usable items (pass context for key items that need adjacency check)
  const itemContext =
    selectedUnit && pendingPosition
      ? { gameMap, position: pendingPosition, openedChests }
      : undefined;
  const usableItems = selectedUnit
    ? selectedUnit.items
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => canUseItem(selectedUnit, item, itemContext))
    : [];
  const hasUsableItems = usableItems.length > 0;

  // Check if standing on an unvisited village
  const pendingKey = posKey(pendingPosition);
  const isUnvisitedVillage =
    !visitedVillages.has(pendingKey) &&
    chapterVillages.some((v) => posKey(v.position) === pendingKey);

  // Check if Lord can seize (on seize position + boss defeated)
  const canSeize = (() => {
    if (!selectedUnit?.isLord || !chapterData?.seizePosition) return false;
    if (
      pendingPosition.x !== chapterData.seizePosition.x ||
      pendingPosition.y !== chapterData.seizePosition.y
    )
      return false;
    for (const u of units.values()) {
      if (u.faction === 'enemy' && u.aiBehavior?.type === 'boss') return false;
    }
    return true;
  })();

  // Check if unit can escape (on escape position, escape objective)
  const canEscape = (() => {
    if (!selectedUnit || selectedUnit.faction !== 'player') return false;
    if (chapterData?.objective.type !== 'escape' || !chapterData.objective.escapePosition)
      return false;
    const escPos = chapterData.objective.escapePosition;
    return pendingPosition.x === escPos.x && pendingPosition.y === escPos.y;
  })();

  // Check movement skills (Shove, Swap, Reposition)
  const canShove = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'shove')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (!ally || ally.faction !== 'player' || ally.id === selectedUnitId) continue;
      const target = { x: adj.x + d.x, y: adj.y + d.y };
      if (target.x >= 0 && target.y >= 0 && target.x < gameMap.width && target.y < gameMap.height) {
        const tgt = gameMap.tiles[target.y]?.[target.x];
        if (tgt && !tgt.occupantId && tgt.terrain !== 'wall' && tgt.terrain !== 'water')
          return true;
      }
    }
    return false;
  })();

  const canSwap = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'swap')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (ally && ally.faction === 'player' && ally.id !== selectedUnitId) return true;
    }
    return false;
  })();

  const canReposition = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'reposition')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (!ally || ally.faction !== 'player' || ally.id === selectedUnitId) continue;
      const target = { x: pendingPosition.x - d.x, y: pendingPosition.y - d.y };
      if (target.x >= 0 && target.y >= 0 && target.x < gameMap.width && target.y < gameMap.height) {
        const tgt = gameMap.tiles[target.y]?.[target.x];
        if (tgt && !tgt.occupantId && tgt.terrain !== 'wall' && tgt.terrain !== 'water')
          return true;
      }
    }
    return false;
  })();

  // Check dance skill — adjacent acted ally
  const canDance = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'dance')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (ally && ally.faction === 'player' && ally.id !== selectedUnitId && ally.hasActed)
        return true;
    }
    return false;
  })();

  // Check steal skill — adjacent enemy with items and SPD < thief's SPD
  const canSteal = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'steal')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const enemy = units.get(tile.occupantId);
      if (
        enemy &&
        enemy.faction === 'enemy' &&
        enemy.items.length > 0 &&
        selectedUnit.stats.spd > enemy.stats.spd
      )
        return true;
    }
    return false;
  })();

  // Check rescue — adjacent player ally that we can carry, not already carrying
  const canRescue = (() => {
    if (!selectedUnit || selectedUnit.carriedUnitId) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (
        ally &&
        ally.faction === 'player' &&
        ally.id !== selectedUnitId &&
        !ally.isCarried &&
        canRescueUnit(selectedUnit, ally)
      )
        return true;
    }
    return false;
  })();

  // Check drop — unit is carrying someone + adjacent empty passable tile
  const canDrop = (() => {
    if (!selectedUnit || !selectedUnit.carriedUnitId) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
      const tile = gameMap.tiles[adj.y][adj.x];
      if (!tile.occupantId && tile.terrain !== 'wall' && tile.terrain !== 'water') return true;
    }
    return false;
  })();

  // Check lockpick — unit has lockpick_skill + adjacent unopened chest or closed door
  const canLockpick = (() => {
    if (!selectedUnit || !hasSkill(selectedUnit, 'lockpick_skill')) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
      const tile = gameMap.tiles[adj.y][adj.x];
      if (tile.terrain === 'chest' && !openedChests.has(posKey(adj))) return true;
      if (tile.terrain === 'door') return true;
    }
    return false;
  })();

  // Check trade — any adjacent player ally
  const canTrade = (() => {
    if (!selectedUnit) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      const tile = gameMap.tiles[adj.y]?.[adj.x];
      if (!tile?.occupantId) continue;
      const ally = units.get(tile.occupantId);
      if (ally && ally.faction === 'player' && ally.id !== selectedUnitId && !ally.isCarried)
        return true;
    }
    return false;
  })();

  // Check break — adjacent destructible terrain with HP remaining
  const canBreak = (() => {
    if (!selectedUnit || !pendingPosition) return false;
    const dirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
    for (const d of dirs) {
      const adj = { x: pendingPosition.x + d.x, y: pendingPosition.y + d.y };
      if (adj.x < 0 || adj.y < 0 || adj.x >= gameMap.width || adj.y >= gameMap.height) continue;
      const terrain = gameMap.tiles[adj.y][adj.x].terrain;
      const key = posKey(adj);
      if (terrainHpMap.has(key) && canAttackTerrain(selectedUnit, terrain)) return true;
    }
    return false;
  })();

  // Check torch — unit has torch item and fog is active
  const canUseTorch =
    fogOfWar &&
    selectedUnit &&
    selectedUnit.items.some((i) => i.effect.kind === 'torch' && i.uses > 0);

  // Check Balance (Fortify) — unit has 'balance' skill + damaged allies within 5 tiles
  const canBalance = (() => {
    if (!selectedUnit || !pendingPosition) return false;
    if (!hasSkill(selectedUnit, 'balance')) return false;
    for (const ally of units.values()) {
      if (ally.id === selectedUnitId) continue;
      if (ally.faction !== selectedUnit.faction || ally.currentHp <= 0) continue;
      if (ally.currentHp >= ally.stats.hp) continue;
      if (getManhattanDistance(pendingPosition, ally.position) <= 5) return true;
    }
    return false;
  })();

  // Check negotiate — Ren adjacent to boss, boss HP ≤ 50%, party AWR avg ≥ 70
  const canNegotiate = (() => {
    if (!selectedUnit || exhausted) return false;
    const { available } = checkNegotiateCondition(useGameStore.getState);
    return available;
  })();

  // Position menu next to the pending tile
  const menuX = (pendingPosition.x + 1) * tileSize + cameraOffset.x + 4;
  const menuY = pendingPosition.y * tileSize + cameraOffset.y;

  // Compute weapon effectiveness badges (Task 1)
  const weaponEffective = new Set<number>();
  if (selectedUnit && hasEnemyInRange) {
    selectedUnit.inventory.forEach((weapon: Weapon, i: number) => {
      for (const unit of units.values()) {
        if (unit.faction === 'enemy' && pendingAttackTiles.has(posKey(unit.position))) {
          if (isEffectiveAgainst(weapon, unit)) {
            weaponEffective.add(i);
            break;
          }
        }
      }
    });
  }

  const showWeaponSelector = selectedUnit && selectedUnit.inventory.length > 1 && hasAttackWeapon;

  return (
    <div className="action-menu" data-testid="action-menu" style={{ left: menuX, top: menuY }}>
      {showWeaponSelector && !showItemMenu && (
        <div className="action-menu__weapons" data-testid="weapon-selector">
          {selectedUnit.inventory.map((weapon, i) => (
            <button
              key={weapon.id}
              className={`action-menu__weapon-btn ${i === selectedWeaponIndex ? 'action-menu__weapon-btn--active' : ''}`}
              data-testid={`weapon-${i}`}
              onClick={() => selectWeapon(i)}
            >
              {weapon.name}
              {weaponEffective.has(i) && (
                <span
                  data-testid="weapon-effective"
                  style={{ marginLeft: 4, fontSize: '0.8em', color: '#22c55e', fontWeight: 'bold' }}
                >
                  Eff!
                </span>
              )}
              {weapon.durability != null && weapon.maxDurability != null && (
                <span
                  data-testid="weapon-durability"
                  style={{
                    marginLeft: 4,
                    fontSize: '0.85em',
                    color: getDurabilityColor(weapon.durability),
                  }}
                >
                  {weapon.durability}/{weapon.maxDurability}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {showItemMenu ? (
        <div className="action-menu__actions" data-testid="item-submenu">
          {usableItems.map(({ item, index }) => (
            <button
              key={item.id}
              className="action-menu__btn action-menu__btn--item"
              data-testid={`item-${item.id}`}
              onClick={() => {
                useItemAction(index);
                setShowItemMenu(false);
              }}
            >
              <span style={{ color: '#22c55e' }}>{item.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '8px', fontSize: '12px' }}>
                ({item.uses}/{item.maxUses})
              </span>
            </button>
          ))}
          <button
            className="action-menu__btn action-menu__btn--cancel"
            data-testid="item-cancel"
            onClick={() => setShowItemMenu(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="action-menu__actions">
          {exhausted && (
            <div
              data-testid="exhaustion-warning"
              style={{
                color: '#f97316',
                fontSize: '11px',
                padding: '4px 8px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: 4,
              }}
            >
              Exhausted — Wait or Rest only
            </div>
          )}
          {!exhausted && hasEnemyInRange && (
            <button
              className="action-menu__btn action-menu__btn--attack"
              data-testid="action-attack"
              onClick={startAttackTargeting}
            >
              Attack
            </button>
          )}
          {!exhausted && canHeal && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-heal"
              onClick={startHealTargeting}
            >
              Heal
            </button>
          )}
          {!exhausted && canTalk && (
            <button
              className="action-menu__btn action-menu__btn--talk"
              data-testid="action-talk"
              onClick={startTalkAction}
            >
              Talk
            </button>
          )}
          {!exhausted && hasUsableItems && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-item"
              onClick={() => setShowItemMenu(true)}
            >
              Item
            </button>
          )}
          {!exhausted && canSeize && (
            <button
              className="action-menu__btn action-menu__btn--seize"
              data-testid="action-seize"
              onClick={seizeAction}
            >
              Seize
            </button>
          )}
          {!exhausted && canEscape && (
            <button
              className="action-menu__btn action-menu__btn--seize"
              data-testid="action-escape"
              onClick={escapeAction}
            >
              Escape
            </button>
          )}
          {!exhausted && isUnvisitedVillage && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-visit"
              onClick={visitVillage}
            >
              Visit
            </button>
          )}
          {!exhausted && canShove && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-shove"
              onClick={shoveAction}
            >
              Shove
            </button>
          )}
          {!exhausted && canSwap && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-swap"
              onClick={swapAction}
            >
              Swap
            </button>
          )}
          {!exhausted && canReposition && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-reposition"
              onClick={repositionAction}
            >
              Reposition
            </button>
          )}
          {!exhausted && canDance && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-dance"
              onClick={startDanceTargeting}
            >
              Dance
            </button>
          )}
          {!exhausted && canSteal && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-steal"
              onClick={startStealTargeting}
            >
              Steal
            </button>
          )}
          {!exhausted && canRescue && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-rescue"
              onClick={startRescueTargeting}
            >
              Rescue
            </button>
          )}
          {!exhausted && canDrop && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-drop"
              onClick={startDropTargeting}
            >
              Drop
            </button>
          )}
          {!exhausted && canLockpick && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-lockpick"
              onClick={lockpickAction}
            >
              Lockpick
            </button>
          )}
          {!exhausted && canTrade && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-trade"
              onClick={startTradeTargeting}
            >
              Trade
            </button>
          )}
          {!exhausted && canBreak && (
            <button
              className="action-menu__btn action-menu__btn--attack"
              data-testid="action-break"
              onClick={attackTerrainAction}
            >
              Break
            </button>
          )}
          {canNegotiate && (
            <button
              className="action-menu__btn action-menu__btn--negotiate"
              data-testid="action-negotiate"
              onClick={negotiateAction}
            >
              Negotiate
            </button>
          )}
          {!exhausted && canBalance && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-balance"
              onClick={useBalanceAction}
            >
              Balance
            </button>
          )}
          {!exhausted && canUseTorch && (
            <button
              className="action-menu__btn action-menu__btn--visit"
              data-testid="action-torch"
              onClick={useTorchAction}
            >
              Torch
            </button>
          )}
          {canRest && (
            <button
              className="action-menu__btn action-menu__btn--rest"
              data-testid="action-rest"
              onClick={restAction}
            >
              Rest
            </button>
          )}
          <button
            className="action-menu__btn"
            data-testid="action-view-info"
            onClick={() => {
              if (selectedUnitId) {
                useUIStore.getState().setDetailUnitId(selectedUnitId);
              }
            }}
          >
            View Info
          </button>
          <button className="action-menu__btn" data-testid="action-wait" onClick={confirmMove}>
            Wait
          </button>
          <button
            className="action-menu__btn action-menu__btn--cancel"
            data-testid="action-cancel"
            onClick={cancelAction}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
