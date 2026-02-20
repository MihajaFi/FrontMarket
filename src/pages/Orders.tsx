import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { useAuth } from "@/context/AuthContext";
import { orderService, type Order, type OrderStatus } from "@/services/orderService";
import { formatPrice } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, Loader2 } from "lucide-react";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "En attente", icon: <Clock className="h-3 w-3" />, variant: "outline" },
  confirmed: { label: "Confirmée", icon: <CheckCircle2 className="h-3 w-3" />, variant: "default" },
  shipping: { label: "En livraison", icon: <Truck className="h-3 w-3" />, variant: "secondary" },
  delivered: { label: "Livrée", icon: <CheckCircle2 className="h-3 w-3" />, variant: "default" },
  cancelled: { label: "Annulée", icon: <XCircle className="h-3 w-3" />, variant: "destructive" },
};

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    orderService.getMyOrders().then(setOrders).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center space-y-4">
          <h2 className="font-display font-bold text-2xl text-foreground">Connexion requise</h2>
          <p className="text-muted-foreground">Connectez-vous pour voir vos commandes.</p>
          <Button onClick={() => navigate("/login")} className="marketplace-gradient text-primary-foreground border-0 font-semibold">Se connecter</Button>
        </div>
      </MarketplaceLayout>
    );
  }

  const handleCancel = async (id: string) => {
    try {
      await orderService.cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
      toast.success("Commande annulée");
    } catch (err: any) {
      toast.error(err.message || "Impossible d'annuler");
    }
  };

  return (
    <MarketplaceLayout>
      <div className="container py-6 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" /> Mes commandes
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="font-display font-semibold text-lg text-foreground">Aucune commande</h2>
            <p className="text-muted-foreground">Vous n'avez pas encore passé de commande.</p>
            <Button onClick={() => navigate("/products")} className="marketplace-gradient text-primary-foreground border-0 font-semibold">
              Découvrir les produits
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = statusConfig[order.status];
              return (
                <div key={order.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Badge variant={cfg.variant} className="flex items-center gap-1">
                      {cfg.icon} {cfg.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.image} alt={item.productName} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Total : <span className="font-display font-bold text-primary">{formatPrice(order.total)}</span>
                    </p>
                    {order.status === "pending" && (
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleCancel(order.id)}>
                        <XCircle className="h-3 w-3 mr-1" /> Annuler
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default Orders;
