import { create } from 'zustand';
import type {
  AppScreen,
  ChapterData,
  DialogueScene,
  UnitProgress,
  SupportPair,
  DifficultyMode,
  EndingType,
} from '../core/types';
import { writeSave, readSave, deleteSave, hasAnySave, getSlotSummary } from '../core/saveManager';
import { CHAPTERS, CHAPTER_ORDER } from '../data/chapters';
import { PLAYER_UNITS } from '../data/units';
import { WEAPONS } from '../data/weapons';
import { canForge, applyForge, getRequiredMaterial, getForgeGoldCost } from '../core/forging';
import { rollLevelUp, applyStatGains } from '../core/experience';
import { ALL_CLASSES } from '../data/promotedClasses';
import { SeededRandom } from '../core/rng';

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
  supportPairs: SupportPair[]; // persistent support pair data
  bonusExp: number; // unallocated bonus EXP pool
  forgeMaterials: string[]; // forge material item IDs
  gold: number; // currency for forging and other costs
  difficulty: DifficultyMode;
  campaignFlags: Record<string, string | number | boolean>;
  newGamePlusUnlocked: boolean;
  endingsSeen: EndingType[];
  currentEnding: EndingType | null;

  // Dialogue playback
  dialogueScene: DialogueScene | null;
  dialogueLineIndex: number;
  dialoguePhase: DialoguePhase | null;

  // Save prompt (shown between chapters)
  showSavePrompt: boolean;
  pendingNextChapterId: string | null;

  // Actions
  goToTitle: () => void;
  goToDebug: () => void;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: DifficultyMode) => void;
  startNewGame: (difficulty?: DifficultyMode) => void;
  startChapter: (id: string) => void;
  startChapterDirect: (id: string) => void;
  startBattle: () => void;
  startDialogue: (scene: DialogueScene, phase: DialoguePhase) => void;
  advanceDialogue: () => void;
  onChapterVictory: (
    unitProgress: Record<string, UnitProgress>,
    actualTurns?: number,
    updatedSupportPairs?: SupportPair[],
  ) => void;

  // Save/Load
  saveToSlot: (slot: number) => void;
  saveCurrentToSlot: (slot: number) => void;
  loadFromSlot: (slot: number) => boolean;
  deleteSlot: (slot: number) => void;
  allocateBonusExp: (unitId: string, amount: number) => void;
  forgeWeapon: (unitId: string, weaponIndex: number) => void;
  hasAnySave: () => boolean;
  getSlotSummary: (slot: number) => { timestamp: number; chapterId: string } | null;
  dismissSavePrompt: () => void;

  // Endings / Credits / NG+
  goToCredits: () => void;
  startNewGamePlus: () => void;
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
  supportPairs: [],
  bonusExp: 0,
  forgeMaterials: [],
  gold: 1000,
  difficulty: 'classic' as DifficultyMode,
  campaignFlags: {},
  newGamePlusUnlocked: false,
  endingsSeen: [],
  currentEnding: null,
  showSavePrompt: false,
  pendingNextChapterId: null,

  goToTitle: () =>
    set({
      currentScreen: 'title',
      dialogueScene: null,
      dialogueLineIndex: 0,
      dialoguePhase: null,
    }),

  goToDebug: () => set({ currentScreen: 'debug' }),

  setGameMode: (mode: GameMode) => set({ gameMode: mode }),

  setDifficulty: (difficulty: DifficultyMode) => set({ difficulty }),

  startNewGame: (difficulty?: DifficultyMode) => {
    const ch1 = CHAPTERS['ch1'];
    const initialRoster = ch1 ? ch1.playerUnits.map((p) => p.unitId) : [];
    set({
      completedChapters: [],
      unitProgress: {},
      deadUnitIds: [],
      roster: initialRoster,
      deployedUnitIds: [],
      storage: [],
      viewedSupports: [],
      supportPairs: [],
      bonusExp: 0,
      forgeMaterials: [],
      gold: 1000,
      difficulty: difficulty ?? get().difficulty,
      campaignFlags: {},
      currentEnding: null,
    });
    get().startChapter('ch1');
  },

  startChapter: (id: string) => {
    const chapter = CHAPTERS[id];
    if (!chapter) return;
    // Auto-add new chapter units to roster (e.g., Elin joining in ch5)
    const { roster } = get();
    const chapterPlayerIds = chapter.playerUnits.map((p) => p.unitId);
    const newIds = chapterPlayerIds.filter((uid) => !roster.includes(uid) && PLAYER_UNITS[uid]);
    if (newIds.length > 0) {
      set({ roster: [...roster, ...newIds] });
    }
    set({ currentChapterId: id, currentChapterData: chapter });

    if (chapter.prologue) {
      get().startDialogue(chapter.prologue, 'prologue');
    } else if (chapter.skipPreparation) {
      const allPlayerIds = chapter.playerUnits.map((p) => p.unitId);
      get().saveCurrentToSlot(0);
      set({ currentScreen: 'battle', deployedUnitIds: allPlayerIds });
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

  startBattle: () => {
    get().saveCurrentToSlot(0);
    set({ currentScreen: 'battle' });
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
    const { dialogueScene, dialogueLineIndex, dialoguePhase } = get();
    if (!dialogueScene) return;

    if (dialogueLineIndex < dialogueScene.lines.length - 1) {
      set({ dialogueLineIndex: dialogueLineIndex + 1 });
    } else {
      // Last line — transition
      if (dialoguePhase === 'prologue') {
        const chapter = get().currentChapterData;
        if (chapter?.skipPreparation) {
          const allPlayerIds = chapter.playerUnits.map((p) => p.unitId);
          get().saveCurrentToSlot(0);
          set({
            currentScreen: 'battle',
            deployedUnitIds: allPlayerIds,
            dialogueScene: null,
            dialoguePhase: null,
          });
        } else {
          set({ currentScreen: 'preparation', dialogueScene: null, dialoguePhase: null });
        }
      } else if (dialoguePhase === 'epilogue') {
        // Auto-save and show save prompt before advancing
        get().saveToSlot(0);
        const { currentChapterId } = get();
        const nextId = getNextChapterId(currentChapterId, []);
        if (nextId !== currentChapterId && CHAPTERS[nextId]) {
          set({
            dialogueScene: null,
            dialoguePhase: null,
            showSavePrompt: true,
            pendingNextChapterId: nextId,
          });
        } else {
          set({ currentScreen: 'title', dialogueScene: null, dialoguePhase: null });
        }
      }
    }
  },

  onChapterVictory: (
    progress: Record<string, UnitProgress>,
    actualTurns?: number,
    updatedSupportPairs?: SupportPair[],
  ) => {
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

    // Bonus EXP pool for completing under par turns (player allocates in preparation screen)
    let newBonusExp = get().bonusExp;
    if (currentChapterData?.parTurns && actualTurns) {
      const earned = Math.min(300, Math.max(0, (currentChapterData.parTurns - actualTurns) * 50));
      newBonusExp += earned;
    }

    // Meta-stat chapter-end updates: AWR +1, crpLowChapters tracking, LOOP regen at arc transitions
    const arcTransitions = ['ch5', 'ch10', 'ch15', 'ch20'];
    const isArcTransition = arcTransitions.includes(currentChapterId);
    for (const uid of Object.keys(progress)) {
      const p = progress[uid];
      const ms = p.metaStats ?? { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 };
      let newAwr = Math.min(100, ms.awr + 1); // AWR +1 per chapter
      let newLoop = ms.loop;
      if (uid === 'shigeru' && isArcTransition) {
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

    // Gold reward for chapter completion
    const newGold = get().gold + 500;

    // Grief decay: decrement grief counter, remove grief trauma skill when expired
    const griefChaptersKey = 'grief_chapters_remaining';
    const griefRemaining = (get().campaignFlags[griefChaptersKey] as number | undefined) ?? 0;
    if (griefRemaining > 0) {
      const newRemaining = griefRemaining - 1;
      const newFlags = { ...get().campaignFlags, [griefChaptersKey]: newRemaining };
      if (newRemaining <= 0) {
        // Remove grief trauma skill from all units
        for (const uid of Object.keys(progress)) {
          const p = progress[uid];
          const trauma = p.traumaSkills;
          if (trauma && trauma.includes('grief')) {
            progress[uid] = { ...p, traumaSkills: trauma.filter((s: string) => s !== 'grief') };
          }
        }
      }
      set({ campaignFlags: newFlags });
    }

    // Halvar's death is scripted, not a battle casualty: ch8 sets halvar_dead when
    // he falls holding the south corridor, and he leaves the roster for good.
    const halvarDeadFlag = get().campaignFlags.halvar_dead;
    if (halvarDeadFlag && !get().deadUnitIds.includes('halvar')) {
      const updatedDead = [...get().deadUnitIds, 'halvar'];
      set({ deadUnitIds: updatedDead });
      // Remove from newRoster (mutates the local array before it's used below)
      const halvarIdx = newRoster.indexOf('halvar');
      if (halvarIdx !== -1) newRoster.splice(halvarIdx, 1);
      // Set grief: 2 chapters remaining, assign grief trauma to all units
      const griefFlags = { ...get().campaignFlags, grief_chapters_remaining: 2 };
      set({ campaignFlags: griefFlags });
      for (const uid of Object.keys(progress)) {
        const p = progress[uid];
        const trauma = p.traumaSkills ? [...p.traumaSkills] : [];
        if (!trauma.includes('grief')) trauma.push('grief');
        progress[uid] = { ...p, traumaSkills: trauma };
      }
    }

    // Casual mode: restore retreated units at 1 HP for next chapter
    if (get().difficulty === 'casual') {
      for (const uid of Object.keys(progress)) {
        const p = progress[uid];
        if (p.retreated) {
          progress[uid] = { ...p, retreated: false, currentHp: 1 };
        }
      }
    }

    const newState: Partial<CampaignState> = {
      completedChapters: newCompleted,
      unitProgress: progress,
      roster: newRoster,
      bonusExp: newBonusExp,
      gold: newGold,
    };
    if (updatedSupportPairs) {
      newState.supportPairs = updatedSupportPairs;
    }
    set(newState);

    if (currentChapterData?.epilogue) {
      get().startDialogue(currentChapterData.epilogue, 'epilogue');
    } else {
      // No epilogue — auto-save and show save prompt
      get().saveToSlot(0);
      const nextId = getNextChapterId(currentChapterId, []);
      if (nextId !== currentChapterId && CHAPTERS[nextId]) {
        set({ showSavePrompt: true, pendingNextChapterId: nextId });
      } else {
        get().goToTitle();
      }
    }
  },

  saveToSlot: (slot: number) => {
    const { currentChapterId, completedChapters, unitProgress, roster, deadUnitIds } = get();
    const nextChapterId = getNextChapterId(currentChapterId, completedChapters);
    writeSave(slot, {
      version: 7,
      timestamp: Date.now(),
      currentChapterId: nextChapterId,
      completedChapters,
      unitProgress,
      roster,
      deadUnitIds,
      supportPairs: get().supportPairs,
      bonusExp: get().bonusExp,
      forgeMaterials: get().forgeMaterials,
      gold: get().gold,
      difficulty: get().difficulty,
      campaignFlags: get().campaignFlags,
      newGamePlusUnlocked: get().newGamePlusUnlocked,
      endingsSeen: get().endingsSeen,
      storage: get().storage,
      viewedSupports: get().viewedSupports,
    });
  },

  saveCurrentToSlot: (slot: number) => {
    const { currentChapterId, completedChapters, unitProgress, roster, deadUnitIds } = get();
    if (!currentChapterId) return;
    writeSave(slot, {
      version: 7,
      timestamp: Date.now(),
      currentChapterId,
      completedChapters,
      unitProgress,
      roster,
      deadUnitIds,
      supportPairs: get().supportPairs,
      bonusExp: get().bonusExp,
      forgeMaterials: get().forgeMaterials,
      gold: get().gold,
      difficulty: get().difficulty,
      campaignFlags: get().campaignFlags,
      newGamePlusUnlocked: get().newGamePlusUnlocked,
      endingsSeen: get().endingsSeen,
      storage: get().storage,
      viewedSupports: get().viewedSupports,
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
      supportPairs: data.supportPairs ?? [],
      bonusExp: data.bonusExp ?? 0,
      forgeMaterials: data.forgeMaterials ?? [],
      gold: data.gold ?? 1000,
      difficulty: data.difficulty ?? 'classic',
      campaignFlags: data.campaignFlags ?? {},
      newGamePlusUnlocked: data.newGamePlusUnlocked ?? false,
      endingsSeen: data.endingsSeen ?? [],
      storage: data.storage ?? [],
      viewedSupports: data.viewedSupports ?? [],
    });
    get().startChapter(data.currentChapterId);
    return true;
  },

  allocateBonusExp: (unitId: string, amount: number) => {
    const { bonusExp, unitProgress } = get();
    const alloc = Math.min(amount, bonusExp);
    if (alloc <= 0) return;
    const progress = unitProgress[unitId];
    if (!progress) return;
    // Catch-up bonus: +20% if unit is 3+ levels below roster average
    const allLevels = Object.values(unitProgress).map((p) => p.level);
    const avgLevel =
      allLevels.length > 0 ? allLevels.reduce((a, b) => a + b, 0) / allLevels.length : 0;
    const catchUpBonus = progress.level + 3 <= avgLevel ? Math.ceil(alloc * 0.2) : 0;
    const totalAlloc = alloc + catchUpBonus;

    const maxAlloc = Math.min(totalAlloc, 99 - progress.exp);
    if (maxAlloc <= 0) return;

    const newExp = progress.exp + maxAlloc;
    let updatedProgress = { ...progress, exp: newExp };

    // Check for level-up at 100+ EXP
    if (newExp >= 100) {
      const cls = ALL_CLASSES[progress.classId ?? ''];
      if (cls) {
        const rng = new SeededRandom(progress.level * 1000 + newExp);
        const gains = rollLevelUp(cls.growthRates, rng);
        const newStats = applyStatGains(progress.stats, gains);
        updatedProgress = {
          ...updatedProgress,
          exp: newExp - 100,
          level: progress.level + 1,
          stats: newStats,
        };
      }
    }

    set({
      bonusExp: bonusExp - Math.min(alloc, maxAlloc),
      unitProgress: {
        ...unitProgress,
        [unitId]: updatedProgress,
      },
    });
  },

  forgeWeapon: (unitId: string, weaponIndex: number) => {
    const { unitProgress, forgeMaterials, gold } = get();
    const progress = unitProgress[unitId];
    if (!progress) return;
    const weaponId = progress.weaponIds?.[weaponIndex];
    if (!weaponId) return;
    const baseWeapon = WEAPONS[weaponId];
    if (!baseWeapon) return;
    // Reconstruct weapon with current forge level
    const weapon: import('../core/types').Weapon = {
      ...baseWeapon,
      forgeLevel: progress.weaponForgeLevel?.[weaponIndex] ?? 0,
    };
    const goldCost = getForgeGoldCost(weapon);
    if (!canForge(weapon, forgeMaterials, gold)) return;
    const materialId = getRequiredMaterial(weapon);
    if (!materialId) return;
    const matIdx = forgeMaterials.indexOf(materialId);
    if (matIdx < 0) return;
    const forged = applyForge(weapon);
    // Update materials
    const newMaterials = [...forgeMaterials];
    newMaterials.splice(matIdx, 1);
    // Update weapon forge levels in progress
    const newForgeLevels = [...(progress.weaponForgeLevel ?? progress.weaponIds.map(() => 0))];
    newForgeLevels[weaponIndex] = forged.forgeLevel ?? 0;
    set({
      forgeMaterials: newMaterials,
      gold: gold - goldCost,
      unitProgress: {
        ...unitProgress,
        [unitId]: { ...progress, weaponForgeLevel: newForgeLevels },
      },
    });
  },

  deleteSlot: (slot: number) => deleteSave(slot),
  hasAnySave: () => hasAnySave(),
  getSlotSummary: (slot: number) => getSlotSummary(slot),

  dismissSavePrompt: () => {
    const { pendingNextChapterId } = get();
    set({ showSavePrompt: false, pendingNextChapterId: null });
    if (pendingNextChapterId && CHAPTERS[pendingNextChapterId]) {
      get().startChapter(pendingNextChapterId);
    } else {
      set({ currentScreen: 'title' });
    }
  },

  goToCredits: () => {
    const { currentEnding, endingsSeen } = get();
    const newSeen =
      currentEnding && !endingsSeen.includes(currentEnding)
        ? [...endingsSeen, currentEnding]
        : endingsSeen;
    set({ currentScreen: 'credits', endingsSeen: newSeen, newGamePlusUnlocked: true });
  },

  startNewGamePlus: () => {
    // Increment LOOP for Shigeru by 1 in unit progress
    const { unitProgress } = get();
    const renProgress = unitProgress['shigeru'];
    const newProgress = renProgress
      ? {
          ...unitProgress,
          lord: {
            ...renProgress,
            metaStats: {
              ...(renProgress.metaStats ?? { awr: 0, loop: 0, sync: 70, loy: 50, crp: 0, sta: 0 }),
              loop: (renProgress.metaStats?.loop ?? 347) + 1,
            },
          },
        }
      : unitProgress;

    set({ newGamePlusUnlocked: true, unitProgress: newProgress });
    get().startNewGame(get().difficulty);
  },
}));

function getNextChapterId(currentId: string | null, _completed: string[]): string {
  if (!currentId) return CHAPTER_ORDER[0];
  const idx = CHAPTER_ORDER.indexOf(currentId);
  if (idx >= 0 && idx < CHAPTER_ORDER.length - 1) {
    return CHAPTER_ORDER[idx + 1];
  }
  return currentId;
}
