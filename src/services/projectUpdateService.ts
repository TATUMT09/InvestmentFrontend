import api from "@/lib/api";
import type { ProjectUpdate } from "@/types/api.types";

export const createProjectUpdate = async (formData: FormData): Promise<ProjectUpdate> => {
  const { data } = await api.post<ProjectUpdate>("/api/project-updates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getProjectUpdates = async (projectId: number): Promise<ProjectUpdate[]> => {
  const { data } = await api.get<ProjectUpdate[]>(`/api/project-updates/project/${projectId}`);
  return data;
};

export const getMyUpdates = async (): Promise<ProjectUpdate[]> => {
  const { data } = await api.get<ProjectUpdate[]>("/api/project-updates/my");
  return data;
};

export const getAllUpdates = async (): Promise<ProjectUpdate[]> => {
  const { data } = await api.get<ProjectUpdate[]>("/api/project-updates");
  return data;
};
