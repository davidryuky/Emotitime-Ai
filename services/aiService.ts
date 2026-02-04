
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5 7B).
 * Specialized in ADHD support and social anxiety assistance.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    // A chave é injetada pelo Vite durante o build na Vercel
    const API_KEY = process.env.API_KEY;
    const ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-7B-Instruct";

    // Se após a injeção a chave ainda for nula ou a string "undefined"
    if (!API_KEY || API_KEY === "undefined") {
      console.error("Erro: API_KEY não encontrada no ambiente de execução.");
      return "Configuração pendente: A chave API não foi detectada. Verifique se as variáveis de ambiente na Vercel foram salvas e um novo Deploy foi realizado.";
    }

    try {
      if (records.length === 0) return null;

      const recentRecords = records.slice(0, 10).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Sentiu-se ${emotion} enquanto fazia ${activity}${r.note ? ` (Nota: ${r.note})` : ''}`;
      }).join('\n');

      const systemInstruction = `
        Você é o cérebro do "EmotiTime", um mentor para pessoas com TDAH e dificuldades sociais.
        Personalidade: Minimalista, ultra-empática, poética e sem julgamentos.
        
        REGRAS DE RESPOSTA:
        1. Responda diretamente ao usuário: ${profile?.name || 'amigo'}.
        2. Use no máximo 3 frases curtas e acolhedoras.
        3. Foco em validar o sentimento e dar um micro-passo para o foco ou conforto social.
        4. Nunca use listas.
        5. Seja o suporte silencioso que não exige energia social.
      `;

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Histórico recente:\n${recentRecords}\n\nGere um insight curto.` }
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`SiliconFlow Error (${response.status}):`, errorData);
        if (response.status === 401) {
          return "Chave de API inválida (401). Verifique se a chave na Vercel está correta.";
        }
        throw new Error(`API Error ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error) {
      console.error("AI Insight Generation Failed:", error);
      return "Estou aqui com você. Às vezes o silêncio é o melhor suporte. Respire fundo.";
    }
  }
};
