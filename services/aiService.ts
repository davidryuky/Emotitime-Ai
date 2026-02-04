
import { GoogleGenAI } from "@google/genai";
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by Google Gemini API.
 * Especializado em suporte para TDAH e ansiedade social.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.warn("API Key not found in environment variables.");
      return "Sua conexão com a sabedoria profunda está desligada no momento.";
    }

    try {
      if (records.length === 0) return null;

      // Always initialize the client right before usage to ensure current API key is used.
      const ai = new GoogleGenAI({ apiKey });

      // Pegamos o contexto completo dos últimos registros para uma análise holística
      const recentRecords = records.slice(0, 7).map(r => {
        const emotion = EMOTIONS.find(e => e.id === r.emotionId)?.label;
        const activity = activities.find(a => a.id === r.activityId)?.label;
        return `- Momento: ${emotion} (Intensidade: ${r.intensity}/5) fazendo ${activity}. ${r.note ? `Nota: "${r.note}"` : ''}`;
      }).join('\n');

      const systemInstruction = `
        Você é a alma do EmotiTime. Seu propósito é ser um "Eco das Emoções" — um espelho poético, gentil e observador.
        
        Sua tarefa é analisar o CONJUNTO dos últimos registros do usuário. Olhe para a combinação de sentimentos, o que a pessoa estava fazendo, a intensidade emocional e as notas escritas.
        
        REGRAS DE OURO:
        1. Fale diretamente com ${profile?.name || 'amigo'}.
        2. Seja EXTREMAMENTE conciso: use no máximo 2 frases curtas e densas.
        3. Use uma linguagem poética, metafórica e profundamente acolhedora.
        4. Sintetize o padrão: procure correlações entre atividades e picos de intensidade ou o tom das notas.
        5. Não aja como assistente. Aja como um pensamento reconfortante que valida a jornada.
      `;

      const userPrompt = `
        Meus últimos registros:
        ${recentRecords}
        
        Crie meu Eco poético baseado nesta combinação de dados.
      `;

      // Use gemini-3-flash-preview for basic text tasks like summarization and Q&A.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85,
        },
      });

      // The extracted generated text content is accessed via the .text property on the GenerateContentResponse object.
      return response.text || "O silêncio às vezes diz muito. Tente novamente em breve.";
    } catch (error: any) {
      console.error("Erro no AI Service:", error);
      return "Houve um silêncio inesperado. Tente novamente em um instante.";
    }
  }
};
