import { useEffect } from 'react';
import { Game } from './components/Game';
import { TitleScreen } from './components/TitleScreen';
import { DialogueBox } from './components/DialogueBox';
import { PreparationScreen } from './components/PreparationScreen';
import { DebugScreen } from './components/Debug/DebugScreen';
import { useCampaignStore } from './stores/campaignStore';
import './styles/grid.css';
import './styles/units.css';
import './styles/camera.css';
import './styles/ui/index.css';

function App() {
  const currentScreen = useCampaignStore((s) => s.currentScreen);

  // If ?seed param exists, skip title and go direct to battle
  // Optional ?chapter=ch3 to start a specific chapter (defaults to ch1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('seed')) {
      const chapterId = params.get('chapter') || 'ch1';
      useCampaignStore.getState().startChapterDirect(chapterId);
    }
  }, []);

  switch (currentScreen) {
    case 'title':
      return <TitleScreen />;
    case 'dialogue':
      return <DialogueBox />;
    case 'preparation':
      return <PreparationScreen />;
    case 'battle':
      return <Game />;
    case 'debug':
      return <DebugScreen />;
  }
}

export default App;
