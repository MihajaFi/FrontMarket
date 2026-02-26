import axiosClient from "@/api/axiosClient";
import type { StockResponse, StockRequest } from "@/data/mock-data";

export const stockService = {
  // GET /api/stocks
  async getAll(): Promise<StockResponse[]> {
    const { data } = await axiosClient.get("/stocks");
    return data;
  },

  // GET /api/stocks/:id
  async getById(id: number): Promise<StockResponse> {
    const { data } = await axiosClient.get(`/stocks/${id}`);
    return data;
  },

  // POST /api/stocks
  async create(payload: StockRequest): Promise<StockResponse> {
    const { data } = await axiosClient.post("/stocks", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  // PUT /api/stocks/:id
  async update(id: number, payload: StockRequest): Promise<StockResponse> {
    const { data } = await axiosClient.put(`/stocks/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  // DELETE /api/stocks/:id
  async delete(id: number): Promise<{ message: string }> {
    const { data } = await axiosClient.delete(`/stocks/${id}`);
    return data;
  },
};