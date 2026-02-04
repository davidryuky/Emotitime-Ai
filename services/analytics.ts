
import { EmotionRecord, InsightPattern, LocalInsights, UserProfile, EmotionId, Activity, WeatherId, TriggerCorrelation } from '../types/index';
import { EMOTIONS, DEFAULT_ACTIVITIES } from '../constants/index';
import { mentorEngine } from './mentor';

export const analytics = {
  calculateInsights: (records: EmotionRecord[], profile: UserProfile | null, allActivities: Activity[] = DEFAULT_ACTIVITIES): LocalInsights => {
    const mentorNote = mentorEngine.generateNote(records, profile);
    
    if (records.length === 0) {
      return { 
        patterns: [], 
        topEmotion: null, 
        bestActivity: null, 
        mentorNote, 
        triggers: [], 
        timeCapsule: null, 
        mostFrequentActivity: null, 
        energyLevel: 100,
        batteryAdvice: "Sua jornada começa agora. Vamos manter esse brilho!"
      };
    }

    // 1. Top Emotion
    const emotionCounts = records.reduce((acc, r) => {
      acc[r.emotionId] = (acc[r.emotionId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topEmotionId = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0][0] as EmotionId;
    const topEmotion = EMOTIONS.find(e => e.id === topEmotionId) || null;

    // 2. Most Frequent Activity
    const emotionSpecificActivities = records
      .filter(r => r.emotionId === topEmotionId)
      .reduce((acc, r) => {
        acc[r.activityId] = (acc[r.activityId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topActivityIdForEmotion = Object.entries(emotionSpecificActivities).length > 0
      ? Object.entries(emotionSpecificActivities).sort((a, b) => b[1] - a[1])[0][0]
      : records[0].activityId;
    
    // CORREÇÃO: Busca na lista dinâmica 'allActivities' passada por parâmetro, não apenas nas DEFAULT
    const mostFrequentActivity = allActivities.find(a => a.id === topActivityIdForEmotion) || null;

    // 3. Emotional Battery (Life Bar)
    let energy = 100;
    const recentRecords = [...records].slice(0, 15).reverse();
    
    recentRecords.forEach(r => {
      // Atividades recarregam ou drenam
      if (['descanso', 'lazer', 'reflexao'].includes(r.activityId)) energy += 12;
      if (['trabalho', 'estudo', 'redes_sociais'].includes(r.activityId)) energy -= 8;
      
      // Emoções impactam a energia
      if (['feliz', 'entusiasmado', 'calmo', 'bem'].includes(r.emotionId)) energy += 15;
      if (['triste', 'irritado', 'ansioso', 'cansado', 'solitario'].includes(r.emotionId)) energy -= 18;
      
      energy = Math.min(100, Math.max(5, energy));
    });

    // 4. Dynamic Battery Advice
    let batteryAdvice = "Esta é sua bateria emocional, vamos deixar ela cheia sempre que possível, ok?";
    
    if (energy === 100) {
      const praises = [
        "Incrível! Sua bateria está no máximo. Você está radiante hoje!",
        "Energia total detectada! Aproveite esse estado de plenitude.",
        "100% de luz! Você é sua melhor versão agora."
      ];
      batteryAdvice = praises[Math.floor(Math.random() * praises.length)];
    } else if (energy < 50) {
      // Sugestão baseada em atividades positivas históricas
      const positiveRecords = records.filter(r => ['feliz', 'calmo', 'bem'].includes(r.emotionId));
      const helpfulActivityId = positiveRecords.length > 0 ? positiveRecords[0].activityId : 'descanso';
      
      // Busca o label na lista dinâmica
      const activityObj = allActivities.find(a => a.id === helpfulActivityId);
      const helpfulActivity = activityObj?.label || "um descanso";
      
      batteryAdvice = `Nível crítico! Notei que ${helpfulActivity.toLowerCase()} costuma te recarregar. Que tal tentar agora?`;
    } else if (energy < 75) {
      batteryAdvice = "Atenção: sua energia está baixando. Lembre-se que pequenas pausas fazem milagres.";
    }

    return { 
      patterns: [], 
      topEmotion, 
      bestActivity: null, 
      mentorNote, 
      triggers: [], 
      timeCapsule: null,
      mostFrequentActivity,
      energyLevel: energy,
      batteryAdvice
    };
  }
};
