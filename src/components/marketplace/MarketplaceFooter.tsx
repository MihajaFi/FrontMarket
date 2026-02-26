import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/Logo.png";
const MarketplaceFooter = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-12">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Logo MarketCom+"
                  className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
                />
              </div>

              {/* Texte */}
              <span className="hidden sm:block font-display font-bold text-lg sm:text-2xl text-foreground">
              Market<span className="text-primary">Com+</span>
            </span>
            </div>
            <p className="text-sm text-secondary-foreground/70">
              Achetez facile, recevez vite
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
              <li><Link to="/register" className="hover:text-primary transition-colors">Devenir commerçant</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Espace commerçant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +261 034 01 212 12</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> admin@marketcom.plus</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Madagascar </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketplaceFooter;
