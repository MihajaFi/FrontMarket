// Données simulées pour l'application de gestion commerciale

export type Merchant = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  status: 'actif' | 'inactif';
  joinDate: string;
  totalSales: number;
  avatarColor: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  productCount: number;
  color: string;
};

export type Product = {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  merchantId: number;
  price: number;
  stock: number;
  minStock: number;
  sold: number;
  status: 'disponible' | 'rupture' | 'faible';
  image?: string;
};

export type Order = {
  id: string;
  customer: string;
  merchantId: number;
  products: { productId: number; qty: number }[];
  total: number;
  status: 'en_attente' | 'validée' | 'livrée' | 'annulée';
  date: string;
  address: string;
};

export type Promotion = {
  id: number;
  name: string;
  discount: number;
  type: 'percentage' | 'fixed';
  productIds: number[];
  startDate: string;
  endDate: string;
  status: 'active' | 'expirée' | 'planifiée';
};

// --- Merchants ---
export const merchants: Merchant[] = [
  { id: 1, name: 'Karim Boutique', email: 'karim@boutique.ma', phone: '+212 661 234 567', city: 'Casablanca', category: 'Vêtements', status: 'actif', joinDate: '2022-03-15', totalSales: 128450, avatarColor: '#10b981' },
  { id: 2, name: 'Fatima Épicerie', email: 'fatima@epicerie.ma', phone: '+212 662 345 678', city: 'Rabat', category: 'Alimentation', status: 'actif', joinDate: '2021-07-22', totalSales: 97320, avatarColor: '#3b82f6' },
  { id: 3, name: 'Youssef Tech', email: 'youssef@tech.ma', phone: '+212 663 456 789', city: 'Marrakech', category: 'Électronique', status: 'actif', joinDate: '2023-01-10', totalSales: 215800, avatarColor: '#8b5cf6' },
  { id: 4, name: 'Amina Cosmétiques', email: 'amina@cosm.ma', phone: '+212 664 567 890', city: 'Fès', category: 'Beauté', status: 'inactif', joinDate: '2022-11-05', totalSales: 43200, avatarColor: '#f59e0b' },
  { id: 5, name: 'Hassan Sport', email: 'hassan@sport.ma', phone: '+212 665 678 901', city: 'Tanger', category: 'Sport', status: 'actif', joinDate: '2023-04-18', totalSales: 89760, avatarColor: '#ef4444' },
  { id: 6, name: 'Sara Déco', email: 'sara@deco.ma', phone: '+212 666 789 012', city: 'Agadir', category: 'Décoration', status: 'actif', joinDate: '2022-08-30', totalSales: 67500, avatarColor: '#06b6d4' },
];

// --- Categories ---
export const categories: Category[] = [
  { id: 1, name: 'Vêtements', description: 'Habillement et accessoires de mode', productCount: 45, color: '#10b981' },
  { id: 2, name: 'Alimentation', description: 'Produits alimentaires et boissons', productCount: 78, color: '#3b82f6' },
  { id: 3, name: 'Électronique', description: 'Appareils électroniques et gadgets', productCount: 32, color: '#8b5cf6' },
  { id: 4, name: 'Beauté', description: 'Cosmétiques et soins personnels', productCount: 56, color: '#ec4899' },
  { id: 5, name: 'Sport', description: 'Équipements et vêtements de sport', productCount: 41, color: '#f59e0b' },
  { id: 6, name: 'Décoration', description: 'Articles de décoration et maison', productCount: 29, color: '#06b6d4' },
];

// --- Products ---
export const products: Product[] = [
  { id: 1, name: 'T-Shirt Premium', sku: 'TSH-001', categoryId: 1, merchantId: 1, price: 199, stock: 85, minStock: 20, sold: 312, status: 'disponible' },
  { id: 2, name: 'Jean Slim Fit', sku: 'JEA-002', categoryId: 1, merchantId: 1, price: 450, stock: 5, minStock: 15, sold: 187, status: 'faible' },
  { id: 3, name: 'Huile d\'olive 5L', sku: 'HUI-001', categoryId: 2, merchantId: 2, price: 120, stock: 210, minStock: 50, sold: 534, status: 'disponible' },
  { id: 4, name: 'Couscous fin 5kg', sku: 'COU-002', categoryId: 2, merchantId: 2, price: 55, stock: 0, minStock: 30, sold: 892, status: 'rupture' },
  { id: 5, name: 'Smartphone Galaxy A54', sku: 'PHO-001', categoryId: 3, merchantId: 3, price: 3200, stock: 18, minStock: 5, sold: 74, status: 'disponible' },
  { id: 6, name: 'Écouteurs Bluetooth', sku: 'ECO-002', categoryId: 3, merchantId: 3, price: 350, stock: 42, minStock: 10, sold: 156, status: 'disponible' },
  { id: 7, name: 'Crème hydratante', sku: 'CRE-001', categoryId: 4, merchantId: 4, price: 89, stock: 0, minStock: 20, sold: 238, status: 'rupture' },
  { id: 8, name: 'Ballon de foot', sku: 'BAL-001', categoryId: 5, merchantId: 5, price: 150, stock: 67, minStock: 15, sold: 423, status: 'disponible' },
  { id: 9, name: 'Tapis de yoga', sku: 'TAP-002', categoryId: 5, merchantId: 5, price: 220, stock: 3, minStock: 10, sold: 89, status: 'faible' },
  { id: 10, name: 'Vase en céramique', sku: 'VAS-001', categoryId: 6, merchantId: 6, price: 280, stock: 24, minStock: 8, sold: 61, status: 'disponible' },
];

