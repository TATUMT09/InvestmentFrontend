"use client";
import { useEffect } from "react";
import { useMomoStore } from "@/store/momoStore";
import api from "@/lib/api";

export function useMomolar() {
  const { momolar, filters, isLoading, setMomolar, setLoading } = useMomoStore();

  const fetchMomolar = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.turi) params.set("turi", filters.turi);
      if (filters.sanadan) params.set("sanadan", filters.sanadan);
      if (filters.sanagacha) params.set("sanagacha", filters.sanagacha);

      const res = await api.get(`/momolar?${params.toString()}`);
      setMomolar(res.data);
    } catch (e) {
      console.error("Momolarni yuklashda xatolik:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMomolar();
  }, [filters]);

  return { momolar, isLoading, refetch: fetchMomolar };
}
