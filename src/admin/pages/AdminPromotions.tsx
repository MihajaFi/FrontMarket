import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import type { Product, Promotion, PromotionRequest, PromotionLoyalty } from '@/data/mock-data';
import { Plus, Pencil, Trash2, Gift, Tag } from 'lucide-react';
import { promotionService, promotionLoyaltyService, productService } from '@/services';

const statusConfig: Record<string, { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'badge-validated' },
  expirée: { label: 'Expirée', cls: 'badge-cancelled' },
  planifiée: { label: 'Planifiée', cls: 'badge-pending' },
};

export function AdminPromotions() {
  const [list, setList] = useState<Promotion[]>([]);
  const [promotionLoyalties, setPromotionLoyalties] = useState<PromotionLoyalty[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [form, setForm] = useState<PromotionRequest>({
    promotionLoyalty: 0,
    productItems: [],
    type: 'percentage',
    status: 'planifiée',
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
 
  useEffect(() => {
    fetchPromotions();
    fetchPromotionLoyalties();
    fetchProducts();
  }, []);

  async function fetchPromotions() {
    const data = await promotionService.getAll();
    setList(data);
  }
  async function fetchProducts() {
    const data = await productService.getProducts();
    setProducts(data);
  }
  async function fetchPromotionLoyalties() {
    const data = await promotionLoyaltyService.getAll();
    setPromotionLoyalties(data);
  }

  function openAdd() {
    setEditing(null);
    setForm({ promotionLoyalty: 0, productItems: [], type: 'percentage', status: 'planifiée' });
    setModalOpen(true);
  }

  function openEdit(p: Promotion) {
    setEditing(p);
    setForm({
      promotionLoyalty: p.promotionLoyalty.id,
      productItems: p.productItems.map(pid => ({ productId: pid.id.toString() })),
      type: p.type,
      status: p.status,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.promotionLoyalty || form.productItems.length === 0) return;
    let saved: Promotion;
    if (editing) {
      saved = await promotionService.update(editing.id, form);
      setList(l => l.map(p => p.id === saved.id ? saved : p));
    } else {
      saved = await promotionService.create(form);
      setList(l => [...l, saved]);
    }
    setModalOpen(false);
  }

  async function handleDelete(id: number) {
    await promotionService.delete(id);
    setList(l => l.filter(p => p.id !== id));
    setDeleteId(null);
  }

  function toggleProduct(productId: number) {
    setForm(f => {
      const exists = f.productItems.find(p => p.productId === productId.toString());
      const updatedItems = exists
        ? f.productItems.filter(p => p.productId !== productId.toString())
        : [...f.productItems, { productId: productId.toString() }];
      return { ...f, productItems: updatedItems };
    });
  }

  function getProductNames(items: Product[]) {
    return items.map(p => p.name).join(', ') || 'Aucun produit';
  }

  return (
    <Layout title="Promotions" subtitle="Gérez vos promotions et offres spéciales">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Créer une promotion</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {list.map(promo => {
          const sc = statusConfig[promo.status];
          return (
            <div key={promo.id} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
                background: promo.status === 'active' ? 'hsl(var(--primary) / 0.08)' : 'hsl(var(--muted))',
                borderRadius: '0 var(--radius) 0 80px',
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <div style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
                    background: 'hsl(var(--primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Gift size={16} color="hsl(var(--primary))" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{promo.promotionLoyalty.promotion_type}</div>
                    <span className={sc.cls} style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600 }}>{sc.label}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.375rem', zIndex: 1 }}>
                  <button className="btn-icon btn-icon-edit" onClick={() => openEdit(promo)}><Pencil size={13} /></button>
                  <button className="btn-icon btn-icon-delete" onClick={() => setDeleteId(promo.id)}><Trash2 size={13} /></button>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{
                  fontSize: '2rem', fontWeight: 900, color: 'hsl(var(--primary))', lineHeight: 1,
                }}>
                  -{promo.type === 'percentage' ? promo.promotionLoyalty.value + '%' : promo.promotionLoyalty.value + ' MAD'}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '0.5rem' }}>
                <Tag size={12} style={{ display: 'inline', marginRight: 4 }} />
                {getProductNames(promo.productItems)}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                📅 {promo.promotionLoyalty.start_date} → {promo.promotionLoyalty.end_date}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Ajouter / Modifier */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>
              {editing ? 'Modifier' : 'Créer'} une promotion
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="form-label">Promotion Loyalty *</label>
                <select
                  className="form-input"
                  value={form.promotionLoyalty}
                  onChange={e => setForm(f => ({ ...f, promotionLoyalty: Number(e.target.value) }))}
                >
                  <option value={0}>Sélectionner une promotion</option>
                  {promotionLoyalties.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.promotion_type} - {l.value}{l.promotion_type === 'percentage' ? '%' : ' MAD'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Type</label>
                <select
                  className="form-input"
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed">Fixe (MAD)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Statut</label>
                <select
                  className="form-input"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                >
                  <option value="planifiée">Planifiée</option>
                  <option value="active">Active</option>
                  <option value="expirée">Expirée</option>
                </select>
              </div>

              <div>
                <label className="form-label">Produits concernés</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.25rem' }}>
                  {products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => toggleProduct(Number(p.id))}
                      style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '99px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: form.productItems.some(pi => pi.productId === p.id.toString())
                          ? 'hsl(var(--primary))'
                          : 'hsl(var(--muted))',
                        color: form.productItems.some(pi => pi.productId === p.id.toString())
                          ? 'white'
                          : 'hsl(var(--muted-foreground))',
                        transition: 'all 0.15s',
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Supprimer cette promotion ?</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId!)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}