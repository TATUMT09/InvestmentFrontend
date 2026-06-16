import api from "@/lib/api";
import type { Problem, ProblemCreateDto, ProblemUpdateDto } from "@/types/api.types";

export const getProblems = async (): Promise<Problem[]> => {
  const { data } = await api.get<Problem[]>("/api/problems");
  return data;
};

export const getMyProblems = async (): Promise<Problem[]> => {
  const { data } = await api.get<Problem[]>("/api/me/problems");
  return data;
};

export const getProblem = async (id: number): Promise<Problem> => {
  const { data } = await api.get<Problem>(`/api/problems/${id}`);
  return data;
};

export const createProblem = async (dto: ProblemCreateDto): Promise<Problem> => {
  const { data } = await api.post<Problem>("/api/problems", dto);
  return data;
};

export const updateProblem = async (id: number, dto: ProblemUpdateDto): Promise<Problem> => {
  const { data } = await api.put<Problem>(`/api/problems/${id}`, dto);
  return data;
};

export const deleteProblem = async (id: number): Promise<void> => {
  await api.delete(`/api/problems/${id}`);
};
