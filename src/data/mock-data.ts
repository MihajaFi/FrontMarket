export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  stock?: number;
  image: string;
}
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  image?: File;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
  userId: number;
  address: string;
  phone: string;
  paymentMethod: "MVOLA" | "ORANGEMONEY" | "AIRTELMONEY";
  items: OrderItem[];
}

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
  order_date: string;
  total_amount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
  user_name: string;
  address: string;
  phone: string;
  payment_method: "MVOLA" | "ORANGEMONEY" | "AIRTELMONEY";
  items: OrderItemResponse[];
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price) + " Ar";
};