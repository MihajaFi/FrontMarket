import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Product, ProductRequest, Merchant } from '@/data/mock-data';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { merchantProductService } from '@/services/merchantProductService';
import { merchantService } from '@/services/adminMerchantService';
import { formatPrice } from '@/services/merchantProductService';

export function AdminProducts() {
  const [list, setList] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductRequest>({
    name: '',
    description: '',
    category: '',
    merchantId: 0,
    price: 0,
    image: undefined
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Chargement produits et marchands ---
  useEffect(() => {
    fetchProducts();
    fetchMerchants();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await merchantProductService.getProducts();
      setList(data);
    } catch (error) {
      console.error("Erreur chargement produits :", error);
    }
  };

  const fetchMerchants = async () => {
    try {
      const data = await merchantService.getAll();
      setMerchants(data);
    } catch (error) {
      console.error("Erreur chargement marchands :", error);
    }
  };

  const filtered = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // --- Modal ouverture ajout ---
  function openAdd() {
    setEditing(null);
    setForm({
      name: '',
      description: '',
      category: '',
      merchantId: merchants[0]?.id || 0,
      price: 0,
      image: undefined
    });
    setImagePreview('');
    setModalOpen(true);
  }

  // --- Modal ouverture édition ---
  function openEdit(p: Product) {
    const merchant = merchants.find(m => m.name === p.merchant);
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category,
      merchantId: merchant ? merchant.id : 0,
      price: p.price || 0,
      image: undefined
    });
    setImagePreview(p.image || '');
    setModalOpen(true);
  }

  // --- Gestion image ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // --- Enregistrement produit ---
  const handleSave = async () => {
    if (!form.name || !form.category || !form.merchantId || !form.price) {
      alert("Tous les champs obligatoires doivent être remplis !");
      return;
    }

    try {
      if (editing) {
        await merchantProductService.updateProduct(Number(editing.id), form);
      } else {
        await merchantProductService.createProduct(form);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Une erreur est survenue lors de l'enregistrement !");
    } finally {
      // Toujours fermer le modal et rafraîchir la liste
      setModalOpen(false);
      fetchProducts();
    }
  };

  // --- Suppression produit ---
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await merchantProductService.deleteProduct(id); // id déjà number
      fetchProducts();
      setDeleteId(null);
    } catch (error: any) {
      console.error("Échec suppression produit id", id, error.response?.data || error);
      alert("Erreur lors de la suppression du produit : " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Layout title="Produits" subtitle={`${list.length} produit(s)`}>
      {/* --- Barre recherche et ajout --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="search-bar">
          <Search size={15} color="hsl(var(--muted-foreground))" />
          <input placeholder="Nom..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Ajouter un produit</button>
      </div>

      {/* --- Tableau produits --- */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Commerçant</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Aucun produit trouvé</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td>
                  {p.image ? <img src={`${import.meta.env.VITE_IMAGE}${p.image}`} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} /> :
                    <Package size={28} color="hsl(var(--muted-foreground))" />}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.merchant}</td>
                <td>{p.price ? formatPrice(p.price) : '-'}</td>
                <td style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon btn-icon-edit" onClick={() => openEdit(p)}><Pencil size={13} /></button>
                  <button className="btn-icon btn-icon-delete" onClick={() => setDeleteId(Number(p.id))}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modal ajout / édition --- */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <h3>{editing ? 'Modifier' : 'Ajouter'} un produit</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label>Nom *</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <label>Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              <label>Prix *</label>
              <input type="number" className="form-input" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
              <label>Catégorie *</label>
              <input className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              <label>Commerçant *</label>
              <select className="form-input" value={form.merchantId} onChange={e => setForm(f => ({ ...f, merchantId: Number(e.target.value) }))}>
                {merchants.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <label>Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} />
              {imagePreview && <img src={imagePreview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', marginTop: 4 }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal suppression --- */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>Supprimer ce produit ?</h3>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 12 }}>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Annuler</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}