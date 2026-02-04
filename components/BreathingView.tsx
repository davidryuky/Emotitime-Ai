
import React, { useState, useEffect } from 'react';
import { Wind, RotateCcw, X, Lock, Heart, Check, Unlock, Sparkles, AlertCircle } from 'lucide-react';
import { ThemeId } from '../types/index';
import { THEMES } from '../constants/index';

interface BreathingViewProps {
  themeId: ThemeId;
  onExit: () => void;
}

const COMMITMENT_REMINDERS = [
  "Você firmou um compromisso com sua paz. Que tal respirar mais um pouco e sentir o agora?",
  "Sua mente pediu essa pausa. Honre o tempo que você separou para cuidar de você.",
  "O mundo lá fora pode esperar 5 minutos. Use este tempo para relaxar, talvez brincar com seu pet depois?",
  "Fazer uma pausa não é parar, é ganhar impulso. Você prometeu este momento ao seu coração.",
  "Respire fundo. Esse tempo é sagrado e só pertence a você. Não desista do seu bem-estar."
];

const BreathingView: React.FC<BreathingViewProps> = ({ themeId, onExit }) => {
  const [phase, setPhase] = useState<'Inale' | 'Segure' | 'Exale' | 'Ready'>('Ready');
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockClicks, setLockClicks] = useState(0);
  const [showLockConfirmation, setShowLockConfirmation] = useState(false);
  const [showCommitmentReminder, setShowCommitmentReminder] = useState(false);
  const [reminderMsg, setReminderMsg] = useState('');

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        setTimer((t) => {
          const next = t + 1;
          if (next <= 4) setPhase('Inale');
          else if (next <= 8) setPhase('Segure');
          else if (next <= 12) setPhase('Exale');
          else return 1;
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const toggleExercise = () => {
    setIsActive(!isActive);
    if (!isActive) setTimer(1);
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

  const reset = () => {
    setIsActive(false);
    setPhase('Ready');
    setTimer(0);
    setIsLocked(false);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 pt-1 pb-10 animate-in fade-in duration-1000 relative">
      
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
                Ao ativar, você firma um pacto consigo mesmo de não sair até terminar sua prática de autocuidado. Aceita o desafio?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmLock}
                className="w-full py-5 bg-white text-black rounded-full font-black shadow-2xl active:scale-95 transition-all"
              >
                Sim, eu aceito
              </button>
              <button 
                onClick={() => setShowLockConfirmation(false)}
                className="w-full py-4 text-gray-500 font-black uppercase tracking-widest text-[10px]"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commitment Reminder Modal */}
      {showCommitmentReminder && (
        <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-xs text-center space-y-8">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-emerald-400">
              <Sparkles size={40} className="animate-pulse" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white tracking-tighter">Lembre-se do Pacto</h3>
              <p className="text-gray-400 font-medium italic leading-relaxed">
                "{reminderMsg}"
              </p>
            </div>
            <button 
              onClick={() => setShowCommitmentReminder(false)}
              className={`w-full py-5 ${currentTheme.accentColor} text-black font-black rounded-full shadow-2xl active:scale-95 transition-all`}
            >
              Continuar cuidando de mim
            </button>
          </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 ${currentTheme.primaryColor}`}>
          <Wind size={28} />
        </div>
        <h2 className="text-4xl font-black font-satoshi tracking-tighter text-white">Respire Fundo</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto font-medium">
          Técnica 4-4-4. Encontre seu centro.
        </p>
      </div>

      <div className="relative flex items-center justify-center w-64 h-64 mx-auto">
        <div 
          className={`absolute inset-0 rounded-full border-4 ${currentTheme.accentColor.replace('bg-', 'border-')}/20 transition-all duration-1000 ease-in-out ${
            phase === 'Inale' ? 'scale-110 opacity-100 bg-white/10' : 
            phase === 'Exale' ? 'scale-75 opacity-50 bg-transparent' : 
            phase === 'Segure' ? 'scale-110 opacity-80 bg-white/20' : 'scale-90 opacity-30'
          }`}
        />
        <div className="z-10 text-center">
          <p className={`text-3xl font-black tracking-widest uppercase ${currentTheme.primaryColor}`}>
            {phase === 'Ready' ? 'Pronto?' : phase}
          </p>
          {isActive && <p className="text-white/40 mt-3 font-black text-xl">{timer % 4 === 0 ? 4 : timer % 4}s</p>}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-2">
        <div className="flex items-center gap-2 w-full">
          <button 
            onClick={toggleExercise}
            className={`flex-1 flex items-center justify-center gap-3 py-5 ${currentTheme.accentColor} text-white font-black rounded-[2rem] active:scale-95 transition-all text-lg shadow-xl`}
          >
            {isActive ? 'Pausar' : 'Começar'}
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

        {(isActive || phase !== 'Ready') && (
          <button onClick={reset} className="flex items-center gap-2 text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <RotateCcw size={14} /> Reiniciar
          </button>
        )}
      </div>

      {isLocked && (
        <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
          <Lock size={10} /> Modo Compromisso Ativado
        </p>
      )}
    </div>
  );
};

export default BreathingView;
