import axiosClient from "@/api/axiosClient";
import type { DashboardResponse } from "@/data/mock-data";

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

  async getTotalSaleByMerchant(): Promise<any[]> {
    try {
      const { data } = await axiosClient.get<any[]>("/dashboard/merchants");
      return data;
    } catch (error: any) {
      console.error("Failed to fetch total sales by merchant:", error.response || error);
      throw new Error(error.response?.data?.message || "Failed to fetch merchant sales");
    }
  },
};