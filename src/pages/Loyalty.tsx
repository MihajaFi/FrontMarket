import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MarketplaceLayout from "@/components/marketplace/MarketplaceLayout";
import { useAuth } from "@/context/AuthContext";
import { loyaltyService, type LoyaltyPoints, type LoyaltyHistoryItem } from "@/services/loyaltyService";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown, Gift, Loader2 } from "lucide-react";

const Loyalty = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [points, setPoints] = useState<LoyaltyPoints | null>(null);
  const [history, setHistory] = useState<LoyaltyHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([loyaltyService.getPoints(), loyaltyService.getHistory()])
      .then(([p, h]) => { setPoints(p); setHistory(h); })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <MarketplaceLayout>
        <div className="container py-16 text-center space-y-4">
          <h2 className="font-display font-bold text-2xl text-foreground">Connexion requise</h2>
          <p className="text-muted-foreground">Connectez-vous pour voir vos points fidélité.</p>
          <Button onClick={() => navigate("/login")} className="marketplace-gradient text-primary-foreground border-0 font-semibold">Se connecter</Button>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="container py-6 max-w-3xl">
        <h1 className="font-display font-bold text-2xl text-foreground mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-accent" /> Programme Fidélité
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Points cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Solde actuel</p>
                <p className="font-display font-bold text-4xl text-primary">{points?.balance || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">points</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Total gagné</p>
                <p className="font-display font-bold text-4xl text-success">{points?.totalEarned || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">points</p>
              </div>
            </div>

            {/* How it works */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">Comment ça marche ?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gagnez <span className="font-medium text-primary">1 point</span> pour chaque 1 000 FCFA dépensé</li>
                <li>• Utilisez vos points pour obtenir des réductions sur vos prochaines commandes</li>
                <li>• <span className="font-medium text-primary">100 points = 500 FCFA</span> de réduction</li>
              </ul>
            </div>

            {/* History */}
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">Historique</h3>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucune activité pour le moment.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === "earn" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      }`}>
                        {item.type === "earn" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <p className={`font-display font-bold text-sm ${item.type === "earn" ? "text-success" : "text-destructive"}`}>
                        {item.type === "earn" ? "+" : ""}{item.points} pts
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default Loyalty;
