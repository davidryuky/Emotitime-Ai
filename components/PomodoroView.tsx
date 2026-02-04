
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Lock, Unlock, ChevronLeft, Sparkles } from 'lucide-react';
import { ThemeId } from '../types/index';
import { THEMES } from '../constants/index';

interface PomodoroViewProps {
  themeId: ThemeId;
  onExit: () => void;
}

const COMMITMENT_REMINDERS = [
  "O foco é uma habilidade que você está cultivando agora. Lembre-se: beber água e honrar esse tempo para você.",
  "Este momento de concentração é um presente para o seu futuro. Você prometeu não se distrair.",
  "Sua produtividade gentil depende desses ciclos. Respire fundo, falta pouco para sua pausa!",
  "Honre o pacto de foco que você fez. Depois, que tal brincar com seu pet ou sentir o ar fresco?",
  "O mundo pode esperar 25 minutos. Este tempo é dedicado à sua evolução pessoal."
];

const PomodoroView: React.FC<PomodoroViewProps> = ({ themeId, onExit }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [workTime, setWorkTime] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isLocked, setIsLocked] = useState(false);
  const [lockClicks, setLockClicks] = useState(0);
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [showCommitmentReminder, setShowCommitmentReminder] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');
  const timerRef = useRef<number | null>(null);

  const themeData = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsLocked(false);
      handleModeSwitch();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleModeSwitch = () => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workTime * 60 : 5 * 60);
    setIsActive(false);
  };

  const handleTimeSelect = (mins: number) => {
    if (isActive) return;
    setWorkTime(mins);
    if (mode === 'work') setTimeLeft(mins * 60);
  };

  const handleLockToggle = () => {
    if (!isLocked) {
      setShowLockConfirmation(true);
    } else {
      const newClicks = lockClicks + 1;
      setLockClicks(newClicks);
      if (newClicks >= 5) {
        setIsLocked(false);
        setLockClicks(0);
      }
    }
  };

  const confirmLock = () => {
    setIsLocked(true);
    setShowLockConfirmation(false);
    setLockClicks(0);
  };

  const tryExit = () => {
    if (isLocked) {
      setReminderMsg(COMMITMENT_REMINDERS[Math.floor(Math.random() * COMMITMENT_REMINDERS.length)]);
      setShowCommitmentReminder(true);
      return;
    }
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? workTime * 60 : 5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center space-y-10 pt-3 pb-6 animate-in fade-in duration-1000 w-full font-satoshi relative">
      
      {/* Commitment Mode Confirmation Modal */}
      {showLockConfirmation && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-xs text-center space-y-8">
            <div className="w-20 h-20 rounded-[2rem] bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
              <Lock size={40} />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tighter">Modo Compromisso</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Neste modo, o botão sair será desativado para te ajudar a manter o foco total. Você promete honrar este tempo para si mesmo?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmLock}
                className="w-full py-5 bg-white text-black rounded-full font-black shadow-2xl active:scale-95 transition-all"
              >
                Sim, eu prometo
              </button>
              <button 
                onClick={() => setShowLockConfirmation(false)}
                className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-[10px]"
              >
                Talvez depois
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commitment Reminder Modal */}
      {showCommitmentReminder && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-xs text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tighter">Honre seu Tempo</h3>
              <p className="text-gray-400 font-medium italic leading-relaxed">
                "{reminderMsg}"
              </p>
            </div>
            <button 
              onClick={() => setShowCommitmentReminder(false)}
              className={`w-full py-5 ${themeData.accentColor} text-black font-black rounded-full shadow-2xl active:scale-95 transition-all`}
            >
              Voltando ao foco
            </button>
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${mode === 'work' ? themeData.primaryColor : 'text-amber-400'}`}>
          {mode === 'work' ? <Zap size={28} /> : <Coffee size={28} />}
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-white">
          {mode === 'work' ? 'Foco Total' : 'Pausa Curta'}
        </h2>
      </div>

      <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl">
        {[25, 45, 60].map(mins => (
          <button
            key={mins}
            disabled={isActive || isLocked}
            onClick={() => handleTimeSelect(mins)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              workTime === mins 
                ? `${themeData.accentColor} text-black shadow-lg` 
                : 'text-gray-500 hover:text-gray-300'
            } disabled:opacity-30`}
          >
            {mins}m
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center w-full max-w-[280px] aspect-square mx-auto">
        <svg viewBox="0 0 320 320" className="w-full h-full -rotate-90">
          <circle cx="160" cy="160" r="115" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/5" />
          <circle 
            cx="160" cy="160" r="115" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeDasharray="722" 
            strokeDashoffset={722 - (progress / 100) * 722} 
            strokeLinecap="round" 
            className={`${mode === 'work' ? themeData.primaryColor : 'text-amber-400'} transition-all duration-1000 ease-linear shadow-2xl`} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">{mode === 'work' ? 'Trabalho' : 'Pausa'}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-2">
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 py-5 ${mode === 'work' ? themeData.accentColor : 'bg-amber-500'} text-white font-black rounded-[1.5rem] active:scale-95 transition-all text-lg shadow-xl`}
          >
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLockToggle}
              className={`flex items-center justify-center w-14 h-14 rounded-[1.5rem] border transition-all active:scale-90 ${isLocked ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'bg-white/5 border-white/5 text-gray-400'}`}
            >
              {isLocked ? <Lock size={22} /> : <Unlock size={22} />}
            </button>
            <button 
              onClick={tryExit}
              className={`flex items-center justify-center px-6 h-14 font-black rounded-[1.5rem] border active:scale-95 transition-all text-[11px] uppercase tracking-widest ${isLocked ? 'bg-white/2 border-white/2 text-gray-800' : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'}`}
            >
              Sair
            </button>
          </div>
        </div>

        {isLocked && (
          <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
            <Lock size={10} /> Modo Compromisso Ativado
          </p>
        )}
      </div>
    </div>
  );
};

export default PomodoroView;
