
import React, { useState } from 'react';
import { Flame, X, Sparkles, Send } from 'lucide-react';
import { ThemeId } from '../types/index';
import { THEMES } from '../constants/index';

interface FireViewProps {
  themeId: ThemeId;
  onExit: () => void;
}

const FireView: React.FC<FireViewProps> = ({ themeId, onExit }) => {
  const [text, setText] = useState('');
  const [isBurning, setIsBurning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const handleBurn = () => {
    if (!text.trim()) return;
    setIsBurning(true);
    // Simula o tempo de queima e fragmentação
    setTimeout(() => {
      setText('');
      setIsBurning(false);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }, 2500);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-1000 relative font-satoshi px-4">
      <div className="text-center space-y-4 relative z-10">
        <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-orange-400`}>
          <Flame size={28} className={isBurning ? 'animate-bounce' : ''} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white">Fogueira do Desapego</h2>
        <p className="text-gray-500 text-sm max-w-[280px] mx-auto font-medium">
          Escreva o que pesa no seu peito e deixe o fogo transformar em luz.
        </p>
      </div>

      <div className="relative w-full max-w-sm aspect-square flex items-center justify-center overflow-hidden">
        {/* Animated Fire Visual */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-t from-orange-600 via-orange-400 to-transparent rounded-full blur-[40px] opacity-40 animate-pulse" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-48 bg-gradient-to-t from-yellow-500 via-orange-300 to-transparent rounded-full blur-[20px] opacity-30 animate-fire-dance" />
        </div>

        {/* Input/Burning Area */}
        <div className="relative z-20 w-full px-6 text-center">
            {isBurning ? (
                <div className="space-y-4 animate-out fade-out slide-out-to-top-32 duration-[2500ms] ease-in">
                    <p className="text-xl font-black text-orange-200 italic leading-relaxed break-words px-4">
                        {text}
                    </p>
                    <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Sparkles key={i} size={14} className={`text-orange-400 animate-ping`} style={{ animationDelay: `${i * 200}ms` }} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="O que você deseja liberar?"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 text-white text-lg font-medium text-center focus:outline-none focus:border-orange-500/50 resize-none h-40 shadow-inner placeholder:text-gray-700 italic"
                        maxLength={120}
                    />
                    <button 
                        disabled={!text.trim()}
                        onClick={handleBurn}
                        className={`w-full py-5 bg-orange-500 text-white font-black rounded-full shadow-[0_15px_30px_rgba(249,115,22,0.3)] active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3`}
                    >
                        Entregar ao Fogo <Send size={18} />
                    </button>
                </div>
            )}
        </div>
      </div>

      {showConfirmation && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-8 py-4 rounded-full animate-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Sparkles size={12} /> Transformado em leveza
            </p>
        </div>
      )}

      <button 
        onClick={onExit}
        className="text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
      >
        Voltar ao Silêncio
      </button>

      <style>{`
        @keyframes fire-dance {
          0%, 100% { transform: translateX(-50%) scaleY(1); opacity: 0.3; }
          50% { transform: translateX(-50%) scaleY(1.2) scaleX(1.1); opacity: 0.5; }
        }
        .animate-fire-dance {
          animation: fire-dance 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FireView;
