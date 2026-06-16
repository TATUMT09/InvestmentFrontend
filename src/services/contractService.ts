import api from "@/lib/api";
import type { Contract, ContractCreateDto, ContractUpdateDto } from "@/types/api.types";

export const getContracts = async (): Promise<Contract[]> => {
  const { data } = await api.get<Contract[]>("/api/contracts");
  return data;
};

export const getContract = async (id: number): Promise<Contract> => {
  const { data } = await api.get<Contract>(`/api/contracts/${id}`);
  return data;
};

export const createContract = async (dto: ContractCreateDto): Promise<Contract> => {
  const { data } = await api.post<Contract>("/api/contracts", dto);
  return data;
};

export const updateContract = async (id: number, dto: ContractUpdateDto): Promise<Contract> => {
  const { data } = await api.put<Contract>(`/api/contracts/${id}`, dto);
  return data;
};

export const deleteContract = async (id: number): Promise<void> => {
  await api.delete(`/api/contracts/${id}`);
};
