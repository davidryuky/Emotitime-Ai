
import { EmotionRecord, MentorMessage, Recommendation, EmotionId, UserProfile } from '../types/index';

const PHILOSOPHY_NUGGETS = [
  "O que importa não é o que acontece, mas como você reage. — Epicteto",
  "A paz vem de dentro. Não a procure fora. — Buda",
  "Sua mente é seu próprio lugar, e nela mesma pode fazer do céu um inferno. — John Milton",
  "A felicidade da sua vida depende da qualidade dos seus pensamentos. — Marco Aurélio",
  "Tudo o que somos é o resultado do que pensamos. — Buda",
  "Não é que tenhamos pouco tempo, é que perdemos muito dele. — Sêneca",
  "Quem olha para fora sonha; quem olha para dentro desperta. — Carl Jung",
  "A vida é o que acontece enquanto você faz outros planos. — John Lennon"
];

const TIP_LIBRARY: Record<string, Recommendation[]> = {
  ansioso: [
    { id: 'a1', type: 'mental', text: 'Tente encontrar 5 coisas azuis ao seu redor agora.', icon: 'Eye', color: 'text-violet-400' },
    { id: 'a2', type: 'física', text: 'Lave o rosto com água bem gelada para um choque térmico calmante.', icon: 'Droplets', color: 'text-blue-400' },
    { id: 'a6', type: 'mental', text: 'Técnica 5-4-3-2-1: 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira.', icon: 'Fingerprint', color: 'text-teal-400' }
  ],
  triste: [
    { id: 't1', type: 'social', text: 'Ligue para alguém que te ama. Um abraço em voz ajuda.', icon: 'Phone', color: 'text-rose-400' },
    { id: 't4', type: 'mental', text: 'Escreva 3 coisas pequenas pelas quais é grato hoje.', icon: 'PenTool', color: 'text-emerald-400' }
  ],
  irritado: [
    { id: 'i1', type: 'física', text: 'Saia para uma caminhada rápida de 5 minutos.', icon: 'Footprints', color: 'text-rose-500' }
  ],
  cansado: [
    { id: 'c1', type: 'ambiente', text: 'Apague as luzes fortes e use apenas uma luz indireta.', icon: 'Lamp', color: 'text-amber-200' },
    { id: 'c4', type: 'mental', text: 'Desligue todas as telas por 15 minutos.', icon: 'MonitorOff', color: 'text-slate-500' }
  ],
  feliz: [
    { id: 'f1', type: 'social', text: 'Mande uma mensagem de elogio para alguém.', icon: 'Heart', color: 'text-rose-400' }
  ],
  calmo: [
    { id: 'l1', type: 'mental', text: 'Observe sua respiração sem tentar mudá-la.', icon: 'Wind', color: 'text-sky-300' }
  ]
};

export const mentorEngine = {
  generateNote: (records: EmotionRecord[], profile: UserProfile | null): MentorMessage => {
    const now = new Date();
    const hour = now.getHours();
    const lastRecord = records[0];
    const name = profile?.name || "amigo";
    
    const footnote = PHILOSOPHY_NUGGETS[Math.floor(Math.random() * PHILOSOPHY_NUGGETS.length)];

    let greeting = `Olá, ${name}.`;
    if (hour < 5) greeting = `Madrugada silenciosa, ${name}?`;
    else if (hour < 12) greeting = `Bom dia, ${name}.`;
    else if (hour < 18) greeting = `Boa tarde, ${name}.`;
    else greeting = `Boa noite, ${name}.`;

    if (records.length === 0) {
      return {
        greeting,
        content: `Espero que possamos passar muitos momentos bons juntos. Pode contar comigo para ser seu porto seguro.`,
        footnote,
        actionLabel: "Falar sobre agora",
        actionTab: "log",
        moodColor: "opacity-20", 
        recommendations: []
      };
    }

    const lastEmotion = lastRecord.emotionId;
    const activity = lastRecord.activityId;
    let recs = [...(TIP_LIBRARY[lastEmotion] || TIP_LIBRARY['neutro'] || [])].slice(0, 3);

    let content = `Estou aqui para o que você precisar. Vamos continuar cuidando de você?`;
    let actionLabel = undefined;
    let actionTab: any = undefined;

    if (lastEmotion === 'cansado' && activity === 'trabalho') {
      content = `Trabalhar cansado é um desafio. O que acha de uma pausa real de 5 minutos agora?`;
      actionLabel = "Vamos respirar?";
      actionTab = "breathing";
    } else if (lastEmotion === 'ansioso') {
      content = `Notei que sua mente está correndo. Vamos tentar aterrar seus pés no agora?`;
      actionLabel = "Acalmar";
      actionTab = "breathing";
    }

    return { greeting, content, footnote, actionLabel, actionTab, moodColor: "opacity-10", recommendations: recs };
  }
};
