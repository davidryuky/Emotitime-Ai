
import React from 'react';
import { Home, History, Sparkles, Leaf, Brain, Settings, Plus, BookOpen, MessageCircle } from 'lucide-react';
import { ThemeId, EmotionRecord } from '../types/index';
import { THEMES } from '../constants/index';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'history' | 'insights' | 'log' | 'breathing' | 'pomodoro' | 'zen';
  setActiveTab: (tab: 'home' | 'history' | 'insights' | 'log' | 'breathing' | 'pomodoro' | 'zen') => void;
  themeId: ThemeId;
  hideNav?: boolean;
  hideHeader?: boolean;
  onOpenSettings: () => void;
  onOpenJournal: () => void;
  onOpenWorldEcho: () => void;
  recentRecords?: EmotionRecord[];
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  themeId, 
  hideNav = false, 
  hideHeader = false,
  onOpenSettings,
  onOpenJournal,
  onOpenWorldEcho,
  recentRecords = []
}) => {
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const avgIntensity = recentRecords.length > 0 
    ? recentRecords.slice(0, 3).reduce((acc, r) => acc + r.intensity, 0) / Math.min(recentRecords.length, 3)
    : 3;
  
  const glowOpacity = (avgIntensity / 5) * 0.15;

  const getGlowShadow = () => {
    switch (themeId) {
      case 'ocean': return '0 10px 25px -5px rgba(59, 130, 246, 0.5)';
      case 'sunset': return '0 10px 25px -5px rgba(249, 115, 22, 0.5)';
      case 'midnight': return '0 10px 25px -5px rgba(139, 92, 246, 0.5)';
      case 'desculpa': return '0 10px 25px -5px rgba(232, 121, 249, 0.5)';
      case 'onepiece': return '0 10px 25px -5px rgba(239, 68, 68, 0.5)';
      case 'aurora': return '0 10px 25px -5px rgba(45, 212, 191, 0.5)';
      case 'mars': return '0 10px 25px -5px rgba(248, 113, 113, 0.5)';
      case 'lavender': return '0 10px 25px -5px rgba(129, 140, 248, 0.5)';
      default: return '0 10px 25px -5px rgba(16, 185, 129, 0.5)';
    }
  };

  const navItemClass = (tab: typeof activeTab) => 
    `relative z-10 w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full ${
      activeTab === tab 
        ? 'text-white' 
        : 'text-gray-500 hover:text-gray-400'
    }`;

  return (
    <div className={`min-h-screen pb-28 flex flex-col max-w-md mx-auto relative bg-[#0a0a0a] transition-colors duration-1000 overflow-x-hidden`}>
      <div 
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full h-[70vh] bg-gradient-to-b ${currentTheme.bgGradient} pointer-events-none z-0 transition-all duration-1000`}
        style={{ opacity: 0.5 + glowOpacity }} 
      />

      <header className={`p-6 pt-10 items-center justify-between relative z-[100] transition-all duration-500 ${hideHeader ? 'hidden' : 'flex opacity-100 translate-y-0'}`}>
        <div className="flex items-center gap-2.5 group cursor-default">
          <div className="relative">
            <div className={`absolute inset-0 ${currentTheme.accentColor} opacity-20 blur-xl rounded-full group-hover:opacity-40 transition-opacity duration-700`}></div>
            <Brain size={28} className={`${currentTheme.primaryColor} relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
          </div>
          <h1 className="text-2xl font-black font-satoshi tracking-tight text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/80 to-white/40 drop-shadow-sm">
              Emoti
            </span>
            <span className={`bg-clip-text text-transparent bg-gradient-to-tr ${currentTheme.primaryColor.replace('text-', 'from-')} to-white/60`}>
              Time
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenJournal}
            className="p-3.5 rounded-2xl bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white transition-all active:scale-90"
            title="Diário"
          >
            <BookOpen size={20} />
          </button>
          <button 
            onClick={onOpenWorldEcho}
            className="p-3.5 rounded-2xl bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white transition-all active:scale-90"
            title="Eco do Mundo"
          >
            <MessageCircle size={20} />
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-3.5 rounded-2xl bg-white/5 text-gray-400 border border-white/5 hover:border-white/20 hover:text-white transition-all active:scale-90"
            title="Configurações"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 overflow-y-auto relative z-10">
        {children}
      </main>

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full px-6 z-50 transition-all duration-700 ${hideNav ? 'translate-y-32 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="relative flex items-center justify-between bg-[#141414]/80 backdrop-blur-3xl border border-white/10 rounded-full p-2.5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
          
          <div className="flex flex-1 justify-around items-center">
            <button 
              onClick={() => setActiveTab('home')} 
              className={navItemClass('home')}
              aria-label="Home"
            >
              <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
              {activeTab === 'home' && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${currentTheme.accentColor} shadow-[0_0_8px_currentColor]`} />}
            </button>
            
            <button 
              onClick={() => setActiveTab('history')} 
              className={navItemClass('history')}
              aria-label="Histórico"
            >
              <History size={22} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
              {activeTab === 'history' && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${currentTheme.accentColor} shadow-[0_0_8px_currentColor]`} />}
            </button>
          </div>
          
          <div className="relative px-2 -mt-10">
            <button
              onClick={() => setActiveTab('log')}
              style={{ boxShadow: getGlowShadow() }}
              className={`relative z-10 w-16 h-16 ${currentTheme.accentColor} rounded-full text-black flex items-center justify-center border border-white/20 active:scale-90 hover:scale-105 transition-all duration-500 group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20" />
              <Plus size={34} strokeWidth={2.5} className="relative z-20 group-hover:rotate-180 transition-transform duration-700" />
            </button>
          </div>

          <div className="flex flex-1 justify-around items-center">
            <button 
              onClick={() => setActiveTab('insights')} 
              className={navItemClass('insights')}
              aria-label="Insights"
            >
              <Sparkles size={22} strokeWidth={activeTab === 'insights' ? 2.5 : 2} />
              {activeTab === 'insights' && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${currentTheme.accentColor} shadow-[0_0_8px_currentColor]`} />}
            </button>
            
            <button 
              onClick={() => setActiveTab('zen')} 
              className={navItemClass('zen')}
              aria-label="Espaço Zen"
            >
              <Leaf size={22} strokeWidth={activeTab === 'zen' ? 2.5 : 2} />
              {activeTab === 'zen' && <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${currentTheme.accentColor} shadow-[0_0_8px_currentColor]`} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Layout;
