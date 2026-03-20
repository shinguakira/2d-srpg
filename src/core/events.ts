import type {
  ChapterEvent,
  EventTrigger,
  EventEffect,
  DialogueScene,
  Unit,
  Position,
  Faction,
  GamePhase,
  AIBehavior,
  TerrainType,
} from './types';

// ===== Event Context =====

export type EventContext = {
  readonly currentTurn: number;
  readonly currentPhase: GamePhase;
  readonly units: Map<string, Unit>;
  readonly flags: Map<string, string>;
  readonly lastMovedUnitId?: string;
  readonly lastMovedPosition?: Position;
  readonly lastKilledUnitId?: string;
  readonly justStartedPhase?: Faction;
};

// ===== Effect Result =====

export type EffectResult = {
  unitsToSpawn: { unitId: string; position: Position; faction: Faction }[];
  unitsToRemove: string[];
  unitsToRecruit: string[];
  aiChanges: { unitId: string; behavior: AIBehavior }[];
  terrainChanges: { position: Position; terrain: TerrainType }[];
  flagChanges: { key: string; value: string }[];
  dialogueToShow: DialogueScene | null;
};

function emptyResult(): EffectResult {
  return {
    unitsToSpawn: [],
    unitsToRemove: [],
    unitsToRecruit: [],
    aiChanges: [],
    terrainChanges: [],
    flagChanges: [],
    dialogueToShow: null,
  };
}

// ===== Trigger Matching =====

export function matchesTrigger(trigger: EventTrigger, ctx: EventContext): boolean {
  switch (trigger.type) {
    case 'turn_start':
      return ctx.justStartedPhase === 'player' && ctx.currentTurn === trigger.turn;
    case 'turn_end':
      return ctx.justStartedPhase === 'enemy' && ctx.currentTurn === trigger.turn;
    case 'phase_start':
      return ctx.justStartedPhase === trigger.faction;
    case 'unit_at': {
      const unit = ctx.units.get(trigger.unitId);
      if (!unit) return false;
      return unit.position.x === trigger.position.x && unit.position.y === trigger.position.y;
    }
    case 'unit_killed':
      return ctx.lastKilledUnitId === trigger.unitId;
    case 'unit_hp_below': {
      const unit = ctx.units.get(trigger.unitId);
      if (!unit) return false;
      return (unit.currentHp / unit.stats.hp) * 100 < trigger.percent;
    }
    case 'tile_visited':
      if (!ctx.lastMovedPosition) return false;
      return ctx.lastMovedPosition.x === trigger.position.x && ctx.lastMovedPosition.y === trigger.position.y;
    default:
      return false;
  }
}

// ===== Event Evaluation =====

/**
 * Returns events that should fire given current context.
 * Skips events that have already fired (if `once` is true).
 */
export function evaluateEvents(
  events: ChapterEvent[],
  firedEventIds: Set<string>,
  ctx: EventContext,
): ChapterEvent[] {
  const result: ChapterEvent[] = [];
  for (const event of events) {
    if (event.once && firedEventIds.has(event.id)) continue;
    if (matchesTrigger(event.trigger, ctx)) {
      result.push(event);
    }
  }
  return result;
}

// ===== Effect Resolution =====

/**
 * Resolves a list of effects into a declarative EffectResult.
 * If a `show_dialogue` effect is found, it goes into `dialogueToShow`.
 * If multiple dialogues exist (via chain), only the first is returned —
 * the caller should re-resolve remaining effects after dialogue dismiss.
 */
export function resolveEffects(effects: EventEffect[]): EffectResult {
  const result = emptyResult();

  for (const effect of effects) {
    switch (effect.type) {
      case 'show_dialogue':
        if (!result.dialogueToShow) {
          result.dialogueToShow = effect.scene;
        }
        // If dialogue already set, it gets queued by the store layer
        break;
      case 'spawn_units':
        for (const u of effect.units) {
          result.unitsToSpawn.push({ unitId: u.unitId, position: u.position, faction: effect.faction });
        }
        break;
      case 'recruit_unit':
        result.unitsToRecruit.push(effect.unitId);
        break;
      case 'change_ai':
        result.aiChanges.push({ unitId: effect.unitId, behavior: effect.newBehavior });
        break;
      case 'remove_unit':
        result.unitsToRemove.push(effect.unitId);
        break;
      case 'change_terrain':
        result.terrainChanges.push({ position: effect.position, terrain: effect.terrain });
        break;
      case 'set_flag':
        result.flagChanges.push({ key: effect.key, value: effect.value });
        break;
      case 'chain':
        mergeResult(result, resolveEffects(effect.effects));
        break;
    }
  }

  return result;
}

function mergeResult(target: EffectResult, source: EffectResult): void {
  target.unitsToSpawn.push(...source.unitsToSpawn);
  target.unitsToRemove.push(...source.unitsToRemove);
  target.unitsToRecruit.push(...source.unitsToRecruit);
  target.aiChanges.push(...source.aiChanges);
  target.terrainChanges.push(...source.terrainChanges);
  target.flagChanges.push(...source.flagChanges);
  if (!target.dialogueToShow && source.dialogueToShow) {
    target.dialogueToShow = source.dialogueToShow;
  }
}
