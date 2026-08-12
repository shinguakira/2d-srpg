import { useState, useCallback } from 'react';
import { useT } from '../i18n/useT';
import { useCampaignStore } from '../stores/campaignStore';
import { PLAYER_UNITS } from '../data/units';
import { computeAutoDeploy } from '../core/deployment';
import { WEAPONS } from '../data/weapons';
import { ITEMS } from '../data/items';
import { BattleSprite } from './Combat/BattleSprite';
import { PromotionScreen } from './UI/PromotionScreen';
import { SaveSlotPicker } from './UI/SaveSlotPicker';
import {
  canPromote,
  getPromotionOptions,
  getMatchingPromotionItem,
  applyPromotion,
  calculateSkillSlots,
} from '../core/promotion';
import { canTeach, getTeachingCost } from '../core/teaching';
import {
  canForge,
  getRequiredMaterial,
  previewForge,
  applyForge,
  getForgeGoldCost,
} from '../core/forging';
import { previewBonusExp } from '../core/experience';
import { defaultMetaStats } from '../core/metaStats';
import { SKILLS } from '../data/skills';
import { ALL_CLASSES } from '../data/promotedClasses';
import type { Unit, Weapon, ConsumableItem, SupportConversation } from '../core/types';
import { RANK_SUPPORT_CONVERSATIONS } from '../data/supportConversations';

type Tab = 'units' | 'storage' | 'support' | 'skills' | 'teaching' | 'bonus_exp' | 'forge';

/** Build a minimal Unit-like object from PrepUnit for promotion functions */
function prepToUnit(u: PrepUnit): Unit {
  const weapon = u.weapons[0];
  if (!weapon) throw new Error(`Unit ${u.name} has no weapons equipped`);
  return {
    id: u.id,
    name: u.name,
    classId: u.classId,
    level: u.level,
    exp: u.exp,
    stats: u.stats,
    currentHp: u.stats.hp,
    inventory: u.weapons,
    items: u.items,
    skills: u.skills,
    learnedSkills: u.learnedSkills,
    faction: 'player',
    position: { x: 0, y: 0 },
    equippedWeapon: weapon,
    hasActed: false,
    facing: 'down',
    sprite: '',
    metaStats: defaultMetaStats(u.id),
  } as Unit;
}

type PrepUnit = {
  id: string;
  name: string;
  classId: string;
  level: number;
  exp: number;
  stats: Unit['stats'];
  weapons: Weapon[];
  items: ConsumableItem[];
  skills: string[];
  learnedSkills: string[];
};

