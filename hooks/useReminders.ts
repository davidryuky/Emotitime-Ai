
import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ReminderSettings } from '../types/index';

export const useReminders = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [settings, setSettings] = useState<ReminderSettings>(storage.getReminderSettings());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!settings.enabled || showPrompt) return;

      const now = Date.now();
      if (now - settings.lastPromptTimestamp >= settings.intervalMinutes * 60000) {
        setShowPrompt(true);
        if (Notification.permission === 'granted') {
          new Notification('EmotiTime', { body: 'Como você está agora?' });
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [settings, showPrompt]);

  const updateSettings = (newSettings: Partial<ReminderSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storage.saveReminderSettings(updated);
  };

  const closePrompt = () => {
    setShowPrompt(false);
    updateSettings({ lastPromptTimestamp: Date.now() });
  };

  return { showPrompt, settings, updateSettings, closePrompt };
};
