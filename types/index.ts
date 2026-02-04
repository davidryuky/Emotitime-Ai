
export type EmotionId = 'feliz' | 'bem' | 'neutro' | 'cansado' | 'ansioso' | 'triste' | 'irritado' | 'calmo' | 'entusiasmado' | 'solitario';
export type ThemeId = 'default' | 'ocean' | 'sunset' | 'midnight' | 'desculpa' | 'onepiece' | 'aurora' | 'mars' | 'lavender';
export type WeatherId = 'sunny' | 'cloudy' | 'rainy' | 'night';

export type JournalColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';

export interface UserProfile {
  name: string;
  age?: number;
}

export interface JournalEntry {
  date: string; // YYYY-MM-DD
  content: string;
  color?: JournalColor;
  lastUpdated: number;
}

export interface HopeCapsule {
  id: string;
  content: string;
  timestamp: number;
  authorEmotion: EmotionId;
}

export interface GratitudeStar {
  id: string;
  message: string;
  timestamp: number;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  size: number;
}

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
}

export interface Emotion {
  id: EmotionId;
  label: string;
  iconName: string;
  color: string;
}

export interface Activity {
  id: string;
  label: string;
  iconName: string;
  color: string;
}

export interface EmotionRecord {
  id: string;
  date: string;
  emotionId: EmotionId;
  intensity: number;
  activityId: string;
  timestamp: number;
  note?: string;
  weather?: WeatherId;
}

export interface InsightPattern {
  title: string;
  description: string;
  icon: string;
}

export interface Recommendation {
  id: string;
  type: 'física' | 'social' | 'mental' | 'ambiente';
  text: string;
  icon: string;
  color: string;
}

export interface MentorMessage {
  greeting: string;
  content: string;
  footnote?: string; 
  actionLabel?: string;
  actionTab?: 'breathing' | 'log';
  moodColor: string;
  recommendations: Recommendation[];
}

export interface TriggerCorrelation {
  activityId: string;
  emotionId: EmotionId;
  percentage: number;
}

export interface LocalInsights {
  patterns: InsightPattern[];
  topEmotion: Emotion | null;
  bestActivity: Activity | null;
  mentorNote: MentorMessage;
  energyLevel: number;
  batteryAdvice?: string;
  triggers: TriggerCorrelation[];
  mostFrequentActivity: Activity | null;
  timeCapsule: EmotionRecord | null;
}

export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  lastPromptTimestamp: number;
}
