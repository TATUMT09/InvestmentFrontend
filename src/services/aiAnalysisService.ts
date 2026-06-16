import api from "@/lib/api";

// Backenddagi AiAnalysisResponseDto ga mos
export interface AiAnalysisResponseDto {
  // Backend qanday maydonlarni qaytarayotganiga qarab to'ldiring
  // Hozircha any, keyin aniq tipini qo'shasiz
  [key: string]: any;
}

export const aiAnalysisService = {
  // Dashboard uchun AI tahlili
  getDashboardAnalysis: async (): Promise<AiAnalysisResponseDto> => {
    const { data } = await api.get("/api/ai-analysis/dashboard");
    return data;
  },
  
  // Oylik AI tahlili
  getMonthlyAnalysis: async (): Promise<AiAnalysisResponseDto> => {
    const { data } = await api.get("/api/ai-analysis/monthly");
    return data;
  }
};