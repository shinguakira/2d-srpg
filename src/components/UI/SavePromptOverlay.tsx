import { useState } from 'react';
import { useCampaignStore } from '../../stores/campaignStore';
import { SaveSlotPicker } from './SaveSlotPicker';

export function SavePromptOverlay() {
  const showSavePrompt = useCampaignStore((s) => s.showSavePrompt);
  const dismissSavePrompt = useCampaignStore((s) => s.dismissSavePrompt);
  const saveToSlot = useCampaignStore((s) => s.saveToSlot);
  const [showPicker, setShowPicker] = useState(false);

  if (!showSavePrompt) return null;

  if (showPicker) {
    return (
      <SaveSlotPicker
        onSave={(slot) => {
          saveToSlot(slot);
        }}
        onCancel={() => {
          setShowPicker(false);
          dismissSavePrompt();
        }}
        title="Save Your Progress"
      />
    );
  }

  return (
    <div className="save-prompt" data-testid="save-prompt">
      <div className="save-prompt__panel">
        <h2 className="save-prompt__title">Chapter Complete</h2>
        <p className="save-prompt__text">Would you like to save your progress?</p>
        <div className="save-prompt__actions">
          <button
            className="save-prompt__btn save-prompt__btn--save"
            data-testid="save-prompt-save"
            onClick={() => setShowPicker(true)}
          >
            Save
          </button>
          <button
            className="save-prompt__btn save-prompt__btn--skip"
            data-testid="save-prompt-continue"
            onClick={dismissSavePrompt}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
