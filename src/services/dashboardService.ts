// services/dashboardService.ts
import axiosClient from "@/api/axiosClient";
import type { DashboardResponse, SalesByMonthResponse, totalSaleByMerchantResponse } from "@/data/mock-data";

export interface MerchantSale {
  id: number;
  name: string;
  totalSales: number;
}

export interface SalesByMonth {
  month: string; // ex: "2026-02"
  totalSales: number;
}

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    try {
      const { data } = await axiosClient.get<DashboardResponse>("/dashboard");
      return data;
    } catch (error: any) {
      console.error("Failed to fetch dashboard data:", error.response || error);
      throw new Error(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  },

  async getTotalSaleByMerchant(): Promise<totalSaleByMerchantResponse[]> {
    try {
      const { data } = await axiosClient.get<totalSaleByMerchantResponse[]>("/dashboard/merchants");
      return data;
    } catch (error: any) {
      console.error("Failed to fetch total sales by merchant:", error.response || error);
      throw new Error(error.response?.data?.message || "Failed to fetch merchant sales");
    }
  },

  async getSalesByMonth(): Promise<SalesByMonthResponse[]> {
    try {
      const { data } = await axiosClient.get<SalesByMonthResponse[]>("/dashboard/sales-by-month");
      return data;
    } catch (error: any) {
      console.error("Failed to fetch sales by month:", error.response || error);
      throw new Error(error.response?.data?.message || "Failed to fetch sales by month");
    }
  },
};