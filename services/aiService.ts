
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5).
 * Especializado em suporte para TDAH e ansiedade social.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    // A chave é injetada do ambiente (Vercel/Vite)
    const RAW_KEY = process.env.API_KEY || "";
    const ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-7B-Instruct";

    // 1. Limpeza rigorosa da chave (remove espaços, aspas e caracteres invisíveis)
    const cleanKey = RAW_KEY.replace(/['"]+/g, '').trim();

    if (!cleanKey || cleanKey === "undefined") {
      return "Erro: API_KEY não configurada. Verifique as variáveis de ambiente.";
    }

    try {
      if (records.length === 0) return null;

      const recentRecords = records.slice(0, 10).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Sentiu-se ${emotion} enquanto fazia ${activity}${r.note ? ` (Nota: ${r.note})` : ''}`;
      }).join('\n');

      const systemInstruction = `
        Você é o "EmotiTime", um mentor ultra-empático para pessoas com TDAH e ansiedade social.
        Sua voz é poética, minimalista e acolhedora.
        
        REGRAS DE RESPOSTA:
        1. Responda diretamente ao usuário: ${profile?.name || 'amigo'}.
        2. Use no máximo 3 frases curtas e acolhedoras.
        3. Nunca use listas ou tópicos.
        4. Valide o sentimento e sugira um micro-passo gentil.
        5. Seja o suporte silencioso que não exige energia social.
      `;

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `Histórico recente:\n${recentRecords}\n\nGere um insight emocional curto.` }
          ],
          temperature: 0.7,
          max_tokens: 150,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erro SiliconFlow (${response.status}):`, errorText);
        
        if (response.status === 401) {
          return "Erro 401: Chave não autorizada. Verifique se a chave sk-... está correta e ativa na SiliconFlow.";
        }
        if (response.status === 403) {
          return "Erro 403: Acesso negado. Pode ser um bloqueio de região ou IP.";
        }
        return `Erro ${response.status}: ${errorText.substring(0, 100)}`;
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error: any) {
      console.error("Erro de conexão SiliconFlow:", error);
      return `Erro de conexão: ${error.message}. Verifique se o navegador está bloqueando a API.`;
    }
  }
};
