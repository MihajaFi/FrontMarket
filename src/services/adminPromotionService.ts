import axiosClient from "@/api/axiosClient";
import type { Promotion, PromotionRequest } from "@/data/mock-data";

export const promotionService = {
  create: async (payload: PromotionRequest): Promise<Promotion> => {
    const { data } = await axiosClient.post<Promotion>("/promotions", payload);
    return data;
  },

  getAll: async (): Promise<Promotion[]> => {
    const { data } = await axiosClient.get<Promotion[]>("/promotions");
    return data;
  },

  getById: async (id: number): Promise<Promotion> => {
    const { data } = await axiosClient.get<Promotion>(`/promotions/${id}`);
    return data;
  },

  update: async (id: number, payload: PromotionRequest): Promise<Promotion> => {
    const { data } = await axiosClient.put<Promotion>(`/promotions/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const { data } = await axiosClient.delete<{ message: string }>(`/promotions/${id}`);
    return data;
  },
};