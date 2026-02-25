import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { orderService, OrderResponse } from "@/services/orderService";
import { Search, Eye, ShoppingCart } from "lucide-react";

/* =======================
   STATUTS BACKEND
======================= */
const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "CANCELLED"] as const;

const statusConfig: Record<
  OrderResponse["status"],
  { label: string; cls: string }
> = {
  PENDING: { label: "En attente", cls: "badge-pending" },
  PAID: { label: "Payée", cls: "badge-validated" },
  SHIPPED: { label: "Livrée", cls: "badge-delivered" },
  CANCELLED: { label: "Annulée", cls: "badge-cancelled" },
};

export function AdminOrders() {
  const [list, setList] = useState<OrderResponse[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderResponse["status"]>("all");
  const [viewOrder, setViewOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     LOAD ORDERS
  ======================= */
  useEffect(() => {
    orderService
      .getAll()
      .then(setList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* =======================
     FILTERS
  ======================= */
  const filtered = list.filter(o => {
    const q = search.toLowerCase();
    return (
      (o.id.toString().includes(q) ||
        o.userName.toLowerCase().includes(q)) &&
      (filterStatus === "all" || o.status === filterStatus)
    );
  });

  /* =======================
     STATUS UPDATE (BACKEND)
  ======================= */
  async function updateStatus(id: number, status: OrderResponse["status"]) {
    try {
      const currentOrder = list.find(o => o.id === id);
      if (!currentOrder) return;

      // Appel backend PATCH pour mise à jour partielle
      const updated = await orderService.updateStatus(id, status);

      // Met à jour le state local
      setList(l => l.map(o => (o.id === id ? updated : o)));
      if (viewOrder?.id === id) {
        setViewOrder(updated);
      }
    } catch (error) {
      console.error("Erreur update status:", error);
    }
  }

  const counts = STATUS_OPTIONS.reduce(
    (acc, s) => ({
      ...acc,
      [s]: list.filter(o => o.status === s).length,
    }),
    {} as Record<OrderResponse["status"], number>
  );

  return (
    <Layout title="Commandes" subtitle={`${list.length} commande(s) au total`}>
      {/* STATUS SUMMARY */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {STATUS_OPTIONS.map(s => (
          <div
            key={s}
            className={statusConfig[s]?.cls || ""}
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
            {statusConfig[s]?.label || s} ({counts[s] || 0})
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
              <th>Commerçant</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  Chargement...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                  <ShoppingCart size={32} style={{ opacity: 0.4 }} />
                  <br />Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filtered.map(o => (
                <tr key={o.id}>
                  <td><code>{o.id}</code></td>
                  <td>{o.userName}</td>
                  <td>{o.merchantName}</td>
                  <td>{o.totalAmount?.toLocaleString() ?? "0"} MAD</td>
                  <td>{o.orderDate}</td>
                  <td>
                    {statusConfig[o.status] ? (
                      <span className={statusConfig[o.status].cls}>
                        {statusConfig[o.status].label}
                      </span>
                    ) : (
                      <span>Inconnu</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => setViewOrder(o)} title="Voir">
                        <Eye size={14} />
                      </button>
                      <select
                        value={o.status}
                        onChange={e =>
                          updateStatus(o.id, e.target.value as OrderResponse["status"])
                        }
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>
                            {statusConfig[s]?.label || s}
                          </option>
                        ))}
                      </select>
                    </div>
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
            <Row label="Commerçant" value={viewOrder.merchantName} />
            <Row label="Date" value={viewOrder.orderDate} />
            <Row label="Adresse" value={viewOrder.address} />
            <Row
              label="Total"
              value={`${viewOrder.totalAmount?.toLocaleString() ?? "0"} MAD`}
              bold
            />
            <button onClick={() => setViewOrder(null)}>Fermer</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

/* =======================
   ROW COMPONENT
======================= */
function Row({
  label,
  value,
  mono,
  bold,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>{label}</span>
      <span
        style={{
          fontFamily: mono ? "monospace" : undefined,
          fontWeight: bold ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}