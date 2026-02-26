import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { categoryService } from "@/services/categorieService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MerchantLayout } from "@/components/MerchantLayout";
import type { CategoryResponse, CategoryRequest } from "@/data/mock-data";


export function MerchantCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
    }
  };

  const openDialogForEdit = (cat: CategoryResponse) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setColor(cat.color || "");
    setOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CategoryRequest = {
        name: name.trim(),
        description: description.trim() || "",
        ...(color.trim() ? { color: color.trim() } : {}),
      };

      if (editingCategoryId) {
        await categoryService.update(editingCategoryId, payload);
      } else {
        await categoryService.create(payload);
      }

      setName("");
      setDescription("");
      setColor("");
      setEditingCategoryId(null);
      setOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Erreur sauvegarde catégorie :", error);
      alert(error.response?.data?.message || error.message || "Impossible de sauvegarder la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error: any) {
      console.error("Erreur suppression catégorie :", error);
      alert(error.response?.data?.message || error.message || "Impossible de supprimer la catégorie");
    }
  };

  return (
    <MerchantLayout title="Catégories" subtitle="Gérez les catégories de produits">
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        {/* Search */}
        <div className="search-bar">
          <Search size={15} color="hsl(var(--muted-foreground))" />
          <input
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle catégorie
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategoryId
                  ? "Modifier la catégorie"
                  : "Ajouter une catégorie"}
              </DialogTitle>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSaveCategory}>
              <div>
                <Label>Nom de la catégorie</Label>
                <Input
                  placeholder="Ex: Électronique"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Ex: Produits électroniques"
                  className="mt-1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <Label>Couleur</Label>
                <Input
                  placeholder="Ex: #FF0000"
                  className="mt-1"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Sauvegarde..."
                  : editingCategoryId
                    ? "Modifier"
                    : "Enregistrer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div>

        {/* Table des catégories */}
        <div className="mt-6 rounded-xl border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Nombre de produits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.description || "📦"}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.productCount ?? 0}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openDialogForEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCategory(cat.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MerchantLayout>
  );
}