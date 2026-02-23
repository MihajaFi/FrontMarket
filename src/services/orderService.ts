import axiosClient from "@/api/axiosClient";
import type { Order, OrderItem } from "@/data/mock-data";

export interface OrderItemResponse {
  id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
  product_name: string;
  product_description: string;
  product_price: number;
}
// Interface pour la réponse backend, qui inclut l'ID généré
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
  // Créer une commande
  create: async (order: Order): Promise<OrderResponse> => {
    // Mapper les items pour correspondre au backend (unitPrice au lieu de price)
    const payload = {
      ...order,
      items: order.items.map((item: OrderItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price, // backend attend unitPrice
      })),
    };
    const response = await axiosClient.post("/orders", payload);
    return response.data as OrderResponse; // Typage correct avec id
  },

  // Récupérer toutes les commandes
  getAll: async (): Promise<OrderResponse[]> => {
    const response = await axiosClient.get("/orders");
    return response.data as OrderResponse[];
  },

  // Récupérer une commande par ID
  getById: async (id: number): Promise<OrderResponse> => {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data as OrderResponse;
  },

  // Mettre à jour une commande
  update: async (id: number, order: Order): Promise<OrderResponse> => {
    const payload = {
      ...order,
      items: order.items.map((item: OrderItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };
    const response = await axiosClient.put(`/orders/${id}`, payload);
    return response.data as OrderResponse;
  },

  // Supprimer une commande
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`/orders/${id}`);
    return response.data;
  },
};