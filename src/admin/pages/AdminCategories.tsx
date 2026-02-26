import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryService } from "@/services/categorieService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layout } from "@/components/Layout";

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  // --- Charger les catégories depuis le backend ---
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

  // --- Ajouter une catégorie ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryService.create({
        name,
        description: icon, // ici on utilise la description pour stocker l’emoji si tu veux
        color: null
      });
      setName("");
      setIcon("");
      setOpen(false);
      fetchCategories(); // raffraîchir la liste
    } catch (error) {
      console.error("Erreur création catégorie :", error);
      alert("Impossible de créer la catégorie");
    }
  };

  return (
    <Layout title="Catégories" subtitle="Gérez les catégories de produits">
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories de produits</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Nouvelle catégorie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une catégorie</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddCategory}>
              <div>
                <Label>Nom de la catégorie</Label>
                <Input 
                  placeholder="Ex: Électronique" 
                  className="mt-1" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                />
              </div>
              <div>
                <Label>Icône (emoji)</Label>
                <Input 
                  placeholder="📱" 
                  className="mt-1" 
                  value={icon} 
                  onChange={e => setIcon(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full">Enregistrer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
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