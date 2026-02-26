import { Outlet } from "react-router-dom";
import { ClientNavbar } from "@/components/ClientNavbar";
import { Footer } from "@/components/Footer";

export function ClientLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ClientNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
