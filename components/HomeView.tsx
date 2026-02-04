
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { EmotionRecord, InsightPattern, MentorMessage, UserProfile, ThemeId, HopeCapsule, Activity } from '../types/index';
import { EMOTIONS, THEMES } from '../constants/index';
import { storage } from '../services/storage';
import { aiService } from '../services/aiService';
import { Bell, X, ChevronRight, MessageCircle, Star, Sparkles, Loader2, Heart, Zap, Waves, Share2 } from 'lucide-react';
import IconRenderer from './IconRenderer';
import html2canvas from 'html2canvas';

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
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSharingEco, setIsSharingEco] = useState(false);
  const ecoCardRef = useRef<HTMLDivElement>(null);

  const themeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const colorBase = useMemo(() => themeData.primaryColor.replace('text-', '').split('-')[0] || 'emerald', [themeData]);

  const todayRecordsCount = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return records.filter(r => r.date === todayStr).length;
  }, [records]);

  const handleShareEco = async () => {
    if (!ecoCardRef.current) return;
    setIsSharingEco(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(ecoCardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 3,
        useCORS: true
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'meu-eco-emotitime.png', { type: 'image/png' });
        if (navigator.share) {
          await navigator.share({ title: 'Meu Eco das Emoções', files: [file] });
        } else {
          const link = document.createElement('a');
          link.download = 'meu-eco-emotitime.png';
          link.href = canvas.toDataURL();
          link.click();
        }
        setIsSharingEco(false);
      });
    } catch (e) {
      console.error(e);
      setIsSharingEco(false);
    }
  };

  const generateInsight = async () => {
    if (records.length < 3) return;
    setIsGeneratingAi(true);
    const insight = await aiService.generateInsight(records, profile, activities);
    setAiInsight(insight);
    setIsGeneratingAi(false);
  };

  const closeCapsule = () => {
    if (activeCapsule) {
      storage.deleteHopeCapsule(activeCapsule.id);
      setCapsules(prev => prev.filter(c => c.id !== activeCapsule.id));
      setActiveCapsule(null);
    }
  };

  // Fix: Replace the inline IIFE with a named function to ensure TypeScript correctly evaluates batteryColor as a string, fixing type errors on style props.
  const getBatteryColor = (level: number) => {
    if (level >= 80) return '#2dd4bf';
    if (level >= 50) return '#fbbf24';
    if (level >= 25) return '#f97316';
    return '#f43f5e';
  };
  const batteryColor = getBatteryColor(energyLevel);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      {/* Hidden Card for Export */}
      <div className="fixed -left-[2000px] top-0 pointer-events-none">
        <div 
          ref={ecoCardRef}
          className="w-[400px] h-[600px] bg-[#0a0a0a] p-12 flex flex-col items-center justify-between text-center border-4 border-white/5 rounded-[4rem] relative overflow-hidden"
        >
          <div className={`absolute -top-40 -right-40 w-96 h-96 bg-${colorBase}-500/10 blur-[100px] rounded-full`} />
          <div className="relative z-10 w-full">
            <h1 className="text-xl font-black text-gray-500 uppercase tracking-[0.5em] mb-12">Eco das minhas Emoções</h1>
            <div className={`w-24 h-24 rounded-3xl bg-${colorBase}-500/10 border border-white/10 flex items-center justify-center mx-auto mb-10`}>
              <Waves size={40} className={themeData.primaryColor} />
            </div>
            <p className="text-white text-2xl font-bold leading-relaxed italic px-4">
              "{aiInsight}"
            </p>
          </div>
          <div className="relative z-10 w-full flex flex-col items-center gap-4">
             <div className="flex items-center gap-2 opacity-50">
               <Sparkles size={14} className={themeData.primaryColor} />
               <span className="text-[10px] font-black text-white uppercase tracking-[0.6em]">EmotiTime</span>
             </div>
          </div>
        </div>
      </div>

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
             <div className="h-full transition-all duration-1000 ease-out rounded-full relative" style={{ width: `${energyLevel}%`, backgroundColor: batteryColor, boxShadow: `0 0 12px ${batteryColor}44` }}>
               <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
             </div>
          </div>
          <div className="px-1">
            <p className={`text-[11px] font-medium leading-relaxed transition-colors duration-500 ${energyLevel < 50 ? 'text-gray-300' : 'text-gray-500'}`}>
              {batteryAdvice || "Esta é sua bateria emocional, vamos deixar ela cheia sempre que possível, ok?"}
            </p>
          </div>
        </div>

        {records.length >= 3 && (
          <div className="pt-6">
             <div className="relative group perspective-1000">
                <div className={`absolute inset-0 bg-gradient-to-br from-${colorBase}-600/20 to-transparent blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000`} />
                <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-8 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-2xl bg-${colorBase}-500/10 flex items-center justify-center border border-white/5`}>
                              <Waves size={24} className={`${themeData.primaryColor} animate-pulse`} />
                           </div>
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Eco das Emoções</h4>
                              <p className={`text-[8px] font-bold ${themeData.primaryColor} opacity-50 uppercase tracking-widest`}>Sincronizado com seu sentir</p>
                           </div>
                        </div>
                        {!aiInsight && !isGeneratingAi && (
                          <button onClick={generateInsight} className={`bg-white text-black text-[10px] font-black px-6 py-3 rounded-full shadow-lg active:scale-90 transition-all hover:bg-${colorBase}-50`}>OUVIR ECO</button>
                        )}
                        {aiInsight && (
                          <button 
                            disabled={isSharingEco}
                            onClick={handleShareEco} 
                            className="p-3 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all active:scale-90"
                          >
                            {isSharingEco ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                          </button>
                        )}
                    </div>
                    {isGeneratingAi ? (
                       <div className="py-8 flex flex-col items-center justify-center gap-4">
                          <div className="relative">
                             <Loader2 size={40} className={`${themeData.primaryColor} animate-spin`} />
                             <Heart size={16} className={`absolute inset-0 m-auto ${themeData.primaryColor} animate-pulse`} />
                          </div>
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] animate-pulse italic text-center px-4">Aguardando o silêncio para ouvir seu coração...</p>
                       </div>
                    ) : aiInsight ? (
                       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                          <div className="relative">
                             <div className={`absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-${colorBase}-500 to-transparent rounded-full opacity-50`} />
                             <p className="text-white font-medium text-lg italic leading-relaxed pl-4 break-words">"{aiInsight}"</p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                             <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Reflexão gerada agora</span>
                             <button onClick={() => setAiInsight(null)} className={`text-[9px] font-black ${themeData.primaryColor} uppercase tracking-widest hover:text-white transition-colors`}>Guardar Eco</button>
                          </div>
                       </div>
                    ) : (
                       <div className="py-2">
                          <p className="text-gray-400 text-sm font-medium leading-relaxed">
                             {todayRecordsCount === 0 ? "Você ainda não registrou nenhum momento hoje." : `Seu dia teve ${todayRecordsCount} momentos marcantes. Quer ouvir o que eles dizem?`}
                          </p>
                       </div>
                    )}
                </div>
             </div>
          </div>
        )}
      </section>

      <div className={`relative p-8 rounded-[3rem] bg-gradient-to-br ${themeData.bgGradient} border border-white/10 overflow-hidden shadow-2xl transition-all duration-1000 group`}>
        <div className={`absolute -top-20 -right-20 w-64 h-64 ${themeData.accentColor} opacity-10 blur-[80px] rounded-full`} />
        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10"><MessageCircle size={24} className={`${themeData.primaryColor}`} /></div>
            <h4 className="font-black text-white text-xl tracking-tight">{mentorNote.greeting}</h4>
          </div>
          <p className="text-white/90 leading-relaxed text-lg font-medium italic">"{mentorNote.content}"</p>
          {mentorNote.footnote && <div className="pt-4 border-t border-white/10 opacity-40"><p className="text-[11px] font-medium leading-relaxed italic text-white/80">{mentorNote.footnote}</p></div>}
          {mentorNote.actionLabel && (
            <button onClick={() => onTabChange(mentorNote.actionTab)} className="group flex items-center justify-between w-full px-10 py-6 bg-white text-black rounded-[2.5rem] text-sm font-black shadow-[0_20px_40px_rgba(255,255,255,0.15)] active:scale-95 transition-all hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)]">
              <div className="flex items-center gap-4"><Sparkles size={20} className={`${themeData.primaryColor} group-hover:rotate-12 transition-transform`} /><span className="tracking-tight">{mentorNote.actionLabel}</span></div>
              <div className={`w-12 h-12 rounded-full ${themeData.accentColor} flex items-center justify-center text-white group-hover:translate-x-1 transition-all shadow-lg`}><ChevronRight size={22} strokeWidth={3} /></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeView;
