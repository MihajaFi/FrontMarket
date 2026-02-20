import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import HeroBanner from "@/components/marketplace/HeroBanner";
import CategoryGrid from "@/components/marketplace/CategoryGrid";
import ProductCard from "@/components/marketplace/ProductCard";
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


const features = [
  { icon: Truck, title: "Livraison Rapide", desc: "Partout dans le pays" },
  { icon: Shield, title: "Paiement Sécurisé", desc: "Mobile Money & Carte" },
  { icon: Headphones, title: "Support 24/7", desc: "Service client réactif" },
  { icon: CreditCard, title: "Points Fidélité", desc: "Gagnez à chaque achat" },
];

const Index = () => {
  return (
    <MarketplaceLayout>
      <div className="container py-4 space-y-8">
        {/* Hero */}
        <HeroBanner />

        {/* Features strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <CategoryGrid />

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-foreground">
              Produits en vedette ⭐
            </h2>
            <Link to="/products">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
        </section>

        {/* Promo Banner */}
        <section className="marketplace-gradient rounded-xl p-6 md:p-10 text-primary-foreground">
          <div className="max-w-lg">
            <h2 className="font-display font-bold text-2xl md:text-3xl mb-2">
              🔥 Offres Flash
            </h2>
            <p className="text-primary-foreground/80 mb-4">
              Des réductions incroyables sur des centaines de produits. Ne ratez pas ces offres limitées !
            </p>
            <Link to="/products?discount=true">
              <Button variant="secondary" className="font-semibold">
                Découvrir les offres
              </Button>
            </Link>
          </div>
        </section>

        {/* Promo Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-foreground">
              Meilleures promotions 🏷️
            </h2>
            <Link to="/products?discount=true">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default Index;
