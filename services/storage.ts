
import { STORAGE_KEYS, DEFAULT_ACTIVITIES } from '../constants/index';
import { EmotionRecord, Activity, ReminderSettings, UserProfile, ThemeId, JournalEntry, HopeCapsule } from '../types/index';

export const storage = {
  getRecords: (): EmotionRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },

  saveRecords: (records: EmotionRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  },

  getActivities: (): Activity[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : DEFAULT_ACTIVITIES;
  },

  saveActivities: (activities: Activity[]) => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  getReminderSettings: (): ReminderSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : { enabled: false, intervalMinutes: 120, lastPromptTimestamp: Date.now() };
  },

  saveReminderSettings: (settings: ReminderSettings) => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(settings));
  },

  getProfile: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getTheme: (): ThemeId => {
    const data = localStorage.getItem(STORAGE_KEYS.THEME);
    return (data as ThemeId) || 'default';
  },

  saveTheme: (theme: ThemeId) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  getJournalEntries: (): Record<string, JournalEntry> => {
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return data ? JSON.parse(data) : {};
  },

  saveJournalEntry: (entry: JournalEntry) => {
    const entries = storage.getJournalEntries();
    entries[entry.date] = entry;
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  },

  getHopeCapsules: (): HopeCapsule[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CAPSULES);
    return data ? JSON.parse(data) : [];
  },

  saveHopeCapsule: (capsule: HopeCapsule) => {
    const capsules = storage.getHopeCapsules();
    localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify([...capsules, capsule]));
  },

  deleteHopeCapsule: (id: string) => {
    const capsules = storage.getHopeCapsules();
    localStorage.setItem(STORAGE_KEYS.CAPSULES, JSON.stringify(capsules.filter(c => c.id !== id)));
  },

  exportData: () => {
    const fullData: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) fullData[key] = JSON.parse(val);
    });
    return JSON.stringify(fullData, null, 2);
  },

  importData: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      Object.entries(data).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key as any)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      return true;
    } catch (e) {
      console.error("Erro ao importar dados:", e);
      return false;
    }
  }
};
