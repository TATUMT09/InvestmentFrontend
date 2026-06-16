import api from "@/lib/api";

export interface MeProfile {
  id: number;
  fullName: string;
  phone: string;
  username: string;
  role: string;
  department: string | null;
  organizationType: string | null;
}

export const getMe = async (): Promise<MeProfile> => {
  const { data } = await api.get<MeProfile>("/auth/me");
  return data;
};