// --- Orders ---
export const orders: Order[] = [
  { id: 'CMD-2024-001', customer: 'Mohamed Alami', merchantId: 3, products: [{ productId: 5, qty: 1 }], total: 3200, status: 'livrée', date: '2024-01-15', address: 'Casablanca, Hay Mohammadi' },
  { id: 'CMD-2024-002', customer: 'Zineb El Fassi', merchantId: 1, products: [{ productId: 1, qty: 2 }, { productId: 2, qty: 1 }], total: 848, status: 'validée', date: '2024-01-18', address: 'Rabat, Agdal' },
  { id: 'CMD-2024-003', customer: 'Omar Benali', merchantId: 2, products: [{ productId: 3, qty: 3 }], total: 360, status: 'en_attente', date: '2024-01-20', address: 'Fès, Médina' },
  { id: 'CMD-2024-004', customer: 'Layla Chraibi', merchantId: 5, products: [{ productId: 8, qty: 1 }], total: 150, status: 'livrée', date: '2024-01-22', address: 'Tanger, Centre' },
  { id: 'CMD-2024-005', customer: 'Rachid Mansouri', merchantId: 3, products: [{ productId: 6, qty: 2 }], total: 700, status: 'annulée', date: '2024-01-23', address: 'Marrakech, Guéliz' },
  { id: 'CMD-2024-006', customer: 'Nadia Tazi', merchantId: 6, products: [{ productId: 10, qty: 1 }], total: 280, status: 'en_attente', date: '2024-01-25', address: 'Agadir, Nouveau Talborjt' },
  { id: 'CMD-2024-007', customer: 'Hamid Benkirane', merchantId: 1, products: [{ productId: 1, qty: 3 }], total: 597, status: 'validée', date: '2024-01-26', address: 'Casablanca, Maarif' },
  { id: 'CMD-2024-008', customer: 'Samira Guessous', merchantId: 2, products: [{ productId: 4, qty: 2 }], total: 110, status: 'livrée', date: '2024-01-27', address: 'Rabat, Hassan' },
];

// --- Promotions ---
export const promotions: Promotion[] = [
  { id: 1, name: 'Soldes Hiver 2024', discount: 20, type: 'percentage', productIds: [1, 2], startDate: '2024-01-01', endDate: '2024-02-28', status: 'active' },
  { id: 2, name: 'Tech Promo Flash', discount: 300, type: 'fixed', productIds: [5, 6], startDate: '2024-01-20', endDate: '2024-01-31', status: 'expirée' },
  { id: 3, name: 'Beauté & Bien-être', discount: 15, type: 'percentage', productIds: [7], startDate: '2024-02-14', endDate: '2024-02-20', status: 'planifiée' },
  { id: 4, name: 'Sport Ramadan', discount: 10, type: 'percentage', productIds: [8, 9], startDate: '2024-03-10', endDate: '2024-04-10', status: 'planifiée' },
];

// --- Chart data ---
export const salesByMonth = [
  { month: 'Jan', ventes: 42000, commandes: 38 },
  { month: 'Fév', ventes: 53000, commandes: 47 },
  { month: 'Mar', ventes: 48000, commandes: 42 },
  { month: 'Avr', ventes: 61000, commandes: 55 },
  { month: 'Mai', ventes: 75000, commandes: 68 },
  { month: 'Jun', ventes: 82000, commandes: 74 },
  { month: 'Jul', ventes: 69000, commandes: 62 },
  { month: 'Aoû', ventes: 91000, commandes: 83 },
  { month: 'Sep', ventes: 78000, commandes: 71 },
  { month: 'Oct', ventes: 95000, commandes: 87 },
  { month: 'Nov', ventes: 110000, commandes: 98 },
  { month: 'Déc', ventes: 128000, commandes: 115 },
];

export const salesByMerchant = [
  { name: 'Youssef Tech', value: 215800 },
  { name: 'Karim Boutique', value: 128450 },
  { name: 'Fatima Épicerie', value: 97320 },
  { name: 'Hassan Sport', value: 89760 },
  { name: 'Sara Déco', value: 67500 },
  { name: 'Amina Cosm.', value: 43200 },
];

export const stockByCategory = [
  { category: 'Vêtements', stock: 90 },
  { category: 'Alimentation', stock: 210 },
  { category: 'Électronique', stock: 60 },
  { category: 'Beauté', stock: 0 },
  { category: 'Sport', stock: 70 },
  { category: 'Décoration', stock: 24 },
];
