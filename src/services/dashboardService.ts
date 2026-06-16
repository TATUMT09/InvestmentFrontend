import api from "@/lib/api";
import type { DashboardStats } from "@/types/api.types";

export const getDashboardStats = async (type?: string): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>("/api/dashboard", {
    params: type ? { type } : {},
  });
  return data;
};
