import { create } from 'zustand';
import type { AppScreen, ChapterData, DialogueScene, UnitProgress } from '../core/types';
import { writeSave, readSave, deleteSave, hasAnySave, getSlotSummary } from '../core/saveManager';
import { CHAPTERS, CHAPTER_ORDER } from '../data/chapters';

type DialoguePhase = 'prologue' | 'epilogue';

type CampaignState = {
  currentScreen: AppScreen;
  currentChapterId: string | null;
  currentChapterData: ChapterData | null;
  completedChapters: string[];
  unitProgress: Record<string, UnitProgress>;

  // Dialogue playback
  dialogueScene: DialogueScene | null;
  dialogueLineIndex: number;
  dialoguePhase: DialoguePhase | null;

  // Actions
  goToTitle: () => void;
  goToDebug: () => void;
  startNewGame: () => void;
  startChapter: (id: string) => void;
  startChapterDirect: (id: string) => void;
  startDialogue: (scene: DialogueScene, phase: DialoguePhase) => void;
  advanceDialogue: () => void;
  onChapterVictory: (unitProgress: Record<string, UnitProgress>) => void;

  // Save/Load
  saveToSlot: (slot: number) => void;
  loadFromSlot: (slot: number) => boolean;
  deleteSlot: (slot: number) => void;
  hasAnySave: () => boolean;
  getSlotSummary: (slot: number) => { timestamp: number; chapterId: string } | null;
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  currentScreen: 'title',
  currentChapterId: null,
  currentChapterData: null,
  completedChapters: [],
  unitProgress: {},
  dialogueScene: null,
  dialogueLineIndex: 0,
  dialoguePhase: null,

  goToTitle: () => set({
    currentScreen: 'title',
    dialogueScene: null,
    dialogueLineIndex: 0,
    dialoguePhase: null,
  }),

  goToDebug: () => set({ currentScreen: 'debug' }),

  startNewGame: () => {
    set({ completedChapters: [], unitProgress: {} });
    get().startChapter('ch1');
  },

  startChapter: (id: string) => {
    const chapter = CHAPTERS[id];
    if (!chapter) return;
    set({ currentChapterId: id, currentChapterData: chapter });

    if (chapter.prologue) {
      get().startDialogue(chapter.prologue, 'prologue');
    } else {
      set({ currentScreen: 'battle' });
    }
  },

  startChapterDirect: (id: string) => {
    const chapter = CHAPTERS[id];
    if (!chapter) return;
    set({
      currentChapterId: id,
      currentChapterData: chapter,
      currentScreen: 'battle',
      dialogueScene: null,
      dialogueLineIndex: 0,
      dialoguePhase: null,
    });
  },

  startDialogue: (scene: DialogueScene, phase: DialoguePhase) => {
    set({
      currentScreen: 'dialogue',
      dialogueScene: scene,
      dialogueLineIndex: 0,
      dialoguePhase: phase,
    });
  },

  advanceDialogue: () => {
    const { dialogueScene, dialogueLineIndex, dialoguePhase, currentChapterData } = get();
    if (!dialogueScene) return;

    if (dialogueLineIndex < dialogueScene.lines.length - 1) {
      set({ dialogueLineIndex: dialogueLineIndex + 1 });
    } else {
      // Last line — transition
      if (dialoguePhase === 'prologue') {
        set({ currentScreen: 'battle', dialogueScene: null, dialoguePhase: null });
      } else if (dialoguePhase === 'epilogue') {
        // Auto-save and go to title
        get().saveToSlot(0);
        set({ currentScreen: 'title', dialogueScene: null, dialoguePhase: null });
      }
    }
  },

  onChapterVictory: (progress: Record<string, UnitProgress>) => {
    const { currentChapterId, completedChapters, currentChapterData } = get();
    if (!currentChapterId) return;

    const newCompleted = completedChapters.includes(currentChapterId)
      ? completedChapters
      : [...completedChapters, currentChapterId];

    set({ completedChapters: newCompleted, unitProgress: progress });

    if (currentChapterData?.epilogue) {
      get().startDialogue(currentChapterData.epilogue, 'epilogue');
    } else {
      get().saveToSlot(0);
      get().goToTitle();
    }
  },

  saveToSlot: (slot: number) => {
    const { currentChapterId, completedChapters, unitProgress } = get();
    // Determine next chapter for the save
    const nextChapterId = getNextChapterId(currentChapterId, completedChapters);
    writeSave(slot, {
      version: 1,
      timestamp: Date.now(),
      currentChapterId: nextChapterId,
      completedChapters,
      unitProgress,
    });
  },

  loadFromSlot: (slot: number) => {
    const data = readSave(slot);
    if (!data) return false;
    set({
      completedChapters: data.completedChapters,
      unitProgress: data.unitProgress,
    });
    get().startChapter(data.currentChapterId);
    return true;
  },

  deleteSlot: (slot: number) => deleteSave(slot),
  hasAnySave: () => hasAnySave(),
  getSlotSummary: (slot: number) => getSlotSummary(slot),
}));

function getNextChapterId(currentId: string | null, completed: string[]): string {
  if (!currentId) return CHAPTER_ORDER[0];
  const idx = CHAPTER_ORDER.indexOf(currentId);
  if (idx >= 0 && idx < CHAPTER_ORDER.length - 1) {
    return CHAPTER_ORDER[idx + 1];
  }
  return currentId;
}
