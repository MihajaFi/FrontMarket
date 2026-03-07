import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import ProductCard from "@/components/marketplace/ProductCard";
import { productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  List
} from "lucide-react";
import type { Product } from "@/data/mock-data";

const Products = () => {
  const [products, setProducts] = useState<(Product & { promotionValue?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || "";
  const discountOnly = searchParams.get("discount") === "true";
  const searchQuery = searchParams.get("search") || "";

  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();

        // Ajouter la promotion pour chaque produit
        const productsWithPromo = await Promise.all(
          data.map(async (p) => {
            try {
              const promo = await productService.getPromotionLoyalty(p.id.toString());
              return { ...p, promotionValue: promo.value };
            } catch {
              return { ...p, promotionValue: 0 };
            }
          })
        );

        setProducts(productsWithPromo);
      } catch (err) {
        setError("Échec du chargement des produits.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (discountOnly) {
      result = result.filter((p) => (p.promotionValue || 0) > 0);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    return result;
  }, [products, selectedCategory, discountOnly, sortBy, searchQuery]);

  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="container py-12 text-center text-muted-foreground">
          Chargement des produits...
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-56 shrink-0 space-y-4">
            {/* ... ton code de filtre reste identique ... */}
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> produit
                {filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun produit trouvé pour ces critères.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 gap-4"
                }
              >
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    promotionValue={product.promotionValue}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default Products;