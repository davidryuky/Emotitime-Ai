
import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Palette, Lock, History, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ThemeId, JournalEntry, JournalColor } from '../types/index';
import { THEMES, JOURNAL_COLORS } from '../constants/index';
import { storage } from '../services/storage';

interface JournalViewProps {
  themeId: ThemeId;
  onClose: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ themeId, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entryContent, setEntryContent] = useState('');
  const [selectedColor, setSelectedColor] = useState<JournalColor>('default');
  const [entries, setEntries] = useState<Record<string, JournalEntry>>(storage.getJournalEntries());
  
  const themeData = THEMES.find(t => t.id === themeId) || THEMES[0];
  const today = startOfToday();

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleDayClick = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const entry = entries[dateKey];
    setSelectedDate(day);
    setEntryContent(entry?.content || '');
    setSelectedColor(entry?.color || 'default');
  };

  const handleSave = () => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newEntry: JournalEntry = {
      date: dateKey,
      content: entryContent,
      color: selectedColor,
      lastUpdated: Date.now()
    };
    
    storage.saveJournalEntry(newEntry);
    setEntries(prev => ({ ...prev, [dateKey]: newEntry }));
    setSelectedDate(null);
  };

  const isPastDate = selectedDate ? isBefore(selectedDate, today) : false;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[250] animate-in slide-in-from-right duration-500 overflow-y-auto flex flex-col font-satoshi">
      <div className="p-6 pt-14 flex items-start justify-between sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-2xl z-20 border-b border-white/5">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">Diário</h3>
          <div className="space-y-1">
            <p className={`text-[10px] uppercase tracking-[0.35em] ${themeData.primaryColor} font-black opacity-80`}>
              Memórias e Reflexões
            </p>
            <p className="text-[9px] text-gray-500 font-medium leading-relaxed max-w-[200px]">
              Basta clicar no dia e escrever seus pensamentos. O tempo guardará suas palavras.
            </p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 p-6 space-y-10">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xl font-black text-white capitalize tracking-tight">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h4>
          <div className="flex gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-600 py-2 tracking-widest">{d}</div>
          ))}
          
          {[...Array(startOfMonth(currentMonth).getDay())].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const entry = entries[dateKey];
            const hasEntry = !!entry?.content;
            const isTodayDate = isToday(day);
            const isBeforeToday = isBefore(day, today);
            const entryColor = JOURNAL_COLORS.find(c => c.id === entry?.color) || JOURNAL_COLORS[0];

            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-90 border ${
                  hasEntry ? `${entryColor.bg} ${entryColor.border}` : isTodayDate ? 'border-white/20 bg-white/10' : 'border-white/5'
                }`}
              >
                <span className={`text-base font-bold ${isTodayDate ? 'text-white' : isBeforeToday ? 'text-gray-400' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {hasEntry && !entry?.color && (
                  <div className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${themeData.accentColor} shadow-[0_0_8px_currentColor]`} />
                )}
                {isBeforeToday && !hasEntry && (
                  <div className="absolute top-1 right-1 opacity-10">
                    <History size={8} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className={`fixed inset-0 z-[300] backdrop-blur-3xl flex flex-col animate-in fade-in zoom-in-95 duration-500 ${isPastDate ? 'bg-black/98' : 'bg-black/95'}`}>
          <header className="p-6 pt-14 flex items-start justify-between border-b border-white/5">
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                {isPastDate ? 'Visitando o ontem' : 'Escrevendo para'}
              </p>
              <h4 className="text-2xl font-black text-white capitalize tracking-tighter">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedDate(null)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 transition-all active:scale-90">
                <X size={24} />
              </button>
              {!isPastDate && (
                <button onClick={handleSave} className={`w-12 h-12 rounded-2xl ${themeData.accentColor} flex items-center justify-center text-black shadow-xl active:scale-90 transition-all`}>
                  <Check size={24} strokeWidth={3} />
                </button>
              )}
            </div>
          </header>

          <main className="flex-1 p-6 flex flex-col gap-6">
            {isPastDate ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
                <div className="space-y-4 max-w-[280px]">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-600 mb-8">
                    <Lock size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tighter leading-tight italic">
                    "O passado não pode ser reescrito, apenas contemplado."
                  </h3>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed italic">
                    O que foi dito ao tempo, o tempo guardou. Honre sua história aceitando cada palavra escrita.
                  </p>
                </div>

                <div className="w-full bg-white/[0.02] rounded-[2.5rem] p-8 border border-white/5 relative min-h-[200px] flex items-center justify-center">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
                    <History size={10} className="text-white" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white">Registro Imutável</span>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed font-medium italic text-center px-4 break-words">
                    {entryContent || "Nenhuma semente foi plantada neste dia... o silêncio também faz parte do caminho."}
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedDate(null)}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-gray-300 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-3"
                >
                  <Sparkles size={14} className={themeData.primaryColor} />
                  Voltar ao Presente
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-2">
                    <Palette size={12} className="text-gray-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Cor do dia</span>
                  </div>
                  <div className="flex items-center gap-3 overflow-x-auto py-5 px-3 -mx-3 scrollbar-hide">
                    {JOURNAL_COLORS.map(c => (
                      <button 
                        key={c.id} 
                        onClick={() => setSelectedColor(c.id)}
                        className={`w-10 h-10 rounded-full shrink-0 border-2 transition-all active:scale-95 ${c.bg} ${selectedColor === c.id ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1 bg-white/[0.03] rounded-[2rem] p-8 border border-white/10 relative shadow-2xl overflow-hidden">
                  <textarea
                    autoFocus
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    placeholder="O que habita em sua mente hoje?"
                    className="w-full h-full bg-transparent text-gray-200 text-lg leading-[2.8rem] font-medium focus:outline-none resize-none placeholder:text-gray-700 relative z-10"
                  />
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default JournalView;
