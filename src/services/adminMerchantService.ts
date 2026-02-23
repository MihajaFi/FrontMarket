import axiosClient from "@/api/axiosClient";
import { type Merchant, type MerchantCreate } from "@/data/mock-data";


export const merchantService = {
  async getAll(): Promise<Merchant[]> {
    const { data } = await axiosClient.get<Merchant[]>("/merchants");
    return data;
  },

  async getById(id: number): Promise<Merchant> {
    const { data } = await axiosClient.get<Merchant>(`/merchants/${id}`);
    return data;
  },

  async create(merchant: MerchantCreate): Promise<Merchant> {
  const { data } = await axiosClient.post<Merchant>("/merchants", merchant);
  return data;
  },

  async update(id: number, merchant: Partial<Merchant>): Promise<Merchant> {
    const { data } = await axiosClient.put<Merchant>(`/merchants/${id}`, merchant);
    return data;
  },

  async delete(id: number): Promise<void> {
    await axiosClient.delete(`/merchants/${id}`);
  },

  async updateStatus(id: number, status: "actif" | "inactif"): Promise<Merchant> {
    const { data } = await axiosClient.patch<Merchant>(`/merchants/${id}/status`, {
      status,
    });
    return data;
  },
};