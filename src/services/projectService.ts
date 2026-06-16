import api from "@/lib/api";
import type { Project, ProjectCreateDto, ProjectTask, ProjectTaskGroup } from "@/types/api.types";

export const getProjects = async (params?: {
  type?: string;
  status?: string;
  search?: string;
}): Promise<Project[]> => {
  const { data } = await api.get<Project[]>("/api/projects/filter", { params });
  return data;
};

export const getProject = async (id: number): Promise<Project> => {
  const { data } = await api.get<Project>(`/api/projects/${id}`);
  return data;
};

export const getMyProjects = async (): Promise<Project[]> => {
  const { data } = await api.get<Project[]>("/api/me/projects");
  return data;
};

export const createProject = async (dto: ProjectCreateDto): Promise<Project> => {
  const { data } = await api.post<Project>("/api/projects", dto);
  return data;
};

export const updateProject = async (id: number, dto: Partial<ProjectCreateDto>): Promise<Project> => {
  const { data } = await api.put<Project>(`/api/projects/${id}`, dto);
  return data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/api/projects/${id}`);
};

export const getProjectTasks = async (id: number): Promise<ProjectTask[]> => {
  const { data } = await api.get(`/api/projects/${id}/tasks/excel`);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.tasks)) return data.tasks;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const getProjectTasksGrouped = async (id: number): Promise<ProjectTaskGroup[]> => {
  const { data } = await api.get(`/api/projects/${id}/tasks/docx`);
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];

  if (data[0]?.decision || data[0]?.tasks) {
    return data as ProjectTaskGroup[];
  }

  if (data[0]?.title || data[0]?.id) {
    return [{ decision: "Vazifalar", tasks: data as ProjectTask[] }];
  }

  return [];
};

export const importProjectTasks = async (id: number, file: File): Promise<void> => {
  const fd = new FormData();
  fd.append("file", file);
  await api.post(`/api/projects/${id}/tasks/import`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const importProjectTasksDocx = async (id: number, file: File): Promise<void> => {
  const fd = new FormData();
  fd.append("file", file);
  await api.post(`/api/projects/${id}/tasks/import-docx`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
