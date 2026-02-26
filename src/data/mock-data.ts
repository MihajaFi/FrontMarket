export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  stock?: number;
  image: string;
  merchant: string
}
export interface ProductRequest {
  name: string;
  description: string;
  merchantId: number;
  categoryId: number;
  price: number;
  image?: File;
}
export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  stock?: number;
  image: string;
  merchant: string
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

// types/order.ts

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  price?: number; // optionnel si besoin
}

export interface OrderAndOrderItemRequest {
  status: string;          // correspond à $status
  userId: number;          // correspond à $userId
  items: OrderItemRequest[]; // correspond à $items
  address: string;         // correspond à $address
  phone: string;           // correspond à $phone
  paymentMethod: string;   // correspond à $paymentMethod
}

export interface PromotionLoyalty {
  id : number;
  promotion_type : string;
  value : number;
  start_date : string;
  end_date : string;
  conditions : string;
}

export interface PromotionLoyaltyRequest {
  promotion_type : string;
  value : number;
  start_date : string;
  end_date : string; 
  conditions : string;
}
export interface ProductItemResponse {
  id: number;
  product: Product;
}
export interface Promotion {
  id : number;
  promotionLoyalty : PromotionLoyalty;
  productItems : ProductItemResponse[];
  type: 'percentage' | 'fixed';
  status: 'active' | 'expirée' | 'planifiée';
}
export interface ProductItemRequest {
  productId: number;
}

export interface PromotionRequest {
  promotionLoyalty: number;
  productItems: ProductItemRequest[];
  type: 'percentage' | 'fixed';
  status: 'active' | 'expirée' | 'planifiée';
}

export type Merchant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'actif' | 'inactif';
  joinDate: string;
  totalSales: number;
  avatarColor: string;
};
export type MerchantCreate = {
  name: string;
  email: string;
  phone: string;
  city: string;
  status: "actif" | "inactif";
};

export interface StockResponse {
  id: number;
  quantity: number;
  alert: string;
  productName: string;
  description: string;
  price: number;
}

export interface StockRequest {
  quantity: number;
  alert: string;
  productId: number;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null; // correspond à ?string en PHP
  color: string;
  productCount: number;
}

export interface CategoryRequest {
  name: string;            // champ obligatoire
  description: string;     // champ obligatoire
  color?: string | null;   // champ optionnel (peut être null)
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price) + " Ar";
};