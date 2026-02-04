
import React, { useState, useRef, useEffect } from 'react';
import { EmotionRecord, ThemeId, Activity } from '../types/index';
import { EMOTIONS, DEFAULT_ACTIVITIES, THEMES } from '../constants/index';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2, Timer, Share2, X, Loader2, Heart, Sparkles } from 'lucide-react';
import IconRenderer from './IconRenderer';
import html2canvas from 'html2canvas';

interface HistoryViewProps {
  records: EmotionRecord[];
  onDelete: (id: string) => void;
  themeId: ThemeId;
  activities: Activity[];
  onSharingChange?: (isSharing: boolean) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onDelete, themeId, activities, onSharingChange }) => {
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const [snapshotRecord, setSnapshotRecord] = useState<EmotionRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onSharingChange) {
      onSharingChange(!!snapshotRecord);
    }
  }, [snapshotRecord, onSharingChange]);
  
  const groupedByDate = records.reduce((acc, record) => {
    const date = record.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {} as Record<string, EmotionRecord[]>);

  const dates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    if (isToday(date)) return 'Hoje';
    if (isYesterday(date)) return 'Ontem';
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const closeSnapshot = () => setSnapshotRecord(null);

  const handleShareMemory = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 3, 
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('share-card-capture');
          if (el) {
            el.style.transform = 'none';
            el.style.width = '400px'; 
            el.style.height = '500px'; 
            el.style.borderRadius = '48px';
          }
        }
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }

        const fileName = `emotitime-instante-${format(new Date(), 'dd-MM-yyyy')}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Meu Instante no EmotiTime',
              text: 'Um breve registro do que senti.',
              files: [file],
            });
          } catch (error) {
            console.log('Compartilhamento cancelado');
          }
        } else {
          const link = document.createElement('a');
          link.download = fileName;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        setIsGenerating(false);
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      setIsGenerating(false);
    }
  };

  if (snapshotRecord) {
    const emotion = EMOTIONS.find(e => e.id === snapshotRecord.emotionId);
    const activity = activities.find(a => a.id === snapshotRecord.activityId) || DEFAULT_ACTIVITIES.find(a => a.id === snapshotRecord.activityId);
    const emotionTextColor = emotion?.color.split(' ')[1] || 'text-white';
    const emotionBaseColor = emotion?.color.split(' ')[0] || 'bg-white/10';

    return (
      <div className="fixed inset-0 z-[600] bg-black/98 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500 overflow-y-auto">
        <button 
          onClick={closeSnapshot} 
          className="absolute top-8 right-8 p-4 text-white/30 hover:text-white transition-all z-[610] active:scale-90 bg-white/5 rounded-full backdrop-blur-md"
        >
          <X size={24}/>
        </button>
        
        <div className="w-full max-w-[340px] space-y-8 my-auto animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
          <div className="p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
            <div 
              ref={cardRef}
              id="share-card-capture"
              className="bg-[#0a0a0a] rounded-[3.2rem] p-8 border border-white/5 relative overflow-hidden flex flex-col items-center text-center aspect-[4/5] justify-between w-full"
            >
                <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-20 ${emotionBaseColor}`} />
                <div className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-10 ${emotionBaseColor}`} />
                
                <div className="relative z-10 w-full pt-4">
                  <p className="text-[9px] font-medium text-gray-500 uppercase tracking-[0.6em] mb-6">Um Breve Instante</p>
                  
                  <div className={`w-20 h-20 rounded-[2.2rem] bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto mb-6 ${emotionTextColor}`}>
                    <IconRenderer name={emotion?.iconName || 'Heart'} size={40} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-2xl font-bold text-white/90 tracking-tight leading-tight px-2">
                    Sentindo <span className={emotionTextColor}>{emotion?.label}</span>
                  </h3>
                  
                  <p className="text-gray-500 font-medium italic text-sm mt-1">
                    Enquanto {activity?.label}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-4">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div 
                        key={level} 
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                          level <= snapshotRecord.intensity 
                            ? `${emotionTextColor.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]` 
                            : 'bg-white/5 border border-white/10'
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 px-4 w-full flex-1 flex items-center justify-center py-4">
                  {snapshotRecord.note ? (
                    <p className="text-white/60 font-medium italic leading-relaxed text-xs bg-white/[0.02] p-5 rounded-[2rem] border border-white/5 w-full break-words whitespace-pre-wrap">
                      "{snapshotRecord.note}"
                    </p>
                  ) : (
                    <div className="h-4" />
                  )}
                </div>

                <div className="pb-6 relative z-10 w-full flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      {format(snapshotRecord.timestamp, "d 'de' MMMM '·' HH:mm", { locale: ptBR })}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-30">
                    <Sparkles size={11} className={currentTheme.primaryColor} />
                    <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white">EmotiTime</span>
                  </div>
                </div>
            </div>
          </div>

          <button 
            onClick={handleShareMemory}
            disabled={isGenerating}
            className={`w-full py-6 ${currentTheme.accentColor} text-black rounded-full font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] disabled:opacity-70 disabled:active:scale-100 hover:brightness-110`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                LAPIDANDO...
              </>
            ) : (
              <>
                <Share2 size={18} strokeWidth={2.5} />
                COMPARTILHAR ESTE INSTANTE
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="px-1">
        <h2 className="text-4xl font-bold font-satoshi tracking-tighter text-white">Linha do Tempo</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Sua história, contada momento a momento.</p>
      </header>

      {dates.length === 0 ? (
        <div className="py-24 text-center text-gray-500 space-y-6 bg-[#121212] rounded-[3rem] border border-white/5 shadow-inner">
          <Timer size={64} className="mx-auto opacity-10" />
          <p className="font-bold text-gray-400">Sua história começará a aparecer aqui.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[25px] top-4 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-full z-0" />
          
          <div className="space-y-16">
            {dates.map((dateStr) => (
              <section key={dateStr} className="space-y-10 relative">
                <div className="sticky top-4 z-20 flex justify-start pl-14 mb-8">
                  <h3 className={`text-[10px] uppercase tracking-[0.3em] font-black ${currentTheme.primaryColor} bg-black/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-2xl ring-1 ring-white/5`}>
                    {getDayLabel(dateStr)}
                  </h3>
                </div>

                <div className="space-y-12">
                  {groupedByDate[dateStr].map((record) => {
                    const emotion = EMOTIONS.find(e => e.id === record.emotionId);
                    const activity = activities.find(a => a.id === record.activityId) || DEFAULT_ACTIVITIES.find(a => a.id === record.activityId);
                    const emotionTextColor = emotion?.color.split(' ')[1] || 'text-white';
                    
                    return (
                      <div key={record.id} className="relative group flex items-start gap-10 pl-14 overflow-hidden">
                        <div className="absolute left-[20px] top-[14px] flex items-center justify-center z-10">
                          <div className={`w-[11px] h-[11px] rounded-full border-2 border-[#0a0a0a] transition-all duration-700 ${emotionTextColor.replace('text-', 'bg-')} shadow-[0_0_15px_currentColor] group-hover:scale-150 ring-2 ring-white/5`} />
                        </div>
                        
                        <div className="flex-1 space-y-4 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <span className="text-[10px] text-gray-600 font-black tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 shrink-0">{format(record.timestamp, 'HH:mm')}</span>
                              <div className={`flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm transition-all truncate`}>
                                <div className={`${activity?.color || 'text-gray-400'} shrink-0`}>
                                  <IconRenderer name={activity?.iconName || 'HelpCircle'} size={14} />
                                </div>
                                <span className="font-bold text-gray-300 tracking-tight uppercase text-[9px] truncate">
                                  {activity?.label}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 shrink-0">
                               <button 
                                 onClick={() => setSnapshotRecord(record)} 
                                 className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-90"
                                 title="Compartilhar Instante"
                               >
                                 <Share2 size={16} />
                               </button>
                               <button 
                                 onClick={() => onDelete(record.id)} 
                                 className="p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90"
                                 title="Apagar Registro"
                               >
                                 <Trash2 size={16} />
                               </button>
                            </div>
                          </div>
                          
                          <div className="bg-[#121212]/50 backdrop-blur-sm p-7 rounded-[2.5rem] border border-white/5 shadow-xl group-hover:border-white/10 group-hover:bg-[#151515] transition-all relative overflow-hidden w-full">
                             <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col-reverse p-[2px] gap-[1px]">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${i < record.intensity ? (emotionTextColor.replace('text-', 'bg-')) : 'bg-white/5 opacity-20'}`} />
                                ))}
                             </div>
                             
                             <div className="mb-4 flex flex-col gap-1">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Sentimento & Atividade</p>
                                <p className="text-sm font-bold text-white tracking-tight">
                                  Sentindo <span className={emotionTextColor}>{emotion?.label}</span> enquanto <span className="text-gray-400">{activity?.label}</span>
                                </p>
                             </div>

                             {record.note ? (
                               <div className="mt-3 pt-3 border-t border-white/5">
                                 <p className="text-sm text-gray-300 font-medium italic leading-relaxed pl-1 break-words whitespace-pre-wrap">"{record.note}"</p>
                               </div>
                             ) : (
                               <p className="text-[10px] text-gray-800 font-bold uppercase tracking-[0.2em] italic pl-1 mt-2">Silêncio reflexivo</p>
                             )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
