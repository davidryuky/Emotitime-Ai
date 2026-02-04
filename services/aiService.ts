
import { EmotionRecord, UserProfile, Activity, EmotionId } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5 VL).
 * Foco em geração dinâmica e personalizada baseada nos registros reais.
 */

export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    const RAW_KEY = process.env.API_KEY || "";
    const ENDPOINT = "https://api.siliconflow.com/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-VL-7B-Instruct";
    
    // Limpeza da chave para evitar caracteres residuais
    const cleanKey = RAW_KEY.replace(/['"]+/g, '').trim();

    if (!cleanKey || cleanKey === "undefined") {
      console.error("SiliconFlow API Key não configurada.");
      return "O silêncio às vezes é o melhor espelho para o que sentimos agora.";
    }

    try {
      if (records.length === 0) return null;

      // Prepara os dados contextuais para a IA
      const recentContext = records.slice(0, 5).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label || "em um momento de pausa";
        const intensity = r.intensity;
        return `- Senti ${emotion} (Intensidade ${intensity}/5) enquanto estava em: ${activity}${r.note ? `. Nota: ${r.note}` : ''}`;
      }).join('\n');

      const systemInstruction = `
        Você é o "Eco da Alma" do aplicativo EmotiTime. Seu papel é ler os sentimentos recentes do usuário e devolver um pensamento poético, curto e profundamente humano.
        
        INSTRUÇÕES DE GERAÇÃO:
        1. Fale diretamente com ${profile?.name || 'esta alma'}.
        2. Use os dados fornecidos: se o usuário está triste no trabalho, seu eco deve refletir essa dualidade.
        3. Seja BREVE: Máximo 15 palavras.
        4. Estilo: Metafórico, usando elementos da natureza (vento, raízes, maré, luz).
        5. NUNCA diga "Com base nos seus dados" ou "Eu analisei". Seja a voz de um pensamento interior.
        6. Se houver notas pessoais nos registros, tente capturar a essência delas no eco.
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
            { role: "user", content: `Aqui está o que tenho vivido ultimamente:\n${recentContext}\n\nQual é o meu eco agora?` }
          ],
          temperature: 0.8,
          max_tokens: 100,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API SiliconFlow: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content.trim();
      
      // Limpeza de aspas desnecessárias que a IA costuma colocar
      content = content.replace(/^["']|["']$/g, '');

      return content;

    } catch (error: any) {
      console.error("Erro ao gerar eco com Qwen:", error);
      return "Sua jornada é um fluxo constante; respire e sinta a força de estar presente.";
    }
  }
};
