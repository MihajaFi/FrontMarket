import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { LayoutDashboard, Package, Warehouse, ShoppingBag, BarChart3 } from "lucide-react";

const merchantNav = [
  { to: "/commercant", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/commercant/produits", label: "Produits", icon: Package },
  { to: "/commercant/stocks", label: "Stocks", icon: Warehouse },
  { to: "/commercant/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/commercant/statistiques", label: "Statistiques", icon: BarChart3 },
];

export function MerchantLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar items={merchantNav} title="Espace Commerçant" />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
