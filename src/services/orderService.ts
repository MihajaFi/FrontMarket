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
  getMyOrders: async (): Promise<OrderResponse[]> => {
    const response = await axiosClient.get("/orders/me", {
      withCredentials: true, // nécessaire si tu relies à la session Symfony
    });
    return response.data.map((o: any) => ({
      id: o.id,
      orderDate: o.orderDate ?? o.order_date,
      totalAmount: o.totalAmount ?? o.total_amount,
      status: o.status,
      userName: o.userName ?? o.user_name,
      merchantName: o.merchantName ?? o.merchant_name ?? "",
      address: o.address,
      phone: o.phone,
      paymentMethod: o.paymentMethod ?? o.payment_method,
      items: o.items.map((i: any) => ({
        id: i.id,
        quantity: i.quantity,
        unit_price: i.unit_price ?? i.product_price,
        sub_total: i.sub_total ?? i.quantity * i.unit_price,
        product_name: i.product_name ?? i.productName,
        product_description: i.product_description ?? i.productDescription,
        product_price: i.product_price ?? i.unit_price,
      })),
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