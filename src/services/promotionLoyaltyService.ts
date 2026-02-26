import axiosClient from "@/api/axiosClient";
import type { PromotionLoyalty, PromotionLoyaltyRequest } from "@/data/mock-data";

export const promotionLoyaltyService = {
  getAll: async (): Promise<PromotionLoyalty[]> => {
    const response = await axiosClient.get("/PromotionLoyaltys");
    return response.data;
  },

  getById: async (id: number): Promise<PromotionLoyalty> => {
    const response = await axiosClient.get(`/PromotionLoyaltys/${id}`);
    return response.data;
  },

  create: async (payload: PromotionLoyaltyRequest): Promise<PromotionLoyalty> => {
    const response = await axiosClient.post("/PromotionLoyaltys", payload);
    return response.data;
  },

  update: async (id: number, payload: PromotionLoyaltyRequest): Promise<PromotionLoyalty> => {
    const response = await axiosClient.put(`/PromotionLoyaltys/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/PromotionLoyaltys/${id}`);
    return response.data;
  },
};