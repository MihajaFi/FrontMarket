import { useEffect, useState } from 'react';
import { promotionLoyaltyService } from '@/services';
import { Layout } from '@/components/Layout';
import type { PromotionLoyalty, PromotionLoyaltyRequest } from '@/data/mock-data';

// Modal pour créer / éditer une promotion
function PromotionModal({
  isOpen,
  closeModal,
  onSave,
  initialData
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (data: PromotionLoyaltyRequest) => void;
  initialData?: PromotionLoyaltyRequest;
}) {
  const [form, setForm] = useState<PromotionLoyaltyRequest>(
    initialData || {
      promotion_type: '',
      value: 0,
      start_date: '',
      end_date: '',
      conditions: ''
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Préparer les dates au format ISO que Symfony comprend
    const payload: PromotionLoyaltyRequest = {
      promotion_type: form.promotion_type,
      value: form.value,
      start_date: form.start_date ,
      end_date: form.end_date,
      conditions: form.conditions
    };

    onSave(payload);

    // Reset form
    setForm({
      promotion_type: '',
      value: 12,
      start_date: '',
      end_date: '',
      conditions: ''
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded shadow w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Modifier' : 'Créer'} une promotion</h2>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">Type</label>
            <input
              type="text"
              value={form.promotion_type}
              onChange={e => setForm(f => ({ ...f, promotion_type: e.target.value }))}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Valeur</label>
            <input
              type="number"
              value={form.value}
              onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Date de début</label>
            <input
              type="date"
              value={form.start_date}
              onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Date de fin</label>
            <input
              type="date"
              value={form.end_date}
              onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Conditions</label>
            <input
              type="text"
              value={form.conditions}
              onChange={e => setForm(f => ({ ...f, conditions: e.target.value }))}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 border rounded" onClick={closeModal}>
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PromotionLoyalty() {
  const [promotions, setPromotions] = useState<PromotionLoyalty[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PromotionLoyalty | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("mc_token");
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchPromotions();
    }
  }, []);

  const fetchPromotions = async () => {
    const data = await promotionLoyaltyService.getAll();
    setPromotions(data);
  };

  const handleSave = async (formData: PromotionLoyaltyRequest) => {
    if (editing) {
      await promotionLoyaltyService.update(editing.id, formData);
    } else {
      await promotionLoyaltyService.create(formData);
    }
    setModalOpen(false);
    setEditing(null);
    fetchPromotions();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette promotion ?')) {
      await promotionLoyaltyService.delete(id);
      fetchPromotions();
    }
  };

  const filteredPromotions = promotions.filter(p =>
    p.promotion_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="PromotionLoyalty" subtitle={`${promotions.length} promotion(s) enregistrée(s)`}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Promotions de fidélité</h1>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Rechercher par type"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded w-1/2"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            Ajouter
          </button>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Valeur</th>
              <th className="border p-2">Début</th>
              <th className="border p-2">Fin</th>
              <th className="border p-2">Conditions</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Aucune promotion
                </td>
              </tr>
            )}
            {filteredPromotions.map(p => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.promotion_type}</td>
                <td className="border p-2">{p.value}</td>
                <td className="border p-2">{p.start_date}</td>
                <td className="border p-2">{p.end_date}</td>
                <td className="border p-2">{p.conditions}</td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setEditing(p);
                      setModalOpen(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(p.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PromotionModal
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          onSave={handleSave}
          initialData={editing || undefined}
        />
      </div>
    </Layout>
  );
}