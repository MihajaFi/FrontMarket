import { useEffect, useState } from 'react';
import { MerchantLayout } from "@/components/MerchantLayout";
import { stockService } from '@/services/stockService';
import { merchantProductService } from '@/services/merchantProductService';
import type { StockResponse, StockRequest, Product } from '@/data/mock-data';
import { AlertTriangle, TrendingDown, CheckCircle, Pencil, Plus, Trash2, Search } from 'lucide-react';

export function MerchantStock() {
  const [list, setList] = useState<StockResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StockResponse | null>(null);
  const [form, setForm] = useState<StockRequest>({ quantity: 0, alert: '', productId: 0 });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStocks() {
      setLoading(true);
      try {
        const data = await stockService.getAll();
        setList(data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    async function fetchProducts() {
      try {
        const data = await merchantProductService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchStocks();
    fetchProducts();
  }, []);

  const filtered = list.filter(s =>
    s.productName.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const ruptureCount = list.filter(s => s.alert.toLowerCase() === 'rupture').length;
  const lowCount = list.filter(s => s.alert.toLowerCase() === 'faible').length;
  const okCount = list.filter(s => s.alert.toLowerCase() === 'disponible').length;


  function openAdd() {
    setEditing(null);
    setForm({
      quantity: 0,
      alert: '',
      productId: Number(products[0]?.id) || 0
    });
    setModalOpen(true);
  }

  function openEdit(stock: StockResponse) {
    setEditing(stock);
    const product = products.find(p => p.name === stock.productName);
    setForm({
      quantity: stock.quantity,
      alert: stock.alert,
      productId: Number(product?.id) || 0,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      if (editing) {
        const updated = await stockService.update(editing.id, form);
        setList(l => l.map(s => s.id === editing.id ? updated : s));
      } else {
        const created = await stockService.create(form);
        setList(l => [created, ...l]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'enregistrement.');
    }
  }

  async function handleDelete(id: number) {
    try {
      await stockService.delete(id);
      setList(l => l.filter(s => s.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression.');
    }
  }

  return (
    <MerchantLayout title="Gestion des stocks" subtitle="Suivi des niveaux de stock">
      {/* Recherche + Ajouter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="search-bar">
          <Search size={15} color="hsl(var(--muted-foreground))" />
          <input placeholder="Recherche produit..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Ajouter un stock</button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="stat-card"><CheckCircle size={20} color="green" /> <span>{okCount} Disponibles</span></div>
        <div className="stat-card"><TrendingDown size={20} color="orange" /> <span>{lowCount} Stock faible</span></div>
        <div className="stat-card"><AlertTriangle size={20} color="red" /> <span>{ruptureCount} Ruptures</span></div>
      </div>

      {/* Data table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Description</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Alerte</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center' }}>Aucun stock trouvé</td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td>{s.productName}</td>
                <td>{s.description}</td>
                <td>{s.price.toLocaleString()} MAD</td>
                <td>{s.quantity}</td>
                <td>{s.alert}</td>
                <td style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn-icon btn-icon-edit" onClick={() => openEdit(s)}><Pencil size={13} /></button>
                  <button className="btn-icon btn-icon-delete" onClick={() => setDeleteId(s.id)}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3>{editing ? 'Modifier le stock' : 'Ajouter un stock'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Select produit */}
              <select
                value={form.productId}
                onChange={e => setForm(f => ({ ...f, productId: Number(e.target.value) }))}
                className="form-input"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantité"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Alerte (disponible/faible/rupture)"
                value={form.alert}
                onChange={e => setForm(f => ({ ...f, alert: e.target.value }))}
                className="form-input"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal delete */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 320 }}>
            <h3>Supprimer le stock ?</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId!)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </MerchantLayout>
  );
}