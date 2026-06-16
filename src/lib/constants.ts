import { MomoStatus, MomoTuri } from "@/types/momo.types";

export const MOMO_STATUS_LABELS: Record<MomoStatus, string> = {
  yuborildi: "Yuborildi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  bajarilmoqda: "Bajarilmoqda",
  bajarildi: "Bajarildi",
};

export const MOMO_STATUS_COLORS: Record<MomoStatus, string> = {
  yuborildi: "bg-gray-100 text-gray-700",
  korib_chiqilmoqda: "bg-yellow-100 text-yellow-700",
  bajarilmoqda: "bg-blue-100 text-blue-700",
  bajarildi: "bg-green-100 text-green-700",
};

export const MOMO_TURI_LABELS: Record<MomoTuri, string> = {
  elektr: "Elektr",
  quvur: "Quvur",
  yol: "Yo'l",
  gaz: "Gaz",
  suv: "Suv",
  boshqa: "Boshqa",
};

export const MOMO_TURI_ICONS: Record<MomoTuri, string> = {
  elektr: "⚡",
  quvur: "🔧",
  yol: "🛣️",
  gaz: "🔥",
  suv: "💧",
  boshqa: "❓",
};

export const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  TASHKILOT: "tashkilot",
  USER: "user",
} as const;

export const HISOBOT_TURLARI = [
  { value: "kunlik", label: "Kunlik" },
  { value: "haftalik", label: "Haftalik" },
  { value: "oylik", label: "Oylik" },
];
