
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5).
 * Um "Espelho Poético" que reconhece sentimentos e oferece orientações sutis.
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

      // Compilação dos dados (últimos 7 registros)
      const contextData = records.slice(0, 7).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Momento: ${emotion} (${r.intensity}/5) enquanto fazia ${activity}. Nota: ${r.note || 'Silêncio.'}`;
      }).join('\n');

      const systemInstruction = `
        Você é o 'Eco das Emoções' do app EmotiTime. Sua voz é poética, densa, acolhedora e profundamente observadora.
        
        Sua missão é ser um ESPELHO DA ALMA do usuário.
        
        DIRETRIZES DE PERSONALIDADE:
        1. Fale diretamente com ${profile?.name || 'amigo'}.
        2. RECONHEÇA O SENTIR: Identifique e valide explicitamente as emoções presentes nos registros. Diga o que você "vê" (ex: "Percebo que a 'melancolia' tem buscado abrigo em seus gestos...").
        3. SEJA UM ESPELHO POÉTICO: Não seja um assistente técnico. Transforme a intensidade e as notas em metáforas sobre o tempo e o ser.
        4. DICAS SUTIS: Quando notar padrões desgastantes, ofereça um "toque" poético. Não dê ordens. Convide (ex: "talvez o seu coração precise de um horizonte mais largo hoje" ou "o silêncio pode ser o melhor cobertor para essa exaustão").
        5. IMAGÉTICA: Use elementos da natureza (raízes, tempestades, orvalho, marés, eclipses).
        6. CONCISÃO: No máximo 3 frases potentes e curtas.
      `;

      const userPrompt = `
        Aqui está o que meu coração registrou recentemente:
        ${contextData}
        
        Ecoe meu sentir e me diga o que o tempo sussurra para mim agora.
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
          temperature: 0.85,
          max_tokens: 200
        })
      });

      if (!response.ok) throw new Error("Falha na comunicação com SiliconFlow");
      
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Erro no AI Service (SiliconFlow):", error);
      return "O espelho do tempo embaçou por um instante. Tente novamente em breve.";
    }
  }
};
