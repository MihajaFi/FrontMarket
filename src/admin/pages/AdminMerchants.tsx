import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { merchantService } from "@/services";
import { Merchant } from "@/data/mock-data";
import { Plus, Pencil, Trash2, Search, Store } from "lucide-react";
import emailjs from "@emailjs/browser";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

function initials(name: string) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminMerchants() {

  const SERVICE_ID = 
            (import.meta.env as Record<string, string>).VITE_PUBLIC_EMAILJS_SERVICE_ID!;
  const TEMPLATE_ID =
            (import.meta.env as Record<string, string>).VITE_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const PUBLIC_KEY = 
             (import.meta.env as Record<string, string>).VITE_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const [list, setList] = useState<Merchant[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Merchant | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    status: "actif" as "actif" | "inactif",
  });
  useEffect(() => {
    setLoading(true);
    merchantService
      .getAll()
      .then(setList)
      .catch(err => console.error("Erreur chargement commerçants", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = list.filter(m =>
    (m.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (m.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "actif",
    });
    setModalOpen(true);
  }

  function openEdit(m: Merchant) {
    setEditing(m);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      city: m.city,
      status: m.status,
    });
    setModalOpen(true);
  }
   const sendEmailCode = async (email: string, code: string) => {
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { to_email: email, code: code },
        PUBLIC_KEY,
      );
    } catch (err) {
      console.error("Erreur EmailJS :", err);
    }
  };

  async function handleSave() {
    if (!form.name.trim()) return;

    try {
      if (editing) {
        const updated = await merchantService.update(editing.id, form);
        setList(l => l.map(m => (m.id === updated.id ? updated : m)));
      } else {
        const response = await merchantService.create(form);

        const newMerchant: Merchant = {
          ...response.merchant,
          avatarColor:
            response.merchant.avatarColor ||
            COLORS[list.length % COLORS.length],
        };

        setList(l => [newMerchant, ...l]);

        await sendEmailCode(response.merchant.email, response.generatedPassword);

        alert(
          `Commerçant créé !`
        );
      }
      setModalOpen(false);
    } catch (e) {
      console.error("Erreur sauvegarde commerçant", e);
    }
  }

  async function handleDelete(id: number) {
    try {
      await merchantService.delete(id);
      setList(l => l.filter(m => m.id !== id));
      setDeleteId(null);
    } catch (e) {
      console.error("Erreur suppression commerçant", e);
    }
  }

  return (
    <Layout title="Commerçants" subtitle={`${list.length} commerçant(s) enregistré(s)`}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="search-bar">
          <Search size={15} color="hsl(var(--muted-foreground))" />
          <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Ajouter un commerçant
        </button>
      </div>

      {/* Table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Commerçant</th>
              <th>Contact</th>
              <th>Ville</th>
              <th>Ventes totales</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                <Store size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} /><br />Aucun commerçant trouvé
              </td></tr>
            ) : filtered.map(m => (
              <tr key={m.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="avatar" style={{ background: m.avatarColor }}>{initials(m.name)}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>Depuis {m.joinDate}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem' }}>{m.email}</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>{m.phone}</div>
                </td>
                <td>{m.city}</td>
                <td style={{ fontWeight: 600 }}>{m.totalSales.toLocaleString()} produits</td>
                <td>
                  <span className={m.status === 'actif' ? 'badge-validated' : 'badge-cancelled'} style={{
                    padding: '0.25rem 0.625rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                  }}>
                    {m.status === 'actif' ? '● Actif' : '● Inactif'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.375rem' }}>
                    <button className="btn-icon btn-icon-edit" onClick={() => openEdit(m)} title="Modifier"><Pencil size={13} /></button>
                    <button className="btn-icon btn-icon-delete" onClick={() => setDeleteId(m.id)} title="Supprimer"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>{editing ? 'Modifier' : 'Ajouter'} un commerçant</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Nom *</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nom du commerçant" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemple.ma" />
              </div>
              <div>
                <label className="form-label">Téléphone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+212 6xx xxx xxx" />
              </div>
              <div>
                <label className="form-label">Ville</label>
                <input className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Casablanca" />
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="btn-ghost" onClick={() => setModalOpen(false)}>Annuler</button>
              <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 360 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>Confirmer la suppression</h3>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              Cette action est irréversible. Le commerçant sera définitivement supprimé.
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