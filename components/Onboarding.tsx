
import React, { useState } from 'react';
import { Brain, ArrowRight, Heart } from 'lucide-react';
import { UserProfile } from '../types/index';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2) {
      onComplete({ 
        name: name.trim(), 
        age: age ? parseInt(age) : undefined 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-sm space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <header className="text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl">
            <Brain size={40} className="text-emerald-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black font-satoshi tracking-tighter text-white">EmotiTime</h1>
            <div className="space-y-1">
              <p className="text-gray-400 font-medium text-sm">Não é sobre quanto tempo passou.</p>
              <p className="text-emerald-400 font-bold text-sm">É sobre como você sentiu.</p>
            </div>
          </div>
        </header>

        <main className="space-y-10">
          {step === 1 ? (
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
          ) : (
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

          <button 
            disabled={step === 1 && !name.trim()}
            onClick={handleNext}
            className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            {step === 1 ? 'Continuar' : 'Entrar no Fluxo'}
            <ArrowRight size={20} />
          </button>
        </main>

        <footer className="text-center pt-10">
           <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
             <Heart size={10} className="text-rose-500 fill-rose-500" />
             <span>Privacidade Total · Dados Locais</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
