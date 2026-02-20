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


export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price) + " Ar";
};