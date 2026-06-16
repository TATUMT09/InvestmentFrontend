export type MomoStatus =
  | "yuborildi"
  | "korib_chiqilmoqda"
  | "bajarilmoqda"
  | "bajarildi";

export type MomoTuri =
  | "elektr"
  | "quvur"
  | "yol"
  | "gaz"
  | "suv"
  | "boshqa";

export interface Lokatsiya {
  lat: number;
  lng: number;
  manzil: string;
}

export interface Momo {
  id: string;
  rasm: string[];
  tavsif: string;
  status: MomoStatus;
  turi: MomoTuri;
  lokatsiya: Lokatsiya;
  userId: string;
  tashkilotId: string;
  aiTahlil?: string;
  yaratilgan: Date;
  muddati?: Date;
  updatedAt: Date;
}

export interface MomoFilters {
  status?: MomoStatus;
  turi?: MomoTuri;
  sanadan?: string;
  sanagacha?: string;
}
