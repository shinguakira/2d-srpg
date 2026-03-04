import { useEffect } from 'react';
import { Game } from './components/Game';
import { TitleScreen } from './components/TitleScreen';
import { DialogueBox } from './components/DialogueBox';
import { DebugScreen } from './components/DebugScreen';
import { useCampaignStore } from './stores/campaignStore';
import './styles/grid.css';
import './styles/units.css';
import './styles/camera.css';
import './styles/ui.css';

function App() {
  const currentScreen = useCampaignStore((s) => s.currentScreen);

  // Backward compat: if ?seed param exists, skip title and go direct to battle
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('seed')) {
      useCampaignStore.getState().startChapterDirect('ch1');
    }
  }, []);

  switch (currentScreen) {
    case 'title':
      return <TitleScreen />;
    case 'dialogue':
      return <DialogueBox />;
    case 'battle':
      return <Game />;
    case 'debug':
      return <DebugScreen />;
  }
}

export default App;
