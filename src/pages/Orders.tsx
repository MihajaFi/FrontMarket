import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { useAuth } from "@/context/AuthContext";
import { orderService, type OrderResponse } from "@/services/orderService";
import { formatPrice } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Loader2, XCircle } from "lucide-react";

const statusConfig = {
  PENDING: { label: "En attente", variant: "outline" },
  PAID: { label: "Payée", variant: "default" },
  SHIPPED: { label: "Expédiée", variant: "secondary" },
  CANCELLED: { label: "Annulée", variant: "destructive" },
} as const;

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    orderService
      .getAll()
      .then(setOrders)
      .catch(() => toast.error("Erreur chargement commandes"))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center">
          <Button onClick={() => navigate("/login")}>
            Se connecter
          </Button>
        </div>
      </MarketplaceLayout>
    );
  }

  const handleCancel = async (id: number) => {
    try {
      await orderService.delete(id);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "CANCELLED" } : o
        )
      );

      toast.success("Commande annulée");
    } catch {
      toast.error("Impossible d'annuler");
    }
  };

  return (
    <MarketplaceLayout>
      <div className="container py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Mes commandes
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center py-12">
            Aucune commande
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-xl p-5 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      Commande #{order.id}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(order.order_date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <Badge variant={statusConfig[order.status].variant}>
                    {statusConfig[order.status].label}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.product_name} x{item.quantity}
                      </span>
                      <span>
                        {formatPrice(item.sub_total)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-3 border-t font-bold text-primary">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>

                {order.status === "PENDING" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleCancel(order.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default Orders;