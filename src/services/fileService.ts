import axios from "axios";
import api from "@/lib/api";
import type { FileItem } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const uploadFile = async (formData: FormData): Promise<FileItem> => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data } = await axios.post<FileItem>(`${BASE_URL}/api/files/upload`, formData, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return data;
};

export const getFiles = async (): Promise<FileItem[]> => {
  const { data } = await api.get<FileItem[]>("/api/files");
  return data;
};

export const getFilesByProject = async (projectId: number): Promise<FileItem[]> => {
  const { data } = await api.get<FileItem[]>(`/api/files/project/${projectId}`);
  return data;
};

export const getFilesByProblem = async (problemId: number): Promise<FileItem[]> => {
  const { data } = await api.get<FileItem[]>(`/api/files/problem/${problemId}`);
  return data;
};
