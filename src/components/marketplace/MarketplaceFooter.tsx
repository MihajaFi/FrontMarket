import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const MarketplaceFooter = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <div className="w-8 h-8 rounded-lg marketplace-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm font-display">M+</span>
              </div>
              <span className="font-display font-bold text-lg">
                Market<span className="text-primary">Com+</span>
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/70">
              La marketplace des PME locales. Achetez et vendez en toute confiance.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Acheter</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/products" className="hover:text-primary transition-colors">Tous les produits</Link></li>
              <li><Link to="/products?discount=true" className="hover:text-primary transition-colors">Promotions</Link></li>
              <li><Link to="/loyalty" className="hover:text-primary transition-colors">Programme fidélité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Vendre</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/merchant/register" className="hover:text-primary transition-colors">Devenir commerçant</Link></li>
              <li><Link to="/merchant/login" className="hover:text-primary transition-colors">Espace commerçant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +225 01 23 45 67</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@marketcom.plus</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Abidjan, Côte d'Ivoire</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-6 text-center text-xs text-secondary-foreground/50">
          © 2026 MarketCom+. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
