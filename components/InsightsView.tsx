
import React, { useMemo } from 'react';
import { EmotionRecord, LocalInsights, ThemeId, Activity } from '../types/index';
import { EMOTIONS, DEFAULT_ACTIVITIES, THEMES } from '../constants/index';
import { 
  Zap, TrendingUp, Calendar, 
  Target, Activity as ActivityIcon, Info, Sparkles, Clock
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InsightsViewProps {
  records: EmotionRecord[];
  localInsights: LocalInsights & { triggers?: any[], mostFrequentActivity?: Activity | null };
  themeId: ThemeId;
}

const InsightsView: React.FC<InsightsViewProps> = ({ records, localInsights, themeId }) => {
  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const radarData = useMemo(() => {
    if (records.length < 3) return [];
    
    const counts: Record<string, number> = {};
    records.forEach(r => {
      counts[r.emotionId] = (counts[r.emotionId] || 0) + 1;
    });

    return EMOTIONS.filter(e => counts[e.id] > 0).map(e => ({
      subject: e.label,
      full: 100,
      value: (counts[e.id] / records.length) * 100,
      id: e.id
    }));
  }, [records]);

  const flowData = useMemo(() => {
    if (records.length < 3) return [];
    
    return [...records].slice(0, 12).reverse().map(r => {
      const emotion = EMOTIONS.find(e => e.id === r.emotionId);
      const activity = DEFAULT_ACTIVITIES.find(a => a.id === r.activityId);
      const colorRaw = emotion?.color.split(' ')[1]?.replace('text-', '') || 'gray';

      return {
        time: format(r.timestamp, 'HH:mm'),
        intensity: r.intensity,
        label: emotion?.label,
        activity: activity?.label,
        color: getColorHex(colorRaw)
      };
    });
  }, [records]);

  function getColorHex(colorName: string) {
    const map: Record<string, string> = {
      'emerald-300': '#34d399', 'teal-300': '#2dd4bf', 'sky-300': '#7dd3fc',
      'orange-300': '#fdba74', 'slate-300': '#cbd5e1', 'amber-300': '#fbbf24',
      'violet-300': '#a78bfa', 'indigo-300': '#818cf8', 'blue-300': '#60a5fa',
      'rose-300': '#fb7185'
    };
    return map[colorName] || '#555';
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#111] border border-white/10 p-4 rounded-[2rem] shadow-2xl backdrop-blur-xl border-t-white/20">
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-2">{data.time || data.subject}</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color || currentTheme.accentColor.replace('bg-', '#') }} />
            <p className="text-sm font-bold text-white">{data.label || `${Math.round(data.value)}%`}</p>
          </div>
          {data.activity && <p className="text-[10px] text-gray-500 mt-1 font-medium">{data.activity}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 font-satoshi">
      <header className="px-1">
        <h2 className="text-4xl font-black tracking-tighter text-white leading-none">Status</h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">Sua biometria emocional processada.</p>
      </header>

      {records.length < 3 ? (
        <section className="bg-[#0f0f0f] border border-white/5 rounded-[3rem] p-12 text-center space-y-8 shadow-2xl">
           <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto animate-pulse">
             <Target className="text-gray-700" size={40} />
           </div>
           <div className="space-y-3">
             <h3 className="text-white font-black text-xl uppercase tracking-tighter">Calibrando Lentes</h3>
             <p className="text-gray-500 text-xs font-medium leading-relaxed max-w-[200px] mx-auto">
               Faltam {3 - records.length} {3 - records.length === 1 ? 'registro' : 'registros'} para desbloquear a análise spider e o fluxo de intensidade.
             </p>
           </div>
        </section>
      ) : (
        <>
          {/* Lente 1: Radar do Ser */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black flex items-center gap-3">
                <Target size={14} className={currentTheme.primaryColor} /> Radar de Frequência
              </h3>
            </div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[3.5rem] p-4 h-[350px] shadow-2xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900, letterSpacing: '1px' }} 
                  />
                  <Radar
                    name="Sentimentos"
                    dataKey="value"
                    stroke={getColorHex(currentTheme.primaryColor.replace('text-', ''))}
                    fill={getColorHex(currentTheme.primaryColor.replace('text-', ''))}
                    fillOpacity={0.2}
                    animationDuration={1500}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Lente 2: Fluxo de Intensidade */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black flex items-center gap-3">
                <ActivityIcon size={14} className={currentTheme.primaryColor} /> Fluxo de Intensidade
              </h3>
            </div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[3.5rem] p-6 h-72 shadow-2xl relative overflow-hidden">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={getColorHex(currentTheme.primaryColor.replace('text-', ''))} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={getColorHex(currentTheme.primaryColor.replace('text-', ''))} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} dy={10} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke={getColorHex(currentTheme.primaryColor.replace('text-', ''))} 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorIntensity)" 
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle 
                            cx={cx} cy={cy} r={6} 
                            fill={payload.color} 
                            stroke="#0f0f0f" 
                            strokeWidth={3} 
                            className="shadow-xl"
                          />
                        );
                      }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      animationDuration={2000}
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </section>

          {/* Card de Foco Dominante Corrigido: Agora usa mostFrequentActivity que é correlacionada à TopEmotion */}
          <section className="animate-in slide-in-from-bottom-4 duration-1000">
             <div className="bg-[#151515] border border-white/5 rounded-[3rem] p-8 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className={`absolute -right-10 -top-10 w-32 h-32 ${currentTheme.accentColor} opacity-5 blur-[40px] rounded-full`} />
                
                <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/5 flex items-center justify-center shrink-0 ${currentTheme.primaryColor}`}>
                   <Sparkles size={28} />
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Predominância</p>
                   <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                     Você tem se sentido <span className={currentTheme.primaryColor}>{localInsights.topEmotion?.label || 'Estável'}</span> principalmente durante <span className="text-white">{localInsights.mostFrequentActivity?.label || localInsights.bestActivity?.label || 'seus momentos'}.</span>
                   </h4>
                </div>
             </div>
          </section>
        </>
      )}

      {/* Grid de Stats Minimalista */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 space-y-4 shadow-xl">
          <Calendar size={20} className="text-gray-700" />
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Registros</p>
            <p className="text-2xl font-black text-white tracking-tight mt-1">{records.length}</p>
          </div>
        </div>
        <div className="p-8 rounded-[2.5rem] bg-[#121212] border border-white/5 space-y-4 shadow-xl">
          <Zap size={20} className={currentTheme.primaryColor} />
          <div>
            <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">Energia</p>
            <p className="text-2xl font-black text-white tracking-tight mt-1">
              {records.length > 0 ? (records.reduce((acc, r) => acc + r.intensity, 0) / records.length).toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsView;
