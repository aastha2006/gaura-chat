import { Cloud, Lock, Sparkles, Shield, Zap } from 'lucide-react';

interface HomeScreenProps {
  onModeSelect: (mode: 'cloud' | 'local') => void;
}

export function HomeScreen({ onModeSelect }: HomeScreenProps) {
  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-purple-200">
            <Sparkles size={16} className="text-purple-600" />
            <span className="text-sm text-purple-700">Powered by Advanced AI</span>
          </div>
          <h2 className="text-5xl mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to Gaura Chat
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience intelligent conversations with dual-mode AI technology. Choose between cloud-powered or private local inference.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Cloud Mode Card */}
          <button
            onClick={() => onModeSelect('cloud')}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 text-left cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Cloud size={32} className="text-white" />
              </div>
              
              <h3 className="mb-3 text-gray-900">Cloud Mode</h3>
              <p className="text-gray-600 mb-6">
                Connect to powerful cloud-based AI models for advanced capabilities and lightning-fast responses.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Zap size={16} className="text-blue-500" />
                  <span>High performance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles size={16} className="text-blue-500" />
                  <span>Advanced AI capabilities</span>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
                <span>Start Cloud Chat</span>
                <span>→</span>
              </div>
            </div>
          </button>

          {/* Local Mode Card */}
          <button
            onClick={() => onModeSelect('local')}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-500 text-left cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Lock size={32} className="text-white" />
              </div>
              
              <h3 className="mb-3 text-gray-900">Local Mode</h3>
              <p className="text-gray-600 mb-6">
                Run AI models directly in your browser with complete privacy. Your data never leaves your device.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Shield size={16} className="text-purple-500" />
                  <span>100% Private & secure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Lock size={16} className="text-purple-500" />
                  <span>No data sent to servers</span>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-purple-600 group-hover:gap-3 transition-all">
                <span>Start Local Chat</span>
                <span>→</span>
              </div>
            </div>
          </button>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Seamlessly switch between modes at any time • Privacy-first design • No setup required
          </p>
        </div>
      </div>
    </div>
  );
}
