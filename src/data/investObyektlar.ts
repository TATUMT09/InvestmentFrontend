export type ObyektHolat = "qurilmoqda" | "ishlamoqda" | "rejalashtirilgan" | "toxtagan";

export type InvestObyekt = {
  id:          string;
  nomi:        string;
  tur:         string;
  icon:        string;
  color:       string;
  lat:         number;
  lng:         number;
  tuman:       string;
  manzil:      string;
  quvvat:      string;
  qiymat:      string;
  xorijiy:     string;
  maydon:      string;
  holat:       ObyektHolat;
  ish_joylari: number;
  mahsulot:    string;
  tavsif:      string;
  rasmlar:     string[];
};

export const INVEST_OBYEKTLAR: InvestObyekt[] = [];

export const HOLAT_COLORS: Record<ObyektHolat, string> = {
  ishlamoqda:       "#10b981",
  qurilmoqda:       "#f59e0b",
  rejalashtirilgan: "#3b82f6",
  toxtagan:         "#ef4444",
};
export const HOLAT_LABELS: Record<ObyektHolat, string> = {
  ishlamoqda:       "Ishlamoqda",
  qurilmoqda:       "Qurilmoqda",
  rejalashtirilgan: "Rejalashtirilgan",
  toxtagan:         "To'xtatilgan",
};
