import { describe, it, expect, beforeEach } from 'vitest';
import { useCampaignStore } from '../../src/stores/campaignStore';

describe('Chapter Preparation Flow', () => {
  beforeEach(() => {
    // Reset store to default state
    useCampaignStore.setState({
      currentScreen: 'title',
      currentChapterId: null,
      currentChapterData: null,
      completedChapters: [],
      deployedUnitIds: [],
      dialogueScene: null,
      dialoguePhase: null,
      dialogueLineIndex: 0,
      roster: ['ren', 'kael', 'senna', 'lira', 'bram'],
      deadUnitIds: [],
      gameMode: 'classic',
      unitProgress: {},
    } as Partial<ReturnType<typeof useCampaignStore.getState>> as ReturnType<typeof useCampaignStore.getState>);
  });

  describe('startChapter', () => {
    it('ch1 with prologue starts dialogue first', () => {
      useCampaignStore.getState().startChapter('ch1');
      const state = useCampaignStore.getState();
      expect(state.currentScreen).toBe('dialogue');
      expect(state.dialoguePhase).toBe('prologue');
      expect(state.currentChapterId).toBe('ch1');
    });

    it('ch2 with prologue starts dialogue first', () => {
      useCampaignStore.getState().startChapter('ch2');
      const state = useCampaignStore.getState();
      expect(state.currentScreen).toBe('dialogue');
      expect(state.dialoguePhase).toBe('prologue');
    });
  });

  describe('advanceDialogue — prologue end', () => {
    it('ch1 (skipPreparation=true) goes to battle after prologue, not preparation', () => {
      // Start ch1 — sets up prologue dialogue
      useCampaignStore.getState().startChapter('ch1');

      const chapterData = useCampaignStore.getState().currentChapterData!;
      const prologueLength = chapterData.prologue!.lines.length;

      // Advance to last line
      for (let i = 0; i < prologueLength - 1; i++) {
        useCampaignStore.getState().advanceDialogue();
      }

      // Verify still in dialogue
      expect(useCampaignStore.getState().currentScreen).toBe('dialogue');

      // Advance past last line — triggers transition
      useCampaignStore.getState().advanceDialogue();

      const state = useCampaignStore.getState();
      expect(state.currentScreen).toBe('battle');
      // All ch1 player units should be auto-deployed
      const ch1PlayerIds = chapterData.playerUnits.map((p) => p.unitId);
      expect(state.deployedUnitIds).toEqual(ch1PlayerIds);
    });

    it('ch2 (no skipPreparation) goes to preparation after prologue', () => {
      useCampaignStore.getState().startChapter('ch2');

      const chapterData = useCampaignStore.getState().currentChapterData!;
      const prologueLength = chapterData.prologue!.lines.length;

      // Advance through all prologue lines
      for (let i = 0; i < prologueLength; i++) {
        useCampaignStore.getState().advanceDialogue();
      }

      const state = useCampaignStore.getState();
      expect(state.currentScreen).toBe('preparation');
    });
  });

  describe('skipPreparation flag', () => {
    it('ch1 chapter data has skipPreparation=true', () => {
      useCampaignStore.getState().startChapter('ch1');
      const chapterData = useCampaignStore.getState().currentChapterData!;
      expect(chapterData.skipPreparation).toBe(true);
    });

    it('ch2 chapter data does NOT have skipPreparation', () => {
      useCampaignStore.getState().startChapter('ch2');
      const chapterData = useCampaignStore.getState().currentChapterData!;
      expect(chapterData.skipPreparation).toBeFalsy();
    });
  });
});
