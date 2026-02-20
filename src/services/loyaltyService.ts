import axiosClient from "@/api/axiosClient";

export interface LoyaltyPoints {
  balance: number;
  totalEarned: number;
}

export interface LoyaltyHistoryItem {
  id: string;
  type: "earn" | "spend";
  points: number;
  description: string;
  date: string;
}

// Mock data
const mockHistory: LoyaltyHistoryItem[] = [
  { id: "l1", type: "earn", points: 185, description: "Achat CMD-1001 — Samsung Galaxy A54", date: "2026-02-10T10:30:00Z" },
  { id: "l2", type: "earn", points: 35, description: "Achat CMD-1002 — Sac artisanal", date: "2026-02-05T14:15:00Z" },
  { id: "l3", type: "spend", points: -50, description: "Réduction appliquée sur commande", date: "2026-01-28T09:00:00Z" },
  { id: "l4", type: "earn", points: 22, description: "Achat CMD-998 — Riz Parfumé 25kg", date: "2026-01-20T11:45:00Z" },
];

export const loyaltyService = {
  async getPoints(): Promise<LoyaltyPoints> {
    try {
      const { data } = await axiosClient.get("/loyalty/points");
      return data;
    } catch {
      return { balance: 192, totalEarned: 292 };
    }
  },

  async getHistory(): Promise<LoyaltyHistoryItem[]> {
    try {
      const { data } = await axiosClient.get("/loyalty/history");
      return data;
    } catch {
      return mockHistory;
    }
  },
};
