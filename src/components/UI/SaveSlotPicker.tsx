import { useState, useEffect } from 'react';
import { useT } from '../../i18n/useT';
import { useCampaignStore } from '../../stores/campaignStore';
import { CAMPAIGN } from '../../data/campaignConfig';

type Props = {
  onSave: (slot: number) => void;
  onCancel: () => void;
  title?: string;
};

export function SaveSlotPicker({ onSave, onCancel, title = 'Save Game' }: Props) {
  const T = useT();
  const getSlotSummary = useCampaignStore((s) => s.getSlotSummary);
  const [confirmingSlot, setConfirmingSlot] = useState<number | null>(null);
  const [savedSlot, setSavedSlot] = useState<number | null>(null);

  // Auto-dismiss after save feedback
  useEffect(() => {
    if (savedSlot !== null) {
      const timer = setTimeout(() => {
        setSavedSlot(null);
        onCancel();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [savedSlot, onCancel]);

  const handleSlotClick = (slot: number) => {
    const summary = getSlotSummary(slot);
    if (!summary) {
      onSave(slot);
      setSavedSlot(slot);
    } else {
      setConfirmingSlot(slot);
    }
  };

  const handleConfirmOverwrite = (slot: number) => {
    onSave(slot);
    setConfirmingSlot(null);
    setSavedSlot(slot);
  };

  return (
    <div className="save-slot-picker" data-testid="save-slot-picker">
      <div className="save-slot-picker__panel">
        <h2 className="save-slot-picker__title">{title}</h2>

        {savedSlot !== null && (
          <div className="save-slot-picker__feedback" data-testid="save-feedback">
            {T.ui('save.saved', 'Saved!')}
          </div>
        )}

        <div className="save-slot-picker__slots">
          {[1, 2, 3].map((slot) => {
            const summary = getSlotSummary(slot);
            const meta = summary ? CAMPAIGN.find((c) => c.id === summary.chapterId) : null;

            return (
              <div key={slot} className="save-slot-picker__slot-row">
                <button
                  className={`save-slot-picker__slot ${!summary ? 'save-slot-picker__slot--empty' : ''}`}
                  data-testid={`save-picker-slot-${slot}`}
                  onClick={() => handleSlotClick(slot)}
                  disabled={savedSlot !== null}
                >
                  {summary
                    ? `Slot ${slot}: ${meta?.name ?? summary.chapterId} — ${new Date(summary.timestamp).toLocaleDateString()}`
                    : `Slot ${slot}: Empty`}
                </button>

                {confirmingSlot === slot && (
                  <div className="save-slot-picker__confirm" data-testid={`save-confirm-${slot}`}>
                    <span>{T.ui('save.overwrite', 'Overwrite?')}</span>
                    <button
                      className="save-slot-picker__confirm-btn save-slot-picker__confirm-btn--yes"
                      data-testid={`save-confirm-yes-${slot}`}
                      onClick={() => handleConfirmOverwrite(slot)}
                    >
                      {T.ui('common.yes', 'Yes')}
                    </button>
                    <button
                      className="save-slot-picker__confirm-btn save-slot-picker__confirm-btn--no"
                      data-testid={`save-confirm-no-${slot}`}
                      onClick={() => setConfirmingSlot(null)}
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="save-slot-picker__cancel"
          data-testid="save-picker-cancel"
          onClick={onCancel}
          disabled={savedSlot !== null}
        >
          {T.ui('common.cancel', 'Cancel')}
        </button>
      </div>
    </div>
  );
}
