import { useState } from 'react';
import { useCampaignStore } from '../../stores/campaignStore';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { WEAPONS } from '../../data/weapons';
import { ITEMS } from '../../data/items';
import { CharactersView } from './CharactersView';
import { ItemsView } from './ItemsView';

type Tab = 'characters' | 'items';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });
const ALL_WEAPONS = Object.values(WEAPONS);
const ALL_CONSUMABLES = Object.values(ITEMS);

export function DebugScreen() {
  const goToTitle = useCampaignStore((s) => s.goToTitle);
  const [tab, setTab] = useState<Tab>('characters');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(ALL_UNITS[0]?.id ?? null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(ALL_WEAPONS[0]?.id ?? null);
  const [itemSubTab, setItemSubTab] = useState<'weapons' | 'consumables'>('weapons');

  return (
    <div className="debug-screen" data-testid="debug-screen">
      <div className="debug-screen__header">
        <h1 className="debug-screen__title">Debug Database</h1>
        <button
          className="debug-screen__back"
          data-testid="debug-back"
          onClick={goToTitle}
        >
          Back
        </button>
      </div>

      <div className="debug-screen__tabs">
        <button
          className={`debug-screen__tab ${tab === 'characters' ? 'debug-screen__tab--active' : ''}`}
          data-testid="debug-tab-characters"
          onClick={() => setTab('characters')}
        >
          Characters
        </button>
        <button
          className={`debug-screen__tab ${tab === 'items' ? 'debug-screen__tab--active' : ''}`}
          data-testid="debug-tab-items"
          onClick={() => setTab('items')}
        >
          Items
        </button>
      </div>

      <div className="debug-screen__content">
        {tab === 'characters' ? (
          <CharactersView
            selectedId={selectedUnitId}
            onSelect={setSelectedUnitId}
          />
        ) : (
          <ItemsView
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
            subTab={itemSubTab}
            onSubTabChange={setItemSubTab}
          />
        )}
      </div>
    </div>
  );
}
