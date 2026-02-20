import axiosClient from "@/api/axiosClient";
import type { CartItem } from "@/context/CartContext";

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: { productName: string; quantity: number; price: number; image: string }[];
  total: number;
  status: OrderStatus;
  address: string;
  phone: string;
  paymentMethod: string;
  createdAt: string;
}

// In-memory mock store
const mockOrders: Order[] = [];
let orderId = 1000;

export const orderService = {
  async createOrder(payload: {
    items: CartItem[];
    address: string;
    phone: string;
    paymentMethod: string;
    total: number;
  }): Promise<Order> {
    try {
      const { data } = await axiosClient.post("/orders", payload);
      return data;
    } catch {
      const order: Order = {
        id: `CMD-${++orderId}`,
        items: payload.items.map((i) => ({
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          image: i.product.image,
        })),
        total: payload.total,
        status: "pending",
        address: payload.address,
        phone: payload.phone,
        paymentMethod: payload.paymentMethod,
        createdAt: new Date().toISOString(),
      };
      mockOrders.unshift(order);
      return order;
    }
  },

  async getMyOrders(): Promise<Order[]> {
    try {
      const { data } = await axiosClient.get("/orders/my-orders");
      return data;
    } catch {
      return [...mockOrders];
    }
  },

  async cancelOrder(id: string): Promise<Order> {
    try {
      const { data } = await axiosClient.put(`/orders/${id}/cancel`);
      return data;
    } catch {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error("Commande introuvable");
      if (order.status !== "pending") throw new Error("Seules les commandes en attente peuvent être annulées");
      order.status = "cancelled";
      return order;
    }
  },
};
