import { useState, useCallback } from 'react';
import { useCampaignStore } from '../stores/campaignStore';
import { PLAYER_UNITS } from '../data/units';
import { WEAPONS } from '../data/weapons';
import { ITEMS } from '../data/items';
import { BattleSprite } from './Combat/BattleSprite';
import type { Unit, Weapon, ConsumableItem, SupportConversation } from '../core/types';

type Tab = 'units' | 'storage' | 'support';

type PrepUnit = {
  id: string;
  name: string;
  classId: string;
  level: number;
  exp: number;
  stats: Unit['stats'];
  weapons: Weapon[];
  items: ConsumableItem[];
};

export function PreparationScreen() {
  const chapterData = useCampaignStore((s) => s.currentChapterData);
  const unitProgress = useCampaignStore((s) => s.unitProgress);
  const startBattle = useCampaignStore((s) => s.startBattle);
  const storage = useCampaignStore((s) => s.storage);
  const viewedSupports = useCampaignStore((s) => s.viewedSupports);

  const [tab, setTab] = useState<Tab>('units');
  const [units, setUnits] = useState<PrepUnit[]>(() => buildUnits());
  const [storageItems, setStorageItems] = useState<string[]>(() => [...storage]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [supportScene, setSupportScene] = useState<SupportConversation | null>(null);
  const [supportLineIdx, setSupportLineIdx] = useState(0);
  const [completedSupports, setCompletedSupports] = useState<string[]>([]);

  function buildUnits(): PrepUnit[] {
    if (!chapterData) return [];
    return chapterData.playerUnits.map((placement) => {
      const template = PLAYER_UNITS[placement.unitId];
      if (!template) return null;
      const progress = unitProgress[placement.unitId];
      const weapons = progress?.weaponIds?.length
        ? progress.weaponIds.map((wid) => ({ ...WEAPONS[wid] })).filter(Boolean)
        : template.inventory.map((w) => ({ ...w }));
      const items = progress?.itemIds?.length
        ? progress.itemIds.map((iid) => ({ ...ITEMS[iid] })).filter(Boolean)
        : template.items.map((i) => ({ ...i, effect: { ...i.effect } }));
      return {
        id: template.id,
        name: template.name,
        classId: template.classId,
        level: progress?.level ?? template.level,
        exp: progress?.exp ?? template.exp,
        stats: progress ? { ...progress.stats } : { ...template.stats },
        weapons,
        items,
      };
    }).filter(Boolean) as PrepUnit[];
  }

  // Weapon/item transfer: unit → storage
  const sendToStorage = useCallback((unitId: string, weaponIdx: number) => {
    setUnits((prev) => {
      const u = prev.find((u) => u.id === unitId);
      if (!u || u.weapons.length <= 1) return prev; // keep at least 1 weapon
      const weapon = u.weapons[weaponIdx];
      setStorageItems((s) => [...s, weapon.id]);
      return prev.map((u) =>
        u.id === unitId
          ? { ...u, weapons: u.weapons.filter((_, i) => i !== weaponIdx) }
          : u
      );
    });
  }, []);

  // Storage → unit
  const takeFromStorage = useCallback((unitId: string, storageIdx: number) => {
    const itemId = storageItems[storageIdx];
    if (!itemId) return;
    const weapon = WEAPONS[itemId];
    const item = ITEMS[itemId];
    if (weapon) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId ? { ...u, weapons: [...u.weapons, { ...weapon }] } : u
        )
      );
    } else if (item) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId ? { ...u, items: [...u.items, { ...item }] } : u
        )
      );
    }
    setStorageItems((s) => s.filter((_, i) => i !== storageIdx));
  }, [storageItems]);

  // Send item to storage
  const sendItemToStorage = useCallback((unitId: string, itemIdx: number) => {
    setUnits((prev) => {
      const u = prev.find((u) => u.id === unitId);
      if (!u) return prev;
      const item = u.items[itemIdx];
      setStorageItems((s) => [...s, item.id]);
      return prev.map((u) =>
        u.id === unitId
          ? { ...u, items: u.items.filter((_, i) => i !== itemIdx) }
          : u
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
      const key = `${chapterData?.id}:${supportScene.unitA}:${supportScene.unitB}`;
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
            return { ...u, stats: { ...u.stats, [reward.stat]: u.stats[reward.stat as keyof typeof u.stats] + reward.amount } };
          }
          return u;
        })
      );

      setSupportScene(null);
    }
  }, [supportScene, supportLineIdx, chapterData]);

  // Start battle — persist changes to campaign store
  const handleStartBattle = useCallback(() => {
    // Save unit changes back to unitProgress
    const newProgress = { ...unitProgress };
    for (const u of units) {
      newProgress[u.id] = {
        level: u.level,
        exp: u.exp,
        stats: { ...u.stats },
        weaponIds: u.weapons.map((w) => w.id),
        itemIds: u.items.map((i) => i.id),
      };
    }
    const allViewed = [...viewedSupports, ...completedSupports];
    useCampaignStore.setState({
      unitProgress: newProgress,
      storage: storageItems,
      viewedSupports: allViewed,
    });
    startBattle();
  }, [units, storageItems, unitProgress, viewedSupports, completedSupports, startBattle]);

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
          <div className="dialogue__speaker" style={{ color: line.speakerFaction === 'player' ? '#60a5fa' : '#fbbf24' }}>
            {line.speaker}
          </div>
          <div className="dialogue__text">{line.text}</div>
          <div className="dialogue__hint">
            {supportLineIdx + 1} / {supportScene.lines.length} — Click to continue
          </div>
        </div>
      </div>
    );
  }

  const supports = chapterData.supportConversations ?? [];
  const availableSupports = supports.filter((s) => {
    const key = `${chapterData.id}:${s.unitA}:${s.unitB}`;
    return !viewedSupports.includes(key) && !completedSupports.includes(key);
  });

  return (
    <div className="prep-screen" data-testid="preparation-screen">
      <div className="prep-screen__header">
        <h1 className="prep-screen__title">{chapterData.name}</h1>
        <div className="prep-screen__objective">
          Objective: {chapterData.objective.description}
        </div>
      </div>

      {/* Tabs */}
      <div className="prep-screen__tabs">
        <button className={`prep-screen__tab ${tab === 'units' ? 'prep-screen__tab--active' : ''}`} onClick={() => setTab('units')}>
          Units
        </button>
        <button className={`prep-screen__tab ${tab === 'storage' ? 'prep-screen__tab--active' : ''}`} onClick={() => setTab('storage')}>
          Storage ({storageItems.length})
        </button>
        <button className={`prep-screen__tab ${tab === 'support' ? 'prep-screen__tab--active' : ''}`} onClick={() => setTab('support')}>
          Support {availableSupports.length > 0 && <span className="prep-screen__tab-badge">{availableSupports.length}</span>}
        </button>
      </div>

      <div className="prep-screen__content">
        {tab === 'units' && (
          <div className="prep-screen__unit-list">
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`prep-screen__unit-card ${selectedUnit === unit.id ? 'prep-screen__unit-card--selected' : ''}`}
                onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
              >
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
                          <button className="prep-screen__inv-btn" onClick={(e) => { e.stopPropagation(); sendToStorage(unit.id, i); }}>
                            → Storage
                          </button>
                        )}
                      </div>
                    ))}
                    {unit.items.map((item, i) => (
                      <div key={`item-${i}`} className="prep-screen__inv-item prep-screen__inv-item--consumable">
                        <span className="prep-screen__inv-name">{item.name} ({item.uses}/{item.maxUses})</span>
                        {selectedUnit === unit.id && (
                          <button className="prep-screen__inv-btn" onClick={(e) => { e.stopPropagation(); sendItemToStorage(unit.id, i); }}>
                            → Storage
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'storage' && (
          <div className="prep-screen__storage">
            {storageItems.length === 0 ? (
              <div className="prep-screen__empty">Storage is empty. Send weapons from units here.</div>
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
              <div className="prep-screen__empty">No support conversations available.</div>
            ) : (
              <div className="prep-screen__support-list">
                {availableSupports.map((conv, idx) => {
                  const unitA = units.find((u) => u.id === conv.unitA);
                  const unitB = units.find((u) => u.id === conv.unitB);
                  if (!unitA || !unitB) return null;
                  const rewardText = getRewardText(conv);
                  return (
                    <div key={idx} className="prep-screen__support-card" onClick={() => startSupport(conv)}>
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
                {completedSupports.length} conversation{completedSupports.length > 1 ? 's' : ''} completed this chapter
              </div>
            )}
          </div>
        )}
      </div>

      <div className="prep-screen__actions">
        <button
          className="prep-screen__start-btn"
          data-testid="prep-start-battle"
          onClick={handleStartBattle}
        >
          Start Battle
        </button>
      </div>
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
  Eirik: { classId: 'lord', faction: 'player' },
  Seth: { classId: 'cavalier', faction: 'player' },
  Lute: { classId: 'mage', faction: 'player' },
  Natasha: { classId: 'cleric', faction: 'player' },
};
