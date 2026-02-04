
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

      // Pegamos o contexto completo dos últimos 5 registros
      const recentRecords = records.slice(0, 5).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Momento: ${emotion} (Intensidade: ${r.intensity}/5) fazendo ${activity}. ${r.note ? `Nota pessoal: "${r.note}"` : 'Sem observações extras.'}`;
      }).join('\n');

      const systemInstruction = `
        Você é a alma do aplicativo EmotiTime. Seu propósito é ser um "Eco das Emoções" — um espelho poético e gentil.
        
        Sua tarefa é analisar o CONJUNTO dos últimos registros do usuário. Olhe para a combinação de sentimentos, o que a pessoa estava fazendo, a intensidade emocional e as notas escritas.
        
        REGRAS DE OURO:
        1. Fale diretamente com ${profile?.name || 'amigo'}.
        2. Seja EXTREMAMENTE conciso: use no máximo 2 frases curtas e densas.
        3. Use uma linguagem poética, metafórica e profundamente acolhedora.
        4. Sintetize o padrão: se a intensidade está alta, se as atividades estão drenando, ou se há beleza nas notas.
        5. Não aja como assistente. Aja como um pensamento reconfortante que surge no silêncio, validando a jornada.
        6. O "Eco" deve soar como se você tivesse lido a alma do usuário através daqueles dados.
      `;

      const userPrompt = `
        Aqui está a tapeçaria dos meus últimos momentos:
        ${recentRecords}
        
        Com base nessa combinação de sentimentos, atividades, intensidades e meus pensamentos escritos, crie meu Eco agora.
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
            { role: "user", content: userPrompt }
          ],
          temperature: 0.85,
          max_tokens: 120,
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