export function PreparationScreen() {
  const T = useT();
  const chapterData = useCampaignStore((s) => s.currentChapterData);
  const unitProgress = useCampaignStore((s) => s.unitProgress);
  const startBattle = useCampaignStore((s) => s.startBattle);
  const storage = useCampaignStore((s) => s.storage);
  const viewedSupports = useCampaignStore((s) => s.viewedSupports);
  const roster = useCampaignStore((s) => s.roster);
  const deadUnitIds = useCampaignStore((s) => s.deadUnitIds);
  const gameMode = useCampaignStore((s) => s.gameMode);
  const bonusExp = useCampaignStore((s) => s.bonusExp);
  const allocateBonusExp = useCampaignStore((s) => s.allocateBonusExp);
  const forgeMaterials = useCampaignStore((s) => s.forgeMaterials);
  const forgeWeapon = useCampaignStore((s) => s.forgeWeapon);
  const gold = useCampaignStore((s) => s.gold);
  const campaignSupportPairs = useCampaignStore((s) => s.supportPairs);
  const saveCurrentToSlot = useCampaignStore((s) => s.saveCurrentToSlot);

  const hasDeploymentSlots = !!chapterData?.deploymentSlots;
  const maxDeploy = chapterData?.deploymentSlots ?? 0;
  const forceDeploy = chapterData?.forceDeploy ?? [];

  const [tab, setTab] = useState<Tab>('units');
  const [units, setUnits] = useState<PrepUnit[]>(() => buildUnits());
  const [storageItems, setStorageItems] = useState<string[]>(() => [...storage]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [supportScene, setSupportScene] = useState<SupportConversation | null>(null);
  const [supportLineIdx, setSupportLineIdx] = useState(0);
  const [completedSupports, setCompletedSupports] = useState<string[]>([]);
  const [deployedIds, setDeployedIds] = useState<string[]>(() => {
    if (!hasDeploymentSlots) return [];
    return computeAutoDeploy(forceDeploy, roster, maxDeploy, deadUnitIds, gameMode);
  });
  const [promotingUnit, setPromotingUnit] = useState<PrepUnit | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  function buildPrepUnit(unitId: string): PrepUnit | null {
    const template = PLAYER_UNITS[unitId];
    if (!template) return null;
    const progress = unitProgress[unitId];
    const weapons = progress?.weaponIds?.length
      ? progress.weaponIds.map((wid) => ({ ...WEAPONS[wid] })).filter(Boolean)
      : template.inventory.map((w) => ({ ...w }));
    const items = progress?.itemIds?.length
      ? progress.itemIds.map((iid) => ({ ...ITEMS[iid] })).filter(Boolean)
      : template.items.map((i) => ({ ...i, effect: { ...i.effect } }));
    return {
      id: template.id,
      name: template.name,
      classId: progress?.classId ?? template.classId,
      level: progress?.level ?? template.level,
      exp: progress?.exp ?? template.exp,
      stats: progress ? { ...progress.stats } : { ...template.stats },
      weapons,
      items,
      skills: progress?.skillIds ?? template.skills ?? [],
      learnedSkills: progress?.learnedSkillIds ?? template.learnedSkills ?? [],
    };
  }

  function buildUnits(): PrepUnit[] {
    if (!chapterData) return [];
    if (hasDeploymentSlots && roster.length > 0) {
      // Roster mode: show all alive roster units
      return roster
        .filter((id) => gameMode !== 'classic' || !deadUnitIds.includes(id))
        .map(buildPrepUnit)
        .filter(Boolean) as PrepUnit[];
    }
    // Legacy mode: use chapter playerUnits
    return chapterData.playerUnits
      .map((placement) => buildPrepUnit(placement.unitId))
      .filter(Boolean) as PrepUnit[];
  }

  // Weapon/item transfer: unit → storage
  const sendToStorage = useCallback((unitId: string, weaponIdx: number) => {
    setUnits((prev) => {
      const u = prev.find((u) => u.id === unitId);
      if (!u || u.weapons.length <= 1) return prev; // keep at least 1 weapon
      const weapon = u.weapons[weaponIdx];
      setStorageItems((s) => [...s, weapon.id]);
      return prev.map((u) =>
        u.id === unitId ? { ...u, weapons: u.weapons.filter((_, i) => i !== weaponIdx) } : u,
      );
    });
  }, []);

  // Storage → unit
  const takeFromStorage = useCallback(
    (unitId: string, storageIdx: number) => {
      const itemId = storageItems[storageIdx];
      if (!itemId) return;
      const weapon = WEAPONS[itemId];
      const item = ITEMS[itemId];
      if (weapon) {
        setUnits((prev) =>
          prev.map((u) => (u.id === unitId ? { ...u, weapons: [...u.weapons, { ...weapon }] } : u)),
        );
      } else if (item) {
        setUnits((prev) =>
          prev.map((u) => (u.id === unitId ? { ...u, items: [...u.items, { ...item }] } : u)),
        );
      }
      setStorageItems((s) => s.filter((_, i) => i !== storageIdx));
    },
    [storageItems],
  );

  // Send item to storage
  const sendItemToStorage = useCallback((unitId: string, itemIdx: number) => {
    setUnits((prev) => {
      const u = prev.find((u) => u.id === unitId);
      if (!u) return prev;
      const item = u.items[itemIdx];
      setStorageItems((s) => [...s, item.id]);
      return prev.map((u) =>
        u.id === unitId ? { ...u, items: u.items.filter((_, i) => i !== itemIdx) } : u,
      );
    });
  }, []);

  // Support conversation handling
  const startSupport = useCallback((conv: SupportConversation) => {
    setSupportScene(conv);
    setSupportLineIdx(0);
  }, []);

  const advanceSupport = useCallback(() => {
    if (!supportScene) return;
    if (supportLineIdx < supportScene.lines.length - 1) {
      setSupportLineIdx((i) => i + 1);
    } else {
      // Conversation done — apply reward
      const key = supportScene.rank
        ? `rank:${supportScene.unitA}:${supportScene.unitB}:${supportScene.rank}`
        : `${chapterData?.id}:${supportScene.unitA}:${supportScene.unitB}`;
      setCompletedSupports((prev) => [...prev, key]);

      const reward = supportScene.reward;
      setUnits((prev) =>
        prev.map((u) => {
          if (reward.type === 'exp_both') {
            if (u.id === supportScene!.unitA || u.id === supportScene!.unitB) {
              return { ...u, exp: u.exp + reward.amount };
            }
          } else if (reward.type === 'exp' && u.id === reward.unitId) {
            return { ...u, exp: u.exp + reward.amount };
          } else if (reward.type === 'stat' && u.id === reward.unitId) {
            return {
              ...u,
              stats: {
                ...u.stats,
                [reward.stat]: u.stats[reward.stat as keyof typeof u.stats] + reward.amount,
              },
            };
          }
          return u;
        }),
      );

      setSupportScene(null);
    }
  }, [supportScene, supportLineIdx, chapterData]);

  // Toggle deploy status for a unit
  const toggleDeploy = useCallback(
    (unitId: string) => {
      if (forceDeploy.includes(unitId)) return; // locked
      setDeployedIds((prev) => {
        if (prev.includes(unitId)) {
          return prev.filter((id) => id !== unitId);
        }
        if (prev.length >= maxDeploy) return prev; // at capacity
        return [...prev, unitId];
      });
    },
    [forceDeploy, maxDeploy],
  );

  // Promotion confirm: apply promotion, remove item, update unit
  const handlePromotionConfirm = useCallback(
    (classId: string) => {
      if (!promotingUnit) return;
      setUnits((prev) =>
        prev.map((u) => {
          if (u.id !== promotingUnit.id) return u;
          const unitLike = prepToUnit(u);
          const promoted = applyPromotion(unitLike, classId);
          const itemIdx = getMatchingPromotionItem(unitLike);
          const newItems = itemIdx >= 0 ? u.items.filter((_, i) => i !== itemIdx) : u.items;
          return {
            ...u,
            classId: promoted.classId,
            stats: promoted.stats,
            items: newItems,
            skills: u.skills,
            learnedSkills: u.learnedSkills,
          };
        }),
      );
      setPromotingUnit(null);
    },
    [promotingUnit],
  );

  // Start battle — persist changes to campaign store
  const handleStartBattle = useCallback(() => {
    // Save unit changes back to unitProgress
    const newProgress = { ...unitProgress };
    for (const u of units) {
      newProgress[u.id] = {
        ...unitProgress[u.id],
        level: u.level,
        exp: u.exp,
        stats: { ...u.stats },
        weaponIds: u.weapons.map((w) => w.id),
        itemIds: u.items.map((i) => i.id),
        classId: u.classId,
        skillIds: u.skills,
        learnedSkillIds: u.learnedSkills,
        weaponForgeLevel: u.weapons.map((w) => w.forgeLevel ?? 0),
      };
    }
    const allViewed = [...viewedSupports, ...completedSupports];
    useCampaignStore.setState({
      unitProgress: newProgress,
      storage: storageItems,
      viewedSupports: allViewed,
      deployedUnitIds: hasDeploymentSlots ? deployedIds : [],
    });
    startBattle();
  }, [
    units,
    storageItems,
    unitProgress,
    viewedSupports,
    completedSupports,
    startBattle,
    hasDeploymentSlots,
    deployedIds,
  ]);

  // Save game — persist prep changes then save to selected slot
  const handleSave = useCallback(
    (slot: number) => {
      const newProgress = { ...unitProgress };
      for (const u of units) {
        newProgress[u.id] = {
          ...unitProgress[u.id],
          level: u.level,
          exp: u.exp,
          stats: { ...u.stats },
          weaponIds: u.weapons.map((w) => w.id),
          itemIds: u.items.map((i) => i.id),
          classId: u.classId,
          skillIds: u.skills,
          learnedSkillIds: u.learnedSkills,
          weaponForgeLevel: u.weapons.map((w) => w.forgeLevel ?? 0),
        };
      }
      useCampaignStore.setState({
        unitProgress: newProgress,
        storage: storageItems,
        viewedSupports: [...viewedSupports, ...completedSupports],
      });
      saveCurrentToSlot(slot);
    },
    [units, storageItems, unitProgress, viewedSupports, completedSupports, saveCurrentToSlot],
  );

  if (!chapterData) return null;

  // Support conversation playing
  if (supportScene) {
    const line = supportScene.lines[supportLineIdx];
    const portrait = SPEAKER_PORTRAITS[line.speaker];
    return (
      <div className="dialogue" data-testid="support-dialogue" onClick={advanceSupport}>
        {portrait && (
          <div className="dialogue__portrait" key={line.speaker}>
            <BattleSprite classId={portrait.classId} faction={portrait.faction} />
          </div>
        )}
        <div className="dialogue__panel">
          <div
            className="dialogue__speaker"
            style={{ color: line.speakerFaction === 'player' ? '#60a5fa' : '#fbbf24' }}
          >
            {line.speaker}
          </div>
          <div className="dialogue__text">{T.t(line.text)}</div>
          <div className="dialogue__hint">
            {supportLineIdx + 1} / {supportScene.lines.length} — Click to continue
          </div>
        </div>
      </div>
    );
  }

  const supports = chapterData.supportConversations ?? [];
  const chapterSupports = supports.filter((s) => {
    const key = `${chapterData.id}:${s.unitA}:${s.unitB}`;
    return !viewedSupports.includes(key) && !completedSupports.includes(key);
  });

  // Rank-based support conversations: unlocked by reaching support rank
  const rankSupports = RANK_SUPPORT_CONVERSATIONS.filter((conv) => {
    if (!conv.rank) return false;
    const key = `rank:${conv.unitA}:${conv.unitB}:${conv.rank}`;
    if (viewedSupports.includes(key) || completedSupports.includes(key)) return false;
    // Check if both units are in roster
    if (!units.some((u) => u.id === conv.unitA) || !units.some((u) => u.id === conv.unitB))
      return false;
    // Check if pair has reached the required rank
    const pair = campaignSupportPairs.find(
      (p) =>
        (p.unitA === conv.unitA && p.unitB === conv.unitB) ||
        (p.unitA === conv.unitB && p.unitB === conv.unitA),
    );
    if (!pair?.rank) return false;
    const rankOrder = ['C', 'B', 'A', 'S'];
    return rankOrder.indexOf(pair.rank) >= rankOrder.indexOf(conv.rank);
  });

  const availableSupports = [...chapterSupports, ...rankSupports];

  return (
    <div className="prep-screen" data-testid="preparation-screen">
      <div className="prep-screen__header">
        <h1 className="prep-screen__title">{chapterData.name}</h1>
        <div className="prep-screen__objective">Objective: {chapterData.objective.description}</div>
      </div>

      {/* Tabs */}
      <div className="prep-screen__tabs">
        <button
          className={`prep-screen__tab ${tab === 'units' ? 'prep-screen__tab--active' : ''}`}
          onClick={() => setTab('units')}
        >
          {T.ui('prep.units', 'Units')}
        </button>
        <button
          className={`prep-screen__tab ${tab === 'storage' ? 'prep-screen__tab--active' : ''}`}
          onClick={() => setTab('storage')}
        >
          Storage ({storageItems.length})
        </button>
        <button
          className={`prep-screen__tab ${tab === 'support' ? 'prep-screen__tab--active' : ''}`}
          onClick={() => setTab('support')}
        >
          Support{' '}
          {availableSupports.length > 0 && (
            <span className="prep-screen__tab-badge">{availableSupports.length}</span>
          )}
        </button>
        <button
          className={`prep-screen__tab ${tab === 'skills' ? 'prep-screen__tab--active' : ''}`}
          data-testid="skill-tab"
          onClick={() => setTab('skills')}
        >
          {T.ui('prep.skills', 'Skills')}
        </button>
        {roster.includes('shigeru') && (
          <button
            className={`prep-screen__tab ${tab === 'teaching' ? 'prep-screen__tab--active' : ''}`}
            data-testid="teaching-tab"
            onClick={() => setTab('teaching')}
          >
            {T.ui('prep.teaching', 'Teaching')}
          </button>
        )}
        {bonusExp > 0 && (
          <button
            className={`prep-screen__tab ${tab === 'bonus_exp' ? 'prep-screen__tab--active' : ''}`}
            data-testid="bonus-exp-tab"
            onClick={() => setTab('bonus_exp')}
          >
            Bonus EXP ({bonusExp})
          </button>
        )}
        {forgeMaterials.length > 0 && (
          <button
            className={`prep-screen__tab ${tab === 'forge' ? 'prep-screen__tab--active' : ''}`}
            data-testid="forge-tab"
            onClick={() => setTab('forge')}
          >
            Forge ({forgeMaterials.length})
          </button>
        )}
      </div>

      {hasDeploymentSlots && (
        <div className="prep-screen__deploy-counter" data-testid="deploy-counter">
          {deployedIds.length}/{maxDeploy} deployed
        </div>
      )}

      <div className="prep-screen__content">
        {tab === 'units' && (
          <div className="prep-screen__unit-list">
            {units.map((unit) => {
              const isDeployed = deployedIds.includes(unit.id);
              const isForced = forceDeploy.includes(unit.id);
              const isDead = deadUnitIds.includes(unit.id);
              return (
                <div
                  key={unit.id}
                  className={`prep-screen__unit-card ${selectedUnit === unit.id ? 'prep-screen__unit-card--selected' : ''}${isDead ? ' prep-screen__unit-card--dead' : ''}${hasDeploymentSlots && isDeployed ? ' prep-screen__unit-card--deployed' : ''}`}
                  onClick={() =>
                    !isDead && setSelectedUnit(selectedUnit === unit.id ? null : unit.id)
                  }
                >
                  {hasDeploymentSlots && !isDead && (
                    <button
                      className={`prep-screen__deploy-toggle ${isDeployed ? 'prep-screen__deploy-toggle--active' : ''} ${isForced ? 'prep-screen__deploy-toggle--locked' : ''}`}
                      data-testid={`deploy-toggle-${unit.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDeploy(unit.id);
                      }}
                      disabled={isForced}
                    >
                      {isForced ? 'Required' : isDeployed ? 'Deploy' : 'Bench'}
                    </button>
                  )}
                  {isDead && (
                    <div className="prep-screen__dead-label">{T.ui('prep.fallen', 'Fallen')}</div>
                  )}
                  {!isDead &&
                    (() => {
                      const unitLike = prepToUnit(unit);
                      const eligible =
                        canPromote(unitLike) && getMatchingPromotionItem(unitLike) >= 0;
                      if (!eligible) return null;
                      return (
                        <button
                          className="prep-screen__promote-btn"
                          data-testid={`promote-btn-${unit.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setPromotingUnit(unit);
                          }}
                        >
                          {T.ui('prep.promote', 'Promote')}
                        </button>
                      );
                    })()}
                  <div className="prep-screen__unit-sprite">
                    <BattleSprite classId={unit.classId} faction="player" />
                  </div>
                  <div className="prep-screen__unit-info">
                    <div className="prep-screen__unit-name">{unit.name}</div>
                    <div className="prep-screen__unit-class">
                      Lv.{unit.level} {unit.classId.charAt(0).toUpperCase() + unit.classId.slice(1)}
                    </div>
                    <div className="prep-screen__unit-stats">
                      <span>HP {unit.stats.hp}</span>
                      <span>STR {unit.stats.str}</span>
                      <span>MAG {unit.stats.mag}</span>
                      <span>SPD {unit.stats.spd}</span>
                      <span>DEF {unit.stats.def}</span>
                    </div>
                    {/* Weapons */}
                    <div className="prep-screen__inventory">
                      {unit.weapons.map((w, i) => (
                        <div key={i} className="prep-screen__inv-item">
                          <span className="prep-screen__inv-name">{w.name}</span>
                          {selectedUnit === unit.id && unit.weapons.length > 1 && (
                            <button
                              className="prep-screen__inv-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendToStorage(unit.id, i);
                              }}
                            >
                              → Storage
                            </button>
                          )}
                        </div>
                      ))}
                      {unit.items.map((item, i) => (
                        <div
                          key={`item-${i}`}
                          className="prep-screen__inv-item prep-screen__inv-item--consumable"
                        >
                          <span className="prep-screen__inv-name">
                            {item.name} ({item.uses}/{item.maxUses})
                          </span>
                          {selectedUnit === unit.id && (
                            <button
                              className="prep-screen__inv-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendItemToStorage(unit.id, i);
                              }}
                            >
                              → Storage
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'storage' && (
          <div className="prep-screen__storage">
            {storageItems.length === 0 ? (
              <div className="prep-screen__empty">
                Storage is empty. Send weapons from units here.
              </div>
            ) : (
              <div className="prep-screen__storage-list">
                {storageItems.map((itemId, idx) => {
                  const weapon = WEAPONS[itemId];
                  const item = ITEMS[itemId];
                  const name = weapon?.name ?? item?.name ?? itemId;
                  return (
                    <div key={idx} className="prep-screen__storage-item">
                      <span className="prep-screen__storage-name">{name}</span>
                      <div className="prep-screen__storage-give">
                        {units.map((u) => (
                          <button
                            key={u.id}
                            className="prep-screen__inv-btn"
                            onClick={() => takeFromStorage(u.id, idx)}
                          >
                            → {u.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'support' && (
          <div className="prep-screen__support">
            {availableSupports.length === 0 ? (
              <div className="prep-screen__empty">
                {T.ui('prep.noSupports', 'No support conversations available.')}
              </div>
            ) : (
              <div className="prep-screen__support-list">
                {availableSupports.map((conv, idx) => {
                  const unitA = units.find((u) => u.id === conv.unitA);
                  const unitB = units.find((u) => u.id === conv.unitB);
                  if (!unitA || !unitB) return null;
                  const rewardText = getRewardText(conv);
                  return (
                    <div
                      key={idx}
                      className="prep-screen__support-card"
                      onClick={() => startSupport(conv)}
                    >
                      <div className="prep-screen__support-pair">
                        <div className="prep-screen__support-unit">
                          <BattleSprite classId={unitA.classId} faction="player" />
                          <span>{unitA.name}</span>
                        </div>
                        <span className="prep-screen__support-x">×</span>
                        <div className="prep-screen__support-unit">
                          <BattleSprite classId={unitB.classId} faction="player" />
                          <span>{unitB.name}</span>
                        </div>
                      </div>
                      <div className="prep-screen__support-reward">{rewardText}</div>
                    </div>
                  );
                })}
              </div>
            )}
            {completedSupports.length > 0 && (
              <div className="prep-screen__support-done">
                {completedSupports.length} conversation{completedSupports.length > 1 ? 's' : ''}{' '}
                completed this chapter
              </div>
            )}
          </div>
        )}

        {tab === 'skills' && (
          <div className="prep-screen__skills-tab">
            {units.map((unit) => {
              const maxSlots = calculateSkillSlots(unit.level);
              const cls = ALL_CLASSES[unit.classId];
              const innateSkills = cls?.innateSkills ?? [];
              return (
                <div
                  key={unit.id}
                  className="prep-screen__skill-unit"
                  data-testid={`skill-unit-${unit.id}`}
                >
                  <div className="prep-screen__skill-unit-header">
                    <BattleSprite classId={unit.classId} faction="player" />
                    <span className="prep-screen__skill-unit-name">{unit.name}</span>
                    <span
                      className="prep-screen__skill-slot-count"
                      data-testid={`skill-slot-count-${unit.id}`}
                    >
                      {unit.skills.length}/{maxSlots} slots
                    </span>
                  </div>

                  {/* Innate class skills */}
                  {innateSkills.length > 0 && (
                    <div className="prep-screen__skill-section">
                      {innateSkills.map((sid) => {
                        const skill = SKILLS[sid];
                        if (!skill) return null;
                        return (
                          <span
                            key={sid}
                            className="prep-screen__skill-card prep-screen__skill-card--innate"
                          >
                            {skill.name}{' '}
                            <span className="prep-screen__skill-innate-label">
                              {T.ui('prep.innate', 'Innate')}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Equipped skills (click to unequip) */}
                  {unit.skills.length > 0 && (
                    <div className="prep-screen__skill-section">
                      {unit.skills.map((sid) => {
                        const skill = SKILLS[sid];
                        if (!skill) return null;
                        return (
                          <button
                            key={sid}
                            className="prep-screen__skill-card prep-screen__skill-card--equipped"
                            data-testid={`skill-unequip-${sid}`}
                            onClick={() => {
                              setUnits((prev) =>
                                prev.map((u) =>
                                  u.id === unit.id
                                    ? { ...u, skills: u.skills.filter((s) => s !== sid) }
                                    : u,
                                ),
                              );
                            }}
                          >
                            {skill.name} ✕
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Learned skills not yet equipped (click to equip) */}
                  {unit.learnedSkills.filter((s) => !unit.skills.includes(s)).length > 0 && (
                    <div className="prep-screen__skill-section">
                      {unit.learnedSkills
                        .filter((s) => !unit.skills.includes(s))
                        .map((sid) => {
                          const skill = SKILLS[sid];
                          if (!skill) return null;
                          const atCapacity = unit.skills.length >= maxSlots;
                          return (
                            <button
                              key={sid}
                              className={`prep-screen__skill-card ${atCapacity ? 'prep-screen__skill-card--disabled' : ''}`}
                              data-testid={`skill-equip-${sid}`}
                              disabled={atCapacity}
                              onClick={() => {
                                if (atCapacity) return;
                                setUnits((prev) =>
                                  prev.map((u) =>
                                    u.id === unit.id ? { ...u, skills: [...u.skills, sid] } : u,
                                  ),
                                );
                              }}
                            >
                              + {skill.name}
                            </button>
                          );
                        })}
                    </div>
                  )}

                  {unit.learnedSkills.length === 0 &&
                    innateSkills.length === 0 &&
                    unit.skills.length === 0 && (
                      <div className="prep-screen__skill-empty">
                        {T.ui('prep.noSkills', 'No skills learned')}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'forge' && (
          <div className="prep-screen__forge" data-testid="forge-panel">
            <div className="prep-screen__forge-header">
              <div className="prep-screen__forge-materials">
                Materials:{' '}
                {forgeMaterials.map((m, i) => (
                  <span key={i} className="prep-screen__forge-mat">
                    {m === 'adamant_ore' ? 'Adamant Ore' : m === 'mithril' ? 'Mithril' : m}
                  </span>
                ))}
              </div>
              <div className="prep-screen__forge-gold" data-testid="forge-gold">
                Gold: <strong>{gold}</strong>G
              </div>
            </div>
            <div className="prep-screen__unit-list">
              {units
                .filter((u) => !deadUnitIds.includes(u.id))
                .map((unit) => (
                  <div key={unit.id} className="prep-screen__forge-unit">
                    <div className="prep-screen__forge-unit-header">
                      <BattleSprite classId={unit.classId} faction="player" />
                      <span className="prep-screen__forge-unit-name">{unit.name}</span>
                    </div>
                    <div className="prep-screen__forge-weapons">
                      {unit.weapons.map((w, wi) => {
                        const forgeLevel = w.forgeLevel ?? 0;
                        const forgeable = canForge(w, forgeMaterials, gold);
                        const preview = previewForge(w);
                        const matNeeded = getRequiredMaterial(w);
                        const goldCost = getForgeGoldCost(w);
                        return (
                          <div key={wi} className="prep-screen__forge-weapon">
                            <span className="prep-screen__forge-weapon-name">
                              {w.name} {'★'.repeat(forgeLevel)}
                              {'☆'.repeat(3 - forgeLevel)}
                            </span>
                            <span className="prep-screen__forge-weapon-stats">
                              Mt {w.might} Hit {w.hit}
                              {preview && (
                                <span className="prep-screen__forge-preview">
                                  {' '}
                                  → Mt {preview.might} Hit {preview.hit}
                                </span>
                              )}
                            </span>
                            {matNeeded && (
                              <span className="prep-screen__forge-cost">
                                {matNeeded === 'adamant_ore' ? 'Adamant' : 'Mithril'} + {goldCost}G
                              </span>
                            )}
                            <button
                              className="prep-screen__forge-btn"
                              data-testid={`forge-${unit.id}-${wi}`}
                              disabled={!forgeable}
                              onClick={() => {
                                forgeWeapon(unit.id, wi);
                                // Update local state using applyForge to stay in sync
                                setUnits((prev) =>
                                  prev.map((u) => {
                                    if (u.id !== unit.id) return u;
                                    const newWeapons = [...u.weapons];
                                    newWeapons[wi] = applyForge(newWeapons[wi]);
                                    return { ...u, weapons: newWeapons };
                                  }),
                                );
                              }}
                            >
                              {T.ui('prep.forge', 'Forge')}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {tab === 'bonus_exp' && (
          <div className="prep-screen__bonus-exp" data-testid="bonus-exp-panel">
            <div className="prep-screen__bonus-pool">
              Available: <strong>{bonusExp}</strong> EXP
            </div>
            <div className="prep-screen__unit-list">
              {units
                .filter((u) => !deadUnitIds.includes(u.id))
                .map((unit) => {
                  const canGain = unit.exp < 99;
                  const cls = ALL_CLASSES[unit.classId];
                  const preview =
                    cls && bonusExp >= 10
                      ? previewBonusExp(
                          unit.exp,
                          Math.min(10, 99 - unit.exp),
                          unit.level,
                          cls.growthRates,
                        )
                      : null;
                  return (
                    <div key={unit.id} className="prep-screen__bonus-unit">
                      <div className="prep-screen__bonus-unit-info">
                        <BattleSprite classId={unit.classId} faction="player" />
                        <span className="prep-screen__bonus-unit-name">{unit.name}</span>
                        <span className="prep-screen__bonus-unit-level">Lv.{unit.level}</span>
                        <span className="prep-screen__bonus-unit-exp">EXP: {unit.exp}/99</span>
                      </div>
                      <div className="prep-screen__bonus-actions">
                        {preview?.wouldLevel && preview.projectedGains && (
                          <span
                            className="prep-screen__bonus-levelup-preview"
                            data-testid={`bonus-preview-${unit.id}`}
                          >
                            Level Up!{' '}
                            {Object.entries(preview.projectedGains)
                              .filter(([, v]) => v > 0)
                              .map(([k, v]) => `${k.toUpperCase()} +${v}`)
                              .join(', ')}
                          </span>
                        )}
                        <button
                          className="prep-screen__bonus-btn"
                          data-testid={`bonus-add-${unit.id}`}
                          disabled={!canGain || bonusExp < 10}
                          onClick={() => {
                            const actual = Math.min(10, bonusExp, 99 - unit.exp);
                            if (actual <= 0) return;
                            allocateBonusExp(unit.id, 10);
                            setUnits((prev) =>
                              prev.map((u) =>
                                u.id === unit.id ? { ...u, exp: u.exp + actual } : u,
                              ),
                            );
                          }}
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {tab === 'teaching' &&
          (() => {
            const lord = units.find((u) => u.id === 'shigeru');
            if (!lord)
              return (
                <div className="prep-screen__empty">
                  {T.ui('prep.lordMissing', 'Shigeru is not in your roster.')}
                </div>
              );

            // All skills Shigeru knows (equipped + learned)
            const lordSkills = [...new Set([...lord.skills, ...lord.learnedSkills])];
            const otherUnits = units.filter((u) => u.id !== 'shigeru');

            return (
              <div className="prep-screen__skills-tab">
                <div className="prep-screen__skill-unit">
                  <div className="prep-screen__skill-unit-header">
                    <BattleSprite classId={lord.classId} faction="player" />
                    <span className="prep-screen__skill-unit-name">
                      Shigeru&apos;s Teachable Skills
                    </span>
                  </div>
                  {lordSkills.length === 0 ? (
                    <div className="prep-screen__skill-empty">
                      {T.ui('prep.lordNoSkills', 'Shigeru has no skills to teach')}
                    </div>
                  ) : (
                    <div className="prep-screen__skill-section">
                      {lordSkills.map((sid) => {
                        const skill = SKILLS[sid];
                        if (!skill) return null;
                        const cost = getTeachingCost(sid);
                        return (
                          <span
                            key={sid}
                            className="prep-screen__skill-card prep-screen__skill-card--equipped"
                          >
                            {skill.name}{' '}
                            <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>
                              ({cost.loop} EMB)
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {otherUnits.map((student) => {
                  const teachable = lordSkills.filter((sid) => {
                    const studentUnit = prepToUnit(student);
                    const renUnit = prepToUnit(lord);
                    return canTeach(renUnit, studentUnit, sid).eligible;
                  });
                  // Check why teaching is blocked (show message)
                  const anyBlocked = lordSkills.some((sid) => {
                    const renUnit = prepToUnit(lord);
                    const studentUnit = prepToUnit(student);
                    const result = canTeach(renUnit, studentUnit, sid);
                    return !result.eligible && result.reason?.includes('Emberlight');
                  });

                  return (
                    <div
                      key={student.id}
                      className="prep-screen__skill-unit"
                      data-testid={`teach-student-${student.id}`}
                    >
                      <div className="prep-screen__skill-unit-header">
                        <BattleSprite classId={student.classId} faction="player" />
                        <span className="prep-screen__skill-unit-name">{student.name}</span>
                      </div>
                      {teachable.length > 0 ? (
                        <div className="prep-screen__skill-section">
                          {teachable.map((sid) => {
                            const skill = SKILLS[sid];
                            if (!skill) return null;
                            return (
                              <button
                                key={sid}
                                className="prep-screen__skill-card"
                                data-testid={`teach-skill-${sid}`}
                                disabled
                              >
                                + {skill.name}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="prep-screen__skill-empty">
                          {anyBlocked
                            ? 'Teaching requires Emberlight (available in later chapters)'
                            : 'No new skills to teach'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
      </div>

      <div className="prep-screen__actions">
        <button
          className="prep-screen__save-btn"
          data-testid="prep-save-game"
          onClick={() => setShowSaveModal(true)}
        >
          {T.ui('prep.saveGame', 'Save Game')}
        </button>
        <button
          className="prep-screen__start-btn"
          data-testid="prep-start-battle"
          onClick={handleStartBattle}
          disabled={hasDeploymentSlots && deployedIds.length === 0}
        >
          Start Battle{hasDeploymentSlots ? ` (${deployedIds.length}/${maxDeploy})` : ''}
        </button>
      </div>

      {promotingUnit && (
        <PromotionScreen
          unitName={promotingUnit.name}
          options={getPromotionOptions(prepToUnit(promotingUnit))}
          onConfirm={handlePromotionConfirm}
          onCancel={() => setPromotingUnit(null)}
        />
      )}

      {showSaveModal && (
        <SaveSlotPicker
          onSave={handleSave}
          onCancel={() => setShowSaveModal(false)}
          title="Save Game"
        />
      )}
    </div>
  );
}

function getRewardText(conv: SupportConversation): string {
  const r = conv.reward;
  if (r.type === 'exp_both') return `+${r.amount} EXP (both)`;
  if (r.type === 'exp') return `+${r.amount} EXP`;
  if (r.type === 'stat') return `+${r.amount} ${r.stat.toUpperCase()}`;
  return '';
}

const SPEAKER_PORTRAITS: Record<string, { classId: string; faction: 'player' | 'enemy' }> = {
  Shigeru: { classId: 'lord', faction: 'player' },
  Akira: { classId: 'cavalier', faction: 'player' },
  Lisette: { classId: 'mage', faction: 'player' },
  Mirelle: { classId: 'cleric', faction: 'player' },
  Gareth: { classId: 'fighter', faction: 'player' },
  Halvar: { classId: 'soldier', faction: 'player' },
  Bryn: { classId: 'archer', faction: 'player' },
  Fenn: { classId: 'thief', faction: 'player' },
};
