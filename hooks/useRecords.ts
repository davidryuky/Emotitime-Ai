
import { useState, useEffect, useMemo } from 'react';
import { storage } from '../services/storage';
import { analytics } from '../services/analytics';
import { EmotionRecord, EmotionId, LocalInsights, UserProfile, Activity } from '../types/index';
import { v4 as uuidv4 } from 'uuid';

export const useRecords = (profile: UserProfile | null, activities: Activity[]) => {
  const [records, setRecords] = useState<EmotionRecord[]>([]);

  useEffect(() => {
    const loaded = storage.getRecords();
    setRecords(loaded);
  }, []);

  const localInsights = useMemo(() => {
    // Passamos activities para que a análise reconheça itens customizados
    return analytics.calculateInsights(records, profile, activities);
  }, [records, profile, activities]);

  const addRecord = (data: { emotionId: EmotionId; activityId: string; intensity: number; note: string }) => {
    const newRecord: EmotionRecord = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      ...data
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    storage.saveRecords(updated);
    return newRecord;
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    storage.saveRecords(updated);
  };

  return { records, localInsights, addRecord, deleteRecord };
};
