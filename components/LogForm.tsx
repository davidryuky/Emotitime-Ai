
import React, { useState } from 'react';
import { EMOTIONS, THEMES, AVAILABLE_ICONS, AVAILABLE_COLORS } from '../constants/index';
import { EmotionId, Activity, ThemeId, WeatherId } from '../types/index';
import { ChevronLeft, Plus, Save, Sun, Cloud, CloudRain } from 'lucide-react';
import IconRenderer from './IconRenderer';
import { v4 as uuidv4 } from 'uuid';

interface LogFormProps {
  onSave: (data: { emotionId: EmotionId; activityId: string; intensity: number; note: string; weather: WeatherId }) => void;
  onCancel: () => void;
  activities: Activity[];
  themeId: ThemeId;
  onAddActivity?: (activity: Activity) => void;
}

const LogForm: React.FC<LogFormProps> = ({ onSave, onCancel, activities, themeId, onAddActivity }) => {
  const [step, setStep] = useState(1);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<WeatherId>('sunny');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityIcon, setNewActivityIcon] = useState('Star');
  const [newActivityColor, setNewActivityColor] = useState('text-blue-400');

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => {
    if (isCreatingActivity) {
      setIsCreatingActivity(false);
      return;
    }
    setStep(prev => prev - 1);
  };

  const handleFinish = () => {
    if (selectedEmotion && selectedActivity) {
      onSave({ 
        emotionId: selectedEmotion, 
        activityId: selectedActivity, 
        intensity, 
        note,
        weather: selectedWeather
      });
    }
  };

  const handleSaveNewActivity = () => {
    if (!newActivityName.trim() || !onAddActivity) return;
    
    const newActivity: Activity = {
      id: uuidv4(),
      label: newActivityName.trim(),
      iconName: newActivityIcon,
      color: newActivityColor
    };
    
    onAddActivity(newActivity);
    setSelectedActivity(newActivity.id);
    setIsCreatingActivity(false);
    setNewActivityName('');
    setNewActivityIcon('Star');
    nextStep();
  };

  const getIntensityHex = () => {
    switch (themeId) {
      case 'ocean': return ['#38bdf8', '#2563eb'];
      case 'sunset': return ['#fbbf24', '#e11d48'];
      case 'midnight': return ['#a78bfa', '#7c3aed'];
      case 'desculpa': return ['#f0abfc', '#d946ef'];
      case 'onepiece': return ['#ef4444', '#facc15'];
      case 'aurora': return ['#5eead4', '#a855f7'];
      case 'mars': return ['#fca5a5', '#b91c1c'];
      case 'lavender': return ['#e0e7ff', '#4338ca'];
      default: return ['#2dd4bf', '#059669'];
    }
  };

  const [colorStart, colorEnd] = getIntensityHex();

  return (
    <div className="min-h-[80vh] flex flex-col animate-in slide-in-from-right-8 duration-500 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={step === 1 ? onCancel : prevStep} className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white transition-colors active:scale-90"><ChevronLeft size={24} /></button>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${currentTheme.accentColor} transition-all duration-500 ease-out`} style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-8 flex-1">
          <h2 className="text-4xl font-black font-satoshi tracking-tight text-white leading-tight">Como está se sentindo?</h2>
          <div className="grid grid-cols-2 gap-3 pb-8">
            {EMOTIONS.map((emotion) => (
              <button 
                key={emotion.id} 
                onClick={() => { setSelectedEmotion(emotion.id); nextStep(); }} 
                className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all duration-300 ${selectedEmotion === emotion.id ? `border-white bg-white/10 scale-[0.98] shadow-2xl` : 'border-white/5 bg-neutral-900/50 hover:bg-neutral-800 active:scale-95'}`}
              >
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 ${emotion.color} shadow-lg shadow-black/20`}>
                  <IconRenderer name={emotion.iconName} size={36} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-200">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 flex-1 flex flex-col relative">
          <h2 className="text-4xl font-black font-satoshi tracking-tight text-white leading-tight">
            {isCreatingActivity ? 'Nova Atividade' : 'O que estava fazendo?'}
          </h2>
          
          {isCreatingActivity ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300 flex-1">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nome</label>
                  <input autoFocus type="text" value={newActivityName} onChange={(e) => setNewActivityName(e.target.value)} placeholder="Ex: Meditação, Yoga..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-lg font-bold focus:outline-none focus:border-white/30" maxLength={15} />
               </div>
               
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ícone</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-black/20 rounded-2xl border border-white/5">
                    {AVAILABLE_ICONS.map(icon => (
                      <button key={icon} onClick={() => setNewActivityIcon(icon)} className={`p-3 rounded-xl transition-all ${newActivityIcon === icon ? 'bg-white text-black scale-110 shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}>
                        <IconRenderer name={icon} size={20} />
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Cor</label>
                  <div className="flex flex-wrap gap-3">
                    {AVAILABLE_COLORS.map(color => (
                      <button key={color} onClick={() => setNewActivityColor(color)} className={`w-8 h-8 rounded-full transition-all ${color.replace('text-', 'bg-')} ${newActivityColor === color ? 'ring-4 ring-white/20 scale-125' : 'opacity-40 hover:opacity-100'}`} />
                    ))}
                  </div>
               </div>

               <button onClick={handleSaveNewActivity} disabled={!newActivityName.trim()} className="w-full py-5 bg-white text-black rounded-[2rem] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-xl mt-4">
                  <Save size={18} /> Criar e Selecionar
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pb-12">
              {activities.map((activity) => (
                <button key={activity.id} onClick={() => { setSelectedActivity(activity.id); nextStep(); }} className={`flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group ${selectedActivity === activity.id ? 'border-white bg-white/10 scale-[0.98] shadow-2xl' : 'border-white/5 bg-neutral-900/50 hover:bg-neutral-800 active:scale-95'}`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/5 group-hover:bg-white/10 transition-colors ${selectedActivity === activity.id ? 'text-white' : activity.color} ${selectedActivity === activity.id ? 'opacity-100' : 'opacity-60'}`}>
                    <IconRenderer name={activity.iconName} size={24} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest transition-colors ${selectedActivity === activity.id ? 'text-white' : 'text-gray-400'}`}>
                    {activity.label}
                  </span>
                </button>
              ))}
              
              <button onClick={() => setIsCreatingActivity(true)} className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-transparent hover:bg-white/5 active:scale-95 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-white/5 group-hover:bg-white/10 text-gray-500 group-hover:text-white transition-colors">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Nova</span>
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-12 flex-1">
          <div className="space-y-4">
            <h2 className="text-4xl font-black font-satoshi tracking-tight text-white leading-tight">Qual a intensidade?</h2>
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl w-fit">
              <button onClick={() => setSelectedWeather('sunny')} className={`p-3 rounded-xl transition-all ${selectedWeather === 'sunny' ? 'bg-amber-400 text-black shadow-lg' : 'text-gray-500'}`}><Sun size={20} /></button>
              <button onClick={() => setSelectedWeather('cloudy')} className={`p-3 rounded-xl transition-all ${selectedWeather === 'cloudy' ? 'bg-slate-400 text-black shadow-lg' : 'text-gray-500'}`}><Cloud size={20} /></button>
              <button onClick={() => setSelectedWeather('rainy')} className={`p-3 rounded-xl transition-all ${selectedWeather === 'rainy' ? 'bg-blue-400 text-black shadow-lg' : 'text-gray-500'}`}><CloudRain size={20} /></button>
            </div>
          </div>
          
          <div className="space-y-14 px-2 pt-4">
            <div className="relative group">
              <input type="range" min="1" max="5" step="1" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full h-4 rounded-full appearance-none cursor-pointer bg-neutral-900 border border-white/5 accent-white transition-all shadow-inner" style={{ background: `linear-gradient(to right, ${colorStart}, ${colorEnd} ${(intensity - 1) * 25}%, #1a1a1a ${(intensity - 1) * 25}%)` }} />
              <div className="flex justify-between mt-8 px-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button key={val} onClick={() => setIntensity(val)} className="flex flex-col items-center gap-4 transition-all duration-300">
                    <div className={`w-3 h-3 rounded-full transition-all duration-500 ${intensity === val ? 'bg-white scale-150 shadow-[0_0_20px_white]' : 'bg-white/10'}`} />
                    <span className={`text-xs font-black tracking-tight transition-colors ${intensity === val ? 'text-white scale-125' : 'text-gray-600'}`}>{val}</span>
                  </button>
                ))}
              </div>
            </div>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Como foi essa experiência? (opcional)" className="w-full bg-[#151515] border border-white/5 rounded-[2.5rem] p-8 text-gray-200 focus:outline-none focus:border-white/20 resize-none h-40 text-lg shadow-inner transition-all placeholder:text-gray-700 break-words" maxLength={100} />
          </div>
          <button onClick={handleFinish} className={`w-full py-5 rounded-[2rem] ${currentTheme.accentColor} text-black font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border-t border-white/10`}>Registrar Momento</button>
        </div>
      )}
    </div>
  );
};

export default LogForm;
