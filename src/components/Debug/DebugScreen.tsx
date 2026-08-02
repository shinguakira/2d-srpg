import { useState } from 'react';
import { useCampaignStore } from '../../stores/campaignStore';
import { PLAYER_UNITS, ENEMY_UNITS } from '../../data/units';
import { WEAPONS } from '../../data/weapons';
import { SKILLS } from '../../data/skills';
import { ALL_CLASSES } from '../../data/promotedClasses';
import { CHAPTER_ORDER } from '../../data/chapters';
import { TERRAIN } from '../../core/terrain';
import { CharactersView } from './CharactersView';
import { ItemsView } from './ItemsView';
import { SkillsView } from './SkillsView';
import { ClassesView } from './ClassesView';
import { ChaptersView } from './ChaptersView';
import { TerrainView } from './TerrainView';
import { FormulasView } from './FormulasView';
import { AIBehaviorsView } from './AIBehaviorsView';
import { MetaStatsView } from './MetaStatsView';
import { CampaignView } from './CampaignView';
import { SpritesView } from './SpritesView';

type Tab =
  | 'characters'
  | 'items'
  | 'skills'
  | 'classes'
  | 'chapters'
  | 'terrain'
  | 'formulas'
  | 'ai'
  | 'metastats'
  | 'campaign'
  | 'sprites';

const ALL_UNITS = Object.values({ ...PLAYER_UNITS, ...ENEMY_UNITS });
const ALL_WEAPONS = Object.values(WEAPONS);
const ALL_SKILLS_ARR = Object.values(SKILLS);
const ALL_CLASSES_ARR = Object.values(ALL_CLASSES);
const TERRAIN_KEYS = Object.keys(TERRAIN);

const TABS: { id: Tab; label: string }[] = [
  { id: 'characters', label: 'Characters' },
  { id: 'items', label: 'Items' },
  { id: 'skills', label: 'Skills' },
  { id: 'classes', label: 'Classes' },
  { id: 'chapters', label: 'Chapters' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'ai', label: 'AI' },
  { id: 'metastats', label: 'Meta-Stats' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'sprites', label: 'Sprites' },
];

export function DebugScreen() {
  const goToTitle = useCampaignStore((s) => s.goToTitle);
  const [tab, setTab] = useState<Tab>('characters');

  // Selection state for split-pane tabs
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(ALL_UNITS[0]?.id ?? null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(ALL_WEAPONS[0]?.id ?? null);
  const [itemSubTab, setItemSubTab] = useState<'weapons' | 'consumables'>('weapons');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(
    ALL_SKILLS_ARR[0]?.id ?? null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    ALL_CLASSES_ARR[0]?.id ?? null,
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    CHAPTER_ORDER[0] ?? null,
  );
  const [selectedTerrainId, setSelectedTerrainId] = useState<string | null>(
    TERRAIN_KEYS[0] ?? null,
  );
  const [selectedAiId, setSelectedAiId] = useState<string | null>('aggressive');
  const [selectedSpriteId, setSelectedSpriteId] = useState<string | null>('lord');

  return (
    <div className="debug-screen" data-testid="debug-screen">
      <div className="debug-screen__header">
        <h1 className="debug-screen__title">Debug Database</h1>
        <button className="debug-screen__back" data-testid="debug-back" onClick={goToTitle}>
          Back
        </button>
      </div>

      <div className="debug-screen__tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`debug-screen__tab ${tab === t.id ? 'debug-screen__tab--active' : ''}`}
            data-testid={`debug-tab-${t.id}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="debug-screen__content">
        {tab === 'characters' && (
          <CharactersView selectedId={selectedUnitId} onSelect={setSelectedUnitId} />
        )}
        {tab === 'items' && (
          <ItemsView
            selectedId={selectedItemId}
            onSelect={setSelectedItemId}
            subTab={itemSubTab}
            onSubTabChange={setItemSubTab}
          />
        )}
        {tab === 'skills' && (
          <SkillsView selectedId={selectedSkillId} onSelect={setSelectedSkillId} />
        )}
        {tab === 'classes' && (
          <ClassesView selectedId={selectedClassId} onSelect={setSelectedClassId} />
        )}
        {tab === 'chapters' && (
          <ChaptersView selectedId={selectedChapterId} onSelect={setSelectedChapterId} />
        )}
        {tab === 'terrain' && (
          <TerrainView selectedId={selectedTerrainId} onSelect={setSelectedTerrainId} />
        )}
        {tab === 'formulas' && <FormulasView />}
        {tab === 'ai' && <AIBehaviorsView selectedId={selectedAiId} onSelect={setSelectedAiId} />}
        {tab === 'metastats' && <MetaStatsView />}
        {tab === 'campaign' && <CampaignView />}
        {tab === 'sprites' && (
          <SpritesView selectedId={selectedSpriteId} onSelect={setSelectedSpriteId} />
        )}
      </div>
    </div>
  );
}
