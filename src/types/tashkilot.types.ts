import { MomoTuri } from "./momo.types";

export interface Tashkilot {
  id: string;
  nomi: string;
  turi: MomoTuri;
  email: string;
  telefon: string;
  manzil: string;
  createdAt: Date;
}

export interface CreateTashkilotDto {
  nomi: string;
  turi: MomoTuri;
  email: string;
  telefon: string;
  manzil: string;
  password: string;
}
