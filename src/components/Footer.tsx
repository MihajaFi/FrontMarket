import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 py-10">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold">
              Market<span className="text-secondary">Com+</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Plateforme e-commerce pour les PME locales à Madagascar.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Accueil</Link>
              <Link to="/produits" className="hover:text-primary">Produits</Link>
              <Link to="/panier" className="hover:text-primary">Panier</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Espaces</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/connexion" className="hover:text-primary">Espace Client</Link>
              <Link to="/commercant" className="hover:text-primary">Espace Commerçant</Link>
              <Link to="/admin" className="hover:text-primary">Administration</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-heading text-sm font-semibold">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>contact@marketcom.mg</span>
              <span>+261 34 00 000 00</span>
              <span>Antananarivo, Madagascar</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © 2026 MarketCom+. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
