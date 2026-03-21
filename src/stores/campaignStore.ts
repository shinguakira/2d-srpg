import { create } from 'zustand';
import type { AppScreen, ChapterData, DialogueScene, UnitProgress } from '../core/types';
import { writeSave, readSave, deleteSave, hasAnySave, getSlotSummary } from '../core/saveManager';
import { CHAPTERS, CHAPTER_ORDER } from '../data/chapters';

export type GameMode = 'classic' | 'casual';
type DialoguePhase = 'prologue' | 'epilogue';

type CampaignState = {
  currentScreen: AppScreen;
  currentChapterId: string | null;
  currentChapterData: ChapterData | null;
  completedChapters: string[];
  unitProgress: Record<string, UnitProgress>;
  gameMode: GameMode;
  deadUnitIds: string[];
  roster: string[]; // ordered list of recruited unit IDs
  deployedUnitIds: string[]; // unit IDs selected for current chapter deployment
  storage: string[]; // weapon/item IDs in shared storage
  viewedSupports: string[]; // "chapterId:unitA:unitB" keys of viewed conversations

  // Dialogue playback
  dialogueScene: DialogueScene | null;
  dialogueLineIndex: number;
  dialoguePhase: DialoguePhase | null;

  // Actions
  goToTitle: () => void;
  goToDebug: () => void;
  setGameMode: (mode: GameMode) => void;
  startNewGame: () => void;
  startChapter: (id: string) => void;
  startChapterDirect: (id: string) => void;
  startBattle: () => void;
  startDialogue: (scene: DialogueScene, phase: DialoguePhase) => void;
  advanceDialogue: () => void;
  onChapterVictory: (unitProgress: Record<string, UnitProgress>, actualTurns?: number) => void;

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
  gameMode: 'classic',
  deadUnitIds: [],
  dialogueScene: null,
  dialogueLineIndex: 0,
  dialoguePhase: null,
  roster: [],
  deployedUnitIds: [],
  storage: [],
  viewedSupports: [],

  goToTitle: () => set({
    currentScreen: 'title',
    dialogueScene: null,
    dialogueLineIndex: 0,
    dialoguePhase: null,
  }),

  goToDebug: () => set({ currentScreen: 'debug' }),

  setGameMode: (mode: GameMode) => set({ gameMode: mode }),

  startNewGame: () => {
    const ch1 = CHAPTERS['ch1'];
    const initialRoster = ch1 ? ch1.playerUnits.map((p) => p.unitId) : [];
    set({ completedChapters: [], unitProgress: {}, deadUnitIds: [], roster: initialRoster, deployedUnitIds: [], storage: [], viewedSupports: [] });
    get().startChapter('ch1');
  },

  startChapter: (id: string) => {
    const chapter = CHAPTERS[id];
    if (!chapter) return;
    set({ currentChapterId: id, currentChapterData: chapter });

    if (chapter.prologue) {
      get().startDialogue(chapter.prologue, 'prologue');
    } else {
      set({ currentScreen: 'preparation' });
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

  startBattle: () => set({ currentScreen: 'battle' }),

  startDialogue: (scene: DialogueScene, phase: DialoguePhase) => {
    set({
      currentScreen: 'dialogue',
      dialogueScene: scene,
      dialogueLineIndex: 0,
      dialoguePhase: phase,
    });
  },

  advanceDialogue: () => {
    const { dialogueScene, dialogueLineIndex, dialoguePhase } = get();
    if (!dialogueScene) return;

    if (dialogueLineIndex < dialogueScene.lines.length - 1) {
      set({ dialogueLineIndex: dialogueLineIndex + 1 });
    } else {
      // Last line — transition
      if (dialoguePhase === 'prologue') {
        set({ currentScreen: 'preparation', dialogueScene: null, dialoguePhase: null });
      } else if (dialoguePhase === 'epilogue') {
        // Auto-save and advance to next chapter (or title if last chapter)
        get().saveToSlot(0);
        const { currentChapterId } = get();
        const nextId = getNextChapterId(currentChapterId, []);
        if (nextId !== currentChapterId && CHAPTERS[nextId]) {
          set({ dialogueScene: null, dialoguePhase: null });
          get().startChapter(nextId);
        } else {
          // Last chapter — go to title
          set({ currentScreen: 'title', dialogueScene: null, dialoguePhase: null });
        }
      }
    }
  },

  onChapterVictory: (progress: Record<string, UnitProgress>, actualTurns?: number) => {
    const { currentChapterId, completedChapters, currentChapterData, roster } = get();
    if (!currentChapterId) return;

    const newCompleted = completedChapters.includes(currentChapterId)
      ? completedChapters
      : [...completedChapters, currentChapterId];

    // Merge newly recruited units into roster
    const newRoster = [...roster];
    for (const unitId of Object.keys(progress)) {
      if (!newRoster.includes(unitId)) {
        newRoster.push(unitId);
      }
    }

    // Bonus EXP for completing under par turns (capped so unit EXP doesn't exceed 99)
    if (currentChapterData?.parTurns && actualTurns) {
      const bonusPool = Math.min(300, Math.max(0, (currentChapterData.parTurns - actualTurns) * 50));
      if (bonusPool > 0) {
        const unitIds = Object.keys(progress);
        const perUnit = Math.floor(bonusPool / unitIds.length);
        if (perUnit > 0) {
          for (const uid of unitIds) {
            const current = progress[uid].exp;
            const capped = Math.min(perUnit, 99 - current);
            if (capped > 0) {
              progress[uid] = { ...progress[uid], exp: current + capped };
            }
          }
        }
      }
    }

    // Meta-stat chapter-end updates: AWR +1, crpLowChapters tracking, LOOP regen at arc transitions
    const arcTransitions = ['ch5', 'ch10', 'ch15', 'ch20'];
    const isArcTransition = arcTransitions.includes(currentChapterId);
    for (const uid of Object.keys(progress)) {
      const p = progress[uid];
      const ms = p.metaStats ?? { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 };
      let newAwr = Math.min(100, ms.awr + 1); // AWR +1 per chapter
      let newLoop = ms.loop;
      if (uid === 'ren' && isArcTransition) {
        newLoop += 10; // LOOP +10 at arc transitions
      }
      // Track CRP low chapters for passive decay
      const oldCrpLow = p.crpLowChapters ?? 0;
      const newCrpLow = ms.crp < 15 ? oldCrpLow + 1 : 0;

      progress[uid] = {
        ...p,
        metaStats: { ...ms, awr: newAwr, loop: newLoop, sta: 0 }, // reset STA
        crpLowChapters: newCrpLow,
      };
    }

    set({ completedChapters: newCompleted, unitProgress: progress, roster: newRoster });

    if (currentChapterData?.epilogue) {
      get().startDialogue(currentChapterData.epilogue, 'epilogue');
    } else {
      // No epilogue — auto-advance to next chapter
      get().saveToSlot(0);
      const nextId = getNextChapterId(currentChapterId, []);
      if (nextId !== currentChapterId && CHAPTERS[nextId]) {
        get().startChapter(nextId);
      } else {
        get().goToTitle();
      }
    }
  },

  saveToSlot: (slot: number) => {
    const { currentChapterId, completedChapters, unitProgress, roster, deadUnitIds } = get();
    const nextChapterId = getNextChapterId(currentChapterId, completedChapters);
    writeSave(slot, {
      version: 4,
      timestamp: Date.now(),
      currentChapterId: nextChapterId,
      completedChapters,
      unitProgress,
      roster,
      deadUnitIds,
    });
  },

  loadFromSlot: (slot: number) => {
    const data = readSave(slot);
    if (!data) return false;
    set({
      completedChapters: data.completedChapters,
      unitProgress: data.unitProgress,
      roster: data.roster,
      deadUnitIds: data.deadUnitIds,
    });
    get().startChapter(data.currentChapterId);
    return true;
  },

  deleteSlot: (slot: number) => deleteSave(slot),
  hasAnySave: () => hasAnySave(),
  getSlotSummary: (slot: number) => getSlotSummary(slot),
}));

function getNextChapterId(currentId: string | null, _completed: string[]): string {
  if (!currentId) return CHAPTER_ORDER[0];
  const idx = CHAPTER_ORDER.indexOf(currentId);
  if (idx >= 0 && idx < CHAPTER_ORDER.length - 1) {
    return CHAPTER_ORDER[idx + 1];
  }
  return currentId;
}
