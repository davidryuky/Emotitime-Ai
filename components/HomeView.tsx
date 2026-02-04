
import React, { useState, useEffect } from 'react';
import { EmotionRecord, InsightPattern, MentorMessage, UserProfile, ThemeId, HopeCapsule, Activity } from '../types/index';
import { EMOTIONS, THEMES } from '../constants/index';
import { storage } from '../services/storage';
import { aiService } from '../services/aiService';
import { Bell, X, ChevronRight, MessageCircle, Star, Sparkles, Loader2, Heart, Zap, Waves, Quote } from 'lucide-react';
import IconRenderer from './IconRenderer';

interface HomeViewProps {
  records: EmotionRecord[];
  insights: InsightPattern[];
  mentorNote: MentorMessage;
  profile: UserProfile | null;
  onLogNew: () => void;
  onTabChange: (tab: any) => void;
  showReminderPrompt: boolean;
  onCloseReminder: () => void;
  currentTheme: ThemeId;
  timeCapsule?: EmotionRecord | null;
  energyLevel?: number;
  batteryAdvice?: string;
  activities: Activity[];
}

const HomeView: React.FC<HomeViewProps> = ({ 
  records, insights, mentorNote, profile, onLogNew, onTabChange, showReminderPrompt, onCloseReminder,
  currentTheme, timeCapsule, energyLevel = 100, batteryAdvice, activities
}) => {
  const [capsules, setCapsules] = useState<HopeCapsule[]>(storage.getHopeCapsules());
  const [activeCapsule, setActiveCapsule] = useState<HopeCapsule | null>(null);
  
  // Estados para a Reflexão (Eco)
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const themeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  useEffect(() => {
    const lastRecord = records[0];
    if (lastRecord && (lastRecord.emotionId === 'triste' || lastRecord.emotionId === 'ansioso' || lastRecord.emotionId === 'cansado')) {
      if (capsules.length > 0 && !activeCapsule) {
        setActiveCapsule(capsules[0]);
      }
    }
  }, [records, capsules]);

  const closeCapsule = () => {
    if (activeCapsule) {
      storage.deleteHopeCapsule(activeCapsule.id);
      setCapsules(prev => prev.filter(c => c.id !== activeCapsule.id));
      setActiveCapsule(null);
    }
  };

  const handleGenerateInsight = async (e: React.MouseEvent) => {
    // Garantia absoluta de captura de evento no mobile
    e.preventDefault();
    e.stopPropagation();
    
    if (records.length < 3 || isGeneratingAi) return;
    
    setIsGeneratingAi(true);
    
    try {
      const insight = await aiService.generateInsight(records, profile, activities);
      setAiInsight(insight);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 80) return '#2dd4bf';
    if (level >= 50) return '#fbbf24';
    if (level >= 25) return '#f97316';
    return '#f43f5e';
  };

  const batteryColor = getBatteryColor(energyLevel);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 relative">
      
      {showReminderPrompt && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-[100] animate-in slide-in-from-top-12 duration-700">
          <div className={`bg-gradient-to-r ${themeData.accentColor} to-teal-400 text-black p-0.5 rounded-[2.2rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}>
            <div className="bg-white/95 backdrop-blur-md p-5 rounded-[2.1rem] flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${themeData.accentColor.replace('bg-', 'bg-opacity-10 ')} rounded-2xl flex items-center justify-center ${themeData.primaryColor}`}>
                  <Bell size={24} className="animate-bounce" />
                </div>
                <div>
                  <p className="font-black text-sm text-neutral-900">Pausa Amiga</p>
                  <p className="text-[11px] text-neutral-500 font-medium">Como você está agora?</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onLogNew} className={`${themeData.accentColor} text-white text-[11px] font-black px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform`}>REGISTRAR</button>
                <button onClick={onCloseReminder} className="p-2 text-neutral-400"><X size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCapsule && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-sm bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 rounded-[3rem] p-10 space-y-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <Sparkles size={36} className="animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tighter">Uma Mensagem do passado</h3>
              <p className="text-lg text-white font-medium italic leading-relaxed">
                "{activeCapsule.content}"
              </p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest pt-4">
                Escrito quando você se sentia {EMOTIONS.find(e => e.id === activeCapsule.authorEmotion)?.label}
              </p>
            </div>
            <button 
              onClick={closeCapsule}
              className="w-full py-5 bg-white text-black rounded-full font-black shadow-xl active:scale-95 transition-all"
            >
              Obrigado, eu precisava disso
            </button>
          </div>
        </div>
      )}

      <section className="space-y-4 px-1">
        <div className="space-y-1">
          <h2 className="text-4xl font-black font-satoshi tracking-tighter text-white leading-tight">
            Olá, <span className={themeData.primaryColor}>{profile?.name}</span>.
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between mb-1 px-1">
             <div className="flex items-center gap-2">
               <Zap size={10} style={{ color: batteryColor }} className={energyLevel === 100 ? 'animate-pulse' : ''} />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Energia Emocional</span>
             </div>
             <span className="text-[10px] font-black" style={{ color: batteryColor }}>{energyLevel}%</span>
          </div>
          
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner p-[2px]">
             <div 
              className="h-full transition-all duration-1000 ease-out rounded-full relative"
              style={{ 
                width: `${energyLevel}%`, 
                backgroundColor: batteryColor,
                boxShadow: `0 0 12px ${batteryColor}44`
              }} 
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
             </div>
          </div>
          
          <div className="px-1">
            <p className={`text-[11px] font-medium leading-relaxed transition-colors duration-500 ${energyLevel < 50 ? 'text-gray-300' : 'text-gray-500'}`}>
              {batteryAdvice || "Esta é sua bateria emocional, vamos deixar ela cheia sempre que possível, ok?"}
            </p>
          </div>
        </div>

        {/* Eco das Emoções - Qwen 2.5 Powered Living Card */}
        {records.length >= 3 && (
          <div className="pt-6 animate-in slide-in-from-bottom-8 duration-1000">
             <div className="relative">
                {/* Glow Background Layer */}
                <div className="absolute -inset-4 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none animate-pulse" />
                
                <div className="relative bg-neutral-900/80 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-8 overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)]">
                    {/* Animated Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-transparent opacity-30 pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-white/10 backdrop-blur-md">
                              <Waves size={26} className="text-indigo-400" />
                           </div>
                           <div className="space-y-0.5">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Eco das Emoções</h4>
                              <p className="text-[8px] font-bold text-indigo-400/80 uppercase tracking-widest">Qwen 2.5 Sintonizando</p>
                           </div>
                        </div>
                        
                        {!aiInsight && !isGeneratingAi && (
                          <button 
                            onClick={handleGenerateInsight}
                            className="z-[90] relative bg-white text-black text-[10px] font-black px-7 py-4 rounded-full shadow-[0_15px_35px_rgba(255,255,255,0.2)] active:scale-90 transition-all hover:bg-neutral-100 uppercase tracking-widest border-t border-white/50 cursor-pointer touch-manipulation"
                          >
                            Sintonizar
                          </button>
                        )}
                    </div>

                    {isGeneratingAi ? (
                       <div className="py-12 flex flex-col items-center justify-center gap-6 relative z-10">
                          <div className="relative flex items-center justify-center">
                             <div className="absolute w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-400 rounded-full animate-spin" />
                             <Heart size={24} className="text-indigo-400 animate-pulse" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] animate-pulse italic">
                               Traduzindo seu silêncio...
                            </p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Analisando registros reais</p>
                          </div>
                       </div>
                    ) : aiInsight ? (
                       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
                          <div className="relative pt-2">
                             <Quote size={20} className="absolute -top-3 -left-3 text-white/5 -scale-x-100" />
                             <p className="text-white font-medium text-lg italic leading-relaxed tracking-tight pl-3">
                                "{aiInsight}"
                             </p>
                          </div>
                          
                          <div className="flex items-center justify-between pt-6 border-t border-white/10">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]" />
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest font-satoshi">Pulso Realizado</span>
                             </div>
                             <button 
                                onClick={() => setAiInsight(null)}
                                className="z-20 text-[9px] font-black text-indigo-400/80 hover:text-white uppercase tracking-widest transition-colors p-2 active:scale-95"
                             >
                                Guardar Eco
                             </button>
                          </div>
                       </div>
                    ) : (
                       <div className="py-2 relative z-10">
                          <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[260px] opacity-90">
                             Suas últimas vivências formaram uma frequência única. Vamos ouvir o que ela tem a dizer?
                          </p>
                       </div>
                    )}
                </div>
             </div>
          </div>
        )}

        <div className="pt-6 space-y-1">
          <p className={`${themeData.primaryColor} opacity-60 text-[10px] font-black uppercase tracking-[0.3em]`}>Fluxo de Vida</p>
        </div>
      </section>

      {/* Card do Mentor/Destaque */}
      <div className={`relative p-8 rounded-[3rem] bg-gradient-to-br ${themeData.bgGradient} border border-white/10 overflow-hidden shadow-2xl transition-all duration-1000 group`}>
        <div className={`absolute -top-20 -right-20 w-64 h-64 ${themeData.accentColor} opacity-10 blur-[80px] rounded-full`} />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
              <MessageCircle size={24} className={`${themeData.primaryColor}`} />
            </div>
            <h4 className="font-black text-white text-xl tracking-tight">{mentorNote.greeting}</h4>
          </div>
          
          <p className="text-white/90 leading-relaxed text-lg font-medium italic">
            "{mentorNote.content}"
          </p>

          {mentorNote.footnote && (
            <div className="pt-4 border-t border-white/10 opacity-40">
              <p className="text-[11px] font-medium leading-relaxed italic text-white/80">
                {mentorNote.footnote}
              </p>
            </div>
          )}

          {mentorNote.actionLabel && (
            <button 
              onClick={() => onTabChange(mentorNote.actionTab)}
              className="group flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full text-xs font-black shadow-xl active:scale-95 transition-all"
            >
              {mentorNote.actionLabel}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {mentorNote.recommendations.length > 0 && (
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Dicas para seu Agora</span>
              </div>
              <div className="grid gap-2">
                {mentorNote.recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 flex items-center gap-4 group/item hover:bg-black/60 transition-all active:scale-95">
                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${rec.color}`}>
                      <IconRenderer name={rec.icon} size={20} />
                    </div>
                    <p className="text-xs font-bold text-white/80 leading-snug group-hover/item:text-white transition-colors">{rec.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
