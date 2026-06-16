import api from "@/lib/api";
import type { ApiUser, UserCreateDto, UserUpdateDto } from "@/types/api.types";

export const getUsers = async (): Promise<ApiUser[]> => {
  const { data } = await api.get<ApiUser[]>("/api/users");
  return data;
};

export const getUser = async (id: number): Promise<ApiUser> => {
  const { data } = await api.get<ApiUser>(`/api/users/${id}`);
  return data;
};

export const createUser = async (dto: UserCreateDto): Promise<ApiUser> => {
  const { data } = await api.post<ApiUser>("/api/users", dto);
  return data;
};

export const updateUser = async (id: number, dto: UserUpdateDto): Promise<ApiUser> => {
  const { data } = await api.put<ApiUser>(`/api/users/${id}`, dto);
  return data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/api/users/${id}`);
};

export const getMyProjects = async () => {
  const { data } = await api.get("/api/me/projects");
  return data;
};

export const getMyProblems = async () => {
  const { data } = await api.get("/api/me/problems");
  return data;
};
