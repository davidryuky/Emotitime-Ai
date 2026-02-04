
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

    // Debug log para o desenvolvedor no console (não exibe a chave toda)
    console.log("Status da API Key:", !!API_KEY ? `Presente (Inicia com ${API_KEY.substring(0, 4)}...)` : "Ausente");

    if (!API_KEY || API_KEY === "undefined" || API_KEY === "") {
      return "Erro de Configuração: A chave API não foi injetada no build. Verifique as variáveis de ambiente na Vercel e faça um novo 'Redeploy'.";
    }

    // Caso o usuário tenha colado "API_KEY=sk-..." por engano no valor da variável
    const cleanKey = API_KEY.startsWith("API_KEY=") ? API_KEY.split("=")[1] : API_KEY;

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
          'Authorization': `Bearer ${cleanKey.trim()}`,
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
        const errorBody = await response.json().catch(() => ({}));
        console.error("SiliconFlow Detailed Error:", errorBody);
        
        const serverMessage = errorBody.message || errorBody.error?.message || "Erro desconhecido";
        
        if (response.status === 401) {
          return `Não Autorizado (401): ${serverMessage}. Verifique se a chave sk-... está correta e tem saldo na SiliconFlow.`;
        }
        
        if (response.status === 402) {
          return "Saldo Insuficiente na SiliconFlow. Verifique seus créditos.";
        }

        return `Erro na API (${response.status}): ${serverMessage}`;
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error: any) {
      console.error("AI Insight Generation Failed:", error);
      return `Falha na conexão: ${error.message || "Verifique sua internet."}`;
    }
  }
};
