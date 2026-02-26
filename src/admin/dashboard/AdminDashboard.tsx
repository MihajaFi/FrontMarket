import { Layout } from '@/components/Layout';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { salesByMonth, salesByMerchant, stockByCategory, merchants, products, orders } from '@/data/mockData';
import { TrendingUp, Package, Store, ShoppingCart, AlertTriangle } from 'lucide-react';
  
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

const totalSales = salesByMonth.reduce((s, m) => s + m.ventes, 0);
const lowStock = products.filter(p => p.status !== 'disponible').length;
const pendingOrders = orders.filter(o => o.status === 'en_attente').length;

const statCards = [
  {
    label: 'Total des ventes',
    value: `${(totalSales / 1000).toFixed(0)}k MAD`,
    icon: TrendingUp,
    iconBg: 'hsl(var(--stat-sales) / 0.12)',
    iconColor: 'hsl(var(--stat-sales))',
    change: '+12.5%',
    positive: true,
  },
  {
    label: 'Produits',
    value: products.length,
    icon: Package,
    iconBg: 'hsl(var(--stat-products) / 0.12)',
    iconColor: 'hsl(var(--stat-products))',
    change: '+3 ce mois',
    positive: true,
  },
  {
    label: 'Commerçants',
    value: merchants.filter(m => m.status === 'actif').length,
    icon: Store,
    iconBg: 'hsl(var(--stat-merchants) / 0.12)',
    iconColor: 'hsl(var(--stat-merchants))',
    change: `${merchants.length} total`,
    positive: true,
  },
  {
    label: 'Commandes en attente',
    value: pendingOrders,
    icon: ShoppingCart,
    iconBg: 'hsl(var(--stat-stock) / 0.12)',
    iconColor: 'hsl(var(--stat-stock))',
    change: `${orders.length} total`,
    positive: null,
  },
];

export default function AdminDashboard() {
  return (
    <Layout title="Tableau de bord" subtitle="Vue d'ensemble de votre activité commerciale">
      {/* Alert if low stock */}
      {lowStock > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'hsl(var(--status-stock) / 0.08)',
          border: '1px solid hsl(38 92% 50% / 0.3)',
          borderRadius: 'var(--radius)',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          color: 'hsl(38 92% 40%)',
          fontSize: '0.875rem',
        }}>
          <AlertTriangle size={16} />
          <strong>{lowStock} produit(s)</strong> en stock faible ou en rupture — vérifiez vos stocks.
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map(card => (
          <div key={card.label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', fontWeight: 500, marginBottom: '0.25rem' }}>{card.label}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'hsl(var(--foreground))', lineHeight: 1 }}>{card.value}</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.4rem', color: card.positive ? 'hsl(var(--stat-sales))' : 'hsl(var(--muted-foreground))' }}>
                  {card.change}
                </p>
              </div>
              <div className="stat-icon" style={{ background: card.iconBg }}>
                <card.icon size={20} color={card.iconColor} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Sales area chart */}
        <div className="chart-card">
          <div className="chart-title">Évolution des ventes (MAD)</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MAD`, 'Ventes']} />
              <Area type="monotone" dataKey="ventes" stroke="#10b981" strokeWidth={2.5} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="chart-card">
          <div className="chart-title">Ventes par commerçant</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={salesByMerchant} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                dataKey="value" paddingAngle={3}>
                {salesByMerchant.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v.toLocaleString()} MAD`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.25rem' }}>
            {salesByMerchant.slice(0, 4).map((m, i) => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORS[i], flexShrink: 0 }} />
                <span style={{ flex: 1, color: 'hsl(var(--muted-foreground))', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                <span style={{ fontWeight: 600 }}>{(m.value / 1000).toFixed(0)}k</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Orders bar chart */}
        <div className="chart-card">
          <div className="chart-title">Commandes mensuelles</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesByMonth} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 88%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="commandes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Commandes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock by category */}
        <div className="chart-card">
          <div className="chart-title">Stock par catégorie</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockByCategory} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 88%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="stock" radius={[0, 4, 4, 0]} name="Stock">
                {stockByCategory.map((s, i) => (
                  <Cell key={i} fill={s.stock === 0 ? '#ef4444' : s.stock < 20 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="data-table">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid hsl(var(--border))' }}>
          <h3 style={{ fontWeight: 600, margin: 0 }}>Commandes récentes</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(order => (
              <tr key={order.id}>
                <td><code style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))' }}>{order.id}</code></td>
                <td style={{ fontWeight: 500 }}>{order.customer}</td>
                <td style={{ fontWeight: 600 }}>{order.total.toLocaleString()} MAD</td>
                <td style={{ color: 'hsl(var(--muted-foreground))' }}>{order.date}</td>
                <td><StatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    en_attente: { label: 'En attente', cls: 'badge-pending' },
    validée: { label: 'Validée', cls: 'badge-validated' },
    livrée: { label: 'Livrée', cls: 'badge-delivered' },
    annulée: { label: 'Annulée', cls: 'badge-cancelled' },
  };
  const s = map[status] || { label: status, cls: '' };
  return (
    <span className={s.cls} style={{
      padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
    }}>
      {s.label}
    </span>
  );
}
