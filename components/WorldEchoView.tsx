
import React from 'react';
import { X, Send, Globe, Sparkles, MessageCircle, Clock } from 'lucide-react';
import { ThemeId } from '../types/index';
import { THEMES } from '../constants/index';

interface WorldEchoViewProps {
  themeId: ThemeId;
  onClose: () => void;
}

const WorldEchoView: React.FC<WorldEchoViewProps> = ({ themeId, onClose }) => {
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[300] animate-in fade-in slide-in-from-right duration-500 flex flex-col font-satoshi overflow-hidden">
      {/* Background Decor */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${currentTheme.accentColor} opacity-5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2`}></div>
      <div className={`absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2`}></div>

      {/* Header */}
      <header className="p-6 pt-14 flex items-start justify-between relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-3xl font-black text-white tracking-tighter leading-tight flex items-center gap-3">
            Eco do Mundo
            <Globe size={24} className={currentTheme.primaryColor + " animate-pulse"} />
          </h3>
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">
            Alguém no mundo pode te ouvir.
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </header>

      {/* Chat Area Content */}
      <main className="flex-1 p-6 relative flex flex-col">
        <div className="flex-1 space-y-6 opacity-30 pointer-events-none select-none">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-white/5 border border-white/10 p-5 rounded-[2rem] rounded-tl-none">
              <p className="text-sm font-medium text-gray-300 italic">
                "As vezes o silêncio é a música mais alta..."
              </p>
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-600 mt-4 block">Sussurro Anônimo</span>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[80%] bg-white/10 border border-white/5 p-5 rounded-[2rem] rounded-tr-none">
              <p className="text-sm font-medium text-white italic">
                Apenas observando as estrelas.
              </p>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40 mt-4 block">Você</span>
            </div>
          </div>
        </div>

        {/* The Philosophical Barrier */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center space-y-10">
          <div className="relative">
             <div className={`absolute inset-0 ${currentTheme.accentColor} opacity-20 blur-3xl rounded-full scale-150 animate-pulse`}></div>
             <Clock size={56} className={`relative z-10 ${currentTheme.primaryColor} opacity-80`} />
          </div>
          
          <div className="space-y-6 max-w-xs">
            <h4 className="text-2xl font-black text-white tracking-tighter italic leading-tight">
              "As marés do tempo ainda precisam fluir."
            </h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
              Para que o mundo ouça o seu sussurro, ainda levará um tempo. As conexões da alma estão sendo tecidas no silêncio.
            </p>
            <p className="text-gray-500 text-[11px] font-bold leading-relaxed">
              Continue semeando seus sentimentos em silêncio; em breve, o horizonte deixará de ser apenas um reflexo seu e passará a ser uma ponte. Compartilhe mais do seu sentir e volte em um novo dia.
            </p>
          </div>

          <button 
            onClick={onClose}
            className={`px-10 py-5 bg-white/5 border border-white/10 text-gray-300 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3`}
          >
            <Sparkles size={14} className={currentTheme.primaryColor} />
            Entender o Tempo
          </button>
        </div>

        {/* Input Bar Fake */}
        <div className="mt-auto pt-6 flex items-center gap-4 opacity-20 border-t border-white/5">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-gray-600 text-sm italic">
            Escreva para o infinito...
          </div>
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600">
            <Send size={20} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorldEchoView;
