import { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

type Swap = { from: 'a' | 'b'; index: number };

export function TradeUI() {
  const tradePartnerId = useGameStore((s) => s.tradePartnerId);
  const selectedUnitId = useGameStore((s) => s.selectedUnitId);
  const units = useGameStore((s) => s.units);
  const confirmTrade = useGameStore((s) => s.confirmTrade);
  const cancelAction = useGameStore((s) => s.cancelAction);

  const [pendingSwaps, setPendingSwaps] = useState<Swap[]>([]);

  if (!tradePartnerId || !selectedUnitId) return null;

  const unitA = units.get(selectedUnitId);
  const unitB = units.get(tradePartnerId);
  if (!unitA || !unitB) return null;

  // Apply pending swaps to preview the result
  const previewItemsA = [...unitA.items];
  const previewItemsB = [...unitB.items];
  for (const swap of pendingSwaps) {
    if (swap.from === 'a') {
      const item = previewItemsA[swap.index];
      if (item) {
        previewItemsA.splice(swap.index, 1);
        previewItemsB.push(item);
      }
    } else {
      const item = previewItemsB[swap.index];
      if (item) {
        previewItemsB.splice(swap.index, 1);
        previewItemsA.push(item);
      }
    }
  }

  const handleTransfer = (from: 'a' | 'b', index: number) => {
    setPendingSwaps([...pendingSwaps, { from, index }]);
  };

  const handleConfirm = () => {
    confirmTrade(tradePartnerId, pendingSwaps);
    setPendingSwaps([]);
  };

  const handleCancel = () => {
    setPendingSwaps([]);
    cancelAction();
  };

  return (
    <div className="trade-ui" data-testid="trade-ui">
      <div className="trade-ui__header">Trade</div>
      <div className="trade-ui__columns">
        <div className="trade-ui__column" data-testid="trade-column-a">
          <div className="trade-ui__unit-name">{unitA.name}</div>
          <div className="trade-ui__items">
            {previewItemsA.length === 0 && (
              <div className="trade-ui__empty">No items</div>
            )}
            {previewItemsA.map((item, i) => (
              <button
                key={`a-${i}-${item.id}`}
                className="trade-ui__item"
                data-testid={`trade-a-${i}`}
                onClick={() => handleTransfer('a', i)}
              >
                <span>{item.name}</span>
                <span className="trade-ui__uses">({item.uses}/{item.maxUses})</span>
                <span className="trade-ui__arrow">&rarr;</span>
              </button>
            ))}
          </div>
        </div>
        <div className="trade-ui__divider" />
        <div className="trade-ui__column" data-testid="trade-column-b">
          <div className="trade-ui__unit-name">{unitB.name}</div>
          <div className="trade-ui__items">
            {previewItemsB.length === 0 && (
              <div className="trade-ui__empty">No items</div>
            )}
            {previewItemsB.map((item, i) => (
              <button
                key={`b-${i}-${item.id}`}
                className="trade-ui__item"
                data-testid={`trade-b-${i}`}
                onClick={() => handleTransfer('b', i)}
              >
                <span className="trade-ui__arrow">&larr;</span>
                <span>{item.name}</span>
                <span className="trade-ui__uses">({item.uses}/{item.maxUses})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="trade-ui__actions">
        <button
          className="trade-ui__btn trade-ui__btn--confirm"
          data-testid="trade-confirm"
          onClick={handleConfirm}
          disabled={pendingSwaps.length === 0}
        >
          Confirm
        </button>
        <button
          className="trade-ui__btn trade-ui__btn--cancel"
          data-testid="trade-cancel"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
