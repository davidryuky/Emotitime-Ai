
import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Heart, Sparkles, Stars } from 'lucide-react';
import { UserProfile } from '../types/index';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(5);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) finishOnboarding();
  };

  const finishOnboarding = () => {
    onComplete({ 
      name: name.trim(), 
      age: age ? parseInt(age) : undefined 
    });
  };

  // Timer para o passo de boas-vindas
  useEffect(() => {
    let timer: number;
    if (step === 3) {
      timer = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishOnboarding();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-8 relative overflow-hidden font-satoshi">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full"></div>
      
      <div className="w-full max-w-sm space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {step < 3 && (
          <header className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
              <Brain size={40} className="text-emerald-400" />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tighter text-white">EmotiTime</h1>
              <div className="space-y-1">
                <p className="text-gray-400 font-medium text-sm">Não é sobre quanto tempo passou.</p>
                <p className="text-emerald-400 font-bold text-sm">É sobre como você sentiu.</p>
              </div>
            </div>
          </header>
        )}

        <main className="space-y-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Como posso te chamar?</label>
                <input 
                  autoFocus
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido..."
                  className="w-full bg-[#121212] border border-white/10 rounded-2xl p-5 text-xl font-bold text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-700 shadow-inner"
                />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed italic">
                "Este será o começo de uma jornada de autoconhecimento gentil."
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Sua idade (opcional)</label>
                <input 
                  autoFocus
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Quantos anos você tem?"
                  className="w-full bg-[#121212] border border-white/10 rounded-2xl p-5 text-xl font-bold text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-gray-700 shadow-inner"
                />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed italic">
                "Isso me ajuda a entender melhor em qual fase da vida você está para te dar dicas mais precisas."
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in zoom-in-95 fade-in duration-1000 text-center py-4">
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl rotate-3">
                   <Heart size={56} className="text-white fill-white animate-bounce" />
                   <Sparkles size={24} className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow" />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">
                  Que bom ter você aqui, <span className="text-emerald-400">{name}</span>!
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-lg font-medium leading-relaxed">
                    Espero que possamos passar momentos incríveis juntos, transformando cada segundo em consciência e paz.
                  </p>
                  <p className="text-emerald-500/60 text-sm font-black uppercase tracking-[0.3em]">
                    Seu refúgio está pronto
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={finishOnboarding}
                  className="w-full py-6 bg-white text-black rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-[0_25px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all group"
                >
                  Entrar no Fluxo
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest animate-pulse">
                  Entrando automaticamente em {countdown}s...
                </p>
              </div>
            </div>
          )}

          {step < 3 && (
            <button 
              disabled={step === 1 && !name.trim()}
              onClick={handleNext}
              className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
            >
              {step === 1 ? 'Continuar' : 'Revelar Destino'}
              <ArrowRight size={20} />
            </button>
          )}
        </main>

        {step < 3 && (
          <footer className="text-center pt-10">
             <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
               <Heart size={10} className="text-rose-500 fill-rose-500" />
               <span>Privacidade Total · Dados Locais</span>
             </div>
          </footer>
        )}
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
