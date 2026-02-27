import { useEffect, useState } from "react";
import { MerchantLayout } from "@/components/MerchantLayout";
import { merchantService } from "@/services/adminMerchantService";
import { merchantOrderService, OrderCurrentResponse } from "@/services/merchantOrderService";
import { orderService, OrderResponse } from "@/services/orderService";
import { Search, Eye, ShoppingCart } from "lucide-react";
import { Merchant } from "@/data/mock-data";

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

const statusConfig: Record<OrderCurrentResponse["status"], { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "badge-pending" },
  PAID: { label: "Payée", cls: "badge-validated" },
  SHIPPED: { label: "Livrée", cls: "badge-delivered" },
  CANCELLED: { label: "Annulée", cls: "badge-cancelled" },
};

export function MerchantOrders() {
  const [list, setList] = useState<OrderCurrentResponse[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderCurrentResponse["status"]>("all");
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [viewOrder, setViewOrder] = useState<OrderCurrentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = () => {
    const user = localStorage.getItem("mc_user");
    return user ? JSON.parse(user) : null;
  };

  // Charger le marchand connecté et ses commandes
  useEffect(() => {
    const fetchMerchantAndOrders = async () => {
      try {
        const user = getCurrentUser();
        if (!user) return;

        const merchantData = await merchantService.getByEmail(user.email);
        setMerchant(merchantData);

        const orders = await merchantOrderService.getCurrentOrders(merchantData.id);
        setList(orders);
      } catch (error) {
        console.error("Erreur chargement marchand ou commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantAndOrders();
  }, []);

  const filtered = list.filter(o => {
    const q = search.toLowerCase();
    return (
      (o.id.toString().includes(q) || o.userName.toLowerCase().includes(q)) &&
      (filterStatus === "all" || o.status === filterStatus)
    );
  });

  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({ ...acc, [s]: list.filter(o => o.status === s).length }),
    {} as Record<OrderCurrentResponse["status"], number>
  );

  // Fonction pour mettre à jour le status d'une commande
  const updateStatus = async (id: number, status: OrderResponse["status"]) => {
    try {
      const updatedOrder = await orderService.updateStatus(id, status);
      setList(prev => prev.map(o => (o.id === id ? updatedOrder : o)));
      if (viewOrder?.id === id) setViewOrder(updatedOrder);
    } catch (error) {
      console.error("Erreur update status:", error);
      alert("Impossible de mettre à jour le statut de la commande.");
    }
  };

  return (
    <MerchantLayout title="Commandes" subtitle={`${list.length} commande(s) au total`}>
      {/* STATUS SUMMARY */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map(s => (
          <div
            key={s}
            className={statusConfig[s].cls}
            style={{
              padding: "0.4rem 0.875rem",
              borderRadius: "99px",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              opacity: filterStatus !== "all" && filterStatus !== s ? 0.5 : 1,
            }}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
          >
            {statusConfig[s].label} ({counts[s] || 0})
          </div>
        ))}
      </div>

      {/* TOOLBAR */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div className="search-bar">
          <Search size={15} />
          <input
            placeholder="ID ou client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                  <ShoppingCart size={32} style={{ opacity: 0.4 }} />
                  <br />Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filtered.map(o => (
                <tr key={o.id}>
                  <td><code>{o.id}</code></td>
                  <td>{o.userName}</td>
                  <td>{o.totalAmount?.toLocaleString() ?? "0"} MAD</td>
                  <td>{o.orderDate}</td>
                  <td>
                    <span className={statusConfig[o.status]?.cls}>
                      {statusConfig[o.status]?.label}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <button onClick={() => setViewOrder(o)} title="Voir">
                      <Eye size={14} />
                    </button>
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value as OrderResponse["status"])}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>
                          {statusConfig[s].label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {viewOrder && (
        <div className="modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Détail commande</h3>
            <Row label="ID" value={viewOrder.id.toString()} mono />
            <Row label="Client" value={viewOrder.userName} />
            <Row label="Date" value={viewOrder.orderDate} />
            <Row label="Total" value={`${viewOrder.totalAmount?.toLocaleString() ?? "0"} MAD`} bold />
            <Row label="Statut" value={statusConfig[viewOrder.status].label} />
            <button onClick={() => setViewOrder(null)}>Fermer</button>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}

function Row({ label, value, mono, bold }: { label: string; value: string; mono?: boolean; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
      <span>{label}</span>
      <span style={{ fontFamily: mono ? "monospace" : undefined, fontWeight: bold ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}