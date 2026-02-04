
import { EmotionRecord, UserProfile, Activity } from "../types/index";
import { EMOTIONS } from "../constants/index";

/**
 * AI Service powered by SiliconFlow (Qwen 2.5 7B).
 * Specialized in ADHD support and social anxiety assistance.
 */
export const aiService = {
  generateInsight: async (records: EmotionRecord[], profile: UserProfile | null, activities: Activity[]) => {
    // A chave é injetada pelo Vite durante o build na Vercel
    const RAW_KEY = process.env.API_KEY || "";
    const ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
    const MODEL = "Qwen/Qwen2.5-7B-Instruct";

    // 1. Limpeza rigorosa da chave
    let cleanKey = RAW_KEY.trim();
    
    // Remove "API_KEY=" se estiver no valor
    if (cleanKey.startsWith("API_KEY=")) {
      cleanKey = cleanKey.replace("API_KEY=", "");
    }
    
    // Remove "Bearer " se o usuário colou junto
    if (cleanKey.toLowerCase().startsWith("bearer ")) {
      cleanKey = cleanKey.substring(7);
    }
    
    cleanKey = cleanKey.trim();

    // Logs de diagnóstico (visíveis no F12 do navegador)
    console.log("--- Depuração EmotiTime ---");
    console.log("Tamanho da chave detectada:", cleanKey.length);
    if (cleanKey.length > 0) {
      console.log("Prefixo da chave:", cleanKey.substring(0, 7) + "...");
      console.log("Sufixo da chave:", "..." + cleanKey.substring(cleanKey.length - 4));
    } else {
      console.warn("ALERTA: A chave API está vazia!");
    }

    if (!cleanKey || cleanKey === "undefined") {
      return "Erro: Variável API_KEY não definida na Vercel. Adicione a chave e faça um 'Redeploy'.";
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
          'Authorization': `Bearer ${cleanKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
        // Tenta ler como texto primeiro para não falhar se não for JSON
        const rawErrorText = await response.text();
        let errorMessage = "Erro desconhecido";
        
        try {
          const errorJson = JSON.parse(rawErrorText);
          errorMessage = errorJson.message || errorJson.error?.message || rawErrorText;
        } catch (e) {
          errorMessage = rawErrorText || `Status ${response.status}`;
        }

        console.error(`Erro SiliconFlow (${response.status}):`, errorMessage);
        
        if (response.status === 401) {
          return `Não Autorizado (401): ${errorMessage}. Dica: Verifique se sua chave da SiliconFlow está ativa e se você não incluiu aspas no painel da Vercel.`;
        }
        
        return `Erro ${response.status}: ${errorMessage}`;
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error: any) {
      console.error("Erro de conexão com a IA:", error);
      return `Erro de conexão: ${error.message}. Verifique se seu navegador está bloqueando a requisição.`;
    }
  }
};
