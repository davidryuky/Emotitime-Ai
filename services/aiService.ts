
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5).
 * Focado em transformar registros em um "Eco" poético e acolhedor.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    const RAW_KEY = process.env.API_KEY || "";
    const ENDPOINT = "https://api.siliconflow.com/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-VL-7B-Instruct";

    const cleanKey = RAW_KEY.replace(/['"]+/g, '').trim();

    if (!cleanKey || cleanKey === "undefined" || cleanKey === "") {
      console.warn("Chave API SiliconFlow não encontrada.");
      return "Sua conexão com a sabedoria profunda está desligada no momento.";
    }

    try {
      if (records.length === 0) return null;

      // Compilação dos dados para o Eco (últimos 7 registros)
      const contextData = records.slice(0, 7).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Sentindo ${emotion} (Intensidade ${r.intensity}/5) enquanto fazia ${activity}. Nota: ${r.note || 'Sem anotações.'}`;
      }).join('\n');

      const systemInstruction = `
        Você é o 'Eco das Emoções' do app EmotiTime. Sua voz é poética, densa, acolhedora e minimalista.
        
        Sua missão: Receber registros emocionais e devolver um "Eco" — uma síntese poética de no máximo 2 frases curtas que valide o sentir do usuário.
        
        DIRETRIZES:
        1. Fale diretamente com ${profile?.name || 'amigo'}.
        2. Não dê conselhos nem seja um assistente. Seja um espelho poético.
        3. Use metáforas naturais (vento, maré, silêncio, raízes).
        4. O texto deve ser curto o suficiente para caber em um card de compartilhamento.
        5. Evite clichês excessivos; foque na verdade do que foi registrado.
      `;

      const userPrompt = `
        Aqui está o que registrei ultimamente:
        ${contextData}
        
        Qual é o meu Eco agora?
      `;

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) throw new Error("Falha na comunicação com SiliconFlow");
      
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Erro no AI Service (SiliconFlow):", error);
      return "Houve um breve silêncio no Eco. Tente novamente em um instante.";
    }
  }
};
