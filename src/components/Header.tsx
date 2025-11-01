import { Cloud, Lock, Home, Settings } from 'lucide-react';

interface HeaderProps {
  activeMode: 'home' | 'cloud' | 'local';
  onModeChange: (mode: 'home' | 'cloud' | 'local') => void;
}

export function Header({ activeMode, onModeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section - Logo & Subtitle */}
        <div className="flex flex-col">
          <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            GAURA CHAT
          </h1>
          <p className="text-xs text-gray-500">Your Intelligent Assistant</p>
        </div>

        {/* Center Section - Navigation Tabs */}
        <nav className="flex gap-2">
          <button
            onClick={() => onModeChange('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeMode === 'home'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </button>
          
          <button
            onClick={() => onModeChange('cloud')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeMode === 'cloud'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Cloud size={18} />
            <span>Cloud Mode</span>
          </button>

          <button
            onClick={() => onModeChange('local')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeMode === 'local'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Lock size={18} />
            <span>Local Mode</span>
          </button>
        </nav>

        {/* Right Section - Settings */}
        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
