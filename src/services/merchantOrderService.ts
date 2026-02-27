import axiosClient from "@/api/axiosClient";

export interface OrderCurrentResponse {
  id: number;
  userName: string;
  totalAmount: number;
  orderDate: string;
  status: string;
}

export const merchantOrderService = {
    async getCurrentOrders(merchantId: number): Promise<OrderCurrentResponse[]> {
    try {
      const { data } = await axiosClient.get(`/orders/recent/merchant/${merchantId}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch orders for merchant with id ${merchantId}:`, error);
      throw new Error("Merchant not found");
    }
}
}