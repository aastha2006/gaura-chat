import { useState } from 'react';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CloudChatScreen } from './components/CloudChatScreen';
import { LocalChatScreen } from './components/LocalChatScreen';

type Mode = 'home' | 'cloud' | 'local';

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode>('home');

  const handleModeChange = (mode: Mode) => {
    setActiveMode(mode);
  };

  const handleModeSelect = (mode: 'cloud' | 'local') => {
    setActiveMode(mode);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header activeMode={activeMode} onModeChange={handleModeChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeMode === 'home' && <HomeScreen onModeSelect={handleModeSelect} />}
        {activeMode === 'cloud' && <CloudChatScreen />}
        {activeMode === 'local' && <LocalChatScreen />}
      </div>
    </div>
  );
}
