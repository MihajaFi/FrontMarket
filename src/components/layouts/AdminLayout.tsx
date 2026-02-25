import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { LayoutDashboard, Users, FolderTree, BarChart3 } from "lucide-react";

const adminNav = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/commercants", label: "Commerçants", icon: Users },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree },
  { to: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar items={adminNav} title="Administration" />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
