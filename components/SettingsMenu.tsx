
import React, { useState, useRef } from 'react';
import { X, Bell, Shield, Share2, Palette, ChevronDown, ChevronRight, HardDrive, Download, Upload, CheckCircle2, Smartphone, LayoutGrid, RotateCcw, Heart } from 'lucide-react';
import { THEMES, DEFAULT_ACTIVITIES } from '../constants/index';
import { ThemeId, ReminderSettings, Activity } from '../types/index';
import { storage } from '../services/storage';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import IconRenderer from './IconRenderer';

interface SettingsMenuProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  onClose: () => void;
  onActivitiesChange?: (activities: Activity[]) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ currentTheme, onThemeChange, onClose, onActivitiesChange }) => {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(storage.getReminderSettings());
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showBackupDropdown, setShowBackupDropdown] = useState(false);
  const [currentActivities, setCurrentActivities] = useState<Activity[]>(storage.getActivities());
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isInstallable, installApp } = useInstallPrompt();
  const themeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  const toggleReminders = () => {
    const newSettings = { ...reminderSettings, enabled: !reminderSettings.enabled, lastPromptTimestamp: Date.now() };
    setReminderSettings(newSettings);
    storage.saveReminderSettings(newSettings);
    if (newSettings.enabled && "Notification" in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleDeleteActivity = (id: string) => {
    if (currentActivities.length <= 1) return;
    const updated = currentActivities.filter(a => a.id !== id);
    setCurrentActivities(updated);
    if (onActivitiesChange) onActivitiesChange(updated);
  };

  const handleResetActivities = () => {
    if (confirm('Restaurar atividades padrão?')) {
      setCurrentActivities(DEFAULT_ACTIVITIES);
      if (onActivitiesChange) onActivitiesChange(DEFAULT_ACTIVITIES);
    }
  };

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotitime_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importData(content);
      if (success) {
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[200] animate-in slide-in-from-bottom duration-500 overflow-y-auto flex flex-col">
      <div className="p-8 pt-12 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter">Ajustes</h3>
          <p className={`text-[10px] uppercase tracking-[0.3em] ${themeData.primaryColor} font-black mt-1`}>Personalize seu refúgio</p>
        </div>
        <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90"><X size={28} /></button>
      </div>

      <div className="flex-1 p-8 space-y-12 pb-32">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500"><Palette size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Estilo do Espaço</span></div>
          <div className="relative">
            <button onClick={() => setShowThemeDropdown(!showThemeDropdown)} className="w-full bg-[#151515] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group active:bg-[#1a1a1a] transition-all">
              <div className="flex items-center gap-4"><div className={`w-8 h-8 rounded-full ${themeData.accentColor} shadow-lg`} /><span className="font-black text-white text-lg">{themeData.label}</span></div>
              <ChevronDown className={`text-gray-500 transition-transform duration-300 ${showThemeDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showThemeDropdown && (
              <div className="absolute top-full left-0 w-full mt-3 bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-3 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                <div className="grid gap-2">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => { onThemeChange(theme.id); setShowThemeDropdown(false); }} className={`flex items-center justify-between p-5 rounded-[1.8rem] transition-all ${currentTheme === theme.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}>
                      <div className="flex items-center gap-4"><div className={`w-6 h-6 rounded-full ${theme.accentColor}`} /><span className={`font-bold ${currentTheme === theme.id ? 'text-white' : 'text-gray-400'}`}>{theme.label}</span></div>
                      {currentTheme === theme.id && <div className={`w-2 h-2 rounded-full ${theme.accentColor} animate-pulse`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
           <div className="flex items-center justify-between text-gray-500"><div className="flex items-center gap-3"><LayoutGrid size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Gerenciar Atividades</span></div>
            <button onClick={handleResetActivities} className="text-[10px] uppercase font-black tracking-widest text-gray-600 hover:text-rose-500 flex items-center gap-1 transition-colors"><RotateCcw size={10} /> Resetar</button>
          </div>
          <div className="bg-[#151515] border border-white/5 rounded-[2.5rem] p-6 space-y-6">
             <div className="flex flex-wrap gap-2">
               {currentActivities.map(activity => (
                 <div key={activity.id} className="relative group/tag">
                   <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2 border border-white/5">
                     <div className={activity.color}><IconRenderer name={activity.iconName} size={14} /></div>
                     <span className="text-xs font-bold text-gray-300">{activity.label}</span>
                   </div>
                   <button onClick={() => handleDeleteActivity(activity.id)} className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-opacity active:scale-90"><X size={10} strokeWidth={3} /></button>
                 </div>
               ))}
             </div>
             <p className="text-[10px] text-gray-600 text-center font-medium">Crie novas atividades diretamente no fluxo de registro.</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500"><HardDrive size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Dados e Backup</span></div>
          <button onClick={() => setShowBackupDropdown(!showBackupDropdown)} className="w-full bg-[#151515] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group active:bg-[#1a1a1a] transition-all">
            <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"><Download size={18} /></div><span className="font-black text-white text-lg">Importar / Exportar</span></div>
            <ChevronDown className={`text-gray-500 transition-transform duration-300 ${showBackupDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showBackupDropdown && (
            <div className="mt-3 bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] p-3 shadow-2xl z-30">
              <div className="grid gap-3 p-2">
                <button onClick={handleExport} className="flex items-center gap-4 p-5 rounded-[1.8rem] hover:bg-white/5 transition-all"><div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400"><Download size={20} /></div><div className="text-left"><span className="block font-bold text-white">Exportar JSON</span><span className="text-[10px] text-gray-500 uppercase font-black">Baixar backup</span></div></button>
                <button onClick={handleImportClick} className="flex items-center gap-4 p-5 rounded-[1.8rem] hover:bg-white/5 transition-all"><div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Upload size={20} /></div><div className="text-left"><span className="block font-bold text-white">Importar Backup</span><span className="text-[10px] text-gray-500 uppercase font-black">Restaurar .json</span></div></button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                {importStatus === 'success' && <div className="p-4 bg-emerald-500/10 rounded-2xl flex items-center gap-3 text-emerald-400"><CheckCircle2 size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Sucesso! Recarregando...</span></div>}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500"><Bell size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Lembretes</span></div>
          <div className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5 flex items-center justify-between">
            <div><p className="text-xl font-black text-white">Pausas Gentis</p><p className="text-sm text-gray-500 mt-1">Sugerir registros periódicos.</p></div>
            <button onClick={toggleReminders} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all ${reminderSettings.enabled ? `${themeData.accentColor}` : 'bg-neutral-800'}`}><span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${reminderSettings.enabled ? 'translate-x-7' : 'translate-x-1'}`} /></button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500"><Shield size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Sua Privacidade</span></div>
          <div className="bg-[#151515] rounded-[2.5rem] p-8 border border-white/5"><p className="text-gray-400 leading-relaxed font-medium">Seus dados ficam guardados apenas neste aparelho. Nenhuma informação é enviada para servidores.</p></div>
        </section>

        <div className="space-y-8 pt-4">
          <div className="grid gap-3">
            {isInstallable && <button onClick={installApp} className="flex items-center justify-between p-6 bg-white rounded-[2rem] text-black font-bold active:scale-95 transition-all"><div className="flex items-center gap-4"><Smartphone size={20} /><span>Instalar Aplicativo</span></div><ChevronRight size={18} /></button>}
            <button className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 text-gray-300 font-bold active:scale-95 transition-all"><div className="flex items-center gap-4"><Share2 size={20} className={themeData.primaryColor} /><span>Compartilhar App</span></div><ChevronRight size={18} /></button>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 space-y-6 text-center">
            <p className="text-sm text-gray-500 font-medium italic leading-relaxed">
              Desenvolvi este App para ajudar pessoas com problemas de foco e dificuldades sociais como eu. É gratuito e sem anúncios e sempre sera! ❤️
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${themeData.primaryColor}`}><Heart size={18} fill="currentColor" className="opacity-50" /></div>
              <div className="flex flex-col items-start"><span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Desenvolvido por:</span><span className={`text-sm font-black transition-colors ${themeData.primaryColor}`}>Davi .S</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
