import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { Layout } from "@/components/Layout";
import type { CategoryResponse, CategoryRequest } from "@/data/mock-data";

export function AdminCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

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
    <Layout title="Catégories" subtitle="Gérez les catégories de produits">
      <div>
        {/* Header + bouton ajouter */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Catégories</h1>
            <p className="text-muted-foreground">Gérez les catégories de produits</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Nouvelle catégorie
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategoryId ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
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
                  {loading ? "Sauvegarde..." : editingCategoryId ? "Modifier" : "Enregistrer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table des catégories */}
        <div className="mt-6 rounded-xl border bg-card shadow-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icône</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Nombre de produits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-2xl">{cat.description || "📦"}</TableCell>
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
    </Layout>
  );
}