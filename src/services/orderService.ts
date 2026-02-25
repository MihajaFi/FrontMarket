import axiosClient from "@/api/axiosClient";
import type { OrderAndOrderItemRequest } from "@/data/mock-data";

export interface OrderItemResponse {
  id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
  product_name: string;
  product_description: string;
  product_price: number;
}

export interface OrderResponse {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
  userName: string;
  merchantName: string;
  address: string;
  phone: string;
  paymentMethod: "MVOLA" | "ORANGEMONEY" | "AIRTELMONEY";
  items: OrderItemResponse[];
}

export const orderService = {

  // ✅ CREATE
  create: async (
    order: OrderAndOrderItemRequest
  ): Promise<OrderResponse> => {
    const response = await axiosClient.post("/orders", order);
    return response.data as OrderResponse;
  },

  // GET ALL
  getAll: async (): Promise<OrderResponse[]> => {
    const response = await axiosClient.get("/orders");

    return response.data.map((o: any) => ({
      id: o.id,
      orderDate: o.order_date,
      totalAmount: o.total_amount,
      status: o.status,
      userName: o.user_name,
      merchantName: o.merchant_name ?? "", // si pas envoyé
      address: o.address,
      phone: o.phone,
      paymentMethod: o.payment_method,
      items: o.items,
    }));
  },

  // GET BY ID
  getById: async (id: number): Promise<OrderResponse> => {
    const response = await axiosClient.get(`/orders/${id}`);
    const o = response.data;

    return {
      id: o.id,
      orderDate: o.order_date,
      totalAmount: o.total_amount,
      status: o.status,
      userName: o.user_name,
      merchantName: o.merchant_name ?? "",
      address: o.address,
      phone: o.phone,
      paymentMethod: o.payment_method,
      items: o.items,
    };
  },

  // UPDATE
  update: async (
    id: number,
    order: OrderAndOrderItemRequest
  ): Promise<OrderResponse> => {
    const response = await axiosClient.put(`/orders/${id}`, order);
    return response.data as OrderResponse;
  },
  updateStatus: async (id: number, status: OrderResponse["status"]): Promise<OrderResponse> => {
  const response = await axiosClient.patch(`/orders/${id}/status`, { status });
  return response.data;
  },
  // DELETE
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/orders/${id}`);
    return response.data;
  },
};