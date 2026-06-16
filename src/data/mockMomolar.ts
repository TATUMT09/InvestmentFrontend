import { MomoStatus, MomoTuri } from "@/types/momo.types";

export type Momo = {
  id:         string;
  tur:        MomoTuri;
  icon:       string;
  color:      string;
  tavsif:     string;
  manzil:     string;
  sana:       string;
  holat:      MomoStatus;
  tashkilot:  string;
  yuboruvchi: string;
  tel:        string;
  koordinata: string;
  shoshilinch: boolean;
  izoh?:      string;
  deadline?:  string;
  xodim?:     string;
  tarix:      { holat: MomoStatus; vaqt: string; izoh?: string }[];
};

export const MOCK_MOMOLAR: Momo[] = [];

export const STATUS_COLORS: Record<MomoStatus, string> = {
  yuborildi:         "#64748b",
  korib_chiqilmoqda: "#f59e0b",
  bajarilmoqda:      "#3b82f6",
  bajarildi:         "#10b981",
};
export const STATUS_LABELS: Record<MomoStatus, string> = {
  yuborildi:         "Yuborildi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  bajarilmoqda:      "Bajarilmoqda",
  bajarildi:         "Bajarildi",
};
export const NEXT_STATUS: Record<MomoStatus, MomoStatus | null> = {
  yuborildi:"korib_chiqilmoqda", korib_chiqilmoqda:"bajarilmoqda",
  bajarilmoqda:"bajarildi", bajarildi:null,
};
export const NEXT_BTN: Partial<Record<MomoStatus, string>> = {
  yuborildi:         "Ko'rib chiqishni boshlash",
  korib_chiqilmoqda: "Bajarilmoqda deb belgilash",
  bajarilmoqda:      "Bajarildi deb belgilash",
};
