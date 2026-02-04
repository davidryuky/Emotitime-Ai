
import React, { useState, useEffect } from 'react';
import { Stars, X, Plus, Sparkles, Send, Heart } from 'lucide-react';
import { ThemeId, GratitudeStar } from '../types/index';
import { THEMES } from '../constants/index';
import { storage } from '../services/storage';
import { v4 as uuidv4 } from 'uuid';

interface GratitudeViewProps {
  themeId: ThemeId;
  onExit: () => void;
}

const GratitudeView: React.FC<GratitudeViewProps> = ({ themeId, onExit }) => {
  const [stars, setStars] = useState<GratitudeStar[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [activeStar, setActiveStar] = useState<GratitudeStar | null>(null);
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    setStars(storage.getGratitudeStars());
  }, []);

  const handleAddStar = () => {
    if (!message.trim()) return;
    
    const newStar: GratitudeStar = {
      id: uuidv4(),
      message: message.trim(),
      timestamp: Date.now(),
      x: Math.random() * 85 + 5, // 5% a 90%
      y: Math.random() * 70 + 10, // 10% a 80%
      size: Math.random() * 2 + 1 // 1 a 3px
    };

    storage.saveGratitudeStar(newStar);
    setStars([...stars, newStar]);
    setMessage('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-[#060606] z-[400] flex flex-col animate-in fade-in duration-1000 overflow-hidden font-satoshi">
      {/* Background Deep Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-indigo-900/10 via-transparent to-transparent opacity-50`}></div>

      {/* Header */}
      <header className="p-6 pt-14 flex items-center justify-between relative z-50">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            Céu de Gratidão <Stars size={20} className="text-indigo-400" />
          </h3>
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">Toque em uma estrela para sentir</p>
        </div>
        <button 
          onClick={onExit} 
          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </header>

      {/* Sky Canvas */}
      <main className="flex-1 relative">
        {stars.map((star) => (
          <button
            key={star.id}
            onClick={() => setActiveStar(star)}
            className={`absolute rounded-full transition-all duration-700 active:scale-[3]`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * (activeStar?.id === star.id ? 4 : 1)}px`,
              height: `${star.size * (activeStar?.id === star.id ? 4 : 1)}px`,
              backgroundColor: activeStar?.id === star.id ? '#fff' : '#ffffff88',
              boxShadow: activeStar?.id === star.id 
                ? '0 0 20px 4px #fff, 0 0 40px 10px rgba(129, 140, 248, 0.4)' 
                : '0 0 8px 1px #ffffff44',
            }}
          >
            <div className={`absolute inset-[-10px] bg-transparent`} />
          </button>
        ))}

        {/* Message Overlay */}
        {activeStar && (
            <div className="absolute inset-x-6 bottom-32 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 text-center animate-in slide-in-from-bottom-8 duration-500 z-50">
                <button 
                    onClick={() => setActiveStar(null)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-white"
                >
                    <X size={16} />
                </button>
                <div className="flex flex-col items-center gap-4">
                    <Heart size={20} className="text-indigo-400 fill-indigo-400/20" />
                    <p className="text-lg font-medium text-white italic leading-relaxed break-words w-full">
                        "{activeStar.message}"
                    </p>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-600">
                        {new Date(activeStar.timestamp).toLocaleDateString('pt-BR')}
                    </span>
                </div>
            </div>
        )}

        {/* Floating Add Button */}
        {!isAdding && (
            <button 
                onClick={() => setIsAdding(true)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-90 transition-all z-50 hover:scale-110"
            >
                <Plus size={32} />
            </button>
        )}
      </main>

      {/* Add Star Modal */}
      {isAdding && (
        <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                    <Sparkles size={32} />
                </div>
                <h4 className="text-2xl font-black text-white tracking-tighter italic">Algo para agradecer?</h4>
                <p className="text-gray-500 text-sm font-medium italic">Pequenas alegrias iluminam os maiores vazios.</p>
            </div>

            <textarea
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sou grato(a) por..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white text-lg font-medium focus:outline-none focus:border-indigo-500/50 resize-none h-32 italic"
                maxLength={80}
            />

            <div className="flex gap-3">
                <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 text-gray-500 font-black uppercase tracking-widest text-[10px]"
                >
                    Cancelar
                </button>
                <button 
                    disabled={!message.trim()}
                    onClick={handleAddStar}
                    className="flex-[2] py-5 bg-indigo-500 text-white font-black rounded-full shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    Fazer Brilhar <Send size={16} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GratitudeView;
