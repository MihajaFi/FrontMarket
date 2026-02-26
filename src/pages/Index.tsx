import { useEffect, useState } from "react";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import HeroBanner from "@/components/marketplace/HeroBanner";
import ProductCard from "@/components/marketplace/ProductCard";
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { productService } from "@/services/productService";
import { categoryService } from "@/services/categorieService";

import type { Product, CategoryResponse } from "@/data/mock-data";

const features = [
  { icon: Truck, title: "Livraison Rapide", desc: "Partout dans le pays" },
  { icon: Shield, title: "Paiement Sécurisé", desc: "Mobile Money & Carte" },
  { icon: Headphones, title: "Support 24/7", desc: "Service client réactif" },
  { icon: CreditCard, title: "Points Fidélité", desc: "Gagnez à chaque achat" },
];

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getAll(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur chargement homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <MarketplaceLayout>
      <div className="container py-4 space-y-8">
        {/* Hero */}
        <HeroBanner />

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">
                  {f.title}
                </p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section className="bg-muted/50 py-16 rounded-xl">
          <div className="container mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              Catégories populaires
            </h2>

            {loading ? (
              <p className="mt-6">Chargement des catégories...</p>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/produits?cat=${cat.id}`}
                    className="flex flex-col items-center gap-2 rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
                  >
                    {/* Cercle couleur dynamique */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="font-heading text-sm font-semibold">
                      {cat.name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {cat.productCount} produits
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-foreground">
              Produits en vedette ⭐
            </h2>
            <Link to="/products">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary"
              >
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Promo Banner */}
        <section className="marketplace-gradient rounded-xl p-6 md:p-10 text-primary-foreground">
          <div className="max-w-lg">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">
              🔥 Offres Flash
            </h2>
            <p className="text-primary-foreground/80 mb-4">
              Des réductions incroyables sur des centaines de produits. Ne ratez
              pas ces offres limitées !
            </p>
            <Link to="/products?discount=true">
              <Button variant="secondary" className="font-semibold">
                Découvrir les offres
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default Index;