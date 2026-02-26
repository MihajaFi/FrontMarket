import { useEffect, useState } from "react";
import { Package, Truck, Clock, XCircle } from "lucide-react";
import { orderService, OrderResponse } from "@/services/orderService";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";

// Mapping des statuts pour afficher les icônes
const statusIcons: Record<string, any> = {
  PENDING: Clock,
  PAID: Package,
  SHIPPED: Truck,
  CANCELLED: XCircle,
};

export default function OrderTracking() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Charger les commandes utilisateur
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔥 Annuler commande
  const handleCancel = async (id: number) => {
    const confirmCancel = window.confirm(
      "Voulez-vous vraiment annuler cette commande ?"
    );

    if (!confirmCancel) return;

    try {
      await orderService.delete(id);

      // Retirer la commande supprimée de l'état local
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'annulation");
    }
  };

  if (loading) {
    return <p className="text-center py-8">Chargement des commandes...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  return (
    <MarketplaceLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold">
          Suivi de commandes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Suivez l'état de vos commandes en temps réel.
        </p>

        <div className="mt-8 space-y-4">
          {orders.length === 0 && (
            <p className="text-center text-muted-foreground">
              Aucune commande trouvée.
            </p>
          )}

          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;

            return (
              <div
                key={order.id}
                className="rounded-xl border bg-card p-5 shadow-card"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <StatusIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">
                        Commande #{order.id}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "PAID"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "SHIPPED"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Produits */}
                <div className="mt-4 space-y-1">
                  {order.items.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {p.product_name} × {p.quantity}
                      </span>
                      <span>
                        {(p.unit_price * p.quantity).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "MGA",
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between border-t pt-3 gap-4">
                  <span className="text-sm text-muted-foreground">
                    {order.address}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="font-heading font-bold text-primary">
                      {order.totalAmount.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "MGA",
                      })}
                    </span>

                    {/* Bouton Annuler si PENDING */}
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 transition"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MarketplaceLayout>
  );
}