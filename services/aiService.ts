
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5 VL).
 * Especializado em suporte para TDAH e ansiedade social.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    // A chave é injetada do ambiente (Vercel/Vite)
    const RAW_KEY = process.env.API_KEY || "";
    const ENDPOINT = "https://api.siliconflow.com/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-VL-7B-Instruct";

    const cleanKey = RAW_KEY.replace(/['"]+/g, '').trim();

    if (!cleanKey || cleanKey === "undefined") {
      return "Sua conexão com a sabedoria profunda está desligada no momento.";
    }

    try {
      if (records.length === 0) return null;

      // Pegamos apenas o essencial para a IA não se perder em dados
      const recentRecords = records.slice(0, 5).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- ${emotion} enquanto ${activity}${r.note ? ` (${r.note})` : ''}`;
      }).join('\n');

      const systemInstruction = `
        Você é a alma do aplicativo EmotiTime. Seu propósito é ser um "Eco das Emoções" — um espelho poético e gentil.
        
        REGRAS DE OURO:
        1. Fale diretamente com ${profile?.name || 'amigo'}.
        2. Seja EXTREMAMENTE conciso: use no máximo 2 frases curtas.
        3. Use uma linguagem poética, metafórica e profundamente acolhedora.
        4. Nunca dê ordens ou use listas.
        5. Não aja como assistente. Aja como um pensamento reconfortante que surge no silêncio.
        6. Seu foco é validar a jornada emocional, por mais difícil que tenha sido.
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
            { role: "user", content: `Aqui está o que eu vivi recentemente:\n${recentRecords}\n\nMe diga algo reconfortante sobre esse meu momento.` }
          ],
          temperature: 0.8,
          max_tokens: 100,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        return "Sinto muito, não consegui traduzir seus sentimentos em palavras agora. Vamos tentar de novo mais tarde?";
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error: any) {
      return "Houve um silêncio inesperado na nossa conexão. Tente novamente em um instante.";
    }
  }
};
