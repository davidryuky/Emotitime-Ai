
import { Emotion, ThemeConfig, Activity, JournalColor } from '../types/index';

export const EMOTIONS: Emotion[] = [
  { id: 'feliz', label: 'Feliz', iconName: 'Sun', color: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' },
  { id: 'bem', label: 'Bem', iconName: 'Smile', color: 'bg-teal-400/20 text-teal-300 border-teal-400/30' },
  { id: 'calmo', label: 'Calmo', iconName: 'Cloud', color: 'bg-sky-400/20 text-sky-300 border-sky-400/30' },
  { id: 'entusiasmado', label: 'Empolgado', iconName: 'Zap', color: 'bg-orange-400/20 text-orange-300 border-orange-400/30' },
  { id: 'neutro', label: 'Neutro', iconName: 'Meh', color: 'bg-slate-400/20 text-slate-300 border-slate-400/30' },
  { id: 'cansado', label: 'Cansado', iconName: 'Moon', color: 'bg-amber-400/20 text-amber-300 border-amber-400/30' },
  { id: 'ansioso', label: 'Ansioso', iconName: 'Activity', color: 'bg-violet-400/20 text-violet-300 border-violet-400/30' },
  { id: 'solitario', label: 'Solitário', iconName: 'User', color: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30' },
  { id: 'triste', label: 'Triste', iconName: 'CloudRain', color: 'bg-blue-400/20 text-blue-300 border-blue-400/30' },
  { id: 'irritado', label: 'Irritado', iconName: 'Flame', color: 'bg-rose-400/20 text-rose-300 border-rose-400/30' },
];

export const JOURNAL_COLORS: { id: JournalColor; bg: string; border: string; label: string }[] = [
  { id: 'default', bg: 'bg-white/5', border: 'border-white/10', label: 'Padrão' },
  { id: 'gray', bg: 'bg-gray-400/10', border: 'border-gray-400/20', label: 'Cinza' },
  { id: 'brown', bg: 'bg-amber-900/20', border: 'border-amber-800/30', label: 'Marrom' },
  { id: 'orange', bg: 'bg-orange-500/15', border: 'border-orange-500/20', label: 'Laranja' },
  { id: 'yellow', bg: 'bg-yellow-500/15', border: 'border-yellow-500/20', label: 'Amarelo' },
  { id: 'green', bg: 'bg-emerald-500/15', border: 'border-emerald-500/20', label: 'Verde' },
  { id: 'blue', bg: 'bg-blue-500/15', border: 'border-blue-500/20', label: 'Azul' },
  { id: 'purple', bg: 'bg-purple-500/15', border: 'border-purple-500/20', label: 'Roxo' },
  { id: 'pink', bg: 'bg-pink-500/15', border: 'border-pink-500/20', label: 'Rosa' },
  { id: 'red', bg: 'bg-rose-500/15', border: 'border-rose-500/20', label: 'Vermelho' },
];

export const THEMES: ThemeConfig[] = [
  { id: 'default', label: 'Esmeralda', primaryColor: 'text-emerald-400', accentColor: 'bg-emerald-500', bgGradient: 'from-emerald-500/10 via-transparent to-transparent' },
  { id: 'ocean', label: 'Oceano', primaryColor: 'text-blue-400', accentColor: 'bg-blue-500', bgGradient: 'from-blue-500/10 via-transparent to-transparent' },
  { id: 'sunset', label: 'Crepúsculo', primaryColor: 'text-orange-400', accentColor: 'bg-orange-500', bgGradient: 'from-rose-500/10 via-transparent to-transparent' },
  { id: 'midnight', label: 'Mistério', primaryColor: 'text-violet-400', accentColor: 'bg-violet-500', bgGradient: 'from-indigo-500/10 via-transparent to-transparent' },
  { id: 'desculpa', label: 'Desculpa', primaryColor: 'text-fuchsia-300', accentColor: 'bg-fuchsia-400', bgGradient: 'from-fuchsia-500/10 via-transparent to-transparent' },
  { id: 'onepiece', label: 'One Piece', primaryColor: 'text-red-500', accentColor: 'bg-yellow-400', bgGradient: 'from-red-600/15 via-blue-500/5 to-transparent' },
  { id: 'aurora', label: 'Aurora', primaryColor: 'text-teal-300', accentColor: 'bg-teal-400', bgGradient: 'from-teal-500/20 via-purple-500/10 to-transparent' },
  { id: 'mars', label: 'Marte', primaryColor: 'text-red-400', accentColor: 'bg-red-500', bgGradient: 'from-red-500/10 via-orange-500/5 to-transparent' },
  { id: 'lavender', label: 'Lavanda', primaryColor: 'text-indigo-300', accentColor: 'bg-indigo-400', bgGradient: 'from-indigo-400/15 via-pink-300/5 to-transparent' },
];

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'trabalho', label: 'Trabalho', iconName: 'Briefcase', color: 'text-blue-400' },
  { id: 'estudo', label: 'Estudo', iconName: 'BookOpen', color: 'text-indigo-400' },
  { id: 'redes_sociais', label: 'Redes sociais', iconName: 'Smartphone', color: 'text-purple-400' },
  { id: 'descanso', label: 'Descanso', iconName: 'Coffee', color: 'text-amber-400' },
  { id: 'exercicio', label: 'Exercício', iconName: 'Dumbbell', color: 'text-rose-400' },
  { id: 'conversa', label: 'Conversa', iconName: 'MessageSquare', color: 'text-teal-400' },
  { id: 'lazer', label: 'Lazer', iconName: 'Gamepad2', color: 'text-orange-400' },
  { id: 'reflexao', label: 'Refletir', iconName: 'Compass', color: 'text-emerald-400' },
];

export const AVAILABLE_ICONS = [
  'Briefcase', 'BookOpen', 'Smartphone', 'Coffee', 'Dumbbell', 'MessageSquare', 
  'Gamepad2', 'Compass', 'Music', 'Tv', 'ShoppingBag', 'Utensils', 'Bed', 
  'Car', 'Plane', 'Code', 'Cat', 'Dog', 'Sun', 'Moon', 'Star', 'Heart', 
  'Headphones', 'Camera', 'PenTool', 'Palette', 'Leaf', 'Home', 'Zap', 'Anchor'
];

export const AVAILABLE_COLORS = [
  'text-blue-400', 'text-indigo-400', 'text-purple-400', 'text-amber-400', 
  'text-rose-400', 'text-teal-400', 'text-orange-400', 'text-emerald-400', 
  'text-sky-400', 'text-fuchsia-400', 'text-red-400', 'text-yellow-400', 'text-gray-400'
];

export const STORAGE_KEYS = {
  RECORDS: 'emotitime_records',
  ACTIVITIES: 'emotitime_activities',
  REMINDERS: 'emotitime_reminder_settings',
  PROFILE: 'emotitime_user_profile',
  THEME: 'emotitime_theme',
  JOURNAL: 'emotitime_journal',
  CAPSULES: 'emotitime_hope_capsules',
  GRATITUDE: 'emotitime_gratitude_stars'
};
