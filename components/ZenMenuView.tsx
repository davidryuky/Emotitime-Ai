
import React from 'react';
import { Wind, Timer, ChevronRight, Leaf, Flame, Stars } from 'lucide-react';
import { ThemeId } from '../types/index';
import { THEMES } from '../constants/index';

interface ZenMenuViewProps {
  themeId: ThemeId;
  onSelect: (tool: 'breathing' | 'pomodoro' | 'fire' | 'gratitude') => void;
}

const ZenMenuView: React.FC<ZenMenuViewProps> = ({ themeId, onSelect }) => {
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="px-1">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 mb-6 ${currentTheme.primaryColor}`}>
          <Leaf size={24} />
        </div>
        <h2 className="text-4xl font-black font-satoshi tracking-tighter text-white">Espaço Zen</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Escolha como deseja se reconectar hoje.</p>
      </header>

      <div className="grid gap-4">
        <button 
          onClick={() => onSelect('breathing')}
          className="group relative w-full p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 flex items-center gap-6 text-left hover:border-white/20 hover:bg-[#151515] transition-all active:scale-[0.98]"
        >
          <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform`}>
            <Wind size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white tracking-tight">Respirar Fundo</h4>
            <p className="text-sm text-gray-500 font-medium">Técnica 4-4-4 para acalmar a mente.</p>
          </div>
          <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
        </button>

        <button 
          onClick={() => onSelect('pomodoro')}
          className="group relative w-full p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 flex items-center gap-6 text-left hover:border-white/20 hover:bg-[#151515] transition-all active:scale-[0.98]"
        >
          <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform`}>
            <Timer size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white tracking-tight">Foco Pomodoro</h4>
            <p className="text-sm text-gray-500 font-medium">Ciclos de concentração e descanso.</p>
          </div>
          <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
        </button>

        <button 
          onClick={() => onSelect('fire')}
          className="group relative w-full p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 flex items-center gap-6 text-left hover:border-white/20 hover:bg-[#151515] transition-all active:scale-[0.98]"
        >
          <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform`}>
            <Flame size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white tracking-tight">Fogueira do Desapego</h4>
            <p className="text-sm text-gray-500 font-medium">Liberte o que não te serve mais.</p>
          </div>
          <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
        </button>

        <button 
          onClick={() => onSelect('gratitude')}
          className="group relative w-full p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 flex items-center gap-6 text-left hover:border-white/20 hover:bg-[#151515] transition-all active:scale-[0.98]"
        >
          <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform`}>
            <Stars size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white tracking-tight">Céu de Gratidão</h4>
            <p className="text-sm text-gray-500 font-medium">Transforme momentos bons em estrelas.</p>
          </div>
          <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
        <p className="text-center text-gray-500 text-xs italic leading-relaxed">
          "A quiet mind is all you need. All else will happen rightly, once your mind is quiet."
        </p>
      </div>
    </div>
  );
};

export default ZenMenuView;
